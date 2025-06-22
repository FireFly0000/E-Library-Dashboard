import ThemeModeToggle from "@/components/ThemeToggle";
import "./ProfilePage.css";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <Button variant="outline" size="xl" className="w-full">
        MY BUTTON
      </Button>
      <span className="text-foreground">RanDOM</span>
      <div className="bg-[var(--popover)] text-[var(--popover-foreground)] px-10 py-3 text-lg">
        HELLO WORLD
      </div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
      <ThemeModeToggle />
    </div>
  );
};

export default ProfilePage;
