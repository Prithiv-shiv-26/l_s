import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Book } from "../entities/Book";
import { IssueRecord } from "../entities/IssueRecord";
import { createBookSchema, updateBookSchema } from "../validators/book.schema";

const BookRepo = AppDataSource.getRepository(Book);

//Create
export const createBook = async (req: Request, res: Response) => {
  const parsed = createBookSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }

  const { title, author, isbn, totalCopies } = parsed.data;
  const copies =
    typeof totalCopies === "number" && Number.isFinite(totalCopies)
      ? Math.max(1, Math.trunc(totalCopies))
      : 1;

  const existingBook = await BookRepo.findOne({
    where: { isbn },
  });

  if (existingBook) {
    return res.status(409).json({
      message: "Book with this ISBN already exists",
    });
  }

  const book = BookRepo.create({
    title,
    author,
    isbn,
    totalCopies: copies,
    availableCopies: copies,
  });

  const savedBook = await BookRepo.save(book);
  return res.status(201).json(savedBook);
};

//Get One
export const getBookById = async (req: Request, res: Response) => {
  const BookId = Number(req.params.id);

  if (Number.isNaN(BookId)) {
    return res.status(400).json({ message: "Invalid Book ID" });
  }

  const book = await BookRepo.findOne({
    where: { id: BookId },
  });

  if (!book) {
    return res.status(404).json({ message: "Book not Found" });
  }

  return res.status(200).json(book);
};

//Get All
export const getAllBooks = async (_req: Request, res: Response) => {
  const books = await BookRepo.find({
    order: { createdAt: "DESC" },
  });
  return res.status(200).json(books);
};

//update
export const updateBook = async (req: Request, res: Response) => {
  const BookId = Number(req.params.id);

  if (Number.isNaN(BookId)) {
    return res.status(400).json({ message: "Invalid Book ID" });
  }

  const parsed = updateBookSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }

  if (Object.keys(parsed.data).length === 0) {
    return res.status(400).json({
      message: "Atleast one field is required to update",
    });
  }

  const book = await BookRepo.findOne({
    where: { id: BookId },
  });

  if (!book) {
    return res.status(404).json({ message: "Book not Found" });
  }

  if (parsed.data.isbn) {
    const existingBook = await BookRepo.findOne({
      where: { isbn: parsed.data.isbn },
    });

    if (existingBook && existingBook.id !== BookId) {
      return res.status(409).json({
        message: "Another book with this ISBN already exists",
      });
    }
  }

  if (parsed.data.totalCopies !== undefined) {
    const diff = parsed.data.totalCopies - book.totalCopies;
    book.totalCopies = parsed.data.totalCopies;
    book.availableCopies += diff;

    if (book.availableCopies < 0) {
      return res.status(400).json({
        message: "Total copies cannot be less than available copies",
      });
    }
  }

  BookRepo.merge(book, parsed.data);
  const updatedBook = await BookRepo.save(book);
  return res.status(200).json(updatedBook);
};

//Delete
export const deleteBook = async (req: Request, res: Response) => {
  const BookId = Number(req.params.id);

  if (Number.isNaN(BookId)) {
    return res.status(400).json({ message: "Invalid Book ID" });
  }

  const book = await BookRepo.findOne({
    where: { id: BookId },
  });

  if (!book) {
    return res.status(404).json({ message: "Book not Found" });
  }

  // Count only active (not returned) issue records referencing this book
  const activeIssuesCount = await AppDataSource.getRepository(IssueRecord)
    .createQueryBuilder("issue")
    .where("issue.bookId = :id", { id: BookId })
    .andWhere("issue.returnedAt IS NULL")
    .getCount();

  if (activeIssuesCount > 0) {
    return res.status(400).json({
      message: `Cannot delete book: ${activeIssuesCount} active issue record(s) reference this book. Return the books first.`,
    });
  }

  try {
    // If there are returned issue records (only), remove them first to avoid FK constraint errors
    const totalIssuesCount = await AppDataSource.getRepository(IssueRecord)
      .createQueryBuilder("issue")
      .where("issue.bookId = :id", { id: BookId })
      .getCount();

    if (totalIssuesCount > 0) {
      await AppDataSource.transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .delete()
          .from(IssueRecord)
          .where("bookId = :id", { id: BookId })
          .execute();

        await manager.remove(Book, book);
      });
    } else {
      await BookRepo.remove(book);
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Failed to remove book:", err);
    return res
      .status(500)
      .json({ message: "Failed to delete book due to server error" });
  }
};
