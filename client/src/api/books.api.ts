import api from "./axios";

export const getBooks = () => api.get("/books");

export const createBook = (data: {
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
}) => api.post("/books", data);

export const deleteBook = (id: number) => api.delete(`/books/${id}`);