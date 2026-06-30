export interface ChannelMetadata {
  name: string;
  title: string;
  description: string;
  keywords?: string[];
  contentHtml?: string;
}

export const channelsMetadata: Record<number, ChannelMetadata> = {
  0: {
    name: "Instructions",
    title: "TV Set Instructions - Rehman's Portfolio",
    description:
      "How to use and navigate through Rehman's interactive TV Set project showcasing creative coding canvas experiments.",
    keywords: [
      "instructions",
      "help",
      "navigation",
      "creative coding",
      "interactive website",
      "portfolio",
    ],
    contentHtml:
      "<h2>How to Use TV Set</h2><p>Welcome to the TV Set! This is a dynamic, retro-themed playground where you can tune into different channels. Each channel showcases a unique creative coding experiment built with React, Canvas, and HTML5.</p><ul><li>Use the <strong>Left and Right Arrow keys</strong> to switch channels.</li><li>On touch screens, simply <strong>swipe left or right</strong>.</li><li>If you want to interact with a channel directly (like drawing on canvases), tap the hand icon in the bottom right to <strong>toggle global swipe interactions</strong>.</li><li>Use <strong>Ctrl + [Number]</strong> to quick-jump to a specific channel.</li></ul>",
  },
  1: {
    name: "Introduction",
    title: "Introduction - Rehman, Web Developer",
    description:
      "Hi, I'm Rehman, a passionate Web Developer specializing in building high-performance interactive web apps, React, Node.js, and browser experiments.",
    keywords: [
      "about rehman",
      "web developer portfolio",
      "react developer",
      "javascript engineer",
      "frontend developer",
    ],
    contentHtml:
      "<h1>About Rehman</h1><p>I am a software engineer and web developer who loves crafting unique web experiences. I specialize in React, Next.js, React Native, TypeScript, and interactive canvas graphics. I like exploring generative art, traveling, and sharing my projects.</p>",
  },
  2: {
    name: "Random Walker 3",
    title: "Random Walker 3 - Generative Art Canvas Experiment",
    description:
      "A generative art experiment based on a random walker algorithm that renders unique pathways in real-time.",
    keywords: [
      "random walker",
      "generative art",
      "canvas rendering",
      "interactive design",
      "creative coding",
    ],
    contentHtml:
      "<h1>Random Walker 3</h1><p>The random walker algorithm is a mathematical construct representing a path that consists of a succession of random steps. This version adds stylized coloring and tracing speed to render beautiful generative designs on the canvas.</p>",
  },
  3: {
    name: "Random Walker",
    title: "Random Walker - Generative Canvas Simulation",
    description:
      "A canvas simulation displaying a classic random walker pattern in motion.",
    keywords: ["random walk", "simulation", "p5js", "canvas", "abstract art"],
    contentHtml:
      "<h1>Random Walker Simulation</h1><p>Observe the traditional random walker algorithm as it moves in four cardinal directions, carving out a randomized trace on the screen over time.</p>",
  },
  4: {
    name: "Random Walker 4",
    title: "Random Walker 4 - Multi-directional Tracing",
    description:
      "An advanced random walker canvas rendering with multi-directional movements and gradient trails.",
    keywords: [
      "multi-directional walker",
      "generative patterns",
      "canvas canvas",
      "mathematical art",
    ],
    contentHtml:
      "<h1>Random Walker 4</h1><p>This experiment runs multiple simultaneous walkers drawing lines on the screen. It builds dynamic textures and shapes through pure random steps.</p>",
  },
  5: {
    name: "Random Walker 2",
    title: "Random Walker 2 - Vector-based Tracing",
    description:
      "A vector-based random walker rendering fluid trajectories and dynamic color shifts.",
    keywords: [
      "vector motion",
      "fluid canvas",
      "generative paint",
      "random trajectory",
    ],
    contentHtml:
      "<h1>Random Walker 2</h1><p>A variation of the random walker experiment that utilizes vector physics (position, velocity, and random acceleration) to create smooth, natural-looking pathways instead of pixelated grids.</p>",
  },
  6: {
    name: "Random Walker 5",
    title: "Random Walker 5 - Abstract Texture Generation",
    description:
      "A complex generative walker creating abstract textures and visual layouts.",
    keywords: [
      "texture generator",
      "generative texture",
      "canvas playground",
      "abstract artwork",
    ],
    contentHtml:
      "<h1>Random Walker 5</h1><p>An abstract generator showing how noise combined with random walking can generate aesthetic organic forms and textures resembling cell structures or stellar paths.</p>",
  },
  7: {
    name: "Motion 101",
    title: "Motion 101 - Newton's Laws of Motion Simulation",
    description:
      "An interactive canvas simulation showcasing the fundamentals of digital physics, including velocity, acceleration, and gravity.",
    keywords: [
      "motion simulation",
      "canvas physics",
      "vectors",
      "acceleration",
      "newtonian motion",
    ],
    contentHtml:
      "<h1>Motion 101: Digital Physics</h1><p>This experiment simulates the basic laws of motion using vectors. It tracks position, velocity, and acceleration towards a target, demonstrating how objects accelerate towards the mouse pointer in a simulated space.</p>",
  },
  8: {
    name: "Ball Shooter",
    title: "Ball Shooter - Interactive Canvas Physics Game",
    description:
      "A fun interactive canvas-based physics game where you aim and shoot balls in a gravity-simulated space.",
    keywords: [
      "canvas game",
      "physics simulation",
      "interactive play",
      "web game",
      "ball physics",
    ],
    contentHtml:
      "<h1>Ball Shooter Experiment</h1><p>Aim, shoot, and watch gravity take action! This experiment features classic particle physics with bounding boxes and vector-based collisions.</p>",
  },
  9: {
    name: "InteractiveGlitchIntroduction",
    title: "Interactive Introduction - Rehman's Portfolio",
    description:
      "An interactive version of the glitch introduction where clicking triggers custom events defined in a text array.",
    keywords: [
      "interactive",
      "glitch",
      "portfolio",
      "custom events",
    ],
    contentHtml:
      "<h1>Interactive Introduction</h1><p>Click anywhere on the screen to trigger custom events such as changing the background color or navigating to other channels!</p>",
  },
  10: {
    name: "Hyperdrive",
    title: "Hyperdrive - Space Travel Simulation",
    description:
      "A p5.js generative art simulation of jumping to hyperdrive or moving through a starfield.",
    keywords: [
      "hyperdrive",
      "starfield",
      "p5js",
      "canvas",
      "creative coding",
      "space",
    ],
    contentHtml:
      "<h1>Hyperdrive Simulation</h1><p>Travel through a starfield using this p5.js canvas sketch. Move your mouse along the X-axis to control the speed of the jump into hyperdrive!</p>",
  },
};
