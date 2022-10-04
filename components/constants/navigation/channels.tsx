import {
	Instructions,
	GlitchIntroduction,
	TestPageOne,
	TestPageTwo,
} from "@channels";
import { WhiteBoard, TvSetNoise, TvStatic, RandomWalker } from "@canvas";

export const channels = {
	0: {
		channelNumber: "000",
		component: Instructions,
	},
	1: {
		channelNumber: "001",
		component: GlitchIntroduction,
	},
	2: {
		channelNumber: "002",
		component: TestPageTwo,
		props: { another: "efcksdkf;sdf;ds" },
	},
	3: {
		channelNumber: "003",
		component: RandomWalker,
	},
	4: {
		channelNumber: "004",
		component: WhiteBoard,
	},
};
