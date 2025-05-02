package com.tenpo.transactions.infrastructure.adapter.in.web.filter;

import io.github.bucket4j.Bucket;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ActionRateLimiter {

    private final Map<String, Bucket> userEndpointBuckets = new ConcurrentHashMap<>();
    private static final String TRANSACTION_BASE_PATH = "/api/transaction";

    public Bucket resolveBucketTransaction(String ip, String endpoint, String method) {
        String normalizedEndpoint = normalizeEndpoint(endpoint);
        
        String key = ip + ":" + normalizedEndpoint + ":" + method;

        return userEndpointBuckets.computeIfAbsent(key, k -> {
            return Bucket.builder()
                    .addLimit(limit-> limit.capacity(3).refillIntervally(3, Duration.ofMinutes(1)))
                    .build();
        });
    }

    public Bucket resolveBucket(String ip, String endpoint) {
        return resolveBucketTransaction(ip, endpoint, "ANY");
    }

    public Bucket resolveBucket(String endpoint) {
        return resolveBucketTransaction(null, endpoint, "ANY");
    }

    private String normalizeEndpoint(String endpoint) {
        if (endpoint.startsWith(TRANSACTION_BASE_PATH) && endpoint.length() > TRANSACTION_BASE_PATH.length()) {
            return TRANSACTION_BASE_PATH + "/{id}";
        }
        return endpoint;
    }
}
