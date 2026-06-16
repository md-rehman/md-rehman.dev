import { useState, KeyboardEventHandler, RefObject } from "react";

const AUDIO_VOL = 0.1;

export const useTvKeyHandlers = (
  nextChannel: () => void,
  prevChannel: () => void,
  changeChannel: (channel: number) => void,
  setChannelMeta: React.Dispatch<React.SetStateAction<any>>,
  buttonAudioRef: RefObject<HTMLAudioElement | null>,
) => {
  const [channelNumber, setChannelNumber] = useState<number | null>(null);

  const keyDownHandler: KeyboardEventHandler<HTMLDivElement> = (e: any) => {
    if (buttonAudioRef?.current) {
      buttonAudioRef.current.volume = AUDIO_VOL;
      buttonAudioRef.current.play().catch(() => {
        // Suppress audio play errors if blocked
      });
    }

    switch (e.key) {
      case "ArrowRight":
        setTimeout(
          () => {
            nextChannel();
          },
          (buttonAudioRef?.current?.duration || 1) * 800,
        );
        break;
      case "ArrowLeft":
        setTimeout(
          () => {
            prevChannel();
          },
          (buttonAudioRef?.current?.duration || 1) * 800,
        );
        break;
      case "Control":
        setChannelMeta((prevState: any) => {
          return {
            ...prevState,
            infoOverlay: true,
            channelNumber: "setting",
          };
        });
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if (e.ctrlKey) {
          setChannelNumber((prevState) => {
            if (prevState === null) return parseInt(e.key);
            return parseInt(`${prevState}${e.key}`);
          });
        }
        break;
    }
  };

  const keyUpHandler: KeyboardEventHandler<HTMLDivElement> = (e: any) => {
    switch (e.key) {
      case "Control":
        if (channelNumber === null) {
          setChannelMeta((prevState: any) => ({
            ...prevState,
            channelNumber: "fixed",
            infoOverlay: false,
          }));
          break;
        }
        if (channelNumber >= 0 && channelNumber <= 999) {
          const targetChan = channelNumber;
          setChannelNumber(null);
          changeChannel(targetChan);
        }
        break;
    }
  };

  return {
    channelNumber,
    keyDownHandler,
    keyUpHandler,
  };
};
