import { Analytics } from "@vercel/analytics/react";

type Props = {
  children?: React.ReactNode;
};

export const AnalyticsWrapper = ({ children }: Props) => {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
};
