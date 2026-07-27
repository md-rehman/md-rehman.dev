import { useState, useRef, KeyboardEventHandler, RefObject, useCallback } from "react";

const AUDIO_VOL = 0.1;
export const CHANNEL_INPUT_TIMEOUT = 3000; // 3 seconds timeout to commit channel

export const useTvKeyHandlers = (
  nextChannel: () => void,
  prevChannel: () => void,
  changeChannel: (channel: number) => void,
  setChannelMeta: React.Dispatch<React.SetStateAction<any>>,
  buttonAudioRef: RefObject<HTMLAudioElement | null>,
  increaseVolume?: () => void,
  decreaseVolume?: () => void,
) => {
  const [channelNumber, setChannelNumber] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelNumberRef = useRef<number | null>(null);

  // Synchronize ref with state for timer closure access
  channelNumberRef.current = channelNumber;

  const clearCommitTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const commitChannelInput = useCallback(() => {
    clearCommitTimer();
    const targetChan = channelNumberRef.current;
    if (targetChan !== null && targetChan >= 0 && targetChan <= 999) {
      setChannelNumber(null);
      channelNumberRef.current = null;
      changeChannel(targetChan);
      return true; // Indicates pending input was committed
    }
    setChannelNumber(null);
    channelNumberRef.current = null;
    return false;
  }, [changeChannel, clearCommitTimer]);

  const cancelDigitInput = useCallback(() => {
    clearCommitTimer();
    setChannelNumber(null);
    channelNumberRef.current = null;
  }, [clearCommitTimer]);

  const appendDigit = useCallback(
    (digit: number) => {
      clearCommitTimer();

      // Show info overlay in "setting" mode
      setChannelMeta((prevState: any) => ({
        ...prevState,
        infoOverlay: true,
        channelNumber: "setting",
      }));

      let newChan: number;
      if (channelNumberRef.current === null) {
        newChan = digit;
      } else {
        newChan = parseInt(`${channelNumberRef.current}${digit}`, 10);
      }

      // Cap to max 999
      if (newChan > 999) {
        newChan = parseInt(`${digit}`, 10);
      }

      setChannelNumber(newChan);
      channelNumberRef.current = newChan;

      // Start 3-second auto-commit timer
      timerRef.current = setTimeout(() => {
        commitChannelInput();
      }, CHANNEL_INPUT_TIMEOUT);
    },
    [clearCommitTimer, commitChannelInput, setChannelMeta],
  );

  const keyDownHandler: KeyboardEventHandler<HTMLDivElement> = (e: any) => {
    if (buttonAudioRef?.current) {
      buttonAudioRef.current.volume = AUDIO_VOL;
      buttonAudioRef.current.play().catch(() => {
        // Suppress audio play errors if blocked
      });
    }

    switch (e.key) {
      case "ArrowUp":
        cancelDigitInput();
        if (increaseVolume) increaseVolume();
        break;
      case "ArrowDown":
        cancelDigitInput();
        if (decreaseVolume) decreaseVolume();
        break;
      case "ArrowRight":
        cancelDigitInput();
        setTimeout(
          () => {
            nextChannel();
          },
          (buttonAudioRef?.current?.duration || 1) * 800,
        );
        break;
      case "ArrowLeft":
        cancelDigitInput();
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
        appendDigit(parseInt(e.key, 10));
        break;
      case "Enter":
        commitChannelInput();
        break;
    }
  };

  const keyUpHandler: KeyboardEventHandler<HTMLDivElement> = (e: any) => {
    switch (e.key) {
      case "Control":
        if (channelNumberRef.current === null) {
          setChannelMeta((prevState: any) => ({
            ...prevState,
            channelNumber: "fixed",
            infoOverlay: false,
          }));
          break;
        }
        commitChannelInput();
        break;
    }
  };

  return {
    channelNumber,
    appendDigit,
    commitChannelInput,
    cancelDigitInput,
    keyDownHandler,
    keyUpHandler,
  };
};
