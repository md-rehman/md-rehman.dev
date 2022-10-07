import React, {
	useEffect,
	useState,
	useContext,
	useRef,
	SyntheticEvent,
	TouchEventHandler,
	LegacyRef,
} from "react";
import { Text } from "@atoms";
import { GlitchText } from "@molecules";
import { WhiteBoard, TvSetNoise, TvStatic, RandomWalker } from "@canvas";
import { NavigationRouteContext } from "../context";
// import { GlitchText } from "components/molecules";
import styles from "./TvSetNavigator.module.scss";

const OVERLAY_DURATION = 600;
const INFO_OVERLAY_DURATION = 26000;
const AUDIO_VOL = 0.1;

interface vector {
	x: number | null;
	y: number | null;
}

type channelMeta = {
	activeChannel: number;
	prevChannel: number;
	overlay: "noise" | "blueScreen" | "none";
	infoOverlay: boolean;
};

const lpad = (value: number, padding: number) => {
	const zeroes = new Array(padding + 1).join("0");
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
		overlay: "none",
		infoOverlay: true,
	});
	const [blur, setBlur] = useState<number>(0);
	const [globalTouchDetection, setGlobalTouchDetection] =
		useState<boolean>(true);
	const buttonAudioRef = useRef<HTMLAudioElement>();
	const touchStartPos = useRef<vector>({
		x: null,
		y: null,
	}).current;
	const touchEndPos = useRef<vector>({
		x: null,
		y: null,
	}).current;

	// Handle first render with noise
	// useEffect(() => {
	// 	setTimeout(() => {
	// 		setChannelMeta((prevState) => {
	// 			return { ...prevState, overlay: "none" };
	// 		});
	// 	}, OVERLAY_DURATION);
	// }, []);

	const nextChannel = () => {
		/*  */
		setChannelMeta((prevState) => {
			setTimeout(() => {
				setChannelMeta((prevState) => {
					return {
						...prevState,
						overlay: config[prevState.activeChannel] ? "none" : "blueScreen",
					};
				});
			}, OVERLAY_DURATION);
			/*  */
			setTimeout(() => {
				setChannelMeta((prevState) => {
					return {
						...prevState,
						infoOverlay: false,
					};
				});
			}, INFO_OVERLAY_DURATION);
			/*  */
			if (prevState.activeChannel < 999) {
				return {
					activeChannel: prevState.activeChannel + 1,
					prevChannel: prevState.activeChannel,
					overlay: "noise",
					infoOverlay: true,
				};
			}
			return prevState;
		});
	};
	const prevChannel = () => {
		setChannelMeta((prevState) => {
			/*  */
			setTimeout(() => {
				setChannelMeta((prevState) => {
					return {
						...prevState,
						overlay: config[prevState.activeChannel] ? "none" : "blueScreen",
						infoOverlay: true,
					};
				});
			}, OVERLAY_DURATION);
			/*  */
			setTimeout(() => {
				setChannelMeta((prevState) => {
					return {
						...prevState,
						infoOverlay: false,
					};
				});
			}, INFO_OVERLAY_DURATION);
			/*  */
			if (prevState.activeChannel > 0) {
				return {
					activeChannel: prevState.activeChannel - 1,
					prevChannel: prevState.activeChannel,
					overlay: "noise",
					infoOverlay: true,
				};
			}
			return prevState;
		});
	};

	const keyDownHandler = (e: any) => {
		if (buttonAudioRef?.current) buttonAudioRef.current.volume = AUDIO_VOL;
		buttonAudioRef?.current?.play();
		console.log("MYLOG: e: ", e);

		switch (e.key) {
			case "ArrowRight":
				setTimeout(() => {
					nextChannel();
				}, (buttonAudioRef?.current?.duration || 1) * 800);
				break;
			case "ArrowLeft":
				setTimeout(() => {
					prevChannel();
				}, (buttonAudioRef?.current?.duration || 1) * 800);
				break;
		}
	};
	// useEffect(() => {
	// 	// Handling key presses on keyboard
	// 	document.addEventListener("keydown", keyDownHandler, true);
	// 	return () => {
	// 		document.removeEventListener("keydown", keyDownHandler, true);
	// 	};
	// }, []);

	const touchStartHandler: TouchEventHandler<HTMLDivElement> = (e) => {
		if (!globalTouchDetection) return null;
		touchStartPos.x = e.touches[0].clientX;
		touchStartPos.y = e.touches[0].clientY;
	};
	const touchMoveHandler: TouchEventHandler<HTMLDivElement> = (e) => {
		if (!touchStartPos.x || !touchStartPos.y || !globalTouchDetection) {
			return null;
		}

		touchEndPos.x = e.touches[0].clientX;
		touchEndPos.y = e.touches[0].clientY;
		const delX = touchStartPos.x - touchEndPos.x;
		const delY = touchStartPos.y - touchEndPos.y;

		console.log("MYLOG: delX: ", delX);

		if (Math.abs(delX) > Math.abs(delY)) {
			/*most significant*/
			if (delX > 0) {
				/* right swipe */
				setBlur(delX / 100);
			} else {
				/* left swipe */
				setBlur(-delX / 100);
			}
		} else {
			if (delY > 0) {
				/* down swipe */
			} else {
				/* up swipe */
			}
		}
		// /* reset values */
		// touchStartPos.x = null;
		// touchStartPos.y = null;
	};
	const touchEndHandler: TouchEventHandler<HTMLDivElement> = (e) => {
		if (!globalTouchDetection) {
			return null;
		}
		if (!touchStartPos.x || !touchEndPos.x) return;

		const delX = touchStartPos.x - touchEndPos.x;
		// Not care about delY for now
		// const delY = touchStartPos.y - touchEndPos.y;
		if (!delX) return;
		if (delX > 100) {
			nextChannel();
		} else if (delX < -100) {
			prevChannel();
		}
		/* reset values */
		touchStartPos.x = null;
		touchStartPos.y = null;
		touchEndPos.x = null;
		touchEndPos.y = null;
		setBlur(0);
	};
	// useEffect(() => {
	// 	// Handling swipes on touch screen
	// 	document.addEventListener("touchstart", touchStartHandler, false);
	// 	document.addEventListener("touchmove", touchMoveHandler, false);
	// 	document.addEventListener("touchend", touchEndHandler, false);
	// 	return () => {
	// 		document.removeEventListener("touchstart", touchStartHandler, false);
	// 		document.removeEventListener("touchmove", touchMoveHandler, false);
	// 		document.removeEventListener("touchend", touchEndHandler, false);
	// 	};
	// }, []);
	const CurrentScene = config[channelMeta.activeChannel]?.component;

	return (
		<NavigationRouteContext.Provider
			value={{ channels: config, currentChannel: channelMeta.activeChannel }}
		>
			<div
				className="navigation-wrapper"
				onTouchStart={touchStartHandler}
				onTouchMove={touchMoveHandler}
				onTouchEnd={touchEndHandler}
				onKeyDown={keyDownHandler}
				tabIndex={-1}
				style={{ outline: 0 }}
			>
				{CurrentScene && (
					<div
						className="animation-wrapper"
						style={{
							filter: `blur(${blur}px)`,
							transform: `translateX(${blur}px)`,
						}}
					>
						<CurrentScene
							testProps={"fdskfjskljljflkjflksjl"}
							{...config[channelMeta.activeChannel].props}
						/>
					</div>
				)}
				{/* TODO: Will Fix it later
				// @ts-ignore */}
				<audio ref={buttonAudioRef} src="/audios/remote_button_2.mp3" />
				{channelMeta.overlay === "noise" && (
					<div
						style={{ backgroundColor: "white", position: "fixed", inset: 0 }}
					>
						<TvStatic volume={AUDIO_VOL} />
					</div>
				)}
				{channelMeta.overlay === "blueScreen" && (
					<div
						className={`bg-blue-600 flex flex-1 h-screen w-screen items-center justify-center`}
					></div>
				)}
				{(channelMeta.infoOverlay || true) && (
					<div
						className={`flex flex-1 h-screen w-screen items-center justify-center`}
					>
						<div className="text-lime-500 absolute top-10 left-10 font-arial">
							<Text>No service</Text>
						</div>
						<div className="text-lime-500  absolute top-10 right-10 font-arial">
							<Text>{lpad(channelMeta.activeChannel, 3)}</Text>
						</div>
						{/* <div className="text-lime-500 text-2xl absolute bottom-20 font-arial">
							<GlitchText>Under construction</GlitchText>
						</div> */}
					</div>
				)}
				{globalTouchDetection ? (
					<div
						className="absolute bg-blue-600 bottom-4 right-4 p-4 rounded-none"
						onClick={() => {
							setGlobalTouchDetection((prevState) => {
								return !prevState;
							});
						}}
					/>
				) : (
					<div
						className="absolute bg-red-500 bottom-4 right-4 p-4 rounded-none"
						onClick={() => {
							setGlobalTouchDetection((prevState) => {
								return !prevState;
							});
						}}
					/>
				)}
				{/* <input
				type="checkbox"
				className="absolute bottom-4 right-4 p-4 rounded-none"
				checked={globalTouchDetection}
			/> */}
			</div>
		</NavigationRouteContext.Provider>
	);
};
