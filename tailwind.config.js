/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{ts,tsx}", "./src/*.{ts,tsx}"],
	important: true,
	theme: {
		extend: {
			colors: {
				"color-dark-violet": "#281b49",
				"color-magenta": "#ed1c70",
				"color-red": "#EA2121",
				"color-pale-blue": "#60b2cc",
				"color-darker-grey": "#b2b2b2",
				"color-light-grey": "#868688",
				"color-light-grey2": "#dbdbdb",
				"color-violet": "#b28ec2",
				"color-lavender": "#9c96b5",
				"color-border-grey": "#EDEEF0",
				"color-bg-grey1": "#fdfdfd",
				"color-bg-grey2": "#fafafa",
				"color-grey3": "#f2f2f2",
				"color-border": "#e1e1e1",
				"color-purple": "#862EE7",
				"color-light-purple": "#ebe4ff",
				"color-dark-purple": "#261A45",
				"color-light-blue": "#86b7fe",
				"color-dashboard-bg": "#f7f8fA",
				"color-banner-green": "#00D986",
			},

			fontFamily: {
				inter: ["Inter"],
			},

			keyframes: {
				overlayShow: {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				contentShow: {
					from: {
						opacity: "0",
						transform: "translate(-50%, -48%) scale(0.96)",
					},
					to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
				},
			},
			animation: {
				overlayShow: "overlayShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
