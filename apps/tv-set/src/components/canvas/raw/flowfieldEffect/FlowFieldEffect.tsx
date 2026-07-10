import { useEffect, useRef } from "react";
import { FlowFieldEffect as CanvasScript } from "./canvasScript";
import styles from "./FlowField.module.scss";

export const FlowFieldEffect = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext("2d");
		if (!context) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		const flowField = new CanvasScript(context, null, {
			width: canvas.width,
			height: canvas.height,
		});
		
		flowField.animate();

		let resizeTimeout: ReturnType<typeof setTimeout>;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
				flowField.resize(canvas.width, canvas.height);
			}, 100);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(resizeTimeout);
			flowField.stop();
		};
	}, []); // Empty dependency array ensures this effect only runs on mount

	return (
		<canvas
			id="FlowFieldEffect"
			ref={canvasRef}
			className={styles.flowFieldEffectCanvas}
		/>
	);
};
