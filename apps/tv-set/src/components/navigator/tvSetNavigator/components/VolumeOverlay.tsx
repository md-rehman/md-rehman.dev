import React from "react";

interface VolumeOverlayProps {
  volume: number;
  isVisible: boolean;
}

const TOTAL_BLOCKS = 20;

export const VolumeOverlay: React.FC<VolumeOverlayProps> = ({
  volume,
  isVisible,
}) => {
  if (!isVisible) return null;

  // Calculate filled blocks (each block represents 5% volume)
  const filledBlocks = Math.round((volume / 100) * TOTAL_BLOCKS);

  return (
    <div className="fixed bottom-10 left-10 z-50 pointer-events-none select-none font-arial animate-fadeIn">
      {/* Title */}
      <div className="text-3xl font-bold tracking-wide text-lime-500 drop-shadow-[0_0_8px_rgba(132,204,22,0.6)] mb-2">
        Volume
      </div>

      {/* Bar and Dots Container */}
      <div className="flex items-center gap-1.5 h-7">
        {Array.from({ length: TOTAL_BLOCKS }).map((_, index) => {
          const isFilled = index < filledBlocks;
          return isFilled ? (
            <div
              key={index}
              className="w-2.5 h-7 bg-lime-500 rounded-[1px] shadow-[0_0_6px_#84cc16]"
            />
          ) : (
            <div
              key={index}
              className="w-2.5 h-7 flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-lime-500 rounded-full shadow-[0_0_4px_#84cc16]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
