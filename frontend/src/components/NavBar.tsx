import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useNavigate } from "react-router-dom";
import { authActions } from "@/redux/slices/index";
import ELibLogo from "/book-svgrepo-com.svg";
import { Outlet } from "react-router-dom";
import ThemeModeToggle from "@/components/ThemeToggle";
import toast from "react-hot-toast";
import {
  Menu,
  CircleX,
  House,
  UserRoundPen,
  LogIn,
  LogOut,
  Settings,
  LoaderCircle,
  Bot,
} from "lucide-react";
import { useState } from "react";
import BlankProfilePic from "@/assets/blank-profile-picture.png";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const user = useAppSelector((state) => state.authSlice.user);
  const isAuthChecked = useAppSelector(
    (state) => state.authSlice.isAuthChecked
  );
  if (!isAuthChecked) {
    return (
      <LoaderCircle className="text-foreground w-[70px] lg:w-[90px] animate-spin mt-4" />
    );
  }

  return (
    <section>
      <nav className="flex items-center justify-center w-full bg-card border-none border-border border dark:border-solid shadow-md fixed top-0 left-0 z-[10]">
        <div className="flex items-center justify-between w-[90vw] max-w-[1400px] py-2 relative">
          {/* Logo and Title */}
          <div
            className="flex gap-2 w-fit items-center hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={ELibLogo} alt="App's logo" className="w-[55px]" />
            <span className="text-foreground text-xl font-sora">E-Shelf</span>
          </div>

          {/*Navigation bar buttons for sm (640px) or below*/}
          <div className="flex w-fit">
            <ThemeModeToggle />
            <Menu
              className={`${
                isMenuOpen ? "text-primary" : "text-foreground"
              } w-[50px] hover:text-primary transition-colors duration-200 cursor-pointer`}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            />
          </div>
        </div>

        {/*Navigation menu*/}
        <div
          className={`${
            isMenuOpen
              ? "fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
              : ""
          }`}
        >
          {isMenuOpen && (
            <div
              className="absolute flex flex-col bg-card border-primary border-2 gap-4
                w-[25vw] min-w-[300px] min-h-[99.5vh] justify-start items-start rounded-lg py-4 px-6 top-1 bot-1 right-0 select-none"
            >
              {/*close button*/}
              <div className="flex w-full justify-end items-start text-end">
                <CircleX
                  className="text-destructive cursor-pointer text-end"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                />
              </div>

              {/*User's info and button to profile page if login*/}
              {isLogin ? (
                <div className="flex w-fit gap-4 items-center justify-center">
                  <img
                    src={user.url_avatar ? user.url_avatar : BlankProfilePic}
                    className="w-[50px] rounded-full cursor-pointer"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  />
                  <div
                    className="relative group inline-flex items-center gap-2 text-foreground hover:cursor-pointer"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <span className="text-2xl">{user.username}</span>

                    <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-foreground/90 transition-all duration-200 group-hover:w-full" />
                  </div>
                </div>
              ) : (
                <></>
              )}

              {/*Navigation buttons*/}
              <div className="flex flex-col gap-6 mt-4 items-start justify-center w-full">
                <div
                  className="relative group inline-flex items-center gap-2 text-foreground hover:cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <House className="w-[24px] h-[24px]" />
                  <span className="text-2xl">Home</span>

                  <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-foreground/90 transition-all duration-200 group-hover:w-full" />
                </div>

                <div
                  className="relative group inline-flex items-center gap-2 text-foreground hover:cursor-pointer"
                  onClick={() => navigate("/authors")}
                >
                  <UserRoundPen className="w-[24px] h-[24px]" />
                  <span className="text-2xl">Authors</span>

                  <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-foreground/90 transition-all duration-200 group-hover:w-full" />
                </div>

                <div
                  className="relative group inline-flex items-center gap-2 text-foreground hover:cursor-pointer"
                  onClick={() => navigate("/chatbot")}
                >
                  <Bot className="w-[24px] h-[24px]" />
                  <span className="text-2xl">AI Chatbot</span>

                  <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-foreground/90 transition-all duration-200 group-hover:w-full" />
                </div>

                {isLogin && (
                  <div
                    className="relative group inline-flex items-center gap-2 text-foreground hover:cursor-pointer"
                    onClick={() => navigate(`/settings`)}
                  >
                    <Settings className="w-[24px] h-[24px]" />
                    <span className="text-2xl">Settings</span>

                    <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-foreground/90 transition-all duration-200 group-hover:w-full" />
                  </div>
                )}

                {/*Login or Logout*/}
                {isLogin ? (
                  <div
                    className="relative group inline-flex items-center gap-2 text-foreground hover:cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-[24px] h-[24px]" />
                    <span className="text-2xl">Logout</span>

                    <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-foreground/90 transition-all duration-200 group-hover:w-full" />
                  </div>
                ) : (
                  <div
                    className="relative group inline-flex items-center gap-2 text-foreground hover:cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    <LogIn className="w-[24px] h-[24px]" />
                    <span className="text-2xl">Login</span>

                    <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-foreground/90 transition-all duration-200 group-hover:w-full" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="mt-18 w-full">
        <Outlet />
      </div>
    </section>
  );
};

export default NavBar;
