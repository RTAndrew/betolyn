import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import BetSlipIdScreen from '@/screens/betslips/history/[id]';

const BetSlipId = () => {
  const { id, type } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, flexGrow: 1, height: '100%' }}>
      <BetSlipIdScreen id={id as string} type={type as 'single' | 'multiple'} />
    </View>
  );
};

export default BetSlipId;
