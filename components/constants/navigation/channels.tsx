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
		component: Instructions,
	},
	1: {
		component: GlitchIntroduction,
	},
	2: {
		component: TestPageTwo,
		props: { another: "efcksdkf;sdf;ds" },
	},
	3: {
		component: RandomWalker,
	},
	4: {
		component: WhiteBoard,
	},
	5: {
		component: RandomWalker2,
	},

	// GITHUB as iframe is not possible
	// 6: {
	// 	component: GithubProfile,
	// },
};
