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
		setInterval(() => {
			randomTextSetter();
		}, 3000);
	}, []);
	// if (typeof window === "undefined") return null;
	const TextArray = [
		"A Web Developer",
		"A React Developer",
		"A JavaScript Developer",
		"A ReactNative Developer",
		"Anime are awesome",
		"Shinigami loves apple",
	];
	const randomTextSetter = () => {
		let randomPosition: ICSSPosition = {};
		randomPosition.top =
			window.innerHeight * 0.1 + window.innerHeight * (Math.random() * 0.8);

		if (
			randomPosition.top > window.innerHeight / 2 - 50 &&
			randomPosition.top < window.innerHeight / 2 + 50
		) {
			// to avoid placing over the center title
			randomPosition.top = randomPosition.top + 150;
		}
		// setTimeout(() => {
		// 	randomTextSetter();
		// }, 2000 + Math.random() * 2000);

		setFloatingText(
			<GlitchText
				style={{
					position: "absolute",
					width: "80%",
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
			<div className="flex flex-1 flex-col items-center justify-center h-full relative overflow-hidden">
				<Text className="text-2xl">Hi, I&apos;m Rehman</Text>
				{/* {randomTextSetter()} */}
				{floatingText}
			</div>
		</FloatingShapes>
	);
};
