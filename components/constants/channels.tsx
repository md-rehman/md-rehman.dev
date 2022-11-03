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
	RandomWalker3,
	RandomWalker4,
	RandomWalker5,
	MotionBasic,
	BallShooter,
	StringShooter,
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
	// 2: {
	// 	name: "Test Channel",
	// 	component: TestPageTwo,
	// 	props: { another: "efcksdkf;sdf;ds" },
	// },
	2: {
		name: "Random Walker 3",
		component: RandomWalker3,
	},
	3: {
		name: "Random Walker",
		component: RandomWalker,
	},
	4: {
		name: "Random Walker 4",
		component: RandomWalker4,
	},
	// 4: {
	// 	name: "Black Board",
	// 	component: WhiteBoard,
	// },
	5: {
		name: "Random Walker 2",
		component: RandomWalker2,
	},
	6: {
		name: "Random Walker 5",
		component: RandomWalker5,
	},

	7: {
		name: "Motion 101",
		component: MotionBasic,
	},

	8: {
		name: "Ball Shooter",
		component: BallShooter,
	},
	// 8: {
	// 	name: "String Shooter",
	// 	component: StringShooter,
	// },

	// GITHUB as iframe is not possible
	// 6: {
	// 	component: GithubProfile,
	// },
};
