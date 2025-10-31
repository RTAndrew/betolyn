import { ThemedView } from '@/components/ThemedView';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CreateEventHeaderProps {
  onClose: () => void;
  type: 'close' | 'back';
}

const CreateEventHeader = ({ onClose, type }: CreateEventHeaderProps) => {
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={onClose}>
        <View style={styles.headerIcon}>
          <AntDesign name={type === 'close' ? 'close' : 'left'} size={18} color="white" />
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    marginBottom: 16,
  },
  headerIcon: {
    backgroundColor: '#485164',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateEventHeader;
