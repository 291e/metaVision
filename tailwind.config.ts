import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			aspectRatio: {
				"1/1": "1/1",
			},
			colors: {
				meta: "#339DFF",
			},
			animation: {
				"fade-in": "fade-in 1s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both",
				"scale-in-top": "scale-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
				"scale-in-center": "scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
			},
			keyframes: {
				"fade-in": {
					"0%": {
						opacity: "0",
					},
					to: {
						opacity: "1",
					},
				},
				"scale-in-top": {
					"0%": {
						transform: "scale(0)",
						"transform-origin": "50% 0%",
						opacity: "1",
					},
					to: {
						transform: "scale(1)",
						"transform-origin": "50% 0%",
						opacity: "1",
					},
				},
				"scale-in-center": {
					"0%": {
						transform: "scale(0)",
						opacity: "1",
					},
					to: {
						transform: "scale(1)",
						opacity: "1",
					},
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/aspect-ratio"),
		require("@tailwindcss/container-queries"),
		require("daisyui"),
	],
};
export default config;
