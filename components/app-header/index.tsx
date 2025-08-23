import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

const AppHeader = () => {
  return (
		<View style={styles.header}>
			<Link href="/">Logo</Link>
			<ThemedText style={{ color: "black" }}>Kart</ThemedText>
		</View>
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

export default AppHeader;
