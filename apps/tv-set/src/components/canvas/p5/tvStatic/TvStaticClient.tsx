"use client";

import React, { useEffect, useRef, useState } from "react";
import { P5Sketch } from "@atoms";
import { tvStaticSetup, tvStaticDraw } from "@repo/channel";
import styles from "./TvStatic.module.scss";

interface ComponentProps {
  volume?: number;
}

export const TvStaticClient: React.FC<ComponentProps> = ({
  volume = 0.01,
}: ComponentProps) => {
  const noiseAudioRef = useRef<HTMLAudioElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const audio = noiseAudioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const playAudio = () => {
      audio
        .play()
        .then(() => {
          removeInteractionListeners();
        })
        .catch((err) => {
          console.log("Audio play failed on interaction:", err);
        });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("click", playAudio);
      window.removeEventListener("keydown", playAudio);
      window.removeEventListener("touchstart", playAudio);
    };

    // Try playing immediately
    audio.play().catch(() => {
      // Catch error and wait for user interaction to avoid browser console error
      window.addEventListener("click", playAudio);
      window.addEventListener("keydown", playAudio);
      window.addEventListener("touchstart", playAudio);
    });

    return () => {
      removeInteractionListeners();
    };
  }, [volume]);

  const setup = (p5: any, canvasParentRef: Element) => {
    tvStaticSetup(p5, canvasParentRef);
  };

  const draw = (p5: any) => {
    tvStaticDraw(p5);
  };

  return (
    <>
      <audio
        ref={noiseAudioRef}
        loop
        preload="auto"
        src="/audios/tv_static_1.mp3"
      />
      {!isMounted ? (
        <svg
          className={styles.staticNoise}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      ) : (
        <P5Sketch setup={setup} draw={draw} />
      )}
    </>
  );
};
