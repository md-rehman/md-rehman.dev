import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { Walker } from "./walker5";
import dynamic from "next/dynamic";
import { P5Sketch } from "@atoms";

interface ComponentProps {
	//Your component props
}
let walker: Walker;

export const RandomWalker5: React.FC<ComponentProps> = (
	props: ComponentProps,
) => {
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(
			canvasParentRef,
		);
		walker = new Walker(p5, p5.width / 2, p5.height / 2, 8);
	};

	const draw = (p5: p5Types) => {
		walker.update(p5);
		walker.render(p5);
	};

	return <P5Sketch setup={setup} draw={draw} />;
};
