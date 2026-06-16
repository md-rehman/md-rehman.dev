import { useEffect, useRef, useState } from "react";
import styles from "./TvSetNoise.module.scss";

export const TvSetNoise = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	let context = useRef<CanvasRenderingContext2D | null>(null).current;
	const [isDrawing, setIsDrawing] = useState(false);

	const noiseGenerator = (e: any) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		if (!context) return;
		let x,
			y,
			r,
			g,
			b,
			opacity = 0.7;

		for (x = 0; x < canvas.width; x++) {
			for (y = 0; y < canvas.height; y++) {
				r = Math.floor(Math.random() * 255);
				g = Math.floor(Math.random() * 255);
				b = Math.floor(Math.random() * 255);

				context.fillStyle =
					"rgba(" + r + "," + b + "," + g + "," + opacity + ")";
				context.fillRect(x, y, 1, 1);
			}
		}
		canvas.style.backgroundImage = "url(" + canvas.toDataURL("image/png") + ")";

		// requestAnimationFrame(noiseGenerator);
	};
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// canvas.width = window.innerWidth;
		// canvas.height = window.innerHeight;
		// canvas.style.width = `${window.innerWidth}px`;
		// canvas.style.height = `${window.innerHeight}px`;

		context = canvas.getContext("2d");
		if (!context) return;

		noiseGenerator(canvas);
		// let x,
		// 	y,
		// 	r,
		// 	g,
		// 	b,
		// 	opacity = 0.7;

		// for (x = 0; x < canvas.width; x++) {
		// 	for (y = 0; y < canvas.height; y++) {
		// 		r = Math.floor(Math.random() * 255);
		// 		g = Math.floor(Math.random() * 255);
		// 		b = Math.floor(Math.random() * 255);

		// 		context.fillStyle =
		// 			"rgba(" + r + "," + b + "," + g + "," + opacity + ")";
		// 		context.fillRect(x, y, 1, 1);
		// 	}
		// }

		// canvas.style.backgroundImage = "url(" + canvas.toDataURL("image/png") + ")";
		// context.lineCap = "round";
		// context.strokeStyle = "white";
		// context.lineWidth = 2;
	}, []);

	const startDrawing = ({ nativeEvent }: any) => {
		if (!context) return;

		const { offsetX, offsetY } = nativeEvent;
		context.beginPath();
		context.moveTo(offsetX, offsetY);
		setIsDrawing(true);
	};
	const stopDrawing = () => {
		if (!context) return;

		context.closePath();
		setIsDrawing(false);
	};
	const draw = ({ nativeEvent }: any) => {
		if (!context) return;
		if (!isDrawing) {
			return;
		}
		const { offsetX, offsetY } = nativeEvent;
		context.lineTo(offsetX, offsetY);
		context.stroke();
	};

	return (
		<canvas
			id="FlowFieldEffect"
			ref={canvasRef}
			className={styles.flowFieldEffectCanvas}
			onMouseDown={startDrawing}
			onMouseUp={stopDrawing}
			onMouseMove={draw}
		></canvas>
	);
};
