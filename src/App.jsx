import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"

function App() {
  return (
    <div>
      
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    <div>
        <h1 className="text-5xl font-bold text-center text-blue-500 mt-50 underline">
          BULKWALA
        </h1>
        <h1 className="text-5xl font-bold text-center text-red-500 underline">
          Coming Soon!
        </h1>
      </div>
    </div>
  )
}

export default App



     