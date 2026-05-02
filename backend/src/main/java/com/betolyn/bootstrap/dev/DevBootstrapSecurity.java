package com.betolyn.bootstrap.dev;

import org.springframework.http.HttpMethod;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

/**
 * {@code permitAll} POST paths used only for local / reset workflows and the Node
 * {@code seed/seed.js} script. Keep this list short; do not add general API routes here—production
 * reviewers should treat changes here as high signal.
 */
public final class DevBootstrapSecurity {

    private DevBootstrapSecurity() {}

    /** Bankroll system accounts; seed step 0 ({@code POST /accounts/seed}). */
    public static final RequestMatcher POST_ACCOUNTS_SEED =
            PathPatternRequestMatcher.pathPattern(HttpMethod.POST, "/accounts/seed");

    /** Promotes seed usernames to {@code PLATFORM_USER}; seed step 1.5 ({@code POST /dev/seed-platform-user-roles}). */
    public static final RequestMatcher POST_DEV_SEED_PLATFORM_USER_ROLES =
            PathPatternRequestMatcher.pathPattern(HttpMethod.POST, "/dev/seed-platform-user-roles");

    public static RequestMatcher[] postPermitAllSeedMatchers() {
        return new RequestMatcher[] {
                POST_ACCOUNTS_SEED,
                POST_DEV_SEED_PLATFORM_USER_ROLES,
        };
    }
}
