"use client";

import * as React from "react";

export interface NavigationRouteContextType {
  channels: any;
  currentChannel: number;
  changeChannel: (channel: number) => void;
  nextChannel: () => void;
  prevChannel: () => void;
  overlay?: string;
  togglePower?: () => void;
  showInfoOverlay?: () => void;
  appendDigit?: (digit: number) => void;
  commitChannelInput?: () => boolean;
  cancelDigitInput?: () => void;
  pendingChannelNumber?: number | null;
}

/**
 * Context which holds the route prop for a screen.
 */
export const NavigationRouteContext = React.createContext<
  NavigationRouteContextType | undefined
>(undefined);

export const useTvNavigator = () => {
  const context = React.useContext(NavigationRouteContext);
  if (!context) {
    throw new Error(
      "useTvNavigator must be used within a NavigationRouteContext.Provider",
    );
  }
  return context;
};
