import type { ComponentProps } from "react";

type IBulgeButton = ComponentProps<"button">;

export const BulgeButton: React.FC<IBulgeButton> = ({ children }) => {
  return <button>{children}</button>;
};
