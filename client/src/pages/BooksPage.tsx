import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../api/books.api";
import AddBookForm from "../components/AddBookForm";

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

  const loadBooks = () => {
    getBooks().then((res) => setBooks(res.data));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await deleteBook(id);
      loadBooks();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete");
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

      {showForm && <AddBookForm onSuccess={() => { loadBooks(); setShowForm(false); }} />}

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

      {books.length === 0 && <p className="text-gray-500 mt-4">No books yet.</p>}
    </div>
  );
}