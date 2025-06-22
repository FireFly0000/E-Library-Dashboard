import { useParams } from "react-router-dom";
import ELibLogo from "/book-svgrepo-com.svg";
import { authActions } from "@/redux/slices";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const EmailVerification = () => {
  const { token } = useParams();

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("API CALLED");
    dispatch(authActions.verifyEmail(token ?? ""));
  }, [token, dispatch]);

  const handleResend = () => {
    dispatch(authActions.resendVerifyEmail(token ?? ""));
  };

  const errorMessage = useAppSelector((state) => state.authSlice.error) ?? "";
  const successMessage =
    useAppSelector((state) => state.authSlice.success) ?? "";
  const isLoading = useAppSelector((state) => state.authSlice.isLoading);

  return (
    <div className="flex flex-col items-center gap-5 text-center w-full text-4xl text-[var(--foreground)] px-5">
      <img src={ELibLogo} alt="App's logo" className="w-[10%] min-w-[200px]" />

      {errorMessage !== "" ? (
        <>
          <span>{errorMessage}, Please try again</span>
          <Button size="xxl" onClick={handleResend}>
            Resend Email
          </Button>
        </>
      ) : (
        <span>{successMessage}</span>
      )}
      <span>{isLoading ? "Loading..." : ""}</span>
    </div>
  );
};

export default EmailVerification;
