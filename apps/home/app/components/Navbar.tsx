import { Navbar as SharedNavbar } from "@repo/atomic-ui/compounds";

const HOME_LINKS = [
  { href: "/tv-set", icon: "📺", label: "TV-Set" },
  { href: "/companion", icon: "🕌", label: "Companion" },
  { href: "/planner", icon: "📋", label: "Planner" },
];

export function Navbar() {
  return <SharedNavbar links={HOME_LINKS} />;
}
