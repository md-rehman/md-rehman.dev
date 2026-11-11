import { Navbar as SharedNavbar } from "@repo/ui";

const HOME_LINKS = [
  { href: "/tv-set", icon: "📺", label: "TV-Set" },
  { href: "/react-native-ruler-date-picker", icon: "📐", label: "Ruler Picker" },
  { href: "/companion", icon: "🕌", label: "Companion" },
  { href: "/planner", icon: "📋", label: "Planner" },
];

export function Navbar() {
  return <SharedNavbar links={HOME_LINKS} />;
}
