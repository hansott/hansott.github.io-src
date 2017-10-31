+++
date = "2017-06-02T09:00:00+02:00"
title = "Building a Sliding Window Rate Limiter With Redis"
tags = ["Redis", "PHP"]
+++

I wrote a blogpost on our company blog about building a sliding rate limiter with Redis. Let me know what you think!

> For our Instagram crawler we needed a system to keep track of the amount of API calls we did to prevent us from hitting the rate limits. We could of course perform our HTTP requests without checking rate limits upfront, and wait until we get a 429 OAuthRateLimitException from Instagram, but that would exhaust our tokens and block us from talking efficiently to their API.
>
> https://engagor.github.io/blog/2017/05/02/sliding-window-rate-limiter-redis/
