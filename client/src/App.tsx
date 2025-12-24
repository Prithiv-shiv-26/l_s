import { Link } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"

const App=()=> {
  return (
    <div>
      <nav style={{marginBottom: "20px"}}>
        <Link to="/books" style={{marginRight: "10px"}}>Books</Link>
        <Link to="/issues" style={{marginRight: "10px"}}>Issues</Link>
        <Link to="/users">Users</Link>
      </nav>
      <AppRoutes/>
    </div>
  )
}

export default App
