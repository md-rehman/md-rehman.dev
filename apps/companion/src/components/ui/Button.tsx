import { ComponentProps } from "react";
import type { I_PRAYER_TIME, I_PRAYER_STATUS } from "@/types/fundamental";
import { AnimatePresence, motion, scale } from "motion/react";
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
  let extraButtonStyle = "";
  let extraButtonExtensionStyle = "";
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
      pressed: { scale: 0.98 },
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
      extraButtonStyle = "dark:bg-background-dark";
      break;
    case "missed":
      state.type = "extended";
      variants.missed.animate = variants.missed.final;
      extraButtonStyle =
        " border-rose-700 text-rose-700 dark:bg-background-950 shadow-[inset_0px_0px_10px_0px_var(--color-rose-700)]  dark:hover:border-emerald-500";

      extraButtonExtensionStyle =
        " border-rose-700 text-rose-700 shadow-[inset_0px_0px_10px_0px_var(--color-rose-700)] dark:hover:border-rose-700";
      break;
    case "done":
      state.type = "extended";
      extraButtonStyle =
        " border-emerald-500 text-emerald-500  dark:bg-background-950  dark:hover:border-emerald-500";
      extraButtonExtensionStyle =
        " border-emerald-500 text-emerald-500  dark:hover:border-emerald-500";
      break;
    case "home":
      state.type = "extended";
      variants.home.animate = variants.home.final;
      extraButtonStyle =
        " border-emerald-500 text-emerald-500 dark:bg-background-950 shadow-[inset_0px_0px_10px_0px_var(--color-emerald-500)] ";
      extraButtonExtensionStyle =
        " border-emerald-500 text-emerald-500 shadow-[inset_0px_0px_10px_0px_var(--color-emerald-500)]  dark:hover:border-emerald-500";
      break;
    case "masjid":
      state.type = "extended";
      variants.masjid.animate = variants.masjid.final;
      extraButtonStyle =
        " border-emerald-500 text-emerald-500 dark:bg-background-950 shadow-[inset_0px_0px_20px_0px_var(--color-emerald-500)]  dark:hover:border-emerald-500";
      extraButtonExtensionStyle =
        " border-emerald-500 text-emerald-500 shadow-[inset_0px_0px_20px_0px_var(--color-emerald-500)]  dark:hover:border-emerald-500";

      break;
    default:
      break;
  }

  const interactionStyle =
    "dark:hover:bg-background-900 active:dark:hover:bg-background-950";

  return (
    <motion.div
      className="relative mx-11 mb-20 inline-flex flex-wrap items-center justify-center"
      variants={variants.main}
      initial="initial"
      whileHover="final"
      animate="animate"
      whileTap="pressed"
    >
      <button
        className={`${interactionStyle} z-10 h-24 w-24 rounded-full border-2 dark:hover:border-emerald-500 ${extraButtonStyle}`}
        onClick={onClick}
      >
        {children}
      </button>
      {state.type === "extended" || true ? (
        <>
          <motion.button
            className={`${interactionStyle} absolute h-16 w-16 rounded-full border-2 dark:hover:border-emerald-500 ${status === "masjid" ? extraButtonExtensionStyle : ""}`}
            onClick={(e) => handlePrayerUpdate(e, time, "masjid")}
            variants={variants.masjid}
          >
            Masjid
          </motion.button>
          <motion.button
            className={`${interactionStyle} absolute h-16 w-16 rounded-full border-2 dark:hover:border-emerald-500 ${status === "home" ? extraButtonExtensionStyle : ""}`}
            onClick={(e) => handlePrayerUpdate(e, time, "home")}
            variants={variants.home}
          >
            Home
          </motion.button>
          <motion.button
            className={`${interactionStyle} absolute h-16 w-16 rounded-full border-2 dark:hover:border-rose-700 ${status === "missed" ? extraButtonExtensionStyle : ""}`}
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
