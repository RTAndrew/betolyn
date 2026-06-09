import { useSheetRouteParams, useSheetRouter } from 'react-native-actions-sheet';

import { ISpaceMember } from '@/types';

export const SPACE_MEMBER_BOTTOM_SHEET_ID = 'space-member-bottomsheet' as const;

export type SpaceMemberBottomSheetRoutesParams = {
  main: { member: ISpaceMember };
  'add-remove-space-member-as-admin': { member: ISpaceMember };
  'remove-member-from-space': { member: ISpaceMember };
};

export type SpaceMemberBottomSheetRoute = keyof SpaceMemberBottomSheetRoutesParams;

type NavigateParamsArgs<RouteKey extends SpaceMemberBottomSheetRoute> =
  undefined extends SpaceMemberBottomSheetRoutesParams[RouteKey]
    ? [params?: SpaceMemberBottomSheetRoutesParams[RouteKey], snap?: number]
    : [params: SpaceMemberBottomSheetRoutesParams[RouteKey], snap?: number];

export type SpaceMemberBottomSheetRouter = {
  navigate: <RouteKey extends SpaceMemberBottomSheetRoute>(
    route: RouteKey,
    ...args: NavigateParamsArgs<RouteKey>
  ) => void;
  goBack: (name?: SpaceMemberBottomSheetRoute, snap?: number) => void;
  close: () => void;
  popToTop: () => void;
  canGoBack: () => boolean;
};

export type SpaceMemberBottomSheetRouteProps<RouteKey extends SpaceMemberBottomSheetRoute> = {
  router: SpaceMemberBottomSheetRouter;
  params: SpaceMemberBottomSheetRoutesParams[RouteKey];
};

export type SpaceMemberBottomSheetRouteDefinition<
  RouteKey extends SpaceMemberBottomSheetRoute = SpaceMemberBottomSheetRoute,
> = {
  name: RouteKey;
  component: any;
  params?: SpaceMemberBottomSheetRoutesParams[RouteKey];
};

export const useSpaceMemberBottomSheetRouter = (): SpaceMemberBottomSheetRouter | undefined => {
  const router = useSheetRouter(SPACE_MEMBER_BOTTOM_SHEET_ID);

  if (!router) return undefined;

  return {
    ...router,
    navigate: <RouteKey extends SpaceMemberBottomSheetRoute>(
      route: RouteKey,
      ...args: NavigateParamsArgs<RouteKey>
    ) => {
      const [params, snap] = args;
      router.navigate(route, params, snap);
    },
  };
};

export function useSpaceMemberRouteParams<RouteKey extends SpaceMemberBottomSheetRoute>(
  route: RouteKey
): SpaceMemberBottomSheetRoutesParams[RouteKey] {
  return useSheetRouteParams(
    SPACE_MEMBER_BOTTOM_SHEET_ID,
    route
  ) as SpaceMemberBottomSheetRoutesParams[RouteKey];
}
