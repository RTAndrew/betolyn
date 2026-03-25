import { useSignals } from '@preact/signals-react/runtime';
import React, { PropsWithChildren } from 'react';

import { authStore } from '@/stores/auth.store';

const AuthenticationGuard = ({ children }: PropsWithChildren) => {
  useSignals();
  const { isLoggedIn } = authStore;

  if (!isLoggedIn.value) {
    return <></>;
  }

  return children;
};

export default AuthenticationGuard;
