import { HTMLAttributes } from "react";

export const Text = (props: any) => {
	const as = props.as || "p";
	const _text = (textProps: any) => {
		switch (as) {
			case "p":
				return <p {...textProps} />;
			case "div":
				return <div {...textProps} />;
			default:
				return <p {...textProps} />;
		}
	};

	return _text(props);
};
