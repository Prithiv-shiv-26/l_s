import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/users.api";
import AddUserForm from "../components/AddUserForm";
import EditUserForm from "../components/EditUserForm";

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = () => {
    getUsers().then((res) => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      loadUsers();
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
      <h2 className="text-xl font-bold mb-4">Users</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Cancel" : "Add User"}
      </button>

      {showForm && (
        <AddUserForm
          onSuccess={() => {
            loadUsers();
            setShowForm(false);
          }}
        />
      )}

      {editingUser && (
        <EditUserForm
          user={editingUser}
          onSuccess={() => {
            loadUsers();
            setEditingUser(null);
          }}
          onCancel={() => setEditingUser(null)}
        />
      )}

      <table className="w-full border">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Created</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">
                <button
                  onClick={() => setEditingUser(u)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p className="text-gray-500 mt-4">No users yet.</p>
      )}
    </div>
  );
}
