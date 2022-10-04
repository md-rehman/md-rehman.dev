import React, { useEffect, useState } from "react";
import { Text } from "@atoms";
import { FloatingShapes, GlitchText } from "@molecules";
import p5 from "p5";

export const GlitchIntroduction: React.FC<{}> = () => {
	const [floatingText, setFloatingText] = useState("");
	useEffect(() => {
		randomTextSetter();
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
		const randomPosition = {};
		randomPosition.top =
			window.innerHeight * 0.1 + window.innerHeight * (Math.random() * 0.8);

		if (
			randomPosition.top > window.innerHeight / 2 - 50 &&
			randomPosition.top < window.innerHeight / 2 + 50
		) {
			// to avoid placing over the center title
			randomPosition.top = randomPosition.top + 150;
		}
		// switch (Math.floor(Math.random() * 4)) {
		// 	case 0:
		// 		randomPosition.top = window.innerHeight * Math.random();
		// 		randomPosition.left = window.innerWidth * Math.random();
		// 		break;
		// 	case 1:
		// 		randomPosition.top = window.innerHeight * Math.random();
		// 		randomPosition.right = window.innerWidth * Math.random();
		// 		break;
		// 	case 2:
		// 		randomPosition.bottom = window.innerHeight * Math.random();
		// 		randomPosition.left = window.innerWidth * Math.random();
		// 		break;
		// 	case 3:
		// 		randomPosition.bottom = window.innerHeight * Math.random();
		// 		randomPosition.right = window.innerWidth * Math.random();
		// 		break;
		// 	default:
		// 		randomPosition.top = window.innerHeight * Math.random();
		// 		randomPosition.left = window.innerWidth * Math.random();
		// 		break;
		// }
		setTimeout(() => {
			randomTextSetter();
		}, 2000 + Math.random() * 2000);

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
				<Text className="text-2xl">Hi, I'm Rehman</Text>
				{/* {randomTextSetter()} */}
				{floatingText}
			</div>
		</FloatingShapes>
	);
};
