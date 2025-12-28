import { useState } from "react";
import { updateUser } from "../api/users.api";

type User = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function EditUserForm({ user, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await updateUser(user.id, { name, email });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-yellow-50">
      <h3 className="font-bold mb-2">Edit User</h3>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mr-2 mb-2"
        required
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Save
      </button>

      <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
        Cancel
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}