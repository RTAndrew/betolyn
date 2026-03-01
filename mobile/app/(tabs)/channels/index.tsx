import { ScrollView } from 'react-native';

import ChannelCard from '@/components/channel-card';
import { ThemedView } from '@/components/ThemedView';
import { colors } from '@/constants/colors';
import { mockAPI } from '@/mock';

export default function Chanells() {
  const channels = mockAPI.getChannels();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.greyLight }}>
      <ThemedView style={{ flex: 1 }}>
        {channels.map((channel, index) => (
          <ChannelCard key={index} channel={channel} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}
