import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../api/books.api";
import AddBookForm from "../components/AddBookForm";
import EditBookForm from "../components/EditBookForm";
import IssueBookForm from "../components/IssueBookForm";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueInitialBookId, setIssueInitialBookId] = useState<
    number | undefined
  >(undefined);

  const loadBooks = () => {
    getBooks().then((res) => setBooks(res.data));
  };

  useEffect(() => {
    loadBooks();

    const handler = () => loadBooks();
    window.addEventListener("l_s:books-updated", handler);
    return () => window.removeEventListener("l_s:books-updated", handler);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await deleteBook(id);
      loadBooks();
    } catch (err: unknown) {
      let msg = "Failed to delete";
      if (typeof err === "object" && err !== null) {
        const e = err as Record<string, unknown>;
        const response = e.response as Record<string, unknown> | undefined;
        const data = response?.data as Record<string, unknown> | undefined;
        if (typeof data?.message === "string") msg = data.message;
      }
      alert(msg);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Books</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Cancel" : "Add Book"}
      </button>

      {showForm && (
        <AddBookForm
          onSuccess={() => {
            loadBooks();
            setShowForm(false);
          }}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            loadBooks();
            setEditingBook(null);
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      {showIssueForm && (
        <div className="mb-4">
          <IssueBookForm
            initialBookId={issueInitialBookId}
            onSuccess={() => {
              setShowIssueForm(false);
              setIssueInitialBookId(undefined);
              loadBooks();
            }}
          />
        </div>
      )}

      <table className="w-full border">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Author</th>
            <th className="p-2 text-left">ISBN</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Available</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="p-2">{b.title}</td>
              <td className="p-2">{b.author}</td>
              <td className="p-2">{b.isbn}</td>
              <td className="p-2">{b.totalCopies}</td>
              <td className="p-2">{b.availableCopies}</td>
              <td className="p-2">
                <button
                  onClick={() => setEditingBook(b)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setIssueInitialBookId(b.id);
                    setShowIssueForm(true);
                  }}
                  disabled={b.availableCopies <= 0}
                  className={`px-2 py-1 rounded text-sm mr-2 ${
                    b.availableCopies > 0
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Issue
                </button>

                <button
                  onClick={() => handleDelete(b.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {books.length === 0 && (
        <p className="text-gray-500 mt-4">No books yet.</p>
      )}
    </div>
  );
}
