"use client";

import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5";
import { P5Sketch } from "@atoms";
import styles from "./TvStatic.module.scss";

interface ComponentProps {
	volume?: number;
}

export const TvStaticClient: React.FC<ComponentProps> = ({
	volume = 0.01,
}: ComponentProps) => {
	const noiseAudioRef = useRef<HTMLAudioElement>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		if (noiseAudioRef?.current) {
			noiseAudioRef.current.volume = volume;
		}
	}, [volume]);

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		const cnv = p5
			.createCanvas(window.innerWidth, window.innerHeight)
			.parent(canvasParentRef);
		p5.pixelDensity(0.7);
		p5.frameRate(60);
		p5.background(0);
	};

	const draw = (p5: p5Types) => {
		p5.loadPixels();
		for (let y = 0; y < p5.height; y++) {
			for (let x = 0; x < p5.width; x++) {
				let index = (x + y * p5.width) * 4;
				p5.pixels[index + 0] = 0;
				p5.pixels[index + 1] = 0;
				p5.pixels[index + 2] = 0;
				p5.pixels[index + 3] = p5.random([0, 50, 100, 150, 200, 255]);
			}
		}
		p5.updatePixels();
	};

	return (
		<>
			<audio
				ref={noiseAudioRef}
				autoPlay
				loop
				preload="auto"
				src="/audios/tv_static_1.mp3"
			/>
			{!isMounted ? (
				<svg className={styles.staticNoise} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<filter id="noiseFilter">
						<feTurbulence 
							type="fractalNoise" 
							baseFrequency="0.8" 
							numOctaves="3" 
							stitchTiles="stitch" />
					</filter>
					<rect width="100%" height="100%" filter="url(#noiseFilter)" />
				</svg>
			) : (
				<P5Sketch
					setup={setup}
					draw={draw}
				/>
			)}
		</>
	);
};
