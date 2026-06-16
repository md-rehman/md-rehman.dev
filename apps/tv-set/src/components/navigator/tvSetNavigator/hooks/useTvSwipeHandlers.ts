import { useState, useRef, TouchEventHandler } from "react";

interface Vector {
	x: number | null;
	y: number | null;
}

export const useTvSwipeHandlers = (
	nextChannel: () => void,
	prevChannel: () => void,
	globalTouchDetection: boolean,
) => {
	const [blur, setBlur] = useState<number>(0);

	const touchStartPos = useRef<Vector>({
		x: null,
		y: null,
	}).current;
	const touchEndPos = useRef<Vector>({
		x: null,
		y: null,
	}).current;

	const touchStartHandler: TouchEventHandler<HTMLDivElement> = (e) => {
		if (!globalTouchDetection || !e.touches[0]) return;
		touchStartPos.x = e.touches[0].clientX;
		touchStartPos.y = e.touches[0].clientY;
	};

	const touchMoveHandler: TouchEventHandler<HTMLDivElement> = (e) => {
		if (!touchStartPos.x || !touchStartPos.y || !globalTouchDetection || !e.touches[0]) {
			return;
		}

		touchEndPos.x = e.touches[0].clientX;
		touchEndPos.y = e.touches[0].clientY;
		const delX = touchStartPos.x - touchEndPos.x;
		const delY = touchStartPos.y - touchEndPos.y;

		if (Math.abs(delX) > Math.abs(delY)) {
			if (delX > 0) {
				setBlur(delX / 100);
			} else {
				setBlur(-delX / 100);
			}
		}
	};

	const touchEndHandler: TouchEventHandler<HTMLDivElement> = (e) => {
		if (!globalTouchDetection) {
			return null;
		}
		if (!touchStartPos.x || !touchEndPos.x) return;

		const delX = touchStartPos.x - touchEndPos.x;
		if (!delX) return;
		if (delX > 100) {
			nextChannel();
		} else if (delX < -100) {
			prevChannel();
		}
		touchStartPos.x = null;
		touchStartPos.y = null;
		touchEndPos.x = null;
		touchEndPos.y = null;
		setBlur(0);
	};

	return {
		blur,
		touchStartHandler,
		touchMoveHandler,
		touchEndHandler,
	};
};
