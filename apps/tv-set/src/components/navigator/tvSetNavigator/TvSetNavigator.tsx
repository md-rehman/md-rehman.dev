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

// Components
import { TouchToggle } from "./components/TouchToggle";
import { OffOverlay } from "./components/OffOverlay";
import { InfoOverlay } from "./components/InfoOverlay";

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

  // 3. Remote/Key Interceptors Hook
  const { channelNumber, keyDownHandler, keyUpHandler } = useTvKeyHandlers(
    nextChannel,
    prevChannel,
    changeChannel,
    setChannelMeta,
    buttonAudioRef,
  );

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
            <TvStatic volume={AUDIO_VOL} />
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
