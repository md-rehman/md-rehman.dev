import p5Types, { Vector } from "p5";
import { VIBRANT_COLORS } from "@constants";

interface IPoint {
	x: number;
	y: number;
}

declare global {
	interface Window {
		p5: typeof p5Types;
	}
}

export class Walker {
	pos: Vector;
	vel: Vector;
	size: number;
	constructor(p5: p5Types, x: number, y: number, size = 4) {
		this.pos = p5.createVector(x, y);
		this.vel = p5.createVector(1, -1);
		this.size = size;
	}
	update(p5: p5Types) {
		this.vel = window.p5.Vector.random2D();
		this.vel.mult(p5.random(2, 70));
		// NOTE: Below add method will update the pos variable
		// this.pos.add(this.vel);
		// NOTE: Below will return the new Vector
		const newPos = window.p5.Vector.add(this.pos, this.vel);
		if (
			newPos.x > 0 &&
			newPos.y > 0 &&
			newPos.x < p5.width &&
			newPos.y < p5.height
		) {
			this.pos = newPos;
		}
	}
	renderRect(p5: p5Types) {
		p5.rect(this.pos.x, this.pos.y, this.size, this.size);
	}
	renderArcs(p5: p5Types) {
		const size = p5.random(p5.width * 0.05, p5.width * 0.2);
		const arcStart = p5.TWO_PI * p5.random(0.2, 0.8);
		const arcEnd = p5.TWO_PI * p5.random(0.2, 0.8);

		p5.stroke(p5.random(VIBRANT_COLORS));
		p5.noFill();
		p5.arc(this.pos.x, this.pos.y, size, size, arcStart, arcEnd);
	}
}
// TODO: delete later
// "react-p5": "file:../../../open-source/repos/react-p5"
