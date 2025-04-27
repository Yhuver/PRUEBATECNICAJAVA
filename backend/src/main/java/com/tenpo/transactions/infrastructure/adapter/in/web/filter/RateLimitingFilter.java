package com.tenpo.transactions.infrastructure.adapter.in.web.filter;

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

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String ip = req.getRemoteAddr();
        String path = req.getRequestURI();

        String CHECK_SESSION = "/api/check-session";

        logBucketStatus(ip, path);

        if (path.startsWith(CHECK_SESSION)) {
            if (!sessionRateLimiter.resolveBucket(ip).tryConsume(1)) {
                reject(res);
                return;
            }
        }
        else {
            if (!actionRateLimiter.resolveBucket(ip, path).tryConsume(1)) {
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

    public void logBucketStatus(String ip, String path) {
        Bucket bucket = actionRateLimiter.resolveBucket(ip, path);
        long availableTokens = bucket.getAvailableTokens();
        System.out.println("Tokens disponibles para " + ip + " en la ruta " + path + ": " + availableTokens);
    }

}
