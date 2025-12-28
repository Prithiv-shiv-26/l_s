import { useEffect, useState } from "react";
import { getUsers } from "../api/users.api";
import Section from "./Section";

type Users = {
    id: number;
    name: string;
    email: string;
};

export default function UsersSection() {
  const [users, setUsers] = useState<Users[]>([]);

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data));
  }, []);

  return (
    <Section title="Users">
      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="border-b pb-2">
            {u.name} — {u.email}
          </li>
        ))}
      </ul>
    </Section>
  );
}
