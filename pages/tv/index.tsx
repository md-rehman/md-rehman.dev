import { TvSetNavigatorX, NavigationRouteContext } from "@navigator";
import { channels } from "@constants";
import type { NextPage } from "next";

const TV: NextPage = () => {
  return <TvSetNavigatorX config={channels} />;
};

export default TV;
