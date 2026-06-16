import React, { useEffect, useRef, useState } from "react";
import p5Types, { Vector } from "p5"; //Import this for typechecking and intellisense
import { P5Sketch } from "@atoms";
import { VIBRANT_COLORS } from "@constants";

class Mover {
	pos: Vector;
	vel: Vector;
	acc: Vector;
	theta: number;
	constructor(p5: p5Types, x: number, y: number) {
		this.pos = p5.createVector(x, y);
		// this.vel = window.p5.Vector.random2D().mult(0.1);
		this.vel = window.p5.Vector.random2D().normalize().mult(0.1);
		// this.pos = p5.createVector(x, y);
		// this.vel = p5.createVector(x + 1, y).mult(0.1);
		// this.vel = window.p5.Vector.random2D().normalize();
		this.acc = window.p5.Vector.random2D().normalize();
		this.theta = p5.random(-p5.HALF_PI / 4, p5.HALF_PI / 4);
	}
	update(p5: p5Types) {
		let mouse = p5.createVector(p5.mouseX, p5.mouseY);
		this.acc = window.p5.Vector.sub(mouse, this.pos);
		const accPer = p5.createVector(this.acc.y, -this.acc.x);
		this.acc.mult(0.3).limit(3);
		accPer.mult(0.1).limit(15);
		// const angle = this.acc.angleBetween(accPer);
		accPer.rotate(this.theta);

		this.acc.add(accPer);

		this.pos.add(this.acc);
	}
	renderRect(p5: p5Types, size: number) {
		p5.rect(this.pos.x, this.pos.y, size, size);
	}
	renderCircle(p5: p5Types, size: number) {
		// p5.background("rgba(17,24,39,0.1)");
		p5.background(17, 24, 39, 160);
		p5.noStroke();
		p5.circle(this.pos.x, this.pos.y, size);
	}
}

let mover: Mover;

export const ForceBasic: React.FC = () => {
	// const [mover, setMover] = useState<Mover | null>();
	const [isSSR, setIsSSR] = useState<boolean>(true);
	useEffect(() => {
		setIsSSR(false);
	});
	if (isSSR) return null;

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(
			canvasParentRef,
		);
		mover = new Mover(p5, p5.width / 2, p5.height / 2);
		// let temp = new Mover(p5, p5.width / 2, p5.height / 2);
		// setMover(temp);
	};

	const draw = (p5: p5Types) => {
		mover.update(p5);
		// mover.render(p5);
		// mover.renderRect(p5, 8);
		mover.renderCircle(p5, 8);
	};

	return <P5Sketch setup={setup} draw={draw} />;
};
