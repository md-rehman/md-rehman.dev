import dynamic from "next/dynamic";

export const P5Sketch = dynamic(
	/* @ts-ignore */
	() => import("react-p5").then((mod) => mod.default),
	{
		ssr: false,
	},
);
