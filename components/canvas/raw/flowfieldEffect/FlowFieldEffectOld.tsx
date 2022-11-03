// import { useEffect, useRef } from "react";
// import { FlowFieldEffect as CanvasScript } from "./canvasScript";
// import styles from "./FlowField.module.scss";

// export const FlowFieldEffect = () => {
// 	const canvasRef = useRef();
// 	const ctxRef = useRef();
// 	const flowFieldAnimation = useRef().current;
// 	let ctx;
// 	let flowField;
// 	const resizeCanvas = () => {
// 		cancelAnimationFrame(flowFieldAnimation);
// 		canvasRef.width = document.innerWidth;
// 		canvasRef.height = document.innerHeight;
// 		flowField = new CanvasScript(ctx, flowFieldAnimation, {
// 			width: canvasRef?.width,
// 			height: canvasRef.height,
// 		});
// 		flowField.animate();
// 	};
// 	useEffect(() => {
// 		if (canvasRef) {
// 			const canvas = canvasRef.current;
// 			const ctx = canvas.getContext("2d");
// 			canvas.width = window.innerWidth;
// 			canvas.heigth = window.innerHeight;
// 			flowField = new CanvasScript(ctx, flowFieldAnimation, {
// 				width: canvas?.width,
// 				height: canvas.height,
// 			});
// 			flowField.animate();
// 		}
// 	}, [canvasRef]);
// 	useEffect(() => {

// 		if (canvasRef) {
// 			// document.addEventListener("resize", resizeCanvas, []);
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
