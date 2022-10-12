import { useEffect, useRef, useState } from "react";
import styles from "./WhiteBoard.module.scss";

export const WhiteBoard = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		if (!window) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;

		const context = canvas.getContext("2d");

		// TODO: have to explore bitmap to replace line for more realistic lines
		// chalk shadder
		// const chalkPaint = new Paint();
		// chalkPaint.setStyle(Style.STROKE);
		// chalkPaint.setStrokeWidth(12);
		// Bitmap chalkShader = ((BitmapDrawable)context.getResources().getDrawable(R.drawable.chalk_texture)).getBitmap();
		// chalkPaint.setShader(new BitmapShader(chalkShader, Shader.TileMode.REPEAT, Shader.TileMode.REPEAT));
		if (context) {
			context.lineCap = "round";
			context.strokeStyle = "white";
			context.lineWidth = 2;
		}
		contextRef.current = context;
	}, []);

	const startDrawing = ({ nativeEvent }: any) => {
		const { offsetX, offsetY } = nativeEvent;
		contextRef?.current?.beginPath();
		contextRef?.current?.moveTo(offsetX, offsetY);
		setIsDrawing(true);
	};
	const stopDrawing = () => {
		contextRef?.current?.closePath();
		setIsDrawing(false);
	};
	const draw = ({ nativeEvent }: any) => {
		if (!isDrawing) {
			return;
		}
		const { offsetX, offsetY } = nativeEvent;
		contextRef?.current?.lineTo(offsetX, offsetY);
		contextRef?.current?.stroke();
	};

	const touchStartHandler = (e: any) => {
		const { clientX: offsetX, clientY: offsetY } = e.touches[0];
		contextRef?.current?.beginPath();
		contextRef?.current?.moveTo(offsetX, offsetY);
		setIsDrawing(true);
	};
	const touchMoveHandler = (e: any) => {
		if (!isDrawing) {
			return;
		}
		// touchEndPos.x = e.touches[0].clientX;
		// touchEndPos.y = e.touches[0].clientY;
		const { clientX: offsetX, clientY: offsetY } = e.touches[0];
		contextRef?.current?.lineTo(offsetX, offsetY);
		contextRef?.current?.stroke();
	};
	const touchEndHandler = (e: any) => {
		contextRef?.current?.closePath();
		setIsDrawing(false);
	};

	return (
		<canvas
			id="FlowFieldEffect"
			ref={canvasRef}
			className={styles.flowFieldEffectCanvas}
			onMouseDown={startDrawing}
			onMouseUp={stopDrawing}
			onTouchStart={touchStartHandler}
			onTouchMove={touchMoveHandler}
			onTouchEnd={touchEndHandler}
			onMouseMove={draw}
		></canvas>
	);
};
