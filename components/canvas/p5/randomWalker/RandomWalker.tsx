import React, { useEffect, useRef } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { Walker } from "./walker";
import dynamic from "next/dynamic";

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
	ssr: false,
});

interface ComponentProps {
	//Your component props
}

let x = 50;
const y = 50;

export const RandomWalker: React.FC<ComponentProps> = (
	props: ComponentProps,
) => {
	let w = useRef().current;
	useEffect(() => {
		w = new Walker(window.innerWidth / 2, window.innerHeight / 2, 8);
		console.log("MYLOG: calling useEffec: ", w);
	});

	if (w === null || w === undefined || window === undefined) {
		return null;
	}
	//See annotations in JS for more information
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		// p5.createCanvas(500, 500).parent(canvasParentRef);
		// const cnv = p5.createCanvas(width, height).parent(canvasParentRef);
		p5.background(220, 200, 100);
		const cnv = p5
			.createCanvas(window.innerWidth, window.innerHeight)
			.parent(canvasParentRef);
		cnv.mousePressed((event) => {
			console.log("Clicked on the canvas. Event:", event);
		});
	};

	const draw = (p5: p5Types) => {
		if (!window) return;
		w.step(p5, {
			// max: { x: window.innerWidth * 0.6, y: window.innerHeight * 0.6 },
			// min: { x: window.innerWidth * 0.4, y: window.innerHeight * 0.4 },
			max: { x: window.innerWidth, y: window.innerHeight },
			min: { x: 0, y: 0 },
		});
		w.render(p5);
		// p5.ellipse(x, y, 70, 70);
		// x++;
	};

	return <Sketch setup={setup} draw={draw} />;
};
