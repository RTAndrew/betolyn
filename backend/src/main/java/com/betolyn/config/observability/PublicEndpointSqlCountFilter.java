package com.betolyn.config.observability;

import java.io.IOException;
import java.util.Set;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.ttddyy.dsproxy.QueryCountHolder;

/**
 * Adds {@code X-Perf-Sql-Count} and {@code X-Perf-Total-Ms} response headers and logs SQL
 * totals for selected public read endpoints. Requires datasource-proxy on the classpath.
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.observability.sql-count", name = "enabled", havingValue = "true")
public class PublicEndpointSqlCountFilter extends OncePerRequestFilter {

    static final String HEADER_SQL_COUNT = "X-Perf-Sql-Count";
    public static final String HEADER_TOTAL_MS = "X-Perf-Total-Ms";

    private static final Set<String> TRACKED_EXACT_PATHS = Set.of(
            "/matches",
            "/teams",
            "/debug/perf/ping",
            "/debug/perf/db-ping",
            "/debug/perf/teams/query",
            "/debug/perf/teams/raw",
            "/debug/perf/matches/query",
            "/debug/perf/matches/raw",
            "/debug/perf/matches/dto",
            "/debug/perf/matches/sql"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (!shouldTrack(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        QueryCountHolder.clear();
        long startedAt = System.nanoTime();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long elapsedMs = (System.nanoTime() - startedAt) / 1_000_000L;
            long sqlCount = QueryCountHolder.getGrandTotal().getTotal();
            if (!response.isCommitted()) {
                response.setHeader(HEADER_SQL_COUNT, String.valueOf(sqlCount));
                response.setHeader(HEADER_TOTAL_MS, String.valueOf(elapsedMs));
            }
            log.info(
                    "perf endpoint={} method={} sqlCount={} elapsedMs={}",
                    request.getRequestURI(),
                    request.getMethod(),
                    sqlCount,
                    elapsedMs
            );
        }
    }

    private static boolean shouldTrack(HttpServletRequest request) {
        if (!"GET".equalsIgnoreCase(request.getMethod())) {
            return false;
        }
        return TRACKED_EXACT_PATHS.contains(request.getRequestURI());
    }
}
