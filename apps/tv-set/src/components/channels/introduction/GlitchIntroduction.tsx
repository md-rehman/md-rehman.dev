"use client";

import React, { useEffect, useState } from "react";
import { Text } from "@atoms";
import { FloatingShapes, GlitchText } from "@molecules";

interface ICSSPosition {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
}

const FloatingTextDelay = 3000;
const TextArray = [
  "I'm a Web Developer 🕷",
  "I'm a React Developer",
  "I'm a ReactNative Developer",
  "Have a look my experiments",
  "This is called TvSet",
  "Do you like what you see",
  // "Tune in to channel 11",
  "Core Contributor of NativeBase",
  "I love to travel",
  "I love Cats 🦁",
  "I love Anime",
  // "Don't click the screen"  when clicked certain action can be performed...
];
const colors = [
  "hsl(180, 100%, 50%)",
  "hsl(30, 100%, 50%)",
  "hsl(240, 100%, 50%)",
  "hsl(0, 100%, 50%)",
  "hsl(120, 100%, 50%)",
  "hsl(60, 100%, 50%)",
  "hsl(270, 100%, 50%)",
  "hsl(30, 100%, 50%)",
  "hsl(330, 100%, 50%)",
  "hsl(300, 100%, 50%)",
] as const;
let randomColor: string = colors[0];

export const GlitchIntroduction: React.FC = () => {
  const [floatingText, setFloatingText] = useState<any | null>(null);

  useEffect(() => {
    randomColor = colors[Math.floor(Math.random() * colors.length)] ?? colors[0];
  }, [])

  useEffect(() => {
    randomTextSetter();
    const timerId = setInterval(() => {
      randomTextSetter();
    }, FloatingTextDelay);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const randomTextSetter = () => {
    let randomPosition: ICSSPosition = {};
    randomPosition.top =
      window.innerHeight * 0.1 + window.innerHeight * (Math.random() * 0.8);
    const randomText = TextArray[Math.floor(Math.random() * TextArray.length)];

    // NOTE: To avoid placing over the center title
    if (
      randomPosition.top > window.innerHeight / 2 - 50 &&
      randomPosition.top < window.innerHeight / 2 + 50
    ) {
      randomPosition.top = randomPosition.top + 150;
    }

    setFloatingText(
      <GlitchText
        className="absolute w-4/5 text-lg"
        style={{
          ...randomPosition,
          marginLeft: window.innerWidth * Math.random(),
        }}
      >
        {randomText}
      </GlitchText>,
    );
  };
  return (
    <FloatingShapes
      backDrop={randomColor}>
      <div className="flex flex-1 flex-col items-center justify-center h-full overflow-hidden">
        <Text className="font-silkscreen text-4xl">Hi, I&apos;m Rehman</Text>
        {floatingText}
      </div>
    </FloatingShapes>
  );
};
