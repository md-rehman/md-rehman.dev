import { ComponentProps } from "react";

export const Button: React.FC<ComponentProps<"button">> = ({
  children,
  onClick,
}) => {
  return (
    <button className="h-24 w-24 rounded-full border-2" onClick={onClick}>
      {children}
    </button>
  );
};
