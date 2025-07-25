import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useNavigate } from "react-router-dom";
import { authActions } from "@/redux/slices/index";
import ELibLogo from "/book-svgrepo-com.svg";
import { Outlet } from "react-router-dom";
import ThemeModeToggle from "@/components/ThemeToggle";
import toast from "react-hot-toast";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout()).then((response) => {
      if (response.payload?.status_code === 200) {
        toast.success(response.payload.message);
      } else {
        toast.error(response.payload?.message as string);
      }
    });
    navigate("/");
  };

  const isLogin = useAppSelector((state) => state.authSlice.isLogin);
  const isAuthChecked = useAppSelector(
    (state) => state.authSlice.isAuthChecked
  );
  if (!isAuthChecked) {
    return null;
  }

  return (
    <section>
      <nav className="flex items-center justify-center w-full bg-card border-none border-border border dark:border-solid shadow-md fixed top-0 left-0 z-[10]">
        {/* Logo and Title */}
        <div className="flex items-center justify-between w-[90vw] max-w-[1400px] py-2">
          <div
            className="flex gap-2 w-fit items-center hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={ELibLogo}
              alt="App's logo"
              className="w-[55px]"
              onClick={() => (window.location.href = "/")}
            />
            <span className="text-foreground text-xl font-sora">
              E-Lib Share
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center w-fit gap-5 justify-center">
            {isLogin ? (
              <Button
                size="xl"
                variant="plain"
                onClick={handleLogout}
                className="px-0"
              >
                <a className="relative group inline-block">
                  Logout
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-foreground/90 transition-all duration-200 group-hover:w-full" />
                </a>
              </Button>
            ) : (
              <Button
                size="xl"
                variant="plain"
                onClick={() => navigate("/login")}
                className="px-0"
              >
                <a className="relative group inline-block">
                  Login
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-foreground/90 transition-all duration-200 group-hover:w-full" />
                </a>
              </Button>
            )}
            <ThemeModeToggle />
          </div>
          {/* End of Navigation Links */}
        </div>
      </nav>
      <div className="mt-22 w-full">
        <Outlet />
      </div>
    </section>
  );
};

export default NavBar;
