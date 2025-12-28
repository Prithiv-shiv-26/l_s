import { useState, useEffect } from "react";
import { issueBook } from "../api/issues.api";
import { getBooks } from "../api/books.api";
import { getUsers } from "../api/users.api";

type Props = {
  onSuccess: () => void;
};

type Book = { id: number; title: string; availableCopies: number };
type User = { id: number; name: string };

export default function IssueBookForm({ onSuccess }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data));
    getBooks().then((res) => setBooks(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId || !bookId) {
      setError("Please select both user and book");
      return;
    }

    try {
      await issueBook(Number(userId), Number(bookId));
      setUserId("");
      setBookId("");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to issue book");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
      <h3 className="font-bold mb-2">Issue Book</h3>

      <select
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      >
        <option value="">Select User</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <select
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      >
        <option value="">Select Book</option>
        {books.filter((b) => b.availableCopies > 0).map((b) => (
          <option key={b.id} value={b.id}>{b.title} ({b.availableCopies} available)</option>
        ))}
      </select>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Issue
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}