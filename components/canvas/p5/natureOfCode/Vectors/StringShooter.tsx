import React, { useEffect, useRef, useState } from "react";
import p5Types, { Vector } from "p5";
import { P5Sketch } from "@atoms";
import { VIBRANT_COLORS } from "@constants";

class String {
	point?: Vector;
	pos: Vector;
	force?: Vector;
	resistance?: Vector;
	mouseForce?: Vector;
	mouse?: Vector;
	vel?: Vector;
	acc?: Vector;
	dAcc?: Vector;
	p5: p5Types;

	constructor(p5: p5Types) {
		this.p5 = p5;
		this.pos = window.p5.Vector.random2D().setMag(11);
	}
	// STEP: Creation
	create() {
		this.pos = this.p5.createVector(this.p5.mouseX, this.p5.mouseY);
		this.force = undefined;
		this.mouseForce = undefined;
	}
	stretch() {
		const mouse = this.p5.createVector(this.p5.mouseX, this.p5.mouseY);
		this.mouseForce = this.pos.copy();
		this.mouseForce.sub(mouse);
	}

	// STEP: Motion
	release() {
		if (this.mouseForce) {
			this.force = this.mouseForce.copy().mult(0.1);
			this.resistance = this.force.copy().mult(-0.01);
		}
	}
	update() {
		if (
			this.force &&
			this.resistance &&
			this.force.angleBetween(this.resistance) !== 0
		) {
			this.force.add(this.resistance);
			this.pos.add(this.force);
		}
	}
	render() {
		this.p5.background(17, 24, 39);
		this.p5.circle(this.pos.x, this.pos.y, 20);
	}
}

let string: String;

export const StringShooter: React.FC = () => {
	const mousePressed = (e: p5Types) => {
		string.create();
	};
	const mouseDragged = (e: p5Types) => {
		string.stretch();
	};
	const mouseReleased = (e: p5Types) => {
		string.release();
	};
	// const touchStarted = (e) => {};
	// const touchMoved = (e) => {};
	// const touchEnded = (e) => {};

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(
			canvasParentRef,
		);
		p5.noStroke();
		string = new String(p5);
	};

	const draw = (p5: p5Types) => {
		string.update();
		string.render();
	};

	return (
		<P5Sketch
			setup={setup}
			draw={draw}
			mousePressed={mousePressed}
			mouseDragged={mouseDragged}
			mouseReleased={mouseReleased}
			// touchStarted={touchStarted}
			// touchMoved={touchMoved}
			// touchEnded={touchEnded}
		/>
	);
};
