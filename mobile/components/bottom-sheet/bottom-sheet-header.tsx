import React from 'react';
import { StyleSheet, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ThemedText } from '../ThemedText';
import SafeHorizontalView from '../safe-horizontal-view';
import { CloseFilled } from '../icons';

interface IHeaderWithChildren {
  title?: never;
  onClose?: never;
  onPrevious?: never;
  children: React.ReactNode;
}

interface IHeaderWithoutChildren {
  title: string;
  onClose?: () => void;
  onPrevious?: () => void;
  children?: never;
}

export type BottomSheetHeaderProps = IHeaderWithChildren | IHeaderWithoutChildren;

/**
 * Composable header supporting two modes: with children and without children.
 * With children allows the user to create and pass a custom component.
 * Without children returns a pre-defined header with a title and other options.
 */
const BottomSheetHeader = (props: BottomSheetHeaderProps) => {
  if ('children' in props) {
    return <View style={styles.root}>{props.children}</View>;
  }

  const { title, onClose, onPrevious } = props;

  return (
    <SafeHorizontalView style={styles.root}>
      {onPrevious && <AntDesign name="left" size={24} color="white" onPress={onPrevious} />}
      <ThemedText style={styles.title} type="default">
        {title}
      </ThemedText>
      {onClose && (
        <CloseFilled width={24} height={24} color="#272F3D" fill="white" onPress={onClose} />
      )}
    </SafeHorizontalView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 0.3,
    borderBottomColor: '#C7D1E7',
  },
  title: {
    fontWeight: '600',
  },
});

export default BottomSheetHeader;
