import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { Walker } from "./walker";
import dynamic from "next/dynamic";
import { P5Sketch } from "@atoms";

interface ComponentProps {
	//Your component props
}

export const RandomWalker: React.FC<ComponentProps> = (
	props: ComponentProps,
) => {
	const [walker, setWalker] = useState<Walker | null>(null);

	useEffect(() => {
		const w = new Walker(window.innerWidth / 2, window.innerHeight / 2, 8);
		setWalker(w);
	}, []);

	if (walker === null) return null;

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		// p5.createCanvas(500, 500).parent(canvasParentRef);
		// const cnv = p5.createCanvas(width, height).parent(canvasParentRef);
		p5.background(220, 200, 100);
		const cnv = p5
			.createCanvas(window.innerWidth, window.innerHeight)
			.parent(canvasParentRef);
		cnv.mousePressed((event) => {});
	};

	const draw = (p5: p5Types) => {
		walker.step(p5, {
			// max: { x: window.innerWidth * 0.6, y: window.innerHeight * 0.6 },
			// min: { x: window.innerWidth * 0.4, y: window.innerHeight * 0.4 },
			max: { x: window.innerWidth, y: window.innerHeight },
			min: { x: 0, y: 0 },
		});
		walker.render(p5);
		// p5.ellipse(x, y, 70, 70);
		// x++;
	};

	return <P5Sketch setup={setup} draw={draw} />;
};

// Shankar suman socity, shiv shakti chock, bakrai nagar, near garwa hotel
