import React, { useEffect, useState, useContext, useRef } from "react";
import { Text } from "@atoms";
import { GlitchText } from "@molecules";
import { WhiteBoard, TvSetNoise, TvStatic, RandomWalker } from "@canvas";
import { NavigationRouteContext } from "../context";
// import { GlitchText } from "components/molecules";
import styles from "./TvSetNavigator.module.scss";

const STATIC_DURATION = 600;

type channelMeta = {
	activeChannel: number;
	prevChannel: number;
	state: "noise" | "blueScreen" | "active";
};

const lpad = (value: number, padding: number) => {
	var zeroes = new Array(padding + 1).join("0");
	return (zeroes + value).slice(-padding);
};

export const TvSetNavigator: React.FC<any> = ({
	children,
	noiseDuration = 20000,
	config,
	...props
}) => {
	// const [currentChannel, setCurrentChannel] = useState("001");
	const [channelMeta, setChannelMeta] = useState<channelMeta>({
		activeChannel: 1,
		prevChannel: 1,
		state: "noise",
	});
	const [channel, setChannel] = useState<number>(1);
	const audioRef = useRef<HTMLAudioElement | undefined>();

	useEffect(() => {
		setTimeout(() => {
			setChannelMeta((prevState) => {
				return { ...prevState, state: "active" };
			});
		}, STATIC_DURATION);
	}, []);

	const nextChannel = () => {
		setChannelMeta((prevState) => {
			setTimeout(() => {
				setChannelMeta((prevState) => {
					return {
						...prevState,
						state: config[prevState.activeChannel] ? "active" : "blueScreen",
					};
				});
			}, STATIC_DURATION);
			if (prevState.activeChannel < 999) {
				console.log("MYLOG: audioRef.current.play: ", audioRef.current.play);

				return {
					activeChannel: prevState.activeChannel + 1,
					prevChannel: prevState.activeChannel,
					state: "noise",
				};
			}
			return prevState;
		});
	};
	const prevChannel = () => {
		setChannelMeta((prevState) => {
			setTimeout(() => {
				setChannelMeta((prevState) => {
					return {
						...prevState,
						state: config[prevState.activeChannel] ? "active" : "blueScreen",
					};
				});
			}, STATIC_DURATION);
			if (prevState.activeChannel > 0) {
				return {
					activeChannel: prevState.activeChannel - 1,
					prevChannel: prevState.activeChannel,
					state: "noise",
				};
			}
			return prevState;
		});
	};

	const keyPressHandler = (e: any) => {
		audioRef.current.play();
		switch (e.key) {
			case "ArrowRight":
				setTimeout(() => {
					nextChannel();
				}, audioRef.current.duration * 800);
				break;
			case "ArrowLeft":
				setTimeout(() => {
					prevChannel();
				}, audioRef.current.duration * 800);
				break;
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", keyPressHandler, true);
		return () => {
			document.removeEventListener("keydown", keyPressHandler, true);
		};
	}, []);
	const CurrentScene = config[channelMeta.activeChannel]?.component;

	return (
		<NavigationRouteContext.Provider
			value={{ channels: config, currentChannel: channelMeta.activeChannel }}
		>
			{CurrentScene && (
				<CurrentScene
					testProps={"fdskfjskljljflkjflksjl"}
					{...config[channelMeta.activeChannel].props}
				/>
			)}
			<audio ref={audioRef} src="/audios/remote_button_2.mp3"></audio>
			{channelMeta.state === "noise" && (
				<div style={{ backgroundColor: "white", position: "fixed", inset: 0 }}>
					<TvStatic />
				</div>
			)}
			{channelMeta.state === "blueScreen" && (
				<div
					className={`bg-blue-600 absolute flex flex-1 h-screen w-screen items-center justify-center`}
				></div>
			)}
			{(channelMeta.state === "blueScreen" ||
				channelMeta.state === "noise") && (
				<div
					className={`absolute flex flex-1 h-screen w-screen items-center justify-center`}
				>
					<div className="text-lime-500 absolute top-10 left-10 font-arial">
						<Text>No service</Text>
					</div>
					<div className="text-lime-500  absolute top-10 right-10 font-arial">
						<Text>{lpad(channelMeta.activeChannel, 3)}</Text>
					</div>
					<div className="text-lime-500 text-2xl absolute bottom-20 font-arial">
						<GlitchText>Under construction</GlitchText>
					</div>
				</div>
			)}
		</NavigationRouteContext.Provider>
	);
};
