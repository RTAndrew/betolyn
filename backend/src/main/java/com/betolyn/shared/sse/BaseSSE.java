package com.betolyn.shared.sse;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class BaseSSE {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
}
