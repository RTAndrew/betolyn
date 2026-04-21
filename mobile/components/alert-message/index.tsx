import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ErrorFilled, Warning } from '@/components/icons';

import { ThemedText } from '../ThemedText';

export interface AlertMessageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  textColor?: string;
}

function AlertMessage({
  title,
  description,
  icon,
  style,
  backgroundColor,
  textColor,
}: AlertMessageProps) {
  return (
    <View style={[styles.container, backgroundColor !== undefined && { backgroundColor }, style]}>
      {icon}
      <View style={styles.content}>
        <ThemedText style={[styles.title, textColor !== undefined && { color: textColor }]}>
          {title}
        </ThemedText>
        {description ? (
          <ThemedText style={[styles.description, textColor !== undefined && { color: textColor }]}>
            {description}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

export interface AlertMessageErrorProps {
  title: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

function AlertMessageError({ title, description, style }: AlertMessageErrorProps) {
  return (
    <AlertMessage
      title={title}
      description={description}
      icon={<ErrorFilled width={18} height={18} color="#A8200D" />}
      backgroundColor="#FFD7EF"
      textColor="#A8200D"
      style={style}
    />
  );
}

/** Same structure as error: dark accent + soft tint (amber / warm yellow). */
const WARNING_ICON_AND_TEXT = '#B45309';
const WARNING_BACKGROUND = '#FFF4E6';

export interface AlertMessageWarningProps {
  title: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

function AlertMessageWarning({ title, description, style }: AlertMessageWarningProps) {
  return (
    <AlertMessage
      title={title}
      description={description}
      icon={<Warning width={18} height={18} color={WARNING_ICON_AND_TEXT} />}
      backgroundColor={WARNING_BACKGROUND}
      textColor={WARNING_ICON_AND_TEXT}
      style={style}
    />
  );
}

AlertMessage.Error = AlertMessageError;
AlertMessage.Warning = AlertMessageWarning;
export default AlertMessage;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  content: {
    flexShrink: 1,
    alignItems: 'flex-start',
  },
  title: {
    flexShrink: 1,
    fontWeight: '500',
  },
  description: {
    marginTop: 4,
    fontWeight: '400',
  },
});
