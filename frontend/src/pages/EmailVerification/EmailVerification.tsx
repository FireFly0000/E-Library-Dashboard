import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import ELibLogo from "/book-svgrepo-com.svg";

const EmailVerification = () => {
  const { token } = useParams();

  console.log(token);

  return (
    <div className="flex flex-col items-center gap-5 text-center w-full text-4xl text-[var(--foreground)] px-5">
      <img src={ELibLogo} alt="App's logo" className="w-[10%] min-w-[200px]" />
      <span>Please click below to verify your email</span>
      <Button className="w-[10%] min-w-[200px]" size="xl">
        Verify
      </Button>
    </div>
  );
};

export default EmailVerification;
