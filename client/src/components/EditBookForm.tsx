import { useState, useEffect } from "react";
import { updateBook } from "../api/books.api";
import { validateBook } from "../utils/validation";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
};

type Props = {
  book: Book;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function EditBookForm({ book, onSuccess, onCancel }: Props) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [isbn, setIsbn] = useState(book.isbn);
  const [totalCopies, setTotalCopies] = useState(book.totalCopies);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    author?: string;
    isbn?: string;
    totalCopies?: string;
  }>({});

  useEffect(() => {
    setErrors(validateBook(title, author, isbn, totalCopies));
  }, [title, author, isbn, totalCopies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const v = validateBook(title, author, isbn, totalCopies);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      await updateBook(book.id, {
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        totalCopies,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update book");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 p-4 border rounded bg-yellow-50"
    >
      <h3 className="font-bold mb-2">Edit Book</h3>

      <div className="mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2 w-full"
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div className="mb-2">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 mr-2 w-full"
          aria-invalid={!!errors.author}
        />
        {errors.author && (
          <p className="text-red-500 text-sm">{errors.author}</p>
        )}
      </div>

      <div className="mb-2">
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="border p-2 mr-2 w-full"
          aria-invalid={!!errors.isbn}
        />
        {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
      </div>

      <div className="mb-2 w-40">
        <input
          type="number"
          value={totalCopies}
          onChange={(e) => setTotalCopies(Number(e.target.value))}
          className="border p-2 mr-2 w-full"
          min={1}
          aria-invalid={!!errors.totalCopies}
        />
        {errors.totalCopies && (
          <p className="text-red-500 text-sm">{errors.totalCopies}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        disabled={Object.keys(errors).length > 0}
      >
        Save
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
