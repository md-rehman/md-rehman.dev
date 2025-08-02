import { ComponentProps } from "react";
import type { PRAYER_STATUS } from "@/types/fundamental";

type IButton = ComponentProps<"button"> & {
  status: PRAYER_STATUS | string;
};
type IButtonExtension = ComponentProps<"button"> & {
  status: PRAYER_STATUS | string;
  extraButtonExtensionStyle: string[];
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
      extraButtonStyle.push(" border-rose-700");
      extraButtonStyle.push(
        " shadow-[inset_0px_0px_10px_0px_var(--color-rose-700)]",
      );
      extraButtonExtensionStyle.push(" border-rose-700");
      extraButtonExtensionStyle.push(
        " shadow-[inset_0px_0px_10px_0px_var(--color-rose-700)]",
      );
      break;
    case "done":
      state.type = "extended";
      extraButtonStyle.push(" border-emerald-500");
      extraButtonExtensionStyle.push(" border-emerald-500");
      break;
    case "home":
      state.type = "extended";
      extraButtonStyle.push(" border-emerald-500");
      extraButtonStyle.push(
        " shadow-[inset_0px_0px_10px_0px_var(--color-emerald-500)]",
      );
      extraButtonExtensionStyle.push(" border-emerald-500");
      extraButtonExtensionStyle.push(
        " shadow-[inset_0px_0px_10px_0px_var(--color-emerald-500)]",
      );
      break;
    case "masjid":
      state.type = "extended";
      extraButtonStyle.push(" border-emerald-500");
      extraButtonStyle.push(
        " shadow-[inset_0px_0px_20px_0px_var(--color-emerald-500)]",
      );
      extraButtonExtensionStyle.push(" border-emerald-500");
      extraButtonExtensionStyle.push(
        " shadow-[inset_0px_0px_20px_0px_var(--color-emerald-500)]",
      );
      break;
    default:
      break;
  }
  return (
    <div className="relative flex justify-center">
      <button
        className={`h-24 w-24 rounded-full border-2 ${extraButtonStyle.join("")}`}
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
    <div className="absolute top-24 flex flex-col justify-center">
      <button
        className={`mt-4 h-16 w-16 rounded-full border-2 ${status === "masjid" ? extraButtonExtensionStyle.join("") : ""}`}
        onClick={onClick}
      >
        Masjid
      </button>
      <button
        className={`mt-4 h-16 w-16 rounded-full border-2 ${status === "home" ? extraButtonExtensionStyle.join("") : ""}`}
        onClick={onClick}
      >
        Home
      </button>
      <button
        className={`mt-4 h-16 w-16 rounded-full border-2 ${status === "missed" ? extraButtonExtensionStyle.join("") : ""}`}
        onClick={onClick}
      >
        Missed
      </button>
    </div>
  );
};
