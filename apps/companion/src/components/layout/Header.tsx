import { Navbar, type NavLink } from "@repo/ui";

const COMPANION_LINKS: NavLink[] = [
  { href: "/", icon: "🏠", label: "Home", size: "md" },
  // { href: "/tv-set", icon: "📺", label: "TV-Set", size: "md" },
  // { href: "/planner", icon: "📋", label: "Planner", size: "md" },
];

export const Header = () => {
  return <Navbar links={COMPANION_LINKS} />;
};
