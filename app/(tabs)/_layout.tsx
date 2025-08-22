import { Link, Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabLayout() {
	return (
		<>
			<View style={styles.header}>
				<Link href="/">Logo</Link>
				<ThemedText style={{ color: "black" }}>Kart</ThemedText>
			</View>

			<Tabs
				screenOptions={{
					tabBarActiveTintColor: "#F3CA41",
					headerShown: false,
					tabBarButton: HapticTab,
					tabBarStyle: Platform.select({
						ios: {
							// Use a transparent background on iOS to show the blur effect
							position: "absolute",
							backgroundColor: "#262F3D",
						},
						default: {
							backgroundColor: "#262F3D",
						},
					}),
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "Apostas",
						tabBarIcon: ({ color }) => (
							<IconSymbol size={28} name="house.fill" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="explore"
					options={{
						title: "Canais",
						tabBarIcon: ({ color }) => (
							<IconSymbol size={28} name="paperplane.fill" color={color} />
						),
					}}
				/>
			</Tabs>
		</>
	);
}

const styles = StyleSheet.create({
	header: {
		marginTop: 40,
		paddingHorizontal: 20,
		paddingVertical: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});
