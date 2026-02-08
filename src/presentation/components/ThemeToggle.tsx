import { Moon, Sun } from "lucide-react"
import { Button } from "@/presentation/components/ui/button"
import { useTheme } from "@/presentation/hooks/useTheme";
export default function ThemeToggle() {
    const {isDark, toggle} = useTheme();
    return (
    <div>
        <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    </div>
  )
}
