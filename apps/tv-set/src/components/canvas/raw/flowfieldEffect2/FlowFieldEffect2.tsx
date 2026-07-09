import { useEffect, useRef } from "react";
import { FlowFieldEffect2 as CanvasScript } from "./canvasScript";
import styles from "./FlowField.module.scss";

export const FlowFieldEffect2 = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext("2d");
		if (!context) return;
		
		let flowField: CanvasScript | null = null;

		const initAndAnimate = () => {
			if (flowField) {
				flowField.stop();
			}

			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			
			// Initialize the external canvas script with the new dimensions
			flowField = new CanvasScript(context, null, {
				width: canvas.width,
				height: canvas.height,
			});
			
			flowField.animate();
		};

		// 1. Run it once when the component mounts
		initAndAnimate();

		// 2. Re-run it whenever the window resizes
		window.addEventListener("resize", initAndAnimate);

		// 3. Cleanup: Remove the listener and stop animation when the component is destroyed
		return () => {
			window.removeEventListener("resize", initAndAnimate);
			if (flowField) {
				flowField.stop();
			}
		};
	}, []); // Empty dependency array ensures this effect only runs on mount

	return (
		<canvas
			id="FlowFieldEffect2"
			ref={canvasRef}
			className={styles.flowFieldEffectCanvas}
		/>
	);
};
