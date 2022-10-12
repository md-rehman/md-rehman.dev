export {};

// import { useEffect, useRef } from "react";
// import { FlowFieldEffect as CanvasScript } from "./canvasScript";
// import styles from "./FlowField.module.scss";

// export const FlowFieldEffect = () => {
// 	const canvasRef = useRef<HTMLCanvasElement | null>(null);
// 	let context = useRef<CanvasRenderingContext2D | null>(null).current;
// 	const flowFieldAnimation = useRef().current;
// 	const resizeCanvas = () => {
// 		const canvas = canvasRef.current;
// 		if (!canvas) return;
// 		if (!window) return;

// 		cancelAnimationFrame(flowFieldAnimation);
// 		canvas.width = window.innerWidth;
// 		canvas.height = window.innerHeight;
// 		flowField = new CanvasScript(context, flowFieldAnimation, {
// 			width: canvas?.width,
// 			height: canvas.height,
// 		});
// 		flowField.animate();
// 	};
// 	useEffect(() => {
// 		const canvas = canvasRef.current;
// 		if (!canvas) return;
// 		context = canvas.getContext("2d");
// 		canvas.width = window.innerWidth;
// 		canvas.heigth = window.innerHeight;
// 		flowField = new CanvasScript(context, flowFieldAnimation, {
// 			width: canvas?.width,
// 			height: canvas.height,
// 		});
// 		flowField.animate();

// 		if (canvasRef) {
// 			document.addEventListener("resize", resizeCanvas, []);
// 		}
// 	}, [canvasRef]);
// 	return (
// 		<canvas
// 			id="FlowFieldEffect"
// 			ref={canvasRef}
// 			className={styles.flowFieldEffectCanvas}
// 		></canvas>
// 	);
// };
