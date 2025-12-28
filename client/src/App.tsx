import BooksSection from "./pages/BooksSection";
import IssuesSection from "./pages/IssuesSection";
import UsersSection from "./pages/UsersSection";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        <h1 className="text-3xl font-bold text-center">
          Library Management System
        </h1>

        <BooksSection />
        <IssuesSection />
        <UsersSection />
      </div>
    </div>
  );
};

export default App;
