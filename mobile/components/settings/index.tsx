import { Right } from '@/components/icons';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { hexToRgba } from '@/utils/hex-rgba';
import React, { cloneElement, isValidElement, ReactNode } from 'react';
import { type ViewStyle, Pressable, StyleSheet, View } from 'react-native';

const BACKGROUND_COLOR = colors.greyLight;
const BORDER_COLOR = colors.greyMedium;
const MUTED_TEXT_COLOR = hexToRgba(colors.greyLighter, 0.8);
const BORDER_RADIUS = 12;
const ITEM_PADDING_V = 12;
const ITEM_PADDING_H = 16;

export interface SettingsItemProps {
  title: ReactNode;
  inGroup?: boolean;
  style?: ViewStyle;
  subtitle?: ReactNode;
  onPress?: () => void;
  description?: ReactNode;
  suffixIcon?: true | ReactNode;
}

const renderNode = (node: ReactNode, style: object, wrap = false) => {
  if (typeof node === 'string' || typeof node === 'number') {
    return (
      <ThemedText style={style} numberOfLines={wrap ? undefined : 1}>
        {node}
      </ThemedText>
    );
  }
  return node;
};

const SettingsItem = ({
  suffixIcon = true,
  inGroup = false,
  description,
  subtitle,
  title,
  style,
  onPress,
}: SettingsItemProps) => {
  const hasSubtitle = subtitle != null;
  const hasDescription = description != null;

  const content = (
    <View style={styles.component}>
      <View style={styles.body}>
        {renderNode(title, styles.title, true)}
        {hasSubtitle && (
          <View style={styles.subtitleRow}>{renderNode(subtitle, styles.subtitle, true)}</View>
        )}
      </View>

      <View style={styles.footer}>
        {hasDescription && renderNode(description, styles.footerDescription, true)}
        {suffixIcon !== false && (
          <View style={styles.arrow}>
            {suffixIcon === true ? (
              <View>
                <Right width={10} height={10} color={MUTED_TEXT_COLOR} />
              </View>
            ) : (
              suffixIcon
            )}
          </View>
        )}
      </View>
    </View>
  );

  const itemStyle = [styles.item, !inGroup && styles.itemStandalone, style];

  if (onPress != null) {
    return (
      <Pressable style={itemStyle} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={itemStyle}>{content}</View>;
};

export interface SettingsItemGroupProps {
  title?: ReactNode;
  children: ReactNode;
  style?: ViewStyle;
}

const SettingsItemGroup = ({ title, children, style }: SettingsItemGroupProps) => {
  const childArray = React.Children.toArray(children);

  return (
    <View style={style}>
      {title != null && (
        <View style={styles.groupTitleWrap}>
          {typeof title === 'string' ? (
            <ThemedText style={styles.groupTitle}>{title}</ThemedText>
          ) : (
            title
          )}
        </View>
      )}

      <View style={styles.group}>
        {childArray.map((child, index) => {
          const isLast = index === childArray.length - 1;
          const wrapped =
            isValidElement(child) && typeof child.type !== 'string'
              ? cloneElement(child as React.ReactElement<SettingsItemProps>, { inGroup: true })
              : child;
          return (
            <View key={index} style={[styles.groupItemWrap, !isLast && styles.groupItemBorder]}>
              {wrapped}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS,
    backgroundColor: BACKGROUND_COLOR,
  },
  groupTitleWrap: {
    paddingBottom: 8,
    paddingHorizontal: ITEM_PADDING_H,
  },
  groupTitle: {
    color: colors.greyLighter,
    fontWeight: '600',
  },
  groupItemWrap: {},
  groupItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    minHeight: 44,
    paddingVertical: ITEM_PADDING_V,
    paddingHorizontal: ITEM_PADDING_H,
  },
  itemStandalone: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: BORDER_RADIUS,
  },
  component: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,

    minWidth: 0,
  },
  body: {
    flex: 1,
    gap: 2,

    minWidth: 0,
  },
  title: {
    color: colors.white,
    fontWeight: '600',
  },
  subtitleRow: {
    marginTop: 2,
  },
  subtitle: {
    color: MUTED_TEXT_COLOR,
  },
  footer: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerDescription: {
    fontSize: 14,
    color: colors.greyLighter50,
  },
  arrow: {
    flexShrink: 0,
  },
});

export const Settings = {
  Item: SettingsItem,
  ItemGroup: SettingsItemGroup,
};
