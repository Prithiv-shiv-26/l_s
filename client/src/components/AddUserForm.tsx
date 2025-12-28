import { useState, useEffect } from "react";
import { createUser } from "../api/users.api";
import { validateUser } from "../utils/validation";

type Props = {
  onSuccess: () => void;
};

export default function AddUserForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    setErrors(validateUser(name, email));
  }, [name, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const v = validateUser(name, email);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      await createUser({ name: name.trim(), email: email.trim() });
      setName("");
      setEmail("");
      onSuccess();
    } catch (err: unknown) {
      let msg = "Failed to add user";
      if (typeof err === "object" && err !== null) {
        const e = err as Record<string, unknown>;
        const response = e.response as Record<string, unknown> | undefined;
        const data = response?.data as Record<string, unknown> | undefined;
        if (typeof data?.message === "string") msg = data.message;
      }
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
      <h3 className="font-bold mb-2">Add New User</h3>

      <div className="mb-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2 w-full"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="mb-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mr-2 w-full"
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={Object.keys(errors).length > 0}
      >
        Add User
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
