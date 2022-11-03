import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from "next/dynamic";
import { P5Sketch } from "@atoms";
import p5 from "p5";

interface ComponentProps {
	//Your component props
}

let pos: p5Types.Vector;
const COLOR_ARRAY = [
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
];
let count = 0;
let greaterSide: number;
let smallerSide: number;
let landscape: boolean;
let MAX_COUNT = 1000;
let screenRatio: number;

export const RandomWalker4: React.FC<ComponentProps> = (props) => {
	function setup(p5: p5Types, canvasParentRef: Element) {
		p5.background(220, 200, 100);
		p5.noFill();

		p5.createCanvas(window.innerWidth, window.innerHeight).parent(
			canvasParentRef,
		);
		pos = p5.createVector(
			p5.random(p5.width * 0.3, p5.width * 0.7),
			p5.random(p5.height * 0.3, p5.height * 0.7),
		);

		if (p5.width > p5.height) {
			greaterSide = p5.width;
			smallerSide = p5.height;
			MAX_COUNT = p5.height * 1.2;
			landscape = true;
		} else {
			greaterSide = p5.height;
			smallerSide = p5.width;
			MAX_COUNT = p5.width * 1.2;
			landscape = false;
		}
		screenRatio = greaterSide / smallerSide;
		count = 0;
	}
	function draw(p5: p5Types) {
		if (window === undefined) return;
		if (pos === undefined) return;
		count++;
		if (count > MAX_COUNT) return;
		p5.stroke(p5.random(COLOR_ARRAY));
		p5.strokeWeight(1);
		const size = p5.random(smallerSide * 0.05, smallerSide * 0.2);
		// p5.circle(pos.x, pos.y, size);
		const arcStart = p5.TWO_PI * p5.random(0.2, 0.8);
		const arcEnd = p5.TWO_PI * p5.random(0.2, 0.8);
		p5.arc(pos.x, pos.y, size, size, arcStart, arcEnd);

		const newPosX =
			pos.x +
			p5.random(
				-p5.width * (landscape ? 0.5 : 0.2),
				p5.width * (landscape ? 0.5 : 0.2),
			);
		const newPosY =
			pos.y + p5.random(-p5.height * (landscape ? 0.5 : 0.2), p5.height * 0.2);
		if (
			newPosX > 0 &&
			newPosX < p5.width &&
			newPosY > 0 &&
			newPosY < p5.height
		) {
			pos.x = newPosX;
			pos.y = newPosY;
			count++;
		}
	}

	return <P5Sketch setup={setup} draw={draw} />;
};
