import p5Types, { Vector } from "p5";

interface IPoint {
	x: number;
	y: number;
}

export class Walker {
	pos: Vector;
	vel: p5Types.Vector;
	size: number;
	constructor(p5: p5Types, x: number, y: number, size = 4) {
		this.pos = p5.createVector(x, y);
		this.vel = p5.createVector(1, -1);
		this.size = size;
	}
	update(p5: p5Types) {
		this.vel = window.p5.Vector.random2D();
		this.vel.mult(p5.random(2, 70));
		this.pos.add(this.vel);
	}
	render(p5: p5Types) {
		// p5.stroke(0);
		// p5.point(this.x, this.y);
		p5.rect(this.pos.x, this.pos.y, this.size, this.size);
	}
}
