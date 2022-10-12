import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from "next/dynamic";
import { P5Sketch } from "@atoms";

interface ComponentProps {
	//Your component props
}

let pos: p5Types.Vector;
const colorsArray = [
	"#db2777",
	"#ef4444",
	"#5eead4",
	"#34d399",
	"#a3e635",
	"#38bdf8",
	"#818cf8",
	"#67e8f9",
	"#e879f9",
	"#fb923c",
	// Same as background Color
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
	"#111827",
];

export const RandomWalker3: React.FC<ComponentProps> = (props) => {
	function gradientLine(
		p5: p5Types,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		color1: string,
		color2: string,
	) {
		// linear gradient from start to end of line
		// @ts-ignore-next-line
		var grad = p5.drawingContext.createLinearGradient(x1, y1, x2, y2);
		grad.addColorStop(0, color1);
		grad.addColorStop(1, color2);

		// @ts-ignore-next-line
		p5.drawingContext.strokeStyle = grad;

		p5.line(x1, y1, x2, y2);
	}

	function setup(p5: p5Types, canvasParentRef: Element) {
		p5.background(220, 200, 100);
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(
			canvasParentRef,
		);
		pos = p5.createVector(
			p5.random(p5.width * 0.3, p5.width * 0.7),
			p5.random(p5.height * 0.3, p5.height * 0.7),
		);
	}

	function draw(p5: p5Types) {
		if (window === undefined) return;
		if (pos === undefined) return;
		p5.strokeWeight(1);
		if (p5.random(-1, 1) > (p5.width > p5.height ? 0.5 : -0.5)) {
			gradientLine(
				p5,
				pos.x - p5.random(0, p5.width * 0.2),
				pos.y,
				pos.x + p5.random(0, p5.width * 0.2),
				pos.y,
				p5.random(colorsArray),
				p5.random(colorsArray),
			);
			const newPos = pos.x + p5.random(-p5.width * 0.1, p5.width * 0.1);
			if (newPos > 0 && newPos < p5.width) pos.x = newPos;
		} else {
			gradientLine(
				p5,
				pos.x,
				pos.y - p5.random(0, p5.height * 0.2),
				pos.x,
				pos.y + p5.random(0, p5.height * 0.2),
				p5.random(colorsArray),
				p5.random(colorsArray),
			);
			const newPos = pos.y + p5.random(-p5.height * 0.1, p5.height * 0.1);
			if (newPos > 0 && newPos < p5.height) pos.y = newPos;
		}
	}

	return <P5Sketch setup={setup} draw={draw} />;
};
