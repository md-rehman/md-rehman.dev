import React, { useState, useRef, useEffect, useCallback } from "react";
import { Text } from "@atoms";
import styles from "../TvSetNavigator.module.scss";

interface OffOverlayProps {
  config: any;
  setChannelMeta: React.Dispatch<React.SetStateAction<any>>;
  probablyTouchScreen?: boolean;
  onRegisterTurnOn?: (fn: () => void) => void;
  isTurningOff?: boolean;
}

export const OffOverlay: React.FC<OffOverlayProps> = ({
  config,
  setChannelMeta,
  onRegisterTurnOn,
  isTurningOff = false,
}) => {
  const [animState, setAnimState] = useState<
    "idle" | "turningOn" | "turningOff"
  >(isTurningOff ? "turningOff" : "idle");
  const animStateRef = useRef<"idle" | "turningOn" | "turningOff">(
    isTurningOff ? "turningOff" : "idle",
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  const updateAnimState = useCallback(
    (nextState: "idle" | "turningOn" | "turningOff") => {
      animStateRef.current = nextState;
      setAnimState(nextState);
    },
    [],
  );

  useEffect(() => {
    if (isTurningOff) {
      updateAnimState("turningOff");
      const timer = setTimeout(() => {
        updateAnimState("idle");
        setChannelMeta((prev: any) => ({ ...prev, isTurningOff: false }));
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      updateAnimState("idle");
    }
  }, [isTurningOff, setChannelMeta, updateAnimState]);

  const handleTurnOn = useCallback(() => {
    if (animStateRef.current === "turningOn") return;
    updateAnimState("turningOn");

    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      setChannelMeta((prevState: any) => {
        setTimeout(() => {
          setChannelMeta((prevState: any) => ({
            ...prevState,
            overlay: config[prevState.activeChannel] ? "none" : "blueScreen",
            infoOverlay: true,
          }));
        }, 600);

        setTimeout(() => {
          setChannelMeta((prevState: any) => ({
            ...prevState,
            infoOverlay: false,
          }));
        }, 2600);

        return {
          ...prevState,
          overlay: "noise",
          infoOverlay: true,
        };
      });
    }, 1250);
  }, [config, setChannelMeta, updateAnimState]);

  useEffect(() => {
    if (onRegisterTurnOn) {
      onRegisterTurnOn(handleTurnOn);
    }
  }, [onRegisterTurnOn, handleTurnOn]);

  const animClass =
    animState === "turningOn"
      ? styles.offText
      : animState === "turningOff"
      ? styles.offTextReverse
      : "";

  return (
    <div
      className="off-overlay fixed h-screen w-screen top-0 bg-black flex flex-1 items-center justify-center text-center z-50 cursor-pointer"
      onClick={handleTurnOn}
    >
      <audio ref={audioRef} src="/tv-set/audios/remote_button_2.mp3" />
      <span className={`flex flex-row ${animClass}`}>
        <Text
          className={`font-silkscreen text-white text-2xl mx-12 ${animClass}`}
        >
          Press to Turn
        </Text>
        <Text
          className={`font-silkscreen text-2xl inline ${
            animClass ? `text-white ${animClass}` : "text-lime-500"
          }`}
        >
          {" On "}
        </Text>
        <Text
          className={`font-silkscreen text-white text-2xl mx-12 ${animClass}`}
        >
          the TV
        </Text>
      </span>
    </div>
  );
};
