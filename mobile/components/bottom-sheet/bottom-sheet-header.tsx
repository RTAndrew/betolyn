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
  description?: React.ReactNode;
  onClose?: () => void;
  onPrevious?: () => void;
  children?: never;
}

export type BottomSheetHeaderProps = IHeaderWithChildren | IHeaderWithoutChildren;

interface _TitleWithDescription {
  title: string;
  children?: never;
  description?: React.ReactNode;
}

interface _TitleWithChildren {
  title: string;
  description?: never;
  children: React.ReactNode;
}

type TTitleProps = _TitleWithDescription | _TitleWithChildren;
const Title = (props: TTitleProps) => {
  if ('children' in props) {
    return <View style={styles.titleContainer}>
      <ThemedText style={styles.title} type="default">
        {props.title}
      </ThemedText>
      {props.children}
    </View>;
  }

  return (
    <View style={styles.titleContainer}>
      <ThemedText style={styles.title} type="default">
        {props.title}
      </ThemedText>
      {props.description && <ThemedText style={styles.description} type="default">{props.description}</ThemedText>}
    </View>

  );
};

/**
 * Composable header supporting two modes: with children and without children.
 * With children allows the user to create and pass a custom component.
 * Without children returns a pre-defined header with a title and other options.
 */
const BottomSheetHeader = (props: BottomSheetHeaderProps) => {
  if ('children' in props) {
    return <View style={styles.root}>{props.children}</View>;
  }

  const { title, onClose, onPrevious, description } = props;
  const shouldCenter = Boolean(!onClose && !onPrevious);

  return (
    <SafeHorizontalView style={shouldCenter ? { ...styles.root, justifyContent: 'center' } : { ...styles.root, justifyContent: 'space-between' }}>
      {onPrevious && <AntDesign name="left" size={24} color="white" onPress={onPrevious} />}

      <Title title={title} description={description} />

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
    paddingBottom: 16,
    marginTop: 4,
    marginBottom: 24,
    borderBottomWidth: 0.3,
    borderBottomColor: '#C7D1E7',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    marginTop: -4,
    fontSize: 12,
    color: '#C7D1E7',
  },
});

export default BottomSheetHeader;
