import React, { CSSProperties, useEffect, useState } from "react";
import { Text } from "@atoms";
import { FloatingShapes, GlitchText } from "@molecules";
import p5 from "p5";

interface ICSSPosition {
	top?: number;
	bottom?: number;
	right?: number;
	left?: number;
}

export const GlitchIntroduction: React.FC = () => {
	const [floatingText, setFloatingText] = useState<any | null>(null);
	useEffect(() => {
		randomTextSetter();
		const timerId = setInterval(() => {
			randomTextSetter();
		}, 3000);
		return () => {
			clearInterval(timerId);
		};
	}, []);

	const TextArray = [
		"I'm a Web Developer 🕷",
		"I'm a React Developer",
		"I'm a JavaScript Developer",
		"I'm a ReactNative Developer",
		// "This is called TvSet",
		"I'm building plugin to make documentation",
		"I love to travel",
		"I love Cats 🦁",
		"I love Anime",
	];
	const randomTextSetter = () => {
		let randomPosition: ICSSPosition = {};
		randomPosition.top =
			window.innerHeight * 0.1 + window.innerHeight * (Math.random() * 0.8);

		// NOTE: To avoid placing over the center title
		if (
			randomPosition.top > window.innerHeight / 2 - 50 &&
			randomPosition.top < window.innerHeight / 2 + 50
		) {
			randomPosition.top = randomPosition.top + 150;
		}
		// setTimeout(() => {
		// 	randomTextSetter();
		// }, 2000 + Math.random() * 2000);

		setFloatingText(
			<GlitchText
				className="absolute w-4/5 text-lg"
				style={{
					...randomPosition,
					marginLeft: window.innerWidth * Math.random(),
				}}
			>
				{TextArray[Math.floor(Math.random() * TextArray.length)]}
			</GlitchText>,
		);
	};
	return (
		<FloatingShapes>
			<div className="flex flex-1 flex-col items-center justify-center h-full overflow-hidden">
				<Text className="font-silkscreen text-4xl">Hi, I&apos;m Rehman</Text>
				{/* {randomTextSetter()} */}
				{floatingText}
			</div>
		</FloatingShapes>
	);
};
