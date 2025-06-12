import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeModeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <div
      className="h-full titlebar-button focus-visible:ring-0 bg-transparent hover:bg-transparent
        border-0 hover:brightness-150 hover:shadow-none hover:border-0 duration-500
        ease-in-out transition-all flex cursor-pointer"
      onClick={() => {
        setTheme({
          mode: theme.mode === "light" ? "dark" : "light",
        });
      }}
    >
      <Moon
        className="h-[1.7rem] w-[1.7rem] rotate-0 scale-100 transition-all text-foreground
          dark:-rotate-90 dark:scale-0"
      />
      <Sun
        className="absolute h-[1.7rem] w-[1.7rem] rotate-90 scale-0 transition-all dark:rotate-0
          dark:scale-100 text-foreground"
      />
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
