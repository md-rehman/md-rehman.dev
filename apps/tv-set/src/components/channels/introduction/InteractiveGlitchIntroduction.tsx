"use client";

import React, { useEffect, useState } from "react";
import { Text } from "@atoms";
import { FloatingShapes, GlitchText } from "@molecules";
import { useTvNavigator } from "@navigator/context";

interface ICSSPosition {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
}

interface TextItem {
  title: string;
  event: (ctx: {
    changeChannel: (channel: number) => void;
    nextChannel: () => void;
    prevChannel: () => void;
    setBackgroundColor: (color: string) => void;
  }) => void;
}

const FloatingTextDelay = 3000;

// The user-defined array of texts and associated events.
const TextArray: TextItem[] = [
  {
    title: "Navigate to page 99",
    event: (ctx) => ctx.changeChannel(99),
  },
  {
    title: "Change background to red",
    event: (ctx) => ctx.setBackgroundColor("#dc2626"),
  },
  {
    title: "Navigate to channel 0 (Instructions)",
    event: (ctx) => ctx.changeChannel(0),
  },
  {
    title: "Change background to purple",
    event: (ctx) => ctx.setBackgroundColor("#9333ea"),
  },
  {
    title: "Navigate to channel 1 (Original Intro)",
    event: (ctx) => ctx.changeChannel(1),
  },
  {
    title: "Reset background color",
    event: (ctx) => ctx.setBackgroundColor("transparent"),
  },
  {
    title: "Go to next channel",
    event: (ctx) => ctx.nextChannel(),
  },
];

interface FloatingTextState {
  item: TextItem;
  position: ICSSPosition;
  marginLeft: number;
}

export const InteractiveGlitchIntroduction: React.FC = () => {
  const navigator = useTvNavigator();
  const [backgroundColor, setBackgroundColor] = useState<string>();
  const [floatingText, setFloatingText] = useState<FloatingTextState | null>(null);

  const randomTextSetter = () => {
    const randomItem = TextArray[Math.floor(Math.random() * TextArray.length)];
    if (!randomItem) return;
    const randomPosition: ICSSPosition = {};
    randomPosition.top =
      window.innerHeight * 0.1 + window.innerHeight * (Math.random() * 0.8);

    // NOTE: To avoid placing over the center title
    if (
      randomPosition.top > window.innerHeight / 2 - 50 &&
      randomPosition.top < window.innerHeight / 2 + 50
    ) {
      randomPosition.top = randomPosition.top + 150;
    }

    setFloatingText({
      item: randomItem,
      position: randomPosition,
      marginLeft: window.innerWidth * Math.random() * 0.6, // Keep slightly centered so it does not overflow
    });
  };

  useEffect(() => {
    randomTextSetter();
    const timerId = setInterval(() => {
      randomTextSetter();
    }, FloatingTextDelay);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const handleScreenClick = () => {
    if (floatingText) {
      const context = {
        changeChannel: navigator.changeChannel,
        nextChannel: navigator.nextChannel,
        prevChannel: navigator.prevChannel,
        setBackgroundColor,
      };
      floatingText.item.event(context);
    }
  };

  return (
    <div
      className="w-full h-full cursor-pointer select-none"
      onClick={handleScreenClick}
    >
      <FloatingShapes
        backDrop={backgroundColor}
      >
        <div className="flex flex-1 flex-col items-center justify-center h-full overflow-hidden">
          <Text className="font-silkscreen text-4xl">Click Screen to Trigger Event</Text>
          {floatingText && (
            <GlitchText
              className="absolute w-4/5 text-lg pointer-events-none"
              style={{
                ...floatingText.position,
                marginLeft: floatingText.marginLeft,
              }}
            >
              {floatingText.item.title}
            </GlitchText>
          )}
        </div>
      </FloatingShapes>
    </div>
  );
};
