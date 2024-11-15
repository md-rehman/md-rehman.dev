import dynamic from "next/dynamic";
import { exampleSketch } from "../components";

// Dynamically import P5Wrapper and disable SSR
const P5Wrapper = dynamic(
  () => import("../components").then((mod) => mod.P5Wrapper),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="flex flex-1 h-screen w-screen flex-col justify-center items-center">
      <p>Below you should see a simple p5 example.</p>
      <P5Wrapper sketch={exampleSketch} />
      <p>Above you should see a simple p5 example.</p>
    </main>
  );
}
