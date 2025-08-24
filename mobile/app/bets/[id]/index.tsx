import { OddButton } from '@/components/odd-button';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Image, Text, View, ViewProps } from 'react-native';

const BetOdd = () => {
  return (
    <View
      style={{
        width: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        flex: 1,
      }}
    >
      <View style={{ width: 80, height: 80, borderRadius: 100, overflow: 'hidden' }}>
        <Image
          source={require('@/assets/images/beach_soccer_cup.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      <Text style={{ color: 'white', maxWidth: '70%', textAlign: 'center' }}>Conor McGregor</Text>
    </View>
  );
};

const Section = ({ children, style }: ViewProps) => {
  return (
    <View
      style={[
        {
          paddingVertical: 20,
          borderColor: '#C7D1E7',
          borderTopWidth: 0.25,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const BetPageId = () => {
  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#495064' }}>
      {/* Highlight */}
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          paddingVertical: 30,
        }}
      >
        <Text style={{ color: '#C7D1E7', marginBottom: 10 }}>UFC</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <BetOdd />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>vs</Text>
          <BetOdd />
        </View>
      </View>

      {/* Main Bet */}
      <Section
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <OddButton style={{ flex: 1 }} />
        <OddButton style={{ flex: 1 }} />
        <OddButton style={{ flex: 1 }} />
      </Section>

      {/* RealTime Bet Odds */}
      <Section style={{ borderBottomWidth: 0.25 }}>
        <Text style={{ color: '#C7D1E7', marginBottom: 5 }}>Critérios em tempo real</Text>
        <Text style={{ color: 'white', marginBottom: 10, fontWeight: '600' }}>
          Quem irá vencer por Knockout?
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <OddButton style={{ flex: 1 }} />
          <OddButton style={{ flex: 1 }} />
        </View>
      </Section>
    </ThemedView>
  );
};

export default BetPageId;
