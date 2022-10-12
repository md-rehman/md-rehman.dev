import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import dynamic from "next/dynamic";
import { P5Sketch } from "@atoms";

interface ComponentProps {
	//Your component props
}

let pos: p5Types.Vector;

export const RandomWalker2: React.FC<ComponentProps> = (props) => {
	function setup(p5: p5Types, canvasParentRef: Element) {
		p5.background(220, 200, 100);
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(
			canvasParentRef,
		);
		pos = p5.createVector(p5.width / 2, p5.height / 2);
	}

	function draw(p5: p5Types) {
		if (window === undefined) return;
		if (pos === undefined) return;
		p5.stroke(255, 100);
		p5.strokeWeight(2);
		p5.point(pos.x, pos.y);
		pos.x = pos.x + p5.random(-1, 1);
		pos.y = pos.y + p5.random(-1, 1);
	}

	return <P5Sketch setup={setup} draw={draw} />;
};
