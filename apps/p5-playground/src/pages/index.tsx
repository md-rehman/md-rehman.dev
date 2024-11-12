import Image from "next/image";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { exampleSketch } from "../components";

// Dynamically import P5Wrapper and disable SSR
const P5Wrapper = dynamic(
  () => import("../components").then((mod) => mod.P5Wrapper),
  { ssr: false },
);

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <main className="flex flex-1 h-screen w-screen flex-col justify-center items-center">
      <P5Wrapper sketch={exampleSketch} />
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
    </main>
  );
}
