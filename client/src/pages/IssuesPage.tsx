import { useState, useEffect } from "react";
import { getActiveIssues, returnBook } from "../api/issues.api";
import IssueBookForm from "../components/IssueBookForm";

type Issue = {
  id: number;
  user: { id: number; name: string };
  book: { id: number; title: string };
  issuedAt: string;
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showForm, setShowForm] = useState(false);

  const loadIssues = () => {
    getActiveIssues().then((res) => setIssues(res.data));
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleReturn = async (issueId: number) => {
    if (!confirm("Mark this book as returned?")) return;

    try {
      await returnBook(issueId);
      loadIssues();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to return book");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Active Issues</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Cancel" : "Issue Book"}
      </button>

      {showForm && <IssueBookForm onSuccess={() => { loadIssues(); setShowForm(false); }} />}

      <table className="w-full border">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Book</th>
            <th className="p-2 text-left">Issued At</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id} className="border-b">
              <td className="p-2">{issue.user.name}</td>
              <td className="p-2">{issue.book.title}</td>
              <td className="p-2">{new Date(issue.issuedAt).toLocaleString()}</td>
              <td className="p-2">
                <button
                  onClick={() => handleReturn(issue.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                >
                  Return
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {issues.length === 0 && <p className="text-gray-500 mt-4">No active issues.</p>}
    </div>
  );
}