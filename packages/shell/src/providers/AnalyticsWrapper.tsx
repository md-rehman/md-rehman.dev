import { Analytics } from "@vercel/analytics/react";

type Props = {
  children?: React.ReactNode;
};

export const AnalyticsWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
};
