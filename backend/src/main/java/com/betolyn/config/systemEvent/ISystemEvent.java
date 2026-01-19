package com.betolyn.config.systemEvent;


public interface ISystemEvent {

    void publish(Object source, String channel, Object data);

    void listen(SystemEvent event);
}
