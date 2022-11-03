import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { P5Sketch } from "@atoms";

interface ComponentProps {
	//Your component props
	volume?: number;
}

export const TvStatic: React.FC<ComponentProps> = ({
	volume = 0.01,
}: ComponentProps) => {
	const noiseAudioRef = useRef<HTMLAudioElement>();

	useEffect(() => {
		if (noiseAudioRef?.current) noiseAudioRef.current.volume = volume;
	}, []);

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		// p5.createCanvas(500, 500).parent(canvasParentRef);
		// const cnv = p5.createCanvas(width, height).parent(canvasParentRef);
		const cnv = p5
			.createCanvas(window.innerWidth, window.innerHeight)
			.parent(canvasParentRef);
		p5.pixelDensity(0.7);
		p5.frameRate(60);
		cnv.mousePressed((event) => {});
		p5.background(0);
	};

	const draw = (p5: p5Types) => {
		// // NOTE: Pixels approch
		p5.loadPixels();
		for (let y = 0; y < p5.height; y++) {
			for (let x = 0; x < p5.width; x++) {
				let index = (x + y * p5.width) * 4;
				// p5.pixels[index + 0] = 5;
				// p5.pixels[index + 1] = 150;
				// p5.pixels[index + 2] = 105;
				p5.pixels[index + 0] = 0;
				p5.pixels[index + 1] = 0;
				p5.pixels[index + 2] = 0;
				p5.pixels[index + 3] = p5.random([0, 50, 100, 150, 200, 255]);
			}
		}
		p5.updatePixels();
		// p5.background(0);
		// p5.fill(255, 52, 42);

		// p5.text(p5.frameRate(), 20, 20);
	};

	return (
		<>
			{/* <audio controls autoPlay loop>
				<source src="/audios/tv_static_1.mp3" />
			</audio> */}
			<audio
				// TODO: Will Fix it later
				// @ts-ignore
				ref={noiseAudioRef}
				autoPlay
				loop
				preload="auto"
				src="/audios/tv_static_1.mp3"
			/>
			<P5Sketch
				setup={setup}
				draw={draw}
				// style={{
				// 	position: "fixed",
				// 	inset: 0,
				// }}
			/>
		</>
	);
};
