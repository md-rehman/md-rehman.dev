export class Walker {
	constructor(x, y, size = 4) {
		this.x = x;
		this.y = y;
		this.size = size;
	}
	render(p5) {
		// p5.stroke(0);
		// p5.point(this.x, this.y);
		p5.rect(this.x, this.y, this.size, this.size);
	}
	step(p5, { min, max }) {
		let choice = Math.floor(Math.random() * 4);
		// let choice = Math.random([0, 1, 2, 3]);

		switch (choice) {
			case 0:
				p5.stroke(132, 204, 22);
				p5.fill(132, 204, 22);

				if (this.x < max.x) this.x = this.x + this.size;
				break;
			case 1:
				p5.stroke(225, 29, 72);
				p5.fill(225, 29, 72);
				if (this.x > min.x) this.x = this.x - this.size;
				break;
			case 2:
				p5.stroke(124, 58, 237);
				p5.fill(124, 58, 237);
				if (this.y < max.y) this.y = this.y + this.size;
				break;
			case 3:
				p5.stroke(245, 158, 11);
				p5.fill(245, 158, 11);
				if (this.y > min.y) this.y = this.y - this.size;
				break;
		}
	}
}
