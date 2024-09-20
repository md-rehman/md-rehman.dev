import { AnalyticsWrapper } from "./AnalyticsWrapper";

type Props = {
  children?: React.ReactNode;
};

export const AppWrapper: React.FC<Props> = ({ children }) => {
  return <AnalyticsWrapper>{children}</AnalyticsWrapper>;
};
