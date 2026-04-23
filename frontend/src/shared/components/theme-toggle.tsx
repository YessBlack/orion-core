import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  if (!resolvedTheme) return null

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="border-slate-300 bg-white/85 text-slate-700 backdrop-blur hover:bg-slate-100 dark:border-[#1E1B4B] dark:bg-[#111827]/85 dark:text-[#E5E7EB] dark:hover:bg-[#151b2C]"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "Modo claro" : "Modo oscuro"}
    </Button>
  )
}
