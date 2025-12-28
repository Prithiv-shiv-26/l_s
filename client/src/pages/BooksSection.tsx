import { useEffect, useState } from "react";
import { getBooks } from "../api/books.api";
import Section from "./Section";

type Book = {
  id: number;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
};

export default function BooksSection() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    getBooks().then((res) => setBooks(res.data));
  }, []);

  return (
    <Section title="Books">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="py-2 px-2">Title</th>
            <th className="py-2 px-2">Author</th>
            <th className="py-2 px-2">Total</th>
            <th className="py-2 px-2">Available</th>
          </tr>
        </thead>

        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-500 italic">
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
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
        + Add Book
      </button>
    </Section>
  );
}
