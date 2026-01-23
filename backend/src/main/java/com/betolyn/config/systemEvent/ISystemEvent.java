package com.betolyn.config.systemEvent;


public interface ISystemEvent {

    void publish(Object source, String eventName, Object data);

    void listen(SystemEvent event);
}
