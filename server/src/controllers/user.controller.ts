import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { IssueRecord } from "../entities/IssueRecord";
import { createUserSchema, updateUserSchema } from "../validators/user.schema";

const UserRepo = AppDataSource.getRepository(User);

//Create
export const createUser = async (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }

  const { name, email } = parsed.data;

  const existingUser = await UserRepo.findOne({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({
      message: "User with this email already exists",
    });
  }

  const user = UserRepo.create({
    name,
    email,
  });
  const savedUser = await UserRepo.save(user);
  return res.status(201).json(savedUser);
};

//Get One
export const GetUserById = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  const user = await UserRepo.findOne({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ message: "User not Found" });
  }

  return res.status(200).json(user);
};

//Get All
export const GetAllUsers = async (_req: Request, res: Response) => {
  const users = await UserRepo.find({
    order: { createdAt: "DESC" },
  });
  return res.status(200).json(users);
};

//update
export const updateUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }

  if (Object.keys(parsed.data).length === 0) {
    return res
      .status(400)
      .json({ message: "Atleast one field is required to update" });
  }

  const user = await UserRepo.findOne({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ message: "User not Found" });
  }

  if (parsed.data.email) {
    const existingUser = await UserRepo.findOne({
      where: { email: parsed.data.email },
    });
    if (existingUser && existingUser.id !== userId) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }
  }

  UserRepo.merge(user, parsed.data);
  const updatedUser = await UserRepo.save(user);
  return res.status(200).json(updatedUser);
};

//delete
export const deleteUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const user = await UserRepo.findOne({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ message: "User not Found" });
  }

  // Check for active (not returned) issues referencing this user
  const activeIssuesCount = await AppDataSource.getRepository(IssueRecord)
    .createQueryBuilder("issue")
    .where("issue.userId = :id", { id: userId })
    .andWhere("issue.returnedAt IS NULL")
    .getCount();

  if (activeIssuesCount > 0) {
    return res.status(400).json({
      message: `Cannot delete user: ${activeIssuesCount} active issue record(s) reference this user. Return the books first.`,
    });
  }

  try {
    // If only returned issue records exist, remove them first to avoid FK constraint errors
    const totalIssuesCount = await AppDataSource.getRepository(IssueRecord)
      .createQueryBuilder("issue")
      .where("issue.userId = :id", { id: userId })
      .getCount();

    if (totalIssuesCount > 0) {
      await AppDataSource.transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .delete()
          .from(IssueRecord)
          .where("userId = :id", { id: userId })
          .execute();

        await manager.remove(User, user);
      });
    } else {
      await UserRepo.remove(user);
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Failed to remove user:", err);
    return res
      .status(500)
      .json({ message: "Failed to delete user due to server error" });
  }
};
