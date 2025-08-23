import { ScrollView, StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import ChannelCard from "@/components/channel-card";


export default function Chanells() {
	return (
		<ScrollView>
			<ThemedView style={{ flex: 1 }}>
				{Array.from({ length: 20 }, (_, index) => (
					<ChannelCard key={index} />
				))}
			</ThemedView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: "#808080",
		bottom: -90,
		left: -35,
		position: "absolute",
	},
	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
});
