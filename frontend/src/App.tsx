import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksDashboard from "./components/pages/BooksDashboard/BooksDashboard";
import axios from "axios";

//axios.defaults.baseURL = "http://localhost:8080";

//axios.defaults.baseURL = "https://e-library-dashboard-be-deployed.onrender.com";

//axios.defaults.baseURL = "https://e-library-dashboard-be-deployed.vercel.app";

axios.defaults.baseURL = "https://bkdelibserver.duckdns.org";

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
