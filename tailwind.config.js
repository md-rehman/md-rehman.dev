module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				body: ['"Edu QLD Beginner"', "serif"],
				sans: ['"Edu QLD Beginner"', "serif"],
				serif: ['"Edu QLD Beginner"', "serif"],
				bubble: ['"Bubblegum Sans"', "serif"],
				chalk: ['"Cabin Sketch"', "serif"],
				silkscreen: ["Silkscreen", "serif"],
				arial: ["arial"],
				death_note_1: ["death_note_1"],
				death_note_2: ["death_note_2"],
			},
			colors: {
				lime: {
					50: "#f7fee7",
					100: "#ecfccb",
					200: "#d9f99d",
					300: "#bef264",
					400: "#a3e635",
					500: "#84cc16",
					600: "#65a30d",
					700: "#4d7c0f",
					800: "#3f6212",
					900: "#365314",
				},
			},
			keyframes: {
				blink: {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
			},
			animation: {
				blink: "blink .3s linear infinite alternate",
			},
		},
	},
	plugins: [],
};
