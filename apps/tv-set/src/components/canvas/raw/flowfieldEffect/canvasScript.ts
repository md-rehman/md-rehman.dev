export class FlowFieldEffect {
	#ctx: CanvasRenderingContext2D;
	#width: number;
	#height: number;
	lastTime: number;
	interval: number;
	timer: number;
	cellSize: number;
	gradient: CanvasGradient | undefined;
	radius: number;
	vr: number;
	flowFieldAnimation: number | undefined;
	mouse: { x: number; y: number };
	#mouseMoveHandler: (e: MouseEvent) => void;

	constructor(
		ctx: CanvasRenderingContext2D,
		flowFieldAnimation: number | null,
		{ width, height }: { width: number; height: number },
	) {
		this.#ctx = ctx;
		this.#width = width;
		this.#height = height;
		this.flowFieldAnimation = flowFieldAnimation ?? undefined;
		this.lastTime = 0;
		this.interval = 17;
		this.timer = 0;
		this.cellSize = 10;
		this.radius = 0;
		this.vr = 0.03;
		
		this.mouse = { x: 0, y: 0 };
		this.#mouseMoveHandler = (e: MouseEvent) => {
			this.mouse.x = e.clientX;
			this.mouse.y = e.clientY;
		};

		if (typeof window !== "undefined") {
			window.addEventListener("mousemove", this.#mouseMoveHandler);
		}

		this.#initContext();
	}

	#initContext() {
		this.#ctx.lineWidth = 1;
		this.gradient = this.#ctx.createLinearGradient(
			0,
			0,
			this.#width,
			this.#height,
		);
		this.gradient.addColorStop(0.1, "#ff5c33");
		this.gradient.addColorStop(0.2, "#ff66b3");
		this.gradient.addColorStop(0.4, "#ccccff");
		this.gradient.addColorStop(0.6, "#b3ffff");
		this.gradient.addColorStop(0.8, "#80ff80");
		this.gradient.addColorStop(0.9, "#ffff33");
		this.#ctx.strokeStyle = this.gradient;
	}

	resize(width: number, height: number) {
		this.#width = width;
		this.#height = height;
		this.#initContext();
	}

	animate(timeStamp: number = 0) {
		const deltaTime = timeStamp - this.lastTime;
		this.lastTime = timeStamp;
		if (this.timer > this.interval) {
			this.#ctx.clearRect(0, 0, this.#width, this.#height);
			this.radius += this.vr;
			if (this.radius > 5 || this.radius < -5) this.vr *= -1;

			this.#ctx.beginPath();
			for (let y = 0; y < this.#height; y += this.cellSize) {
				for (let x = 0; x < this.#width; x += this.cellSize) {
					const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius;
					
					const dx = this.mouse.x - x;
					const dy = this.mouse.y - y;
					const distance = dx * dx + dy * dy;
					const length = distance * 0.00001;

					this.#ctx.moveTo(x, y);
					this.#ctx.lineTo(
						x + Math.cos(angle) * length,
						y + Math.sin(angle) * length,
					);
				}
			}
			this.#ctx.stroke();

			this.timer = 0;
		} else {
			this.timer += deltaTime;
		}
		this.flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
	}
    
	stop() {
		if (this.flowFieldAnimation) {
			cancelAnimationFrame(this.flowFieldAnimation);
		}
		if (typeof window !== "undefined") {
			window.removeEventListener("mousemove", this.#mouseMoveHandler);
		}
	}
}
