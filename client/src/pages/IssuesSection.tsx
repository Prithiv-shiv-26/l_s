import { useEffect, useState } from "react";
import { getActiveIssues, returnBook } from "../api/issues.api";
import Section from "./Section";
import IssueBookForm from "../components/IssueBookForm";

type Issue = {
  id: number;
  issuedAt: string;
  returnedAt: string | null;
  user: { name: string };
  book: { title: string };
};

export default function IssuesSection() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadIssues = async () => {
    const res = await getActiveIssues();
    setIssues(res.data);
    setLoading(false);
  };

  useEffect(() => {
    async function fetchIssues() {
      try {
        const res = await getActiveIssues();
        setIssues(res.data);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  const handleReturn = async (id: number) => {
    await returnBook(id);
    loadIssues();
    // notify other parts of the app that book availability changed
    window.dispatchEvent(new CustomEvent("l_s:books-updated"));
  };

  return (
    <Section
      title="Issued Books"
      actions={
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          {showForm ? "Cancel" : "Issue Book"}
        </button>
      }
    >
      {showForm && (
        <IssueBookForm
          onSuccess={() => {
            setShowForm(false);
            loadIssues();
            window.dispatchEvent(new CustomEvent("l_s:books-updated"));
          }}
        />
      )}

      {loading && <p>Loading...</p>}

      {!loading && issues.length === 0 && (
        <p className="text-gray-500">No active issues</p>
      )}

      {issues.length > 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">User</th>
              <th>Book</th>
              <th>Issued At</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-b">
                <td className="py-2">{issue.user.name}</td>
                <td>{issue.book.title}</td>
                <td>{new Date(issue.issuedAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleReturn(issue.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Section>
  );
}
