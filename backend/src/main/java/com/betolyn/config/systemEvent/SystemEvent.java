package com.betolyn.config.systemEvent;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class SystemEvent extends ApplicationEvent {
    private Object payload;
    private String domain;
    private String eventName;

    public SystemEvent(Object source, String domain, String eventName, Object payload) {
        super(source);
        this.domain = domain;
        this.payload = payload;
        this.eventName = eventName;
    }
}
