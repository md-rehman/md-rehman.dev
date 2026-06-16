import React from "react";
import { Text } from "@atoms";

interface InfoOverlayProps {
  config: any;
  activeChannel: number;
  channelNumberMode: "setting" | "fixed";
  channelNumber: number | null;
}

const lpad = (value: number, padding: number, symbol = "0") => {
  const symbols = new Array(padding + 1).join(symbol);
  return (symbols + value).slice(-padding);
};

export const InfoOverlay: React.FC<InfoOverlayProps> = ({
  config,
  activeChannel,
  channelNumberMode,
  channelNumber,
}) => {
  const channelNumberTemplate = () => {
    if (channelNumberMode === "setting") {
      if (channelNumber !== null) {
        return (
          <span className="animate-blink">{lpad(channelNumber, 3, "-")}</span>
        );
      }
      return <span className="animate-blink">---</span>;
    }
    return lpad(activeChannel, 3);
  };

  return (
    <div className="flex flex-1 items-center justify-center text-lime-500">
      <div className={`absolute top-10 left-10 font-arial`}>
        <Text>{config[activeChannel]?.name ?? "No service"}</Text>
      </div>
      <div className="absolute top-10 right-10 font-arial tracking-widest">
        <Text>{channelNumberTemplate()}</Text>
      </div>
    </div>
  );
};
