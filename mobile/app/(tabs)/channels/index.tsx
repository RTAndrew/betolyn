import { ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import ChannelCard from '@/components/channel-card';
import { mockAPI } from '@/mock';

export default function Chanells() {
  const channels = mockAPI.getChannels();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#61687E' }}>
      <ThemedView style={{ flex: 1 }}>
        {channels.map((channel, index) => (
          <ChannelCard key={index} channel={channel} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}
