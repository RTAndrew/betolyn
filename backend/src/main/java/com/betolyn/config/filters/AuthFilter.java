package com.betolyn.config.filters;

import com.betolyn.features.auth.AuthService;
import com.betolyn.features.auth.JwtTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthFilter extends OncePerRequestFilter {
    private final JwtTokenService tokenService;
    private final AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverTokenFromRequest(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }


        if (!tokenService.isValid(token)) {
            throw new RuntimeException("Invalid auth token detected");
        }

        var decodedToken = tokenService.decode(token);
        if (!authService.isSessionValid(decodedToken)) {
            throw new RuntimeException("The current session is invalid");
        }

        // 1. Create an empty context (to avoid race conditions across multiple threads in production)
        var securityContext = SecurityContextHolder.createEmptyContext();
        var authentication = new UsernamePasswordAuthenticationToken(decodedToken, null, List.of());
        securityContext.setAuthentication(authentication);

        // 2. Set the SecurityContextHolder with context
        // Spring uses this information for authorization
        SecurityContextHolder.setContext(securityContext);

        filterChain.doFilter(request, response);
    }


    @Nullable
    private String recoverTokenFromRequest(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}