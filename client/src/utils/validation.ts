export const userNameRegex = /^[a-zA-Z\s]+$/;
export const authorNameRegex = /^[a-zA-Z\s.'-]+$/;

export function validateUser(name: string, email: string) {
  const errors: { name?: string; email?: string } = {};
  const trimmedName = name.trim();
  if (trimmedName.length === 0) errors.name = "Name is required";
  else if (trimmedName.length > 30) errors.name = "Name is too long";
  else if (!userNameRegex.test(trimmedName))
    errors.name = "Name can only contain letters and spaces";

  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0) errors.email = "Email is required";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail))
    errors.email = "Invalid email address";

  return errors;
}

export function validateBook(
  title: string,
  author: string,
  isbn: string,
  totalCopies: number
) {
  const errors: {
    title?: string;
    author?: string;
    isbn?: string;
    totalCopies?: string;
  } = {};
  const t = title.trim();
  if (t.length === 0) errors.title = "Title is required";
  else if (t.length > 100) errors.title = "Title is too long";

  const a = author.trim();
  if (a.length === 0) errors.author = "Author is required";
  else if (a.length > 50) errors.author = "Author name is too long";
  else if (!authorNameRegex.test(a))
    errors.author = "Author name contains invalid characters";

  const i = isbn.trim();
  if (i.length < 5)
    errors.isbn = "ISBN is required and should be at least 5 characters";
  else if (i.length > 20) errors.isbn = "ISBN is too long";

  if (!Number.isInteger(totalCopies) || totalCopies < 1)
    errors.totalCopies = "Total copies must be a positive integer";

  return errors;
}
