import { useSignals } from '@preact/signals-react/runtime';
import { useMemo } from 'react';

import { useGetMySpaceMembership } from '@/services/spaces/space-query';
import { authStore } from '@/stores/auth.store';

/** Platform users may mutate any match; otherwise space matches require space admin
 * So, you can pass the spaceId instead of the entire match object
 */
export function useCanMutateSpace(spaceId?: string | null) {
  useSignals();
  const authenticatedUser = authStore.user.peek()?.user;

  const isPlatformUser = authenticatedUser?.role === 'PLATFORM_USER';
  const needsSpaceMembershipCheck = !isPlatformUser && Boolean(spaceId);

  const membershipQuery = useGetMySpaceMembership({
    spaceId: spaceId ?? '',
    queryOptions: {
      enabled: needsSpaceMembershipCheck,
    },
  });

  const isMatchActionPermissionPending = needsSpaceMembershipCheck && membershipQuery.isPending;

  const canMutateMatchActions = useMemo(() => {
    if (isPlatformUser) return true; // platform users can mutate any match
    if (!spaceId) return false;
    if (membershipQuery.isPending) return false;
    if (membershipQuery.isError) return false;
    return membershipQuery.data?.data?.isSpaceAdmin === true;
  }, [
    isPlatformUser,
    membershipQuery.data,
    membershipQuery.isError,
    membershipQuery.isPending,
    spaceId,
  ]);

  return { canMutateMatchActions, isMatchActionPermissionPending };
}
