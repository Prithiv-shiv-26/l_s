import { useState } from "react";
import { updateBook } from "../api/books.api";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await updateBook(book.id, { title, author, isbn, totalCopies });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update book");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-yellow-50">
      <h3 className="font-bold mb-2">Edit Book</h3>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <input
        type="text"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <input
        type="number"
        value={totalCopies}
        onChange={(e) => setTotalCopies(Number(e.target.value))}
        className="border p-2 mr-2 mb-2 w-20"
        min={1}
        required
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Save
      </button>

      <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
        Cancel
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}