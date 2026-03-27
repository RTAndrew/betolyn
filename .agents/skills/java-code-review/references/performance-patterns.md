# Java Performance Patterns (Reference)

This file provides quick reference patterns and anti-patterns for the performance phase of the Java Code Review skill. Tailor it to your typical workloads and stack (e.g., Spring Boot, JPA/Hibernate, reactive frameworks).

## General Guidance

- Focus optimization on hot paths and high-traffic code.
- Prefer clear, correct code first; then optimize with evidence (profiling, metrics).
- Beware of premature micro-optimizations that hurt readability without measurable benefit.

## Common Performance Pitfalls

- O(n²) or worse algorithms in request handlers, schedulers, or batch jobs.
- N+1 database queries in loops (especially with ORMs).
- Repeated object allocation in tight loops (e.g., formatters, regex, builders).
- Unbounded in-memory caches or queues.
- String concatenation in loops instead of `StringBuilder` or collectors.
- Using legacy blocking I/O on scalability-critical paths where async/reactive options exist.

## Helpful Patterns

- Use `try-with-resources` for I/O to avoid leaks and clean up in a timely manner.
- Pre-size collections (`ArrayList`, `HashMap`) when size is known or easily estimated.
- Prefer bulk operations (batch inserts/updates) over per-element calls when supported.
- Cache expensive, immutable computations where appropriate (with clear invalidation).
- Use primitive collections or arrays in tight computation loops when profiling shows boxing overhead.

Extend this file with stack-specific tips (e.g., Spring Boot actuator metrics to identify bottlenecks, Hibernate configuration patterns, thread pool tuning guidelines).

