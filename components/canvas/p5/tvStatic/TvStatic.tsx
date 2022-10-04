import React, { useEffect, useRef, useState } from "react";
// import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense

import dynamic from "next/dynamic";

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
	ssr: false,
});

interface ComponentProps {
	//Your component props
}

export const TvStatic: React.FC<ComponentProps> = (props: ComponentProps) => {
	// const [muted, setMuted] = useState(true);
	const audioRef = useRef<HTMLAudioElement | undefined>();
	// useEffect(() => {
	// 	setTimeout(() => {}, 100);
	// 	console.log("MYLOG: audioRef: ", audioRef);
	// 	console.log("MYLOG: audioRef: ", audioRef.current.play());

	// 	audioRef?.current?.play().then(() => {
	// 		console.log("MYLOG: dsadadsadsadsadsada: ");
	// 	});
	// }, []);
	//See annotations in JS for more information
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		// p5.createCanvas(500, 500).parent(canvasParentRef);
		// const cnv = p5.createCanvas(width, height).parent(canvasParentRef);
		const cnv = p5
			.createCanvas(window.innerWidth, window.innerHeight)
			.parent(canvasParentRef);
		p5.pixelDensity(0.7);
		p5.frameRate(60);
		cnv.mousePressed((event) => {
			console.log("Clicked on the canvas. Event:", event);
		});
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
				// p5.pixels[index + 3] = Math.floor(Math.random() * 256);
				p5.pixels[index + 3] = p5.random([0, 50, 100, 150, 200, 255]);
				// p5.pixels[index + 3] = Math.random() < 0.7 ? 0 : 255;
			}
		}
		// p5.updatePixels();

		// // NOTE: Fast Pixels approch
		// for (let y = 0; y < window.innerHeight; y++) {
		// 	for (let x = 0; x < window.innerWidth; x++) {
		// 		let index = (x + y * window.innerWidth) * 4;
		// 		// const color = p5.color(5, 150, 105, Math.floor(Math.random() * 256));
		// 		const color = p5.color(0, 0, 0, Math.floor(Math.random() * 256));
		// 		p5.set(x, y, color);
		// 	}
		// }
		// for (let y = 0; y < window.innerHeight; y++) {
		// 	// for (let x = 0; x < window.innerWidth; x++) {
		// 	let index = (1 + y * window.innerWidth) * 4;
		// 	// const color = p5.color(5, 150, 105, Math.floor(Math.random() * 256));
		// 	const color = p5.color(255, 255, 255, Math.floor(Math.random() * 256));
		// 	p5.set(y, y, color);
		// 	// }
		// }
		p5.updatePixels();

		// p5.background(0);
		p5.fill(255, 52, 42);
		p5.text(p5.frameRate(), 20, 20);
	};

	return (
		<>
			{/* <audio controls autoPlay loop>
				<source src="/audios/tv_static_1.mp3" />
			</audio> */}
			<audio
				ref={audioRef}
				autoPlay
				loop
				preload="auto"
				src="/audios/tv_static_1.mp3"
			/>
			<Sketch
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
