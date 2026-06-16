import React, { useState } from "react";
import { Text } from "@atoms";
import styles from "../TvSetNavigator.module.scss";

interface OffOverlayProps {
	probablyTouchScreen: boolean;
	setChannelMeta: React.Dispatch<React.SetStateAction<any>>;
}

export const OffOverlay: React.FC<OffOverlayProps> = ({
	probablyTouchScreen,
	setChannelMeta,
}) => {
	const [offAnimation, setOffAnimation] = useState<boolean>(false);

	const handleTurnOn = () => {
		setOffAnimation(true);
		setTimeout(() => {
			setChannelMeta((prevState: any) => {
				return {
					...prevState,
					overlay: "none",
					infoOverlay: true,
				};
			});
		}, 1250);
	};

	return (
		<div
			className="off-overlay fixed h-screen w-screen top-0 bg-black flex flex-1 items-center justify-center text-center z-50 cursor-pointer"
			onClick={handleTurnOn}
		>
			<Text
				className={`font-silkscreen text-white text-2xl mx-12 ${
					offAnimation ? styles.offText : ""
				}`}
			>
				{probablyTouchScreen ? "Press" : "Click"} to Turn
				<Text
					className={`inline  ${
						offAnimation ? "text-white" : "text-lime-500"
					}`}
				>
					{" On "}
				</Text>
				the TV
			</Text>
		</div>
	);
};
