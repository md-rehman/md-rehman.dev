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
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
      <Footer />
    </>
  );
}
