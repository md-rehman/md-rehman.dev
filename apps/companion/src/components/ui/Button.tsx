import { ComponentProps } from "react";
import type { I_PRAYER_STATUS } from "@/types/fundamental";
import { AnimatePresence, motion } from "motion/react";

type IButton = ComponentProps<"button"> & {
  status: I_PRAYER_STATUS | string;
};
type IButtonExtension = ComponentProps<"button"> & {
  status: I_PRAYER_STATUS | string;
  extraButtonExtensionStyle: string[];
};

const variants = {
  main: {
    initial: {},
    hover: {},
  },
  masjid: {
    initial: { top: 16, left: 16 },
    hover: { top: -24, left: -40 },
  },
  home: {
    initial: { top: 16, right: 16 },
    hover: { top: -24, right: -40 },
  },
  missed: {
    initial: { bottom: 16 },
    hover: { bottom: -52 },
  },
};

export const Button: React.FC<IButton> = ({ children, status, onClick }) => {
  const extraButtonStyle: string[] = [];
  const extraButtonExtensionStyle: string[] = [];
  const state = {
    type: "default",
    level: 1,
  };
  switch (status) {
    case "untracked":
      break;
    case "missed":
      state.type = "extended";
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
    <div className="relative flex items-center justify-center">
      <button
        className={`z-10 h-24 w-24 rounded-full border-2 bg-gray-950 ${extraButtonStyle.join("")}`}
        onClick={onClick}
      >
        {children}
      </button>
      {state.type === "extended" ? (
        <ButtonExtention
          extraButtonExtensionStyle={extraButtonExtensionStyle}
          status={status}
        />
      ) : null}
    </div>
  );
};

const ButtonExtention: React.FC<IButtonExtension> = ({
  extraButtonExtensionStyle,
  onClick,
  status,
}) => {
  return (
    <motion.div
      className="absolute flex h-full w-full flex-col items-center justify-center"
      variants={variants.main}
      initial="initial"
      whileHover="hover"
    >
      <motion.button
        className={`absolute h-16 w-16 rounded-full border-2 ${status === "masjid" ? extraButtonExtensionStyle.join("") : ""}`}
        onClick={onClick}
        variants={variants.masjid}
      >
        Masjid
      </motion.button>
      <motion.button
        className={`absolute h-16 w-16 rounded-full border-2 ${status === "home" ? extraButtonExtensionStyle.join("") : ""}`}
        onClick={onClick}
        variants={variants.home}
      >
        Home
      </motion.button>
      <motion.button
        className={`absolute h-16 w-16 rounded-full border-2 ${status === "missed" ? extraButtonExtensionStyle.join("") : ""}`}
        onClick={onClick}
        variants={variants.missed}
      >
        Missed
      </motion.button>
    </motion.div>
  );
};
