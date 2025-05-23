import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksDashboard from "./components/pages/BooksDashboard/BooksDashboard";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BooksDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
