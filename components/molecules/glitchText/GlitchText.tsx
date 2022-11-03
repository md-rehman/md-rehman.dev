import React, { ReactDOM, ReactElement, useEffect, useState } from "react";
import { Text } from "../../atoms";
import styles from "./GlitchText.module.scss";

export const GlitchText = ({
	children,
	className,
	duration,
	_text = {},
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	duration?: number;
	children: string;
	className?: string;
	_text?: any;
}) => {
	const [state, setState] = useState("visible");
	useEffect(() => {
		if (duration)
			setTimeout(() => {
				setState("hidden");
			}, duration);
	}, []);

	if (state === "hidden") return null;
	if (state === "visible")
		return (
			<div
				// NOTE: removing relative positioning form below element
				className={`${styles.glitchTextWrapper} ${className}`}
				{...props}
			>
				<Text
					{..._text}
					className={`${styles.glitch} ${_text.className}`}
					data-text={children}
				>
					{children}
				</Text>
			</div>
		);
	return null;
};
