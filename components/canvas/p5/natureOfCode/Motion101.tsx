import React, { useEffect, useRef, useState } from "react";
import p5Types, { Vector } from "p5"; //Import this for typechecking and intellisense
import { P5Sketch } from "@atoms";
import { VIBRANT_COLORS } from "@constants";

// declare global {
// 	interface Window {
// 		p5: typeof p5Types;
// 	}
// }

class Mover {
	pos: Vector;
	vel: Vector;
	acc: Vector;
	constructor(p5: p5Types, x: number, y: number) {
		this.pos = p5.createVector(x, y);
		this.vel = window.p5.Vector.random2D().mult(3);
		this.acc = window.p5.Vector.random2D().normalize();
	}
	update(p5: p5Types) {
		let mouse = p5.createVector(p5.mouseX, p5.mouseY);
		this.acc = window.p5.Vector.sub(mouse, this.pos);
		this.acc.setMag(0.08);

		this.vel.add(this.acc);

		this.pos.add(this.vel);
	}
	renderRect(p5: p5Types, size: number) {
		p5.rect(this.pos.x, this.pos.y, size, size);
	}
}

export const Motion101: React.FC = () => {
	const [mover, setMover] = useState<Mover>();
	console.log("MYLOG: mover: ", mover);
	// useEffect(()=>{
	// 	const temp = new Mover(p5, p5.width / 2, p5.height / 2);
	// 	setMover(temp);
	// })
	useEffect(() => {
		setMover(null);
	}, []);

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		console.log("MYLOG: p5: ", p5);

		p5.createCanvas(window.innerWidth, window.innerHeight).parent(
			canvasParentRef,
		);
		let temp = new Mover(p5, p5.width / 2, p5.height / 2);
		setMover(temp);
	};

	const draw = (p5: p5Types) => {
		mover?.update(p5);
		// mover.render(p5);
		mover?.renderRect(p5, 8);
	};

	return <P5Sketch setup={setup} draw={draw} />;
};
