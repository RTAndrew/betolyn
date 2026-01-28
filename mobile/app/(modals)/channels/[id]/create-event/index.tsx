import React, { useState } from 'react';
import ChannelSearchMatches from './components/channel-search-matches';
import ChannelSelectCriteria from './components/select-criteria';
import ChannelCreateOdds from './components/create-odds';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateEventHeader from './components/create-event-header';
import { router } from 'expo-router';
import { IMatch } from '@/types';

type TScreen = 'search-matches' | 'select-criteria' | 'create-odds';

const CreateChannelEvent = () => {
  const [selectedMatch, setSelectedMatch] = useState<IMatch | null>(null);
  const [screen, setScreen] = useState<TScreen[]>(['search-matches']);

  const pushScreen = (screen: TScreen) => {
    setScreen((prev) => [...prev, screen]);
  };
  const popScreen = () => {
    if (screen.length === 1) {
      router.back();
      return;
    }
    setScreen(screen.slice(0, -1));
  };

  const renderScreen = () => {
    switch (screen[screen.length - 1]) {
      case 'search-matches':
        return (
          <ChannelSearchMatches
            onMatchPress={(m) => {
              setSelectedMatch(m);
              pushScreen('select-criteria');
            }}
          />
        );
      case 'select-criteria': {
        if (!selectedMatch) {
          return null;
        }

        return (
          <ChannelSelectCriteria
            match={selectedMatch}
            onSelectCriteria={(criteria) => {
              pushScreen('create-odds');
            }}
          />
        );
      }
      case 'create-odds': {
        if (!selectedMatch) {
          return null;
        }

        return <ChannelCreateOdds match={selectedMatch} onSave={() => router.back()} />;
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#61687E' }}>
      <CreateEventHeader onClose={() => popScreen()} type={screen.length > 1 ? 'back' : 'close'} />
      {renderScreen()}
    </SafeAreaView>
  );
};

export default CreateChannelEvent;
