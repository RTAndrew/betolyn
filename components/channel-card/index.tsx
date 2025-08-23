import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const ChannelCard = () => {
	return (
		<View style={styles.container}>
			<View style={styles.image}>
				<Image
					resizeMode="contain"
					source={require("../../assets/images/badges/newcastle_united.png")}
				/>
			</View>

			<View style={styles.body}>
				<View style={styles.descriptionAndTime}>
					<Text style={styles.name}>Amantes Convictos de Luta Livre</Text>
					<Text style={styles.description}>
						Conor McGregor vs Khabib Nurmagomedov
					</Text>
				</View>

				<View style={[styles.descriptionAndTime, { alignItems: "flex-end" }]}>
					<Text style={styles.time}>21:47</Text>
					<Text style={styles.remainingUsers}>100</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		height: "auto",
		gap: 15,
	},

	body: {
    paddingVertical: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		flex: 1,
		height: "auto",

		borderBottomWidth: 0.25,
		borderBottomColor: "#C7D1E7",
	},
	image: {
		width: 45,
		height: 45,
		borderRadius: 100,
		// transform: [{ scale: 0.8 }],
	},
	name: {
		color: "#fff",
	},
	description: {
		fontSize: 10,
		color: "#C7D1E7",
	},
	time: {
		color: "#fff",
		fontSize: 10,
	},
	descriptionAndTime: {
		flexDirection: "column",
		gap: 5,
	},
	remainingUsers: {
		fontSize: 14,
		borderRadius: 100,
		fontWeight: "600",
		color: "#61687E",
		backgroundColor: "#FFF7D6",
		paddingVertical: 2,
		paddingHorizontal: 5,
	},
});

export default ChannelCard;
