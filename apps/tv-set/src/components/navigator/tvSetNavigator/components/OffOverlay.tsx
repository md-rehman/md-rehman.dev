import React, { useState, useRef } from "react";
import { TvStatic } from "@canvas";
import { Text } from "@atoms";
import styles from "../TvSetNavigator.module.scss";

interface OffOverlayProps {
  config: any;
  setChannelMeta: React.Dispatch<React.SetStateAction<any>>;
  probablyTouchScreen?: boolean;
}

export const OffOverlay: React.FC<OffOverlayProps> = ({
  config,
  setChannelMeta,
}) => {
  const [offAnimation, setOffAnimation] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);

  const handleTurnOn = () => {
    // Play remote turn-on sound
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch((err) => {
        console.log("Audio 1 playback failed:", err);
      });

      const playNext = () => {
        if (audioRef2.current) {
          audioRef2.current.volume = 0.2;
          audioRef2.current.play().catch((err) => {
            console.log("Audio 3 playback failed:", err);
          });
        }
        audioRef.current?.removeEventListener("ended", playNext);
      };

      audioRef.current.addEventListener("ended", playNext);
    }

    setOffAnimation(true);
    setTimeout(() => {
      setChannelMeta((prevState: any) => {
        // Transition to actual channel scene after noise transition duration (600ms)
        setTimeout(() => {
          setChannelMeta((prevState: any) => {
            return {
              ...prevState,
              overlay: config[prevState.activeChannel] ? "none" : "blueScreen",
              infoOverlay: true,
            };
          });
        }, 600); // OVERLAY_DURATION

        // Fade out the info display after 2600ms
        setTimeout(() => {
          setChannelMeta((prevState: any) => {
            return {
              ...prevState,
              infoOverlay: false,
            };
          });
        }, 2600); // INFO_OVERLAY_DURATION

        return {
          ...prevState,
          overlay: "noise",
          infoOverlay: true,
        };
      });
    }, 1250);
  };

  // return <TvStatic />
  return (
    <div
      className="off-overlay fixed h-screen w-screen top-0 bg-black flex flex-1 items-center justify-center text-center z-50 cursor-pointer"
      onClick={handleTurnOn}
    >
      <audio ref={audioRef} src="/audios/remote_button_2.mp3" />
      {/* TODO: Add turn_on audio effect */}
      {/* <audio ref={audioRef2} src="/audios/turn_on.mp3" /> */}
      <span className={`flex flex-row ${offAnimation ? styles.offText : ""}`}>
        <Text
          className={`font-silkscreen text-white text-2xl mx-12 ${
            offAnimation ? styles.offText : ""
          }`}
        >
          Press to Turn
        </Text>
        <Text
          className={`font-silkscreen text-2xl inline  ${
            offAnimation ? `text-white ${styles.offText}` : "text-lime-500"
          }`}
        >
          {" On "}
        </Text>
        <Text
          className={`font-silkscreen text-white text-2xl mx-12 ${
            offAnimation ? styles.offText : ""
          }`}
        >
          the TV
        </Text>
      </span>
    </div>
  );
};
