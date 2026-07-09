"use client";

import React from "react";
import { Text } from "@atoms";
import Image from "next/image";
import InstructionsLogo from './InstructionsLogo.jpg';
import FrameCorner from './FrameCorner.jpg';


export const DeathNoteLikeInstructions: React.FC = () => {
  const rules: Array<string> = [
    "The mortal who presses the left or right arrows shall alter the current channel.",
    "The mortal with a touch screen need only swipe left or right to command the channels.",
    "Beware the global touch. It governs all. To touch the page directly, one must first disable the global touch by pressing the bottom right icon.",
    "The mortal who holds the 'Ctrl' key will possess the ability to transport to any channel by entering the channel number.",
    "This domain is known as the TV SET. Within it lie countless experiments. Each channel shall manifest something extraordinary.",
    "The mortal who stays on a channel for too long shall inevitably become captivated.",
    "A channel's manifestation is not absolute. Some shall reveal alternate forms each time they are observed.",
    "There exist concealed experiments, buried deep within the abyss of the TV SET domain."
  ];

  return (
    <div className="bg-black text-white h-[100dvh] w-full flex flex-col items-center p-4 sm:p-10 overflow-y-auto">
      {/* Outer border mimicking a page frame */}
      <div
        className="w-full max-w-4xl flex-1 relative flex flex-col items-center mt-10 sm:mt-12 mb-10 min-h-max"
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

        {/* Inner Content */}
        <div className="flex-1 w-full p-6 pt-16 sm:p-12 sm:pt-20 flex flex-col items-center">
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
              <li key={i} className="flex items-start">
                <span className="font-death_note_2 text-xl sm:text-2xl pr-4 sm:pr-6 mt-1 opacity-90">O</span>
                <span className="text-base sm:text-xl mt-1.5">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
