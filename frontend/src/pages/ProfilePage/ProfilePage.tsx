import ThemeModeToggle from "@/components/ThemeToggle";
import "./ProfilePage.css";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  return (
    <div className="">
      <Button variant="default" size="xl" className="w-full">
        MY BUTTON
      </Button>
      <span className="text-foreground">RanDOM</span>
      <div className="bg-[var(--popover)] text-[var(--popover-foreground)] px-10 py-3 text-lg">
        HELLO WORLD
      </div>
      <ThemeModeToggle />
    </div>
  );
};

export default ProfilePage;
