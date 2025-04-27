package com.tenpo.transactions.infrastructure.adapter.in.web.filter;

import io.github.bucket4j.Bucket;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

public class SessionRateLimiter {

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String key) {
        return buckets.computeIfAbsent(key, this::newBucket);
    }

    private Bucket newBucket(String key) {
        return Bucket.builder()
                .addLimit(limit-> limit.capacity(50).refillIntervally(50, Duration.ofMinutes(3)))
                .build();
    }
}
