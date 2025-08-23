import { StyleSheet, Text, View, ViewProps } from "react-native";


export const OddButton = ({style, ...props}: ViewProps) => {
	return (
		<View style={[oddsStyles.oddButton, style]} {...props}>
			<Text style={oddsStyles.oddText}>1.00</Text>
		</View>
	);
};

const oddsStyles = StyleSheet.create({
	oddButton: {
		backgroundColor: "transparent",
		borderWidth: 2,
		borderColor: "#F3C942",
		borderRadius: 100,
		paddingVertical: 5,
		paddingHorizontal: 20,
	},
	oddText: {
		color: "#F3C942",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
});

