import { useState, useEffect } from "react";
import { issueBook } from "../api/issues.api";
import { getBooks } from "../api/books.api";
import { getUsers } from "../api/users.api";

type Props = {
  onSuccess: () => void;
  initialUserId?: number;
  initialBookId?: number;
};

type Book = { id: number; title: string; availableCopies: number };
type User = { id: number; name: string };

export default function IssueBookForm({
  onSuccess,
  initialBookId,
  initialUserId,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data));
    getBooks().then((res) => setBooks(res.data));
  }, []);

  // apply initial selections once data is loaded
  useEffect(() => {
    if (initialUserId) setUserId(String(initialUserId));
  }, [initialUserId]);

  useEffect(() => {
    if (initialBookId) setBookId(String(initialBookId));
  }, [initialBookId]);

  const selectedBook = books.find((b) => String(b.id) === bookId);
  const bookAvailable = selectedBook ? selectedBook.availableCopies > 0 : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId || !bookId) {
      setError("Please select both user and book");
      return;
    }

    if (!bookAvailable) {
      setError("Selected book has no available copies");
      return;
    }

    try {
      setSubmitting(true);
      await issueBook(Number(userId), Number(bookId));
      // notify other parts of the app that book availability changed
      window.dispatchEvent(new CustomEvent("l_s:books-updated"));
      setUserId("");
      setBookId("");
      onSuccess();
    } catch (err: unknown) {
      let msg = "Failed to issue book";
      if (typeof err === "object" && err !== null) {
        const e = err as Record<string, unknown>;
        const response = e.response as Record<string, unknown> | undefined;
        const data = response?.data as Record<string, unknown> | undefined;
        if (typeof data?.message === "string") msg = data.message;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
      <h3 className="font-bold mb-2">Issue Book</h3>

      <div className="mb-2">
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 mr-2 w-full"
          required
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <select
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="border p-2 mr-2 w-full"
          required
        >
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
              {b.title} ({b.availableCopies} available)
            </option>
          ))}
        </select>
        {selectedBook && (
          <p
            className={`text-sm mt-1 ${
              bookAvailable ? "text-gray-600" : "text-red-500"
            }`}
          >
            {bookAvailable
              ? `${selectedBook.availableCopies} copies available`
              : "No copies available"}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={submitting || !bookAvailable}
      >
        {submitting ? "Issuing..." : "Issue"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
