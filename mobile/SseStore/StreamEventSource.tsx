import React, { useEffect } from 'react'
import EventSource, { MessageEvent } from "react-native-sse";
import ListenerFactory from './event-listeners';



const StreamEventSource = () => {

  const onListener = (event: MessageEvent) => {
    const listenener = ListenerFactory.createListener(event);
    listenener.handleEvent();
  }

  const connection = () => {
    const evtSource = new EventSource("http://192.168.178.110:8080/stream")

    return evtSource
  }

  useEffect(() => {
    const evtSource = connection()
    evtSource.addEventListener("message", onListener)

    evtSource.addEventListener("close", () => console.log("Disconnected from the stream"))
    evtSource.addEventListener("open", () => console.log("Connected to the stream"))
    return () => {
      evtSource.close()
    }

  }, [])


  return (
    <></>
  )
}

export default StreamEventSource