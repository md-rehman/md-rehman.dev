import React from "react";
import { DeathNoteLikeInstructions, Instructions } from "../channels/instructions";
import { GlitchIntroduction, InteractiveGlitchIntroduction } from "../channels/introduction";
import {
	RandomWalker,
	RandomWalker2,
	RandomWalker3,
	RandomWalker4,
	RandomWalker5,
	MotionBasic,
	BallShooter,
	Hyperdrive,
} from "@canvas";
import { channelsMetadata } from "./channelsMetadata";

export interface ChannelConfig {
	name?: string;
	title?: string;
	description?: string;
	keywords?: string[];
	contentHtml?: string;
	component: React.ComponentType<any>;
	props?: any;
}

export const channels: Record<number, ChannelConfig> = {
	0: {
		...channelsMetadata[0],
		component: DeathNoteLikeInstructions,
	},
	1: {
		...channelsMetadata[1],
		component: GlitchIntroduction,
	},
	2: {
		...channelsMetadata[2],
		component: BallShooter,
	},
	3: {
		...channelsMetadata[3],
		component: Hyperdrive,
	},
	4: {
		...channelsMetadata[4],
		component: RandomWalker4,
	},
	5: {
		...channelsMetadata[5],
		component: RandomWalker2,
	},
	6: {
		...channelsMetadata[6],
		component: RandomWalker5,
	},
	7: {
		...channelsMetadata[7],
		component: MotionBasic,
	},
	8: {
		...channelsMetadata[8],
		component: RandomWalker3,
	},
	9: {
		...channelsMetadata[9],
		component: RandomWalker,
	},
	10: {
		...channelsMetadata[10],
		component: InteractiveGlitchIntroduction,
	},
	999: {
		...channelsMetadata[999],
		component: Instructions,
	},
};
