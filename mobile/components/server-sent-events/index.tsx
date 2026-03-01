import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import EventSource from 'react-native-sse';

import { env } from '@/constants/env';

import ListenerFactory from './event-listeners/sse-listener-factory';

const connectToStream = () => {
  const eventSource = new EventSource(`${env.backendApiUrl}/stream`);

  eventSource.addEventListener('close', () => console.log('[SSE] Disconnected from the stream'));
  eventSource.addEventListener('open', () => console.log('[SSE] Connected to the stream'));

  eventSource.addEventListener('message', (event) => {
    const listenener = ListenerFactory.createListener(event);
    listenener.handleEvent();
  });

  return eventSource;
};

const StreamEventSource = () => {
  useEffect(() => {
    const eventSource = connectToStream();

    // connect to the stream when only the app is active (being used)
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        eventSource.open();
      } else {
        eventSource.close();
      }
    });

    return () => {
      appState.remove();
      eventSource.close();
    };
  }, []);

  return <></>;
};

export default StreamEventSource;
