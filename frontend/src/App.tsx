import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { authActions } from "@/redux/slices/index";
import { ThemeProvider } from "./components/ThemeProvider";
import Cookies from "js-cookie";
import BooksDashboard from "./pages/BooksDashboard/BooksDashboard";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/LoginPage/LoginPage";
import NavBar from "./components/NavBar";
import { Toaster } from "react-hot-toast";
import BookVersionsDashboard from "./pages/BookVersionsDashboard/BookVersionsDashboard";
import AuthorsDashboard from "./pages/AuthorsDashboard/AuthorsDashboard";
import BooksByAuthorIdDashboard from "./pages/BooksByAuthorIdDashboard/BooksByAuthorIdDashboard";
import SettingsDashboard from "./pages/SettingsDashboard/SettingsDashboard";
import AIChatBot from "./pages/AIChatBot/AIChatBot";

//testing new backend
//axios.defaults.baseURL = "https://bkdelibserver.duckdns.org";

function App() {
  const dispatch = useAppDispatch();

  //const isLogin = useAppSelector((state) => state?.authSlice?.isLogin) ?? false;
  const profileImgUploaded = useAppSelector(
    (state) => state.userSlice.profileImgUploaded
  );
  const basicInfoUpdated = useAppSelector(
    (state) => state.userSlice.basicInfoUpdated
  );

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      dispatch(authActions.getMe());
    } else {
      dispatch(authActions.setIsAuthChecked());
    }
  }, [dispatch, profileImgUploaded, basicInfoUpdated]);

  return (
    <ThemeProvider>
      <div className="bg-background flex min-h-svh flex-col items-center justify-start overflow-x-hidden">
        <Toaster position="bottom-right" />
        <Router>
          <Routes>
            <Route element={<NavBar />}>
              <Route element={<PrivateRoute />}>
                <Route path="/settings" element={<SettingsDashboard />} />
              </Route>
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/" element={<BooksDashboard />} />
              <Route
                path="/book-versions/:bookId/:authorId"
                element={<BookVersionsDashboard />}
              />
              <Route path="/authors" element={<AuthorsDashboard />} />
              <Route
                path="/books-by-author-id/:authorId/:authorName/:authorCountry/"
                element={<BooksByAuthorIdDashboard />}
              />
              <Route path="/chatbot" element={<AIChatBot />} />
            </Route>

            <Route
              path="/verify-email/:token"
              element={<EmailVerification />}
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
