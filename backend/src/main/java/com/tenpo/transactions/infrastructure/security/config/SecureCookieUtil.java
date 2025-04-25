package com.tenpo.transactions.infrastructure.security.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class SecureCookieUtil {

    private static final Logger logger = LoggerFactory.getLogger(SecureCookieUtil.class);

    @Value("${cookie.secure}")
    private boolean isSecureCookie;

    @Value("${jwt.refreshExpiration}")
    private int expirationRefresh;

    @Value("${jwt.expiration}")
    private int expirationAccess;


    public void createAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        createCookie(response, "accessToken", accessToken, expirationAccess, "Lax");
        createCookie(response, "refreshToken", refreshToken, expirationRefresh, "Strict");
    }

    public void createAccessTokenCookie(HttpServletResponse response, String name, String value) {
        addCookie(response, name, value, true, expirationAccess, "/");
    }

    public void createCookie(HttpServletResponse response, String name, String value, int expiration, String sameSite) {
        addCookie(response, name, value, true, expiration, sameSite);
    }

    public void deleteCookie(HttpServletResponse response, String cookie) {
        createCookie(response, cookie, "", 0, null);
    }

    private void addCookie(
            HttpServletResponse response,
            String name,
            String value,
            boolean httpOnly,
            int maxAge,
            String sameSite
    ) {
        StringBuilder cookieBuilder = new StringBuilder();
        cookieBuilder.append(name).append("=").append(value != null ? value : "").append(";");
        cookieBuilder.append("Path=/;");
        cookieBuilder.append("Max-Age=").append(maxAge).append(";");
        if (isSecureCookie) cookieBuilder.append("Secure;");
        if (httpOnly) cookieBuilder.append("HttpOnly;");
        if (sameSite != null && !sameSite.isEmpty()) cookieBuilder.append("SameSite=").append(sameSite).append(";");

        response.addHeader("Set-Cookie", cookieBuilder.toString());
    }

}
