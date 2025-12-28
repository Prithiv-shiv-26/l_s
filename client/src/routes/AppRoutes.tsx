import{Routes,Route, Navigate} from "react-router-dom";
import BooksPage from "../pages/BooksSection";
import IssuesPage from "../pages/IssuesSection";
import UsersPage from "../pages/UsersSection";

const AppRoutes=()=>(
    <Routes>
        <Route path="/" element={<Navigate to="/books" replace/>}/>
        <Route path="/books" element={<BooksPage/>}/>
        <Route path="/issues" element={<IssuesPage/>}/>
        <Route path="/users" element={<UsersPage/>}/>
    </Routes>
);

export default AppRoutes;