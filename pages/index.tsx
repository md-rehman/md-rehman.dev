import { TvSetNavigator, NavigationRouteContext } from "@navigator";
import { channels } from "@constants";
import type { NextPage } from "next";
import { ColorWave } from "../components/compounds/canvas/ColorWave";
import { Glitch } from "../components/channels/glitch/Glitch";

const Home: NextPage = () => {
	return <TvSetNavigator config={channels} />;
	return <Glitch />;
};

export default Home;
