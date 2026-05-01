import React, { PropsWithChildren } from 'react';
import { ActivityIndicator } from 'react-native';

import { colors } from '@/constants/colors';
import { useGetMe, useGetSpaceById } from '@/services';

import { Button, ButtonProps } from '../button';
import EmptyState from '../empty-state';
import FullScreenCentered from '../full-screen-centered';
import { NoFolderFound } from '../illustrations';
import ScreenWrapper from '../screen-wrapper';

interface FullScreenProps extends PropsWithChildren {
  fullScreen?: boolean;
}

interface TSpaceGuardWithEmptyState extends FullScreenProps {
  spaceId: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  action?: ButtonProps;
  fallback?: never;
}

interface TSpaceGuardWithFallback extends FullScreenProps {
  spaceId: string;
  title?: never;
  description?: never;
  backgroundColor?: never;
  action?: never;
  fallback?: React.ReactNode;
}

type SpaceGuardProps = TSpaceGuardWithEmptyState | TSpaceGuardWithFallback;

// TODO: do the check based on space users table
export const useIsSpaceAdmin = (spaceId: string) => {
  const enabled = Boolean(spaceId);
  const meQuery = useGetMe({ queryOptions: { enabled } });
  const spaceQuery = useGetSpaceById({ spaceId, queryOptions: { enabled } });

  const meId = meQuery.data?.data?.user?.id;
  const createdById = spaceQuery.data?.data?.createdBy?.id;
  const isAdmin = Boolean(meId && createdById && meId === createdById);
  const isPending = meQuery.isPending || spaceQuery.isPending;

  return { isAdmin, isPending };
};

const FullScreen = ({ children, fullScreen }: FullScreenProps) => {
  if (!fullScreen) return children;

  return (
    <ScreenWrapper statusBarStyle="light-content" backgroundColor={colors.greyMedium}>
      <FullScreenCentered>{children}</FullScreenCentered>
    </ScreenWrapper>
  );
};

/**
 * Conditional rendering of a component based on the user's role in the space.
 * If no title is provided, it will return nothing.
 * Otherwise, it will return an empty state with the title, description and icon.
 * @param fullScreen - Whether to render the component in full screen
 * @param fallback - The fallback component to render if the user is not an admin
 * @param description - The description of the component
 * @param children - The children components to render if the user is an admin
 */
const SpaceGuard = ({
  fullScreen = false,
  fallback = null,
  description,
  children,
  spaceId,
  action,
  title,
}: SpaceGuardProps) => {
  const { isAdmin, isPending } = useIsSpaceAdmin(spaceId);

  if (isPending) {
    return (
      <FullScreen fullScreen={fullScreen}>
        <ActivityIndicator size="large" color={colors.white} />
      </FullScreen>
    );
  }

  if (!isAdmin) {
    if (title) {
      return (
        <FullScreen fullScreen={fullScreen}>
          <EmptyState
            title={title ?? ''}
            description={description}
            icon={<NoFolderFound width={150} height={150} fill={colors.greyLight} />}
          >
            {action && <Button.Root {...action} />}
          </EmptyState>
        </FullScreen>
      );
    }

    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default SpaceGuard;
