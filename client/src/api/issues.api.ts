import api from "./axios";

export const getActiveIssues = () => api.get("/issues/active");

export const issueBook = (userId: number, bookId: number) =>
  api.post("/issues", { userId, bookId });

export const returnBook = (issueId: number) =>
  api.post(`/issues/${issueId}/return`);