export {};

//////////////////////////////////////////////
// const canvas;
// const ctx;
// const flowField;
// const flowFieldAnimation;

// window.onLoad = function () {
// 	// this will be ref
// 	canvas = document.getElementById("canvas");
// 	ctx = canvas.getContext("2d");
// 	canvas.width = window.innerWidth;
// 	canvas.heigth = window.innerHeight;
// 	flowField = new FlowFieldEffect(ctx, canvas?.width, canvas.height);
// 	flowField.animate();
// };

// document.addEventListener("resize", function () {
// 	this.cancelAnimationFrame(flowFieldAnimation);
// 	canvas.width = window.innerWidth;
// 	canvas.height = window.innerHeight;
// 	flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
// 	flowField.animate();
// });
//////////////////////////////////////////////

// NOTE: Below code is temp. commented
// const mouse = { x: 0, y: 0 };
// document.addEventListener("mousemove", (e) => {
// 	mouse.x = e.x;
// 	mouse.y = e.y;
// });

// export class FlowFieldEffect {
// 	#ctx;
// 	#width;
// 	#height;
// 	lastTime;
// 	interval;
// 	timer;
// 	cellSize;
// 	gradient;
// 	radius;
// 	vr;
// 	flowFieldAnimation;
// 	constructor(
// 		ctx: any,
// 		flowFieldAnimation,
// 		{ width, height }: { width: number; height: number },
// 	) {
// 		this.#ctx = ctx;
// 		this.#ctx.lineWidth = 1;
// 		this.#width = width;
// 		this.#height = height;
// 		this.flowFieldAnimation = flowFieldAnimation;
// 		this.lastTime = 0;
// 		this.interval = 17;
// 		this.timer = 0;
// 		this.cellSize = 10;
// 		this.gradient;
// 		this.#createGradient();
// 		this.#ctx.strokeStyle = this.gradient;
// 		this.radius = 0;
// 		this.vr = 0.03;
// 	}
// 	#createGradient() {
// 		this.gradient = this.#ctx.createLinearGradient(
// 			0,
// 			0,
// 			this.#width,
// 			this.#height,
// 		);
// 		this.gradient.addColor("0.1", "#ff5c33");
// 		this.gradient.addColor("0.2", "#ff66b3");
// 		this.gradient.addColor("0.4", "#ccccff");
// 		this.gradient.addColor("0.6", "#b3ffff");
// 		this.gradient.addColor("0.8", "#80ff80");
// 		this.gradient.addColor("0.9", "#ffff33");
// 	}
// 	#drawLine(angle: number, x: number, y: number) {
// 		const positionX = x;
// 		const positionY = y;
// 		const dx = mouse.x - positionX;
// 		const dy = mouse.y - positionY;
// 		const distance = dx * dx + dy * dy;
// 		const length = distance * 0.00001;
// 		this.#ctx.beginPath();
// 		this.#ctx.moveTo(x, y);
// 		this.#ctx.lineTo(
// 			x + Math.cos(angle) * length,
// 			y + Math.sin(angle) * length,
// 		);
// 		this.#ctx.stroke();
// 	}
// 	animate(timeStamp: number) {
// 		const deltaTime = timeStamp - this.lastTime;
// 		this.lastTime = timeStamp;
// 		if (this.timer > this.interval) {
// 			this.#ctx.clearRect(0, 0, this.#width, this.#height);
// 			this.radius += this.vr;
// 			if (this.radius > 5 || this.radius < -5) this.vr *= -1;

// 			for (let y = 0; y < this.#width; y += this.cellSize) {
// 				for (let x = 0; x < this.#height; x += this.cellSize) {
// 					const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius;
// 					this.#drawLine(angle, x, y);
// 				}
// 			}
// 			this.timer = 0;
// 		} else {
// 			this.timer += deltaTime;
// 		}
// 		this.flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
// 	}
// }
