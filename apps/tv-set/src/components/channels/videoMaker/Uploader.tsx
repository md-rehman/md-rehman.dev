import React, { useEffect } from "react";

export const Uploader: React.FC<any> = (props) => {
	let audioCtx, analyser, bufferLength, dataArray;

	useEffect(() => {
		if (!window) return;

		audioCtx = new window.AudioContext();
		analyser = audioCtx.createAnalyser();

		analyser.fftSize = 2048;
		bufferLength = analyser.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
	});

	const handleAudioUpload = (e: any) => {};

	return (
		<main className="flex flex-1 h-screen w-screen items-center justify-center">
			<h1 className="text-3xl">Hello video!!!</h1>
			<audio id="audio">
				<source src="" id="thesource" />
			</audio>
			<input
				type="file"
				onChange={handleAudioUpload}
				id="upload"
				title="Upload File"
			/>
		</main>
	);
};
