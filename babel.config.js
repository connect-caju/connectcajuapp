/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
module.exports = {
	presets: ["module:metro-react-native-babel-preset"],
	env: {
		production: {
			plugins: ["react-native-paper/babel"],
		},
	},
	plugins: [
		[
			"react-native-reanimated/plugin", {
				relativeSourceLocation: true,
			},
		],
		"nativewind/babel",
		
	],
};
