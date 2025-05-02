package com.tenpo.transactions.infrastructure.adapter.in.web.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenpo.transactions.infrastructure.exception.ErrorResponse;
import io.github.bucket4j.Bucket;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class RateLimitingFilter implements Filter {

    private final SessionRateLimiter sessionRateLimiter = new SessionRateLimiter();
    private final ActionRateLimiter actionRateLimiter = new ActionRateLimiter();
    
    private static final String AUTH_PATH_PREFIX = "/api/auth/";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String ip = req.getRemoteAddr();
        String path = req.getRequestURI();
        String method = req.getMethod();

        if (path.startsWith(AUTH_PATH_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }
        else {
            if (!actionRateLimiter.resolveBucketTransaction(ip, path, method).tryConsume(1)) {
                reject(res);
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private void reject(HttpServletResponse res) throws IOException {
        res.setStatus(429);
        res.getWriter().write("Too Many Requests");
    }
}
