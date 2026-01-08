package com.betolyn.config.systemEvent;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class SystemEvent extends ApplicationEvent {
    private String eventType;
    private String channel;
    private Object data;

    public SystemEvent(Object source, String eventType, String channel, Object data) {
        super(source);
        this.eventType = eventType;
        this.data = data;
        this.channel = channel;
    }
}
