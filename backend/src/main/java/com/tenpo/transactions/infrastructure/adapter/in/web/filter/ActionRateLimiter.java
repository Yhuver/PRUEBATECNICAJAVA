package com.tenpo.transactions.infrastructure.adapter.in.web.filter;

import io.github.bucket4j.Bucket;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ActionRateLimiter {

    private final Map<String, Bucket> userEndpointBuckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String ip, String endpoint) {
        String key = ip + ":" + endpoint;

        return userEndpointBuckets.computeIfAbsent(key, k -> {
            return Bucket.builder()
                    .addLimit(limit-> limit.capacity(3).refillIntervally(3, Duration.ofMinutes(1)))
                    .build();
        });
    }

    public Bucket resolveBucket(String endpoint) {
        return resolveBucket(null, endpoint);
    }
}
