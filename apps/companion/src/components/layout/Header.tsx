import { Navbar } from "@repo/atomic-ui/compounds";

const COMPANION_LINKS = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/companion/prayers", icon: "🕌", label: "Prayers" },
  { href: "/companion/prayers_strict", icon: "📿", label: "Strict" },
];

export const Header = () => {
  return <Navbar links={COMPANION_LINKS} />;
};
