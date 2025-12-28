import { useState } from "react";
import { createUser } from "../api/users.api";

type Props = {
  onSuccess: () => void;
};

export default function AddUserForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createUser({ name, email });
      setName("");
      setEmail("");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
      <h3 className="font-bold mb-2">Add New User</h3>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add User
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}