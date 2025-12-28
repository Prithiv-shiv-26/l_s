import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/users.api";
import Section from "./Section";
import AddUserForm from "../components/AddUserForm";
import EditUserForm from "../components/EditUserForm";

type Users = {
  id: number;
  name: string;
  email: string;
};

export default function UsersSection() {
  const [users, setUsers] = useState<Users[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const load = () => getUsers().then((res) => setUsers(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <Section
      title="Users"
      actions={
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => setShowAdd((s) => !s)}
        >
          {showAdd ? "Close" : "+ Add User"}
        </button>
      }
    >
      {showAdd && (
        <AddUserForm
          onSuccess={() => {
            setShowAdd(false);
            load();
          }}
        />
      )}

      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className="border-b pb-2 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>

            <div className="flex items-center space-x-2">
              {editingUserId === u.id ? (
                <EditUserForm
                  user={u}
                  onSuccess={() => {
                    setEditingUserId(null);
                    load();
                  }}
                  onCancel={() => setEditingUserId(null)}
                />
              ) : (
                <>
                  <button
                    className="bg-yellow-400 text-black px-3 py-1 rounded"
                    onClick={() => setEditingUserId(u.id)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
