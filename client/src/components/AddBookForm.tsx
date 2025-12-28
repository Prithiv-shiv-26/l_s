import { useState, useEffect } from "react";
import { createBook } from "../api/books.api";
import { validateBook } from "../utils/validation";

type Props = {
  onSuccess: () => void;
};

export default function AddBookForm({ onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
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
      await createBook({
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        totalCopies,
      });
      setTitle("");
      setAuthor("");
      setIsbn("");
      setTotalCopies(1);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
      <h3 className="font-bold mb-2">Add New Book</h3>

      <div className="mb-2">
        <input
          type="text"
          placeholder="Title"
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
          placeholder="Author"
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
          placeholder="ISBN"
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
          placeholder="Copies"
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
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={Object.keys(errors).length > 0}
      >
        Add Book
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
