import { View, Text, TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import React, { useState } from 'react';
import { IconSymbol } from '../ui/IconSymbol';

interface CollapsibleProps extends TouchableOpacityProps {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}

export default function Collapsible({ children, title, open = false, ...props }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <View>
      <TouchableOpacity activeOpacity={1} onPress={() => setIsOpen(!isOpen)} {...props}>
        <View style={styles.titleWrapper}>
          <IconSymbol
            name="chevron.right"
            size={14}
            weight="medium"
            color={'#fff'}
            style={{
              transform: [{ rotate: isOpen ? '90deg' : '0deg' }],
            }}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableOpacity>

      {isOpen && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#495064',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    backgroundColor: '#61687E',
  },
});
