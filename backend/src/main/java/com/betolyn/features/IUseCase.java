package com.betolyn.features;

public interface IUseCase<P, R> {
    R execute(P param);
}
