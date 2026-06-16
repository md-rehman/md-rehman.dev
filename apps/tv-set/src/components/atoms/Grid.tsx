export const Grid = ({ children, core, ...props }: any) => {
	return (
		<div className="grid-wrapper" {...props}>
			{children}
		</div>
	);
};
