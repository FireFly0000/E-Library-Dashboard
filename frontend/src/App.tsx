import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksDashboard from "./pages/BooksDashboard/BooksDashboard";
import axios from "axios";
import { ThemeProvider } from "./components/ThemeProvider";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import EmailVerification from "./pages/EmailVerification/EmailVerification";

axios.defaults.baseURL = "http://localhost:8080";

//axios.defaults.baseURL = "https://e-library-dashboard-be-deployed.onrender.com";

//axios.defaults.baseURL = "https://e-library-dashboard-be-deployed.vercel.app";

//axios.defaults.baseURL = "https://bkdelibserver.duckdns.org";

function App() {
  return (
    <ThemeProvider>
      <div className="bg-background flex min-h-svh flex-col items-center justify-center overflow-x-hidden">
        <Router>
          <Routes>
            <Route path="/dashboard" element={<BooksDashboard />} />
            <Route path="/" element={<ProfilePage />} />
            <Route
              path="/verify-email/:token"
              element={<EmailVerification />}
            />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
