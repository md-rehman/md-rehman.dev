import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
