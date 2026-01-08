package com.betolyn.config.systemEvent;


public interface ISystemEvent<T> {

    void publish(Object source, String channel, Object data);

    void listen(SystemEvent event);
}
