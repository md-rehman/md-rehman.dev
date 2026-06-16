import { useState, useRef, useEffect } from "react";

const OVERLAY_DURATION = 600;
const INFO_OVERLAY_DURATION = 2600;

export type ChannelMeta = {
	activeChannel: number;
	prevChannel: number;
	overlay: "noise" | "blueScreen" | "off" | "none";
	infoOverlay: boolean;
	channelNumber: "setting" | "fixed";
};

export const useTvChannelManager = (config: any, initialChannel: number) => {
	const [channelMeta, setChannelMeta] = useState<ChannelMeta>({
		activeChannel: initialChannel,
		prevChannel: initialChannel,
		overlay: "noise",
		infoOverlay: true,
		channelNumber: "fixed",
	});

	const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const infoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const changeChannel = (channel: number) => {
		if (channel < 0 || channel > 999) return;

		// Clear any existing timeouts to avoid race conditions
		if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
		if (infoTimeoutRef.current) clearTimeout(infoTimeoutRef.current);

		setChannelMeta((prevState) => {
			overlayTimeoutRef.current = setTimeout(() => {
				setChannelMeta((prevState) => {
					return {
						...prevState,
						overlay: config[prevState.activeChannel] ? "none" : "blueScreen",
						infoOverlay: true,
					};
				});
			}, OVERLAY_DURATION);

			infoTimeoutRef.current = setTimeout(() => {
				setChannelMeta((prevState) => {
					return {
						...prevState,
						infoOverlay: false,
					};
				});
			}, INFO_OVERLAY_DURATION);

			return {
				activeChannel: channel,
				prevChannel: prevState.activeChannel,
				overlay: "noise",
				infoOverlay: true,
				channelNumber: "fixed",
			};
		});
	};

	// Synchronize state when URL changes (e.g. back/forward browser navigation)
	useEffect(() => {
		const handlePopState = () => {
			const path = window.location.pathname;
			const match = path.match(/^\/(\d+)$/);
			if (match && match[1]) {
				const channelId = parseInt(match[1], 10);
				if (!isNaN(channelId) && channelId !== channelMeta.activeChannel) {
					changeChannel(channelId);
				}
			}
		};

		window.addEventListener("popstate", handlePopState);
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [channelMeta.activeChannel]);

	// Update browser URL path when active channel changes
	useEffect(() => {
		if (channelMeta.activeChannel !== undefined) {
			const targetUrl = `/${channelMeta.activeChannel}`;
			if (window.location.pathname !== targetUrl) {
				window.history.pushState(null, "", targetUrl);
			}
		}
	}, [channelMeta.activeChannel]);

	// Set initial timers on mount for first channel noise transition
	useEffect(() => {
		overlayTimeoutRef.current = setTimeout(() => {
			setChannelMeta((prevState) => {
				return {
					...prevState,
					overlay: config[prevState.activeChannel] ? "none" : "blueScreen",
					infoOverlay: true,
				};
			});
		}, OVERLAY_DURATION);

		infoTimeoutRef.current = setTimeout(() => {
			setChannelMeta((prevState) => {
				return {
					...prevState,
					infoOverlay: false,
				};
			});
		}, INFO_OVERLAY_DURATION);

		return () => {
			if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
			if (infoTimeoutRef.current) clearTimeout(infoTimeoutRef.current);
		};
	}, []);

	const nextChannel = () => {
		if (channelMeta.activeChannel < 999) {
			changeChannel(channelMeta.activeChannel + 1);
		}
	};

	const prevChannel = () => {
		if (channelMeta.activeChannel > 0) {
			changeChannel(channelMeta.activeChannel - 1);
		}
	};

	return {
		channelMeta,
		setChannelMeta,
		changeChannel,
		nextChannel,
		prevChannel,
	};
};
