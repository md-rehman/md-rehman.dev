import React from "react";
import { Text } from "@atoms";
import { FloatingShapes, GlitchText } from "@molecules";

export const Instructions: React.FC<{}> = () => {
	return (
		// Have a dark backgroud with white text and maybe remove floating shapes
		<FloatingShapes>
			<div className="flex flex-1 flex-col items-center justify-center h-full">
				<GlitchText className="text-6xl">TV SET</GlitchText>
				{/* <Text className="font-death_note_2 text-6xl">DEATH NOTE</Text> */}
				<Text className="font-death_note_2 text-4xl">How to use it</Text>
				<ol start={1}>
					<li>
						<Text>Use left and right arrow to change channels</Text>
					</li>
				</ol>
			</div>
		</FloatingShapes>
	);
};
