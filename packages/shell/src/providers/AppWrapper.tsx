import { AnalyticsWrapper } from "./AnalyticsWrapper";

type Props = {
  children?: React.ReactNode;
};

export const AppWrapper = ({ children }: Props) => {
  return <AnalyticsWrapper>{children}</AnalyticsWrapper>;
};
