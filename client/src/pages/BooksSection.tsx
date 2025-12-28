import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../api/books.api";
import Section from "./Section";
import AddBookForm from "../components/AddBookForm";
import EditBookForm from "../components/EditBookForm";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
};

export default function BooksSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  const load = () => getBooks().then((res) => setBooks(res.data));

  useEffect(() => {
    load();

    const handler = () => load();
    window.addEventListener("l_s:books-updated", handler);
    return () => window.removeEventListener("l_s:books-updated", handler);
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete book");
    }
  };

  return (
    <Section
      title="Books"
      actions={
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => setShowAdd((s) => !s)}
        >
          {showAdd ? "Close" : "+ Add Book"}
        </button>
      }
    >
      {showAdd && (
        <AddBookForm
          onSuccess={() => {
            setShowAdd(false);
            load();
          }}
        />
      )}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="py-2 px-2">Title</th>
            <th className="py-2 px-2">Author</th>
            <th className="py-2 px-2">Total</th>
            <th className="py-2 px-2">Available</th>
            <th className="py-2 px-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-500 italic">
                No books found. Add your first book to get started.
              </td>
            </tr>
          ) : (
            books.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">{b.title}</td>
                <td className="py-2 px-2">{b.author}</td>
                <td className="py-2 px-2">{b.totalCopies}</td>
                <td className="py-2 px-2">{b.availableCopies}</td>
                <td className="py-2 px-2">
                  {editingBookId === b.id ? (
                    <EditBookForm
                      book={b}
                      onSuccess={() => {
                        setEditingBookId(null);
                        load();
                      }}
                      onCancel={() => setEditingBookId(null)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        className="bg-yellow-400 text-black px-3 py-1 rounded"
                        onClick={() => setEditingBookId(b.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Section>
  );
}
