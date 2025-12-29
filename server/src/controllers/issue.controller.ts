import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { IssueRecord } from "../entities/IssueRecord";
import { User } from "../entities/User";
import { Book } from "../entities/Book";
import { IssueBookSchema } from "../validators/issue.schema";
import { IsNull } from "typeorm";

const issueRepo = AppDataSource.getRepository(IssueRecord);
const userRepo = AppDataSource.getRepository(User);
const bookRepo = AppDataSource.getRepository(Book);

//Issue
export const issueBook = async (req: Request, res: Response) => {
  const parsed = IssueBookSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }
  const { userId, bookId } = parsed.data;

  const user = await userRepo.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const book = await bookRepo.findOne({ where: { id: bookId } });
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (book.availableCopies <= 0) {
    return res.status(400).json({ message: "No available copies to issue" });
  }

  book.availableCopies -= 1;
  const issue = issueRepo.create({
    user,
    book,
    returnedAt: null,
  });

  await AppDataSource.transaction(async (manager) => {
    await manager.save(book);
    await manager.save(issue);
  });
  return res.status(201).json(issue);
};

//return
export const returnBook = async (req: Request, res: Response) => {
  const issueId = Number(req.params.id);

  if (Number.isNaN(issueId)) {
    return res.status(400).json({ message: "Invalid Issue ID" });
  }
  const issue = await issueRepo.findOne({
    where: { id: issueId },
    relations: ["book"],
  });

  if (!issue) {
    return res.status(404).json({ message: "Issue Record not found" });
  }
  if (issue.returnedAt) {
    return res.status(400).json({ message: "Book already returned" });
  }

  issue.returnedAt = new Date();
  issue.book.availableCopies += 1;

  await AppDataSource.transaction(async (manager) => {
    await manager.save(issue.book);
    await manager.save(issue);
  });

  return res.status(200).json(issue);
};

//Get All Issues
export const getAllIssues = async (_req: Request, res: Response) => {
  const issues = await issueRepo.find({
    relations: ["user", "book"],
    order: { issuedAt: "DESC" },
  });
  return res.status(200).json(issues);
};

//get Active Issues
export const getActiveIssues = async (_req: Request, res: Response) => {
  const activeIssues = await issueRepo.find({
    where: { returnedAt: IsNull() },
    relations: ["user", "book"],
    order: { issuedAt: "DESC" },
  });
  return res.status(200).json(activeIssues);
};
