import React from "react";
import { Text } from "@atoms";
import { FloatingShapes, GlitchText } from "@molecules";
import { useMediaQuery } from "@react-hook/media-query";

export const Instructions: React.FC = () => {
	// Maybe use it remove certains rules, if the number of rules becomes large.
	const probablyTouchScreen = useMediaQuery(
		"only screen and (pointer: coarse)",
	);
	const rules: Array<string> = [
		"Use left and right arrow to change channels.",
		"Swipe left and right on touch screen to change channel.",
		"Touch on bottom right botton to disable global touches (default enabled) to itetact with the page.",
		'Use "Ctrl + <number>" for quick jumping to that channel.',
	];
	const rulesTemplate = () => {
		return rules.map((rule, i) => (
			<li key={i} className="flex items-center">
				<Text className="font-death_note_2 text-2xl pr-2 pb-1 self-start">
					O
				</Text>
				<Text className="font-thin">{rule}</Text>
			</li>
		));
	};
	return (
		<div className="bg-gradient-to-b from-gray-700 to-gray-900 text-white h-screen">
			<div className="flex flex-1 flex-col text-center h-full p-10">
				<GlitchText className="font-silkscreen text-6xl pb-4">
					TV SET
				</GlitchText>
				{/* <Text className="font-death_note_2 text-6xl">DEATH NOTE</Text> */}
				<Text className="text-md pb-4">
					Welcome to my TV SET, a place to see all my experiments. Each channel
					have something exiting to show.{" "}
				</Text>
				<Text className="text-2xl pb-4">Enjoy the shows</Text>
				<Text className="font-death_note_2 text-5xl pb-4 ">How to use it</Text>
				<ol start={1} className="text-left font-thin">
					{rulesTemplate()}
				</ol>
			</div>
		</div>
	);
};
