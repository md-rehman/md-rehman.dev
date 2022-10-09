import {
	Instructions,
	GlitchIntroduction,
	TestPageOne,
	TestPageTwo,
	GithubProfile,
} from "@channels";
import {
	WhiteBoard,
	TvSetNoise,
	TvStatic,
	RandomWalker,
	RandomWalker2,
} from "@canvas";

export const channels = {
	0: {
		name: "",
		component: Instructions,
	},
	1: {
		name: "",
		component: GlitchIntroduction,
	},
	2: {
		name: "Test Channel",
		component: TestPageTwo,
		props: { another: "efcksdkf;sdf;ds" },
	},
	3: {
		name: "Random Walker",
		component: RandomWalker,
	},
	4: {
		name: "Black Board",
		component: WhiteBoard,
	},
	5: {
		name: "Random Walker 2",
		component: RandomWalker2,
	},

	// GITHUB as iframe is not possible
	// 6: {
	// 	component: GithubProfile,
	// },
};
