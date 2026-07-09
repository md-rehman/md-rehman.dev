import { NavLink } from "@repo/atomic-ui/compounds";

export const COMPANION_LINKS: NavLink[] = [
  { href: "/", icon: "🏠", label: "Home", size: "md" },
  { href: "/companion/prayers", icon: "🕌", label: "Prayers", size: "md" },
  { href: "/companion/prayers_strict", icon: "📿", label: "Strict", size: "md" },
];

export function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
