"use client";

import React from "react";
import { Text } from "@atoms";
import { useMediaQuery } from "@react-hook/media-query";

import Image from "next/image";
import InstructionsLogo from './InstructionsLogo.jpg';
import FrameCorner from './FrameCorner.jpg';


export const DeathNoteLikeInstructions: React.FC = () => {
  const probablyTouchScreen = useMediaQuery(
    "only screen and (pointer: coarse)",
  );

  const rules: Array<string> = [
    "Use left and right arrow to change channels.",
    "Swipe left and right on touch screen to change channel.",
    "Touch on bottom right botton to disable global touches (default enabled) to itetact with the page.",
    'Use "Ctrl + <number>" for quick jumping to that channel.',
  ];

  return (
    <div className="bg-black text-white h-[100dvh] w-full flex flex-col items-center p-4 sm:p-10 overflow-hidden">
      {/* Outer border mimicking a page frame */}
      <div
        className="w-full max-w-4xl h-full relative flex flex-col items-center mt-10 sm:mt-12"
        style={{
          borderStyle: "solid",
          borderWidth: "2px 1px 3px 2px",
          borderImage: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.8) 100%) 1",
        }}
      >
        {/* Decorative corner markers */}
        <div className="absolute top-1 left-1 opacity-80">
          <Image
            src={FrameCorner}
            alt="Frame Corner Top Left"
            width={48}
            height={48}
            priority
            style={{ width: "48px", height: "48px" }}
          />
        </div>
        <div className="absolute top-1 right-1 opacity-80 rotate-90">
          <Image
            src={FrameCorner}
            alt="Frame Corner Top Right"
            width={48}
            height={48}
            priority
            style={{ width: "48px", height: "48px" }}
          />
        </div>
        <div className="absolute bottom-1 left-1 opacity-80 -rotate-90">
          <Image
            src={FrameCorner}
            alt="Frame Corner Bottom Left"
            width={48}
            height={48}
            priority
            style={{ width: "48px", height: "48px" }}
          />
        </div>
        <div className="absolute bottom-1 right-1 opacity-80 rotate-180">
          <Image
            src={FrameCorner}
            alt="Frame Corner Bottom Right"
            width={48}
            height={48}
            priority
            style={{ width: "48px", height: "48px" }}
          />
        </div>

        {/* TV Icon on top of the border */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-black px-6 py-2">
          <Image
            src={InstructionsLogo}
            alt="Instructions Logo"
            width={120}
            height={120}
            priority
            style={{ width: "auto", height: "auto", margin: "0 auto" }}
          />
        </div>

        {/* Scrollable Inner Content */}
        <div className="flex-1 w-full overflow-y-auto p-6 pt-16 sm:p-12 sm:pt-20 flex flex-col items-center">
          {/* Title */}
          <Text className="font-death_note_2 text-5xl sm:text-8xl tracking-widest text-center mt-4 sm:mt-8">
            TV SET
          </Text>
          <Text className="font-death_note_2 text-3xl sm:text-5xl tracking-widest mb-2 mt-2 sm:mt-4 text-center">
            How to use it
          </Text>
          {/* <Text className="font-death_note_2 text-4xl mb-12 text-center">I</Text> */}

          {/* Rules */}
          <ul className="text-left font-serif max-w-3xl w-full flex flex-col gap-6 sm:gap-10 tracking-wide leading-relaxed mt-6 sm:mt-8 mb-8">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-end">
                <span className="font-death_note_2 text-xl sm:text-2xl pr-4 sm:pr-6 mt-1 opacity-90">O</span>
                <span className="text-base sm:text-xl">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
