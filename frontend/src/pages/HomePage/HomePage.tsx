import { useAppSelector } from "@/hooks/hooks";

const HomePage = () => {
  const isLogin = useAppSelector((state) => state.authSlice.isLogin);
  const user = useAppSelector((state) => state.authSlice.user);

  return (
    <div className="flex flex-col items-center text-2xl text-foreground">
      {isLogin ? "LOGGED IN" : "NOT LOGGED IN"}
      <div className="mt-4">
        {isLogin ? (
          <div>
            <p>Welcome, {user.username}!</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <p>Please log in to access your profile.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
