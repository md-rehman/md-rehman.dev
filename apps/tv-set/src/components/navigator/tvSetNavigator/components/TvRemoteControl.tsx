"use client";

import React, { useState, useRef } from "react";
import { useTvNavigator } from "../../context";

export const TvRemoteControl: React.FC = () => {
  const {
    currentChannel,
    changeChannel,
    nextChannel,
    prevChannel,
    overlay,
    togglePower,
    showInfoOverlay,
    appendDigit,
    commitChannelInput,
    cancelDigitInput,
    pendingChannelNumber,
  } = useTvNavigator();

  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {
        // Suppress audio error if user hasn't interacted yet
      });
    }
  };

  const handlePower = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cancelDigitInput) cancelDigitInput();
    playClickSound();
    if (togglePower) togglePower();
  };

  const handleDigit = (digit: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    if (appendDigit) {
      appendDigit(digit);
    } else {
      changeChannel(digit);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cancelDigitInput) cancelDigitInput();
    playClickSound();
    nextChannel();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cancelDigitInput) cancelDigitInput();
    playClickSound();
    prevChannel();
  };

  const handleOK = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    const committed = commitChannelInput ? commitChannelInput() : false;
    if (!committed && showInfoOverlay) {
      showInfoOverlay();
    }
  };

  const isPowerOff = overlay === "off";

  return (
    <div
      className={`fixed bottom-0 right-6 z-50 transition-transform duration-300 ease-in-out select-none ${isExpanded
          ? "translate-y-0"
          : "translate-y-[calc(100%-54px)] hover:translate-y-0"
        }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <audio
        ref={audioRef}
        src="/tv-set/audios/remote_button_2.mp3"
        preload="auto"
      />

      {/* Remote Control Main Frame */}
      <div className="w-44 sm:w-48 bg-gradient-to-b from-neutral-800 via-neutral-850 to-neutral-900 border-2 border-neutral-700/80 rounded-t-[38px] rounded-b-[48px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3.5 text-white">
        {/* Peek Handle & Header */}
        <div
          className="w-full flex flex-col items-center cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-10 h-1 bg-neutral-600 rounded-full mb-2 group-hover:bg-lime-400 transition-colors" />

          {/* Top Sensor LED & Power Button Row */}
          <div className="w-full flex items-center justify-between px-1">
            {/* Power Button */}
            <button
              onClick={handlePower}
              title={isPowerOff ? "Turn TV On" : "Turn TV Off"}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 active:scale-90 ${isPowerOff
                  ? "bg-red-950/80 border-red-600 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  : "bg-white border-neutral-300 text-neutral-900 hover:bg-neutral-100 shadow-md"
                }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 3v7h-2V3h2zm-1 18a8.5 8.5 0 1 1 6.01-2.49"
                />
              </svg>
            </button>

            {/* LED Status Light */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                {pendingChannelNumber !== null && pendingChannelNumber !== undefined
                  ? `SET ${pendingChannelNumber}`
                  : `CH ${currentChannel}`}
              </span>
              <span
                className={`w-2 h-2 rounded-full transition-colors ${isPowerOff
                    ? "bg-red-500 animate-pulse"
                    : pendingChannelNumber !== null && pendingChannelNumber !== undefined
                      ? "bg-amber-400 animate-ping shadow-[0_0_8px_#f59e0b]"
                      : "bg-lime-400 shadow-[0_0_8px_#84cc16]"
                  }`}
              />
            </div>
          </div>
        </div>

        {/* 3x3 Keypad + 0 Button */}
        <div className="w-full grid grid-cols-3 gap-2 px-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={(e) => handleDigit(num, e)}
              className="h-8 bg-neutral-200 hover:bg-white text-neutral-900 font-semibold rounded-md shadow-sm active:scale-95 transition-all text-xs font-mono"
            >
              {num}
            </button>
          ))}
          <div className="col-span-1" />
          <button
            onClick={(e) => handleDigit(0, e)}
            className="h-8 bg-neutral-200 hover:bg-white text-neutral-900 font-semibold rounded-md shadow-sm active:scale-95 transition-all text-xs font-mono"
          >
            0
          </button>
          <div className="col-span-1" />
        </div>

        {/* D-Pad Directional Control */}
        <div className="relative w-28 h-28 my-1 flex items-center justify-center">
          {/* Circular Outer D-Pad Background */}
          <div className="absolute inset-0 rounded-full border-2 border-neutral-700 bg-neutral-800 shadow-inner" />

          {/* Up Button */}
          <button
            onClick={handleNext}
            title="Next Channel"
            className="absolute top-0 inset-x-0 h-9 flex items-start justify-center pt-1 hover:text-lime-400 text-neutral-300 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8l-6 6h12z" />
            </svg>
          </button>

          {/* Down Button */}
          <button
            onClick={handlePrev}
            title="Previous Channel"
            className="absolute bottom-0 inset-x-0 h-9 flex items-end justify-center pb-1 hover:text-lime-400 text-neutral-300 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 16l6-6H6z" />
            </svg>
          </button>

          {/* Left Button */}
          <button
            onClick={handlePrev}
            title="Previous Channel"
            className="absolute left-0 inset-y-0 w-9 flex items-center justify-start pl-1 hover:text-lime-400 text-neutral-300 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 12l6-6v12z" />
            </svg>
          </button>

          {/* Right Button */}
          <button
            onClick={handleNext}
            title="Next Channel"
            className="absolute right-0 inset-y-0 w-9 flex items-center justify-end pr-1 hover:text-lime-400 text-neutral-300 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 12l-6 6V6z" />
            </svg>
          </button>

          {/* Center OK / Select Button */}
          <button
            onClick={handleOK}
            title="Info / Select"
            className="relative z-10 w-10 h-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-[10px] uppercase shadow-md active:scale-90 transition-transform flex items-center justify-center"
          >
            OK
          </button>
        </div>

        {/* Bottom Pill Buttons : Commenting out for now. Because of the D-Pad */}
        {/* <div className="w-full flex items-center justify-between gap-2 px-1 mb-1">
          <button
            onClick={handlePrev}
            className="flex-1 h-7 bg-neutral-200 hover:bg-white text-neutral-900 font-bold text-[10px] uppercase rounded-full shadow-sm active:scale-95 transition-all flex items-center justify-center gap-0.5"
          >
            CH -
          </button>
          <button
            onClick={handleNext}
            className="flex-1 h-7 bg-neutral-200 hover:bg-white text-neutral-900 font-bold text-[10px] uppercase rounded-full shadow-sm active:scale-95 transition-all flex items-center justify-center gap-0.5"
          >
            CH +
          </button>
        </div> */}
      </div>
    </div>
  );
};
