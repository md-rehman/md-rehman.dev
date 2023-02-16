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
import { useMediaQuery, useMediaQueries } from "@react-hook/media-query";
// import { GlitchText } from "components/molecules";
import styles from "./TvSetNavigator.module.scss";

const OVERLAY_DURATION = 600;
const INFO_OVERLAY_DURATION = 2600;
const AUDIO_VOL = 0.1;
const START_CHANNEL = 0;

interface vector {
	x: number | null;
	y: number | null;
}

type channelMeta = {
	activeChannel: number;
	prevChannel: number;
	overlay: "noise" | "blueScreen" | "off" | "none";
	infoOverlay: boolean;
	channelNumber: "setting" | "fixed";
};

const lpad = (value: number, padding: number, symbol = "0") => {
	const symbols = new Array(padding + 1).join(symbol);
	return (symbols + value).slice(-padding);
};

export const TvSetNavigator: React.FC<any> = ({
	children,
	noiseDuration = 20000,
	config,
	...props
}) => {
	// const [currentChannel, setCurrentChannel] = useState("001");
	const [channelMeta, setChannelMeta] = useState<channelMeta>({
		activeChannel: START_CHANNEL,
		prevChannel: START_CHANNEL,
		overlay: "off",
		infoOverlay: false,
		channelNumber: "fixed",
	});
	const [channelNumber, setChannelNumber] = useState<number | null>(null);
	const [blur, setBlur] = useState<number>(0);
	const [offAnimation, setOffAnimation] = useState<boolean>(false);
	const [globalTouchDetection, setGlobalTouchDetection] =
		useState<boolean>(true);
	const mainRef = useRef<HTMLDivElement>();
	const buttonAudioRef = useRef<HTMLAudioElement>();
	const touchStartPos = useRef<vector>({
		x: null,
		y: null,
	}).current;
	const touchEndPos = useRef<vector>({
		x: null,
		y: null,
	}).current;
	const probablyTouchScreen = useMediaQuery(
		"only screen and (pointer: coarse)",
	);

	/* Handle first render with noise  */
	useEffect(() => {
		setTimeout(() => {
			setChannelMeta((prevState) => {
				return {
					...prevState,
					infoOverlay: false,
				};
			});
		}, INFO_OVERLAY_DURATION);
		mainRef?.current?.focus();
	}, []);

	const nextChannel = () => {
		/*  */
		setChannelMeta((prevState) => {
			// TODO: need to add mechanism to clear the timeout and also move all this common code to single function
			setTimeout(() => {
				setChannelMeta((prevState) => {
					return {
						...prevState,
						overlay: config[prevState.activeChannel] ? "none" : "blueScreen",
						// infoOverlay: config[prevState.activeChannel] ? false : true,
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
			if (prevState.activeChannel < 999) {
				return {
					activeChannel: prevState.activeChannel + 1,
					prevChannel: prevState.activeChannel,
					overlay: "noise",
					infoOverlay: true,
					channelNumber: "fixed",
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
					channelNumber: "fixed",
				};
			}
			return prevState;
		});
	};

	const keyDownHandler = (e: any) => {
		if (buttonAudioRef?.current) buttonAudioRef.current.volume = AUDIO_VOL;
		buttonAudioRef?.current?.play();
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
			case "Control":
				setChannelMeta((prevState) => {
					return {
						...prevState,
						infoOverlay: true,
						channelNumber: "setting",
					};
				});
				break;
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				if (e.ctrlKey) {
					setChannelNumber((prevState) => {
						if (prevState === null) return e.key;
						return `${prevState}${e.key}`;
						return parseInt(`${prevState}${e.key}`);
					});
				}
				break;
		}
	};
	const keyUpHandler = (e: any) => {
		switch (e.key) {
			case "Control":
				setChannelMeta((prevState) => {
					if (channelNumber === null) {
						return { ...prevState, channelNumber: "fixed", infoOverlay: false };
					}
					/*  */
					setTimeout(() => {
						setChannelMeta((prevState) => {
							return {
								...prevState,
								overlay: config[prevState.activeChannel]
									? "none"
									: "blueScreen",
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
					if (channelNumber && channelNumber >= 0 && channelNumber <= 999) {
						setChannelNumber(null);
						return {
							activeChannel: channelNumber,
							prevChannel: prevState.activeChannel,
							overlay: "noise",
							infoOverlay: true,
							channelNumber: "fixed",
						};
					}
					return prevState;
				});
				break;
		}
	};

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

	const CurrentScene = config[channelMeta.activeChannel]?.component;
	const channelNumberTemplate = () => {
		if (channelMeta.channelNumber === "setting") {
			if (channelNumber) {
				return (
					<span className="animate-blink">{lpad(channelNumber, 3, "-")}</span>
				);
			}
			return <span className="animate-blink">---</span>;
		}
		// if (channelMeta.channelNumber === "fixed")
		return lpad(channelMeta.activeChannel, 3);
	};
	const touchToggleTemplate = () => {
		return globalTouchDetection ? (
			<div
				className="absolute  bg-gray-50 bottom-4 right-4  flex algin-ceter justify-center w-10 h-10 rounded-md"
				onClick={() => {
					setGlobalTouchDetection((prevState) => {
						return !prevState;
					});
				}}
			>
				<svg
					id="Layer_1"
					data-name="Layer 1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 104.49 122.88"
					className="w-4"
				>
					<title>hand-pointer</title>
					<path d="M35.54,72a3,3,0,1,1-6.05,0v-5.6a2.34,2.34,0,0,1-.47-.3c-1.92-1.54-4-3.25-5.85-4.74-2.66-2.17-5.71-4.68-7.84-6.44a10.92,10.92,0,0,0-4.67-2.35A4.66,4.66,0,0,0,8,52.7a2.64,2.64,0,0,0-1.42,1.46,9,9,0,0,0-.53,4.25,16.22,16.22,0,0,0,1.46,5.24,34.83,34.83,0,0,0,3.83,6.48c.07.09.13.19.19.28l23,34.8a3,3,0,0,1,.48,1.31c.46,3.79,1.27,6.63,2.45,8.4a3.83,3.83,0,0,0,3.37,1.92H77a10.87,10.87,0,0,0,6.15-2,19.67,19.67,0,0,0,5.63-6.59l.44-.75c4.47-7.7,8.8-15.18,9.26-24.05l-.23-10.3a2.12,2.12,0,0,1,0-.44l0-2.42c.08-6.81.18-15.23-6-16.3h-4c0,1.92-.15,3.88-.27,5.77-.1,1.68-.21,3.31-.21,4.87a3,3,0,0,1-6,0c0-1.56.11-3.37.23-5.25.41-6.41.87-13.77-4.26-14.69h-4a2.81,2.81,0,0,1-.65-.07c0,2.32-.11,4.73-.26,7-.11,1.68-.21,3.31-.21,4.86a3,3,0,0,1-6.06,0c0-1.55.12-3.36.24-5.24.4-6.41.87-13.77-4.26-14.69h-4a2.9,2.9,0,0,1-.79-.11V48.23a3,3,0,0,1-6.06,0V16.78c0-5.27-2.15-8.59-4.9-10a6.87,6.87,0,0,0-6.3,0c-2.72,1.39-4.84,4.72-4.84,10.12V72Zm45.3,9.42a2.48,2.48,0,0,1,5,0V92.74a2.48,2.48,0,0,1-5,0V81.43Zm-14.62-5a2.48,2.48,0,0,1,5,0V92.74a2.48,2.48,0,0,1-5,0V76.43ZM51.61,72.9a2.47,2.47,0,1,1,4.94,0V92.74a2.47,2.47,0,0,1-4.94,0V72.9ZM29.49,58.72V16.91c0-8,3.57-13.18,8.15-15.51a13,13,0,0,1,11.77,0c4.61,2.33,8.23,7.5,8.23,15.37V30.66a2.9,2.9,0,0,1,.79-.11H62.6a3.08,3.08,0,0,1,.68.08c5.56.86,8,4.11,9.06,8.3a2.85,2.85,0,0,1,1.27-.29h4.18a2.93,2.93,0,0,1,.67.08c6,.93,8.4,4.61,9.27,9.26a3.44,3.44,0,0,1,.46,0h4.18A2.93,2.93,0,0,1,93,48c11.46,1.77,11.32,13.16,11.21,22.35,0,.32,0,.66,0,2.31l.24,10.66a1.93,1.93,0,0,1,0,.34c-.51,10.39-5.21,18.5-10.06,26.86l-.42.72a25.55,25.55,0,0,1-7.45,8.56A16.76,16.76,0,0,1,77,122.87H40.92a9.43,9.43,0,0,1-8.45-4.59c-1.66-2.48-2.76-6-3.35-10.33L6.52,73.75A41.28,41.28,0,0,1,2,66.09,22.1,22.1,0,0,1,.05,58.78a14.85,14.85,0,0,1,1-7.11,8.63,8.63,0,0,1,4.67-4.58,10.6,10.6,0,0,1,6.06-.44,17.07,17.07,0,0,1,7.37,3.62c1.83,1.52,4.87,4,7.81,6.41l2.49,2Z" />
				</svg>
			</div>
		) : (
			<div
				className="absolute bg-gray-400 bottom-4 right-4 flex algin-ceter justify-center w-10 h-10 rounded-md"
				onClick={() => {
					setGlobalTouchDetection((prevState) => {
						return !prevState;
					});
				}}
			>
				<svg
					id="Layer_1"
					data-name="Layer 1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 85.55 122.88"
					className="w-4"
				>
					<defs></defs>
					<title>hand-mouse-cursor</title>
					<path
						fill="#231f20"
						d="M31.66,83.11a2.37,2.37,0,0,1-4.74,0V78.74a2.82,2.82,0,0,1-.36-.24C25.06,77.3,23.4,76,22,74.77c-2.07-1.69-4.45-3.64-6.1-5a8.76,8.76,0,0,0-3.65-1.84,3.78,3.78,0,0,0-2.06.09A2.15,2.15,0,0,0,9,69.15a7.27,7.27,0,0,0-.41,3.33,12.62,12.62,0,0,0,1.15,4.1,27.12,27.12,0,0,0,3,5.06l.15.22,18,27.21a2.36,2.36,0,0,1,.38,1,15.66,15.66,0,0,0,1.92,6.57,2.94,2.94,0,0,0,2.63,1.49H64.05a8.39,8.39,0,0,0,4.8-1.55,15.29,15.29,0,0,0,4.4-5.15l.34-.58c3.5-6,6.89-11.87,7.24-18.81l-.18-8c0-.11,0-.23,0-.35l0-1.89c.07-5.32.15-11.9-4.72-12.73H72.78c0,1.5-.11,3-.2,4.5-.09,1.32-.17,2.6-.17,3.81a2.37,2.37,0,0,1-4.73,0c0-1.22.09-2.64.18-4.1.32-5,.68-10.77-3.33-11.49H61.42a2.76,2.76,0,0,1-.51,0c0,1.81-.09,3.69-.2,5.5-.09,1.32-.17,2.6-.17,3.81a2.37,2.37,0,1,1-4.73,0c0-1.22.09-2.63.18-4.1.32-5,.68-10.77-3.33-11.49H49.55a2.11,2.11,0,0,1-.62-.08v9.17a2.37,2.37,0,0,1-4.74,0V39.93c0-4.11-1.68-6.71-3.82-7.8a5.48,5.48,0,0,0-2.47-.6,5.38,5.38,0,0,0-2.46.6c-2.13,1.08-3.78,3.69-3.78,7.9V83.11ZM11.92,37.63a3.12,3.12,0,1,1,0,6.23H3.11a3.12,3.12,0,0,1,0-6.23ZM20.82,19a3.12,3.12,0,0,1-4.43,4.39l-7-7A3.11,3.11,0,1,1,13.82,12l7,7Zm41,24.84a3.12,3.12,0,0,1,0-6.23h8.81a3.12,3.12,0,1,1,0,6.23ZM57.3,22.73a3.12,3.12,0,0,1-4.42-4.4l7-7a3.12,3.12,0,0,1,4.42,4.4l-7,7Zm-17-10.81a3.12,3.12,0,1,1-6.23,0V3.11a3.12,3.12,0,0,1,6.23,0v8.81Zm26.8,78.56a1.94,1.94,0,1,1,3.87,0v8.84a1.94,1.94,0,0,1-3.87,0V90.48ZM55.64,86.57a1.94,1.94,0,0,1,3.87,0V99.32a1.94,1.94,0,0,1-3.87,0V86.57ZM26.92,72.72V40c0-6.26,2.8-10.3,6.37-12.12a10.21,10.21,0,0,1,9.2,0c3.61,1.82,6.44,5.86,6.44,12V50.78a2.51,2.51,0,0,1,.62-.08h3.26a2.33,2.33,0,0,1,.53.06,7.89,7.89,0,0,1,7.08,6.49,2.36,2.36,0,0,1,1-.22h3.26a2.33,2.33,0,0,1,.53.06c4.68.72,6.57,3.6,7.24,7.24a2.22,2.22,0,0,1,.37,0h3.26a2.33,2.33,0,0,1,.53.06c9,1.38,8.85,10.29,8.76,17.47,0,3.38.1,6.76.18,10.14a2.43,2.43,0,0,1,0,.27c-.4,8.12-4.08,14.46-7.87,21l-.32.57a20.15,20.15,0,0,1-5.82,6.69,13.15,13.15,0,0,1-7.47,2.38H35.86a7.35,7.35,0,0,1-6.6-3.58,19.2,19.2,0,0,1-2.62-8.08L9,84.47a32,32,0,0,1-3.52-6,17.06,17.06,0,0,1-1.53-5.71,11.59,11.59,0,0,1,.82-5.56,6.7,6.7,0,0,1,3.64-3.58,8.25,8.25,0,0,1,4.74-.35,13.42,13.42,0,0,1,5.76,2.84c1.43,1.18,3.79,3.12,6.09,5l2,1.61Z"
					/>
				</svg>
			</div>
		);
	};

	return (
    <NavigationRouteContext.Provider
      value={{ channels: config, currentChannel: channelMeta.activeChannel }}
    >
      <main
        // TODO: Will Fix it later
        // @ts-ignore
        ref={mainRef}
        className="navigation-wrapper outline-none bg-gray-900"
        // bg-gray-900 = rgba(17,24,39,1);
        onTouchStart={touchStartHandler}
        onTouchMove={touchMoveHandler}
        onTouchEnd={touchEndHandler}
        onKeyDown={keyDownHandler}
        onKeyUp={keyUpHandler}
        tabIndex={-1}
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
              testProps={"test props"}
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
        {channelMeta.overlay === "off" && (
          <div
            className="off-overlay fixed h-screen w-screen top-0 bg-black flex flex-1 items-center justify-center text-center"
            onClick={() => {
              setOffAnimation(true);
              setTimeout(() => {
                setChannelMeta((prevState) => {
                  return {
                    ...prevState,
                    overlay: "none",
                    infoOverlay: true,
                  };
                });
              }, 1250);
            }}
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
        )}
        {channelMeta.infoOverlay && (
          <div className="flex flex-1 items-center justify-center text-lime-500">
            <div className={`absolute top-10 left-10 font-arial`}>
              <Text>
                {config[channelMeta.activeChannel]?.name ?? "No service"}
              </Text>
            </div>
            <div className="absolute top-10 right-10 font-arial tracking-widest">
              <Text>{channelNumberTemplate()}</Text>
            </div>
            {/* <div className="text-lime-500 text-2xl absolute bottom-20 font-arial">
							<GlitchText>Under construction</GlitchText>
						</div> */}
          </div>
        )}
        {probablyTouchScreen ? touchToggleTemplate() : null}

        {/* <input
				type="checkbox"
				className="absolute bottom-4 right-4 p-4 rounded-none"
				checked={globalTouchDetection}
			/> */}
      </main>
    </NavigationRouteContext.Provider>
  );
};
