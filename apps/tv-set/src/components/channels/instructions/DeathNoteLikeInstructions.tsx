"use client";

import React, { useState, useEffect } from "react";
import { Text } from "@atoms";
import Image from "next/image";
import InstructionsLogo from './InstructionsLogo.jpg';
import FrameCorner from './FrameCorner.jpg';
import { Eye } from "./Eye";

const EYE_CLOSE_DURATION_MS = 1000;

const GlitchingRule: React.FC<{ text: string; isSimplified: boolean }> = ({ text, isSimplified }) => {
  const [scrambled, setScrambled] = useState(text);

  useEffect(() => {
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const interval = setInterval(() => {
      setScrambled(
        text
          .split("")
          .map((char) => {
            if (char === " ") return " ";
            return Math.random() > 0.3
              ? chars[Math.floor(Math.random() * chars.length)]
              : char;
          })
          .join("")
      );
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  const textColorClass = isSimplified ? "text-cyan-400" : "text-red-400";

  return (
    <span className={`font-mono ${textColorClass} tracking-tighter opacity-90 select-none blur-[0.2px] glitch-active text-sm`}>
      {scrambled}
    </span>
  );
};

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

  const simplified_rules: Array<string> = [
    "Press Left or Right arrow keys to switch channels.",
    "Swipe left or right on mobile to change channels.",
    "Click the bottom-right icon to unlock direct page interaction.",
    "Hold 'Ctrl' and type a channel number to jump to it directly.",
    "Welcome to the TV SET — a collection of unique web experiments.",
    "Stay on a channel long enough, and you might get hooked.",
    "Some channels change and surprise you every time you visit.",
    "Secret hidden experiments are waiting to be discovered!"
  ];

  const [isSimplified, setIsSimplified] = useState<boolean>(false);
  const [isEyeClosed, setIsEyeClosed] = useState<boolean>(false);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  const handleEyeClick = () => {
    if (isEyeClosed) return;

    setIsEyeClosed(true);
    setIsGlitching(true);

    setTimeout(() => {
      setIsSimplified((prev) => !prev);
      setIsEyeClosed(false);
      setIsGlitching(false);
    }, EYE_CLOSE_DURATION_MS);
  };

  const activeRules = isSimplified ? simplified_rules : rules;

  return (
    <div className="bg-black text-white h-[100dvh] w-full flex flex-col items-center p-4 sm:p-10 overflow-y-auto relative">
      <style>{`
        @keyframes glitch-anim-fast {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(3px, 1px); }
          80% { transform: translate(-1px, -2px); }
          100% { transform: translate(0); }
        }
        .glitch-active {
          display: inline-block;
          animation: glitch-anim-fast 0.08s infinite;
          text-shadow: 2px 0 #ff0055, -2px 0 #00e5ff;
        }
      `}</style>

      {/* Detailed Shinigami Eye Button on Top Right of Screen */}
      <button
        type="button"
        onClick={handleEyeClick}
        disabled={isEyeClosed}
        title={isSimplified ? "Revert to Original Rules" : "Simplify Rules"}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 group cursor-pointer p-1 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
        aria-label="Toggle simplified rules"
      >
        <Eye isSimplified={isSimplified} isEyeClosed={isEyeClosed} />
      </button>

      {/* Outer border mimicking a page frame */}
      <div
        className="w-full max-w-4xl flex-1 relative flex flex-col items-center mt-10 sm:mt-12 mb-10 min-h-max"
        style={{
          borderStyle: "solid",
          borderWidth: "2px 1px 3px 2px",
          borderImage: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.8) 100%) 1",
        }}
      >
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

          {/* Rules */}
          <ul className="text-left font-serif max-w-3xl w-full flex flex-col gap-6 sm:gap-10 tracking-wide leading-relaxed mt-6 sm:mt-8 mb-8">
            {activeRules.map((rule, i) => (
              <li key={i} className="flex items-start">
                <span className="font-death_note_2 text-xl sm:text-2xl pr-4 sm:pr-6 mt-1 opacity-90">O</span>
                <span className="text-base sm:text-xl mt-1.5 min-h-[1.5em]">
                  {isGlitching ? <GlitchingRule text={rule} isSimplified={isSimplified} /> : rule}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

