import { ComponentProps } from "react";
import type { I_PRAYER_TIME, I_PRAYER_STATUS } from "@/types/fundamental";
import { AnimatePresence, motion } from "motion/react";
import { animate } from "motion";

type IPrayerButton = ComponentProps<"button"> & {
  status: I_PRAYER_STATUS | string;
  time: I_PRAYER_TIME;
  handlePrayerUpdate: (
    e: React.MouseEvent,
    prayerTime: I_PRAYER_TIME,
    prayerStatus: I_PRAYER_STATUS,
  ) => void;
};
type IButtonExtension = ComponentProps<"button"> & {
  status: I_PRAYER_STATUS | string;
  extraButtonExtensionStyle: string[];
};

export const PrayerButton: React.FC<IPrayerButton> = ({
  children,
  time,
  status,
  onClick,
  handlePrayerUpdate,
}) => {
  const extraButtonStyle: string[] = [];
  const extraButtonExtensionStyle: string[] = [];
  const state = {
    type: "default",
    level: 1,
    initMainState: "initial",
  };
  const variants = {
    main: {
      initial: {},
      final: {},
      animate: {},
    },
    masjid: {
      initial: { top: 16, left: 16 },
      final: { top: -24, left: -40 },
      animate: { top: 16, left: 16 },
    },
    home: {
      initial: { top: 16, right: 16 },
      final: { top: -24, right: -40 },
      animate: { top: 16, right: 16 },
    },
    missed: {
      initial: { bottom: 16 },
      final: { bottom: -52 },
      animate: { bottom: 16 },
    },
  };

  switch (status) {
    case "untracked":
      break;
    case "missed":
      state.type = "extended";
      variants.missed.animate = variants.missed.final;
      extraButtonStyle.push(" border-rose-700 text-rose-700");
      extraButtonStyle.push(
        " shadow-[inset_0px_0px_10px_0px_var(--color-rose-700)]",
      );
      extraButtonExtensionStyle.push(" border-rose-700 text-rose-700");
      extraButtonExtensionStyle.push(
        " shadow-[inset_0px_0px_10px_0px_var(--color-rose-700)]",
      );
      break;
    case "done":
      state.type = "extended";
      extraButtonStyle.push(" border-emerald-500 text-emerald-500");
      extraButtonExtensionStyle.push(" border-emerald-500 text-emerald-500");
      break;
    case "home":
      state.type = "extended";
      variants.home.animate = variants.home.final;
      extraButtonStyle.push(" border-emerald-500 text-emerald-500");
      extraButtonStyle.push(
        " shadow-[inset_0px_0px_10px_0px_var(--color-emerald-500)]",
      );
      extraButtonExtensionStyle.push(" border-emerald-500 text-emerald-500");
      extraButtonExtensionStyle.push(
        " shadow-[inset_0px_0px_10px_0px_var(--color-emerald-500)]",
      );
      break;
    case "masjid":
      state.type = "extended";
      variants.masjid.animate = variants.masjid.final;
      extraButtonStyle.push(" border-emerald-500 text-emerald-500");
      extraButtonStyle.push(
        " shadow-[inset_0px_0px_20px_0px_var(--color-emerald-500)]",
      );
      extraButtonExtensionStyle.push(" border-emerald-500 text-emerald-500");
      extraButtonExtensionStyle.push(
        " shadow-[inset_0px_0px_20px_0px_var(--color-emerald-500)]",
      );
      break;
    default:
      break;
  }

  return (
    <motion.div
      className="relative mx-11 mb-20 inline-flex flex-wrap items-center justify-center"
      variants={variants.main}
      initial="initial"
      whileHover="final"
      animate="animate"
    >
      <button
        className={`z-10 h-24 w-24 rounded-full border-2 bg-gray-950 ${extraButtonStyle.join("")}`}
        onClick={onClick}
      >
        {children}
      </button>
      {state.type === "extended" || true ? (
        <>
          <motion.button
            className={`absolute h-16 w-16 rounded-full border-2 ${status === "masjid" ? extraButtonExtensionStyle.join("") : ""}`}
            onClick={(e) => handlePrayerUpdate(e, time, "masjid")}
            variants={variants.masjid}
          >
            Masjid
          </motion.button>
          <motion.button
            className={`absolute h-16 w-16 rounded-full border-2 ${status === "home" ? extraButtonExtensionStyle.join("") : ""}`}
            onClick={(e) => handlePrayerUpdate(e, time, "home")}
            variants={variants.home}
          >
            Home
          </motion.button>
          <motion.button
            className={`absolute h-16 w-16 rounded-full border-2 ${status === "missed" ? extraButtonExtensionStyle.join("") : ""}`}
            onClick={(e) => handlePrayerUpdate(e, time, "missed")}
            variants={variants.missed}
          >
            Missed
          </motion.button>
        </>
      ) : null}
    </motion.div>
  );
};
