import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import CriterionSettingsScreen from '@/screens/criteria/[id]/setttings';

const CriterionSettingsRoute = () => {
  const { criterionId } = useLocalSearchParams();

  return <CriterionSettingsScreen criterionId={criterionId as string} />;
};
export default CriterionSettingsRoute;
