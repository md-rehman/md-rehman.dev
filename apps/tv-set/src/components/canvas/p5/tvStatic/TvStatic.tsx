import React from "react";
import styles from "./TvStatic.module.scss";
import { TvStaticClient } from "./TvStaticClient";

interface ComponentProps {
	volume?: number;
}

export const TvStatic: React.FC<ComponentProps> = ({
	volume = 0.01,
}: ComponentProps) => {
	return (
		<div className={styles.tvStaticContainer}>
			<TvStaticClient volume={volume} />
		</div>
	);
};
