import React, { useEffect, useState } from "react";
import { Text } from "@atoms";
import { WhiteBoard, TvSetNoise, TvStatic, RandomWalker } from "@canvas";
import { GlitchText, GlitchScreen, FloatingShapes } from "@molecules";
import styles from "./Glitch.module.scss";

const lpad = (value: number, padding: number) => {
	var zeroes = new Array(padding + 1).join("0");
	return (zeroes + value).slice(-padding);
};

export const Glitch: React.FC<any> = (props) => {
	const [channel, setChannel] = useState<number>(0);

	const nextChannel = () => {
		setChannel((prevState) => {
			if (prevState < 999) return ++prevState;
			return prevState;
		});
	};
	const prevChannel = () => {
		setChannel((prevState) => {
			if (prevState > 0) return --prevState;
			return prevState;
		});
	};

	const keyPressHandler = (e: any) => {
		switch (e.key) {
			case ".":
				nextChannel();
				break;
			case ",":
				prevChannel();
				break;
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", keyPressHandler, true);
		return () => {
			document.removeEventListener("keydown", keyPressHandler, true);
		};
	}, []);
	return <TvStatic />;
	return <RandomWalker />;
	// return <FloatingShapes />;
	// return <TvSetNoise />;
	// return <WhiteBoard />;
	// return <FlowFieldEffect />;
	return (
		<main
			className={`relative flex flex-1 h-screen w-screen items-center justify-center`}
		>
			<FloatingShapes />
			<div className="absolute">
				<div className="flex-col">
					<GlitchText _text={{ className: "text-3xl " }}>Hi, I am</GlitchText>
					<GlitchText _text={{ className: "text-3xl" }}>REHMAN</GlitchText>
				</div>
			</div>
			{/* NOTE: The below is glitch screen section. */}
			<GlitchScreen>
				<div className="text-lime-500 absolute top-10 left-10 font-arial">
					<GlitchText>No service</GlitchText>
				</div>
				<div className="text-lime-500  absolute top-10 right-10 font-arial">
					<GlitchText>{lpad(channel, 3)}</GlitchText>
				</div>
				<div className="text-lime-500 text-2xl absolute bottom-20 font-arial">
					<GlitchText>Under construction</GlitchText>
				</div>
			</GlitchScreen>
		</main>
	);
};
