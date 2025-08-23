import React from "react";
import {
	Image,
	StyleSheet,
	View,
	Text as _Text,
	TextProps as _TextProps,
} from "react-native";

const Text = ({ children, style, ...props }: _TextProps) => {
	return (
		<_Text style={[{ color: "white" }, style]} {...props}>
			{children}
		</_Text>
	);
};

const Team = () => {
	return (
		<View style={teamStyles.teamContent}>
			<View style={teamStyles.teamInfo}>
				<Image
					source={require("../../assets/images/badges/newcastle_united.png")}
					style={{ width: 24, height: 24 }}
				/>
				<Text className="team-name">Flamengo</Text>
			</View>

			<Text style={{color: "#C7D1E7"}}>2</Text>
		</View>
	);
};

const teamStyles = StyleSheet.create({
	teamContent: {
		gap: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	teamInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
});

const OddButton = () => {
	return (
		<View style={oddsStyles.oddButton}>
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
	},
});

export default function BetCard() {
	return (
		<View style={styles.container}>
			<Text style={styles.cardTitle}>Futebol 100%</Text>

			<View style={styles.content}>
				<View style={styles.teamBody}>
					<View style={styles.teamWrapper}>
						<Team />
						<Team />
					</View>

					<View style={styles.betInfo}>
						<View style={styles.divider} />
						<Text style={{color: "#C7D1E7"}}>100</Text>
					</View>
				</View>

				<View style={styles.oddsWrapper}>
					<OddButton />
					<OddButton />
					<OddButton />
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		color: "white",
		paddingVertical: 10,
		borderBottomWidth: 0.3,
		borderBottomColor: "#C7D1E7",
		flexDirection: "column",
	},
	content: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	teamBody: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
	},
	teamWrapper: {
		flexDirection: "column",
		flex: 1,
		gap: 15,
	},
	betInfo: {
		height: 100,
		flexDirection: "row",
		alignItems: "center",
    justifyContent: "center",
	},
	divider: {
		width: 0.3,
		marginHorizontal: 10,
		height: "90%",
		backgroundColor: "#C7D1E7",
	},
  oddsWrapper: {
    marginLeft: 50,
		flexDirection: "column",
		gap: 10,
	},
	cardTitle: {
		color: "#C7D1E7",
		fontStyle: "italic",
	},
});
