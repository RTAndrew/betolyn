import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import BetCard from "@/components/bet-card";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

const ChannelId = () => {
	return (
		<ScrollView>
			<View style={styles.headerContainer}>
				<ThemedView style={styles.header}>
					<View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>

						<AntDesign
							name="arrowleft"
							size={24}
							color="white"
              />
              </TouchableOpacity>
						<View
							style={styles.imageContainer}
						>
							<Image
								source={{ uri: "https://picsum.photos/200/300" }}
								style={{ width: 100, height: 100 }}
							/>
						</View>

						<TouchableOpacity onPress={() => router.push("/channels/1/info")}>

						<Text style={styles.headerTitle}>
							Campeonato Futebol de Praia (Samba)...
						</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.headerRight}>
						<AntDesign name="message1" size={24} color="white" />
					</View>
				</ThemedView>
			</View>

			<ThemedView style={{ flex: 1 }}>
				<>
					{Array.from({ length: 10 }).map((_, index) => (
						<BetCard key={index} />
					))}
				</>
			</ThemedView>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		backgroundColor: "#485164",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "transparent",
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	imageContainer: {
		width: 24,
		height: 24,
		borderRadius: 100,
		overflow: "hidden",
	},
	headerTitle: {
		color: "white",
	},
});

export default ChannelId;
