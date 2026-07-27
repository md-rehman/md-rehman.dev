"use client";

import React, { useEffect, useState, useRef } from "react";
import { TvStatic } from "@canvas";
import { NavigationRouteContext } from "../context";
import { useMediaQuery } from "@react-hook/media-query";
import { channels } from "@constants";

// Hooks
import { useTvChannelManager } from "./hooks/useTvChannelManager";
import { useTvSwipeHandlers } from "./hooks/useTvSwipeHandlers";
import { useTvKeyHandlers } from "./hooks/useTvKeyHandlers";
import { useTvVolumeManager } from "./hooks/useTvVolumeManager";

// Components
import { TouchToggle } from "./components/TouchToggle";
import { OffOverlay } from "./components/OffOverlay";
import { InfoOverlay } from "./components/InfoOverlay";
import { VolumeOverlay } from "./components/VolumeOverlay";
import { TvRemoteControl } from "./components/TvRemoteControl";

const AUDIO_VOL = 0.1;
const START_CHANNEL = 0;

export const TvSetNavigator: React.FC<any> = ({
  children,
  noiseDuration = 20000,
  config = channels,
  initialChannel = START_CHANNEL,
  ...props
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const buttonAudioRef = useRef<HTMLAudioElement>(null);
  const [globalTouchDetection, setGlobalTouchDetection] =
    useState<boolean>(true);

  const probablyTouchScreen = useMediaQuery(
    "only screen and (pointer: coarse)",
  );

  // 1. Channel State Manager
  const {
    channelMeta,
    setChannelMeta,
    changeChannel,
    nextChannel,
    prevChannel,
  } = useTvChannelManager(config, initialChannel);

  // 2. Touch/Swipe Gestures Hook
  const { blur, touchStartHandler, touchMoveHandler, touchEndHandler } =
    useTvSwipeHandlers(nextChannel, prevChannel, globalTouchDetection);

  // 3. Volume State Manager
  const { volume, isVolumeOverlayVisible, increaseVolume, decreaseVolume } =
    useTvVolumeManager();

  // 4. Remote/Key Interceptors Hook
  const {
    channelNumber,
    appendDigit,
    commitChannelInput,
    cancelDigitInput,
    keyDownHandler,
    keyUpHandler,
  } = useTvKeyHandlers(
    nextChannel,
    prevChannel,
    changeChannel,
    setChannelMeta,
    buttonAudioRef,
    increaseVolume,
    decreaseVolume,
  );

  const turnOnRef = useRef<(() => void) | null>(null);

  const handleRegisterTurnOn = React.useCallback((fn: () => void) => {
    turnOnRef.current = fn;
  }, []);

  const togglePower = () => {
    if (channelMeta.overlay === "off") {
      if (turnOnRef.current) {
        turnOnRef.current();
      } else {
        setChannelMeta((prevState: any) => ({
          ...prevState,
          overlay: "noise",
          infoOverlay: true,
        }));
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
      }
    } else {
      turnOnRef.current = null;
      setChannelMeta((prevState: any) => ({
        ...prevState,
        overlay: "off",
        infoOverlay: false,
        isTurningOff: true,
      }));
    }
  };

  const showInfoOverlay = () => {
    setChannelMeta((prevState: any) => ({
      ...prevState,
      infoOverlay: true,
    }));
    setTimeout(() => {
      setChannelMeta((prevState: any) => ({
        ...prevState,
        infoOverlay: false,
      }));
    }, 2600);
  };

  // Focus the main element on mount
  useEffect(() => {
    mainRef?.current?.focus();
  }, []);

  const CurrentScene = config[channelMeta.activeChannel]?.component;

  return (
    <NavigationRouteContext.Provider
      value={{
        channels: config,
        currentChannel: channelMeta.activeChannel,
        changeChannel,
        nextChannel,
        prevChannel,
        overlay: channelMeta.overlay,
        togglePower,
        showInfoOverlay,
        appendDigit,
        commitChannelInput,
        cancelDigitInput,
        pendingChannelNumber: channelNumber,
        volume,
        increaseVolume,
        decreaseVolume,
        isVolumeOverlayVisible,
      }}
    >
      <main
        ref={mainRef}
        className="navigation-wrapper outline-none bg-gray-900"
        onTouchStart={touchStartHandler}
        onTouchMove={touchMoveHandler}
        onTouchEnd={touchEndHandler}
        onKeyDown={keyDownHandler}
        onKeyUp={keyUpHandler}
        tabIndex={-1}
      >
        {CurrentScene && (
          <div
            className="animation-wrapper"
            style={{
              filter: `blur(${blur}px)`,
              transform: `translateX(${blur}px)`,
            }}
          >
            <CurrentScene
              testProps={"test props"}
              {...config[channelMeta.activeChannel].props}
            />
          </div>
        )}
        <audio ref={buttonAudioRef} src="/tv-set/audios/remote_button_2.mp3" />
        {channelMeta.overlay === "noise" && (
          <div
            style={{ backgroundColor: "white", position: "fixed", inset: 0 }}
          >
            <TvStatic volume={AUDIO_VOL * (volume / 100)} />
          </div>
        )}
        {channelMeta.overlay === "blueScreen" && (
          <div
            className={`bg-blue-600 flex flex-1 h-screen w-screen items-center justify-center`}
          ></div>
        )}
        {channelMeta.overlay === "off" && (
          <OffOverlay
            config={config}
            probablyTouchScreen={probablyTouchScreen}
            setChannelMeta={setChannelMeta}
            onRegisterTurnOn={handleRegisterTurnOn}
            isTurningOff={channelMeta.isTurningOff}
          />
        )}
        {channelMeta.infoOverlay && (
          <InfoOverlay
            config={config}
            activeChannel={channelMeta.activeChannel}
            channelNumberMode={channelMeta.channelNumber}
            channelNumber={channelNumber}
          />
        )}
        <VolumeOverlay volume={volume} isVisible={isVolumeOverlayVisible} />
        <TvRemoteControl />
        {probablyTouchScreen ? (
          <TouchToggle
            globalTouchDetection={globalTouchDetection}
            setGlobalTouchDetection={setGlobalTouchDetection}
          />
        ) : null}
      </main>
    </NavigationRouteContext.Provider>
  );
};
