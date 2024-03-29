import { Children } from "react";
import styles from "./FloatingShapes.module.scss";

export const FloatingShapes: React.FC = ({ children }) => {
	return (
		<>
			<div className={styles.area}>
				<ul className={styles.circles}>
					<svg
						width="404"
						height="373"
						viewBox="0 0 404 373"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M248.999 1.76423C247.812 -0.0232286 245.187 -0.0232134 244.001 1.76425L0.611318 368.341C-0.712626 370.335 0.717031 373 3.11059 373H403.892L379.071 335.5H77.5553C75.1617 335.5 73.732 332.835 75.056 330.841L243.751 76.7643C244.937 74.9768 247.562 74.9768 248.749 76.7642L264.032 99.7823L286.918 58.875L248.999 1.76423Z"
							fill="#0004"
						/>
					</svg>
					<svg
						width="404"
						height="373"
						viewBox="0 0 404 373"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M248.999 1.76423C247.812 -0.0232286 245.187 -0.0232134 244.001 1.76425L0.611318 368.341C-0.712626 370.335 0.717031 373 3.11059 373H403.892L379.071 335.5H77.5553C75.1617 335.5 73.732 332.835 75.056 330.841L243.751 76.7643C244.937 74.9768 247.562 74.9768 248.749 76.7642L264.032 99.7823L286.918 58.875L248.999 1.76423Z"
							fill="#0004"
						/>
					</svg>
					<svg
						width="404"
						height="373"
						viewBox="0 0 404 373"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M248.999 1.76423C247.812 -0.0232286 245.187 -0.0232134 244.001 1.76425L0.611318 368.341C-0.712626 370.335 0.717031 373 3.11059 373H403.892L379.071 335.5H77.5553C75.1617 335.5 73.732 332.835 75.056 330.841L243.751 76.7643C244.937 74.9768 247.562 74.9768 248.749 76.7642L264.032 99.7823L286.918 58.875L248.999 1.76423Z"
							fill="#0004"
						/>
					</svg>
					<svg
						width="404"
						height="373"
						viewBox="0 0 404 373"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M248.999 1.76423C247.812 -0.0232286 245.187 -0.0232134 244.001 1.76425L0.611318 368.341C-0.712626 370.335 0.717031 373 3.11059 373H403.892L379.071 335.5H77.5553C75.1617 335.5 73.732 332.835 75.056 330.841L243.751 76.7643C244.937 74.9768 247.562 74.9768 248.749 76.7642L264.032 99.7823L286.918 58.875L248.999 1.76423Z"
							fill="#0004"
						/>
					</svg>
					<svg
						width="404"
						height="373"
						viewBox="0 0 404 373"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M248.999 1.76423C247.812 -0.0232286 245.187 -0.0232134 244.001 1.76425L0.611318 368.341C-0.712626 370.335 0.717031 373 3.11059 373H403.892L379.071 335.5H77.5553C75.1617 335.5 73.732 332.835 75.056 330.841L243.751 76.7643C244.937 74.9768 247.562 74.9768 248.749 76.7642L264.032 99.7823L286.918 58.875L248.999 1.76423Z"
							fill="#0004"
						/>
					</svg>
				</ul>
				{children}
			</div>
		</>
	);
};
