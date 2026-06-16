import React, { useEffect, useState } from "react";
import { Text } from "@atoms";
import { GlitchText } from "@molecules";
// import { GlitchText } from "components/molecules";
import styles from "./GlitchScreen.module.scss";

export const GlitchScreen: React.FC<any> = ({
	children,
	noiseDuration = 20000,
	...props
}) => {
	const [state, setState] = useState("noise");
	useEffect(() => {
		const timer = setTimeout(() => {
			setState("static");
		}, noiseDuration);
		return () => {
			clearTimeout(timer);
		};
	});
	if (state === "noise")
		return (
			<div className={`${styles.noiseWrapper}`}>
				<div
					className={`${styles.noiseBg} flex flex-1 h-screen w-screen items-center justify-center`}
				>
					<div className={styles.strips}>
						<li></li>
						<li></li>
					</div>
					{children}
				</div>
			</div>
		);
	if (state === "static")
		return (
			<div
				className={`bg-blue-600 absolute flex flex-1 h-screen w-screen items-center justify-center`}
			>
				{children}
			</div>
		);
	return null;
};
