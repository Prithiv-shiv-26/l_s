import { useState } from "react";
import { createBook } from "../api/books.api";

type Props = {
  onSuccess: () => void;
};

export default function AddBookForm({ onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createBook({ title, author, isbn, totalCopies });
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

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <input
        type="text"
        placeholder="ISBN"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <input
        type="number"
        placeholder="Copies"
        value={totalCopies}
        onChange={(e) => setTotalCopies(Number(e.target.value))}
        className="border p-2 mr-2 mb-2 w-20"
        min={1}
        required
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Book
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}