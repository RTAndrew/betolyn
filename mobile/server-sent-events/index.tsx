import React, { useEffect } from 'react';
import EventSource from 'react-native-sse';
import ListenerFactory from './event-listeners/sse-listener-factory';
import { AppState } from 'react-native';

const connectToStream = () => {
  const eventSource = new EventSource('http://192.168.178.76:8080/stream');

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
