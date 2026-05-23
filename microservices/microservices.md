[Back to interview](../interview.md)

# 🏗 Microservices — Patterns & Interview Scenarios

<!-- TOC -->
* [🏗 Microservices — Patterns & Interview Scenarios](#-microservices--patterns--interview-scenarios)
  * [⚡ Resilience Patterns](#-resilience-patterns)
    * [Retry + Exponential Backoff](#retry--exponential-backoff)
    * [Timeout](#timeout)
    * [Bulkhead](#bulkhead)
    * [Rate Limiter](#rate-limiter)
    * [Fallback](#fallback)
    * [Resilience4j — all patterns together](#resilience4j--all-patterns-together)
  * [🌐 Distributed Consistency](#-distributed-consistency)
    * [CAP Theorem](#cap-theorem)
    * [BASE vs ACID](#base-vs-acid)
    * [Eventual Consistency in practice](#eventual-consistency-in-practice)
  * [🚀 Deployment Strategies](#-deployment-strategies)
    * [Blue-Green Deployment](#blue-green-deployment)
    * [Canary Deployment](#canary-deployment)
    * [Feature Flags](#feature-flags)
  * [🔀 Service Discovery & Load Balancing](#-service-discovery--load-balancing)
  * [🚪 API Gateway](#-api-gateway)
  * [💾 Caching Strategies](#-caching-strategies)
  * [🎯 Interview Scenarios](#-interview-scenarios)
    * [Scenario 1: Payment service is slow — cascading failure](#scenario-1-payment-service-is-slow--cascading-failure)
    * [Scenario 2: Multi-step process — partial failure](#scenario-2-multi-step-process--partial-failure)
    * [Scenario 3: Customer placed the same order twice](#scenario-3-customer-placed-the-same-order-twice)
    * [Scenario 4: User service is the bottleneck](#scenario-4-user-service-is-the-bottleneck)
    * [Scenario 5: New deployment broke 30% of users](#scenario-5-new-deployment-broke-30-of-users)
    * [Scenario 6: Search aggregates data from 3 services](#scenario-6-search-aggregates-data-from-3-services)
    * [Scenario 7: Service A calls B calls C — C is down](#scenario-7-service-a-calls-b-calls-c--c-is-down)
    * [Scenario 8: How do you keep two services' data in sync?](#scenario-8-how-do-you-keep-two-services-data-in-sync)
    * [Scenario 9: Data consistency across 5 microservices](#scenario-9-data-consistency-across-5-microservices)
    * [Scenario 10: Database reads can't keep up with load](#scenario-10-database-reads-cant-keep-up-with-load)
<!-- TOC -->

---

## ⚡ Resilience Patterns

> Related: [Circuit Breaker](../patterns/patterns.md#-circuit-breaker-pattern) · [Saga](../patterns/patterns.md#-saga-pattern)

These patterns work **together** as a defence-in-depth stack. No single one is sufficient alone.

### Retry + Exponential Backoff

**TL;DR**: Try again, but wait longer each time.

**Analogy**: You call a friend who doesn't pick up. You don't call 100 times per second — you wait a bit, then a bit more.

**How it works**:
- On transient failure (network blip, 503), retry automatically
- Increase delay between retries: 1s → 2s → 4s → 8s (exponential)
- Add **jitter** (random offset) to prevent thundering herd — thousands of services retrying simultaneously at the same instant
- Set a max retry count to avoid infinite loops

**When NOT to retry**:
- `400 Bad Request` — retrying won't help, the input is wrong
- `401 / 403` — auth won't fix itself
- Non-idempotent calls (`POST /payments`) — retry = double charge; use idempotency key first

```java
// Resilience4j
RetryConfig config = RetryConfig.custom()
    .maxAttempts(3)
    .waitDuration(Duration.ofMillis(500))
    .retryOnException(e -> e instanceof ConnectException)
    .build();
```

---

### Timeout

**TL;DR**: Don't wait forever. Set a deadline.

**Analogy**: You order pizza. If it hasn't arrived in 45 minutes, you cancel and order elsewhere — you don't wait 3 hours holding the phone.

**How it works**:
- Every outbound call has a time limit
- If the response doesn't arrive in time → fail fast, release the thread
- Combine with fallback or circuit breaker

**Key insight**: Without timeouts, a slow dependency holds your threads indefinitely. Under load, all threads get stuck → your service appears "hung" even though the dependency is the problem.

```yaml
# Resilience4j in application.yml
resilience4j.timelimiter:
  instances:
    paymentService:
      timeoutDuration: 2s
```

---

### Bulkhead

**TL;DR**: Isolate resources so one slow dependency can't exhaust everything.

**Analogy**: A ship has bulkheads — watertight compartments. If one floods, the ship doesn't sink. Without bulkheads, one breach drowns the whole hull.

**How it works**:
- Assign a separate **thread pool** (or semaphore) per downstream dependency
- If `payment-service` pool is full, only payment calls are rejected
- `inventory-service` continues working on its own pool

```
Without Bulkhead:
  [shared thread pool: 100 threads]
  payment-service (slow) → takes 80 threads
  inventory-service → starved → all calls fail
  
With Bulkhead:
  [payment-service pool: 20 threads]  ← only this is affected
  [inventory-service pool: 20 threads] ← still works
  [email-service pool: 10 threads]    ← still works
```

```java
BulkheadConfig config = BulkheadConfig.custom()
    .maxConcurrentCalls(20)
    .maxWaitDuration(Duration.ofMillis(100))
    .build();
```

---

### Rate Limiter

**TL;DR**: Cap how many requests go through per unit of time.

**Use cases**:
- Protect your own service from overload (inbound rate limiting at API Gateway)
- Respect downstream API quotas (outbound rate limiting before calling a 3rd party)
- Prevent abuse / DDoS mitigation

```java
RateLimiterConfig config = RateLimiterConfig.custom()
    .limitForPeriod(100)          // 100 calls
    .limitRefreshPeriod(Duration.ofSeconds(1))  // per second
    .timeoutDuration(Duration.ofMillis(25))
    .build();
```

---

### Fallback

**TL;DR**: When everything fails, return something useful instead of an error.

**Examples by context**:

| Situation | Fallback |
|---|---|
| Recommendation service down | Return bestseller list from cache |
| Payment service timeout | "Payment is processing, you'll be notified" |
| Inventory service down | "Stock status unavailable, checkout still possible" |
| User profile service 503 | Return default/anonymous profile |

**Important**: Not every call needs a fallback. Fallbacks add complexity. Ask: *"Is a degraded response better than an error here?"*

```java
@CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
public PaymentResult processPayment(Order order) { ... }

public PaymentResult paymentFallback(Order order, Exception ex) {
    return PaymentResult.pending("Payment queued — we'll notify you");
}
```

---

### Resilience4j — all patterns together

Typical stack for a single outbound call:

```
Request
  → Rate Limiter  (am I allowed to call?)
  → Circuit Breaker (is the service healthy?)
  → Bulkhead  (is there a free thread?)
  → Timeout   (cancel if too slow)
  → Retry     (try again on transient failure)
  → Fallback  (last resort)
→ Response
```

Applied order matters: Circuit Breaker wraps Retry (not the other way), so failed retries count as one circuit breaker failure, not three.

---
<div style="break-after: page;"></div>

## 🌐 Distributed Consistency

### CAP Theorem

**TL;DR**: In a distributed system, during a network partition you must choose between Consistency and Availability. You can never have all three simultaneously.

| Property | Meaning |
|---|---|
| **C**onsistency | Every read receives the most recent write (or an error) |
| **A**vailability | Every request receives a response (not necessarily the latest data) |
| **P**artition tolerance | System continues despite network failures between nodes |

**Real-world mapping**:

| System | Choice | Why |
|---|---|---|
| Traditional RDBMS (single node) | CA | No partition (single node) |
| Apache Kafka | CP | Prefers consistency (leader election, no stale reads) |
| Cassandra / DynamoDB | AP | Prefers availability (eventual consistency, always responds) |
| Zookeeper / etcd | CP | Used as coordination services — must be consistent |

**Key insight for interviews**: P (partition tolerance) is not optional in distributed systems — network partitions happen. The real choice is **CP vs AP**.

> "We chose Cassandra for the shopping cart because availability matters more than perfect consistency. If someone sees a slightly stale cart, that's acceptable. If the cart service is down during checkout — that's a lost sale."

---

### BASE vs ACID

**ACID** (traditional relational DB):

- **A**tomicity — all or nothing
- **C**onsistency — data always valid
- **I**solation — transactions don't interfere
- **D**urability — committed data survives crashes

**BASE** (distributed systems):

- **B**asically Available — system responds even with partial failures
- **S**oft state — data may change over time without input (due to replication)
- **E**ventually consistent — data will become consistent, eventually

**Rule of thumb**: Use ACID when you can't tolerate inconsistency (payments, bookkeeping). Use BASE when availability matters more and temporary inconsistency is acceptable (social feeds, shopping carts, recommendations).

---

### Eventual Consistency in practice

The data is correct — just not immediately.

**Example**: User updates their profile photo.
- Write goes to primary DB
- Read replicas lag by ~100ms
- Another service reads the old photo for a moment
- After replication → all services see the new photo

**Design for it**:
- Show users their own writes immediately (read-your-writes)
- Use version/timestamp to detect stale data
- Design UIs that tolerate "loading..." states
- Never make distributed transactions your default — design sagas and compensations

---
<div style="break-after: page;"></div>

## 🚀 Deployment Strategies

### Blue-Green Deployment

**TL;DR**: Two identical environments, flip traffic between them.

```
Blue (current v1)  ← 100% traffic
Green (new v2)     ← idle, being tested

After validation:
Blue  ← idle (instant rollback if needed)
Green ← 100% traffic
```

**Benefits**: Zero downtime, instant rollback (flip the switch back).  
**Cost**: Requires double the infrastructure.

---

### Canary Deployment

**TL;DR**: Roll out to a small percentage of users first, observe, then expand.

```
v1 → 95% of traffic
v2 → 5% of traffic (canary)

Monitor errors, latency, business metrics...

If OK:  v1 → 0%, v2 → 100%
If bad: v2 → 0%  (rollback affects only 5% of users)
```

**Benefits**: Real production testing on small blast radius.  
**Cost**: Requires traffic routing (API Gateway, Istio, feature flags) and monitoring.

**In Kubernetes**: achieved via weighted routing or by controlling replica counts across two Deployments.

---

### Feature Flags

**TL;DR**: Toggle features at runtime without deploying new code.

```java
if (featureFlags.isEnabled("new-checkout-flow", userId)) {
    return newCheckoutService.process(order);
} else {
    return legacyCheckoutService.process(order);
}
```

**Powers**:
- Canary via user segments (5% of users see new feature)
- Kill switch for production incidents
- A/B testing
- Dark launches (code deployed but inactive)

**Tools**: LaunchDarkly, Unleash, Spring Cloud Config, environment variables.

---
<div style="break-after: page;"></div>

## 🔀 Service Discovery & Load Balancing

**Problem**: Service A wants to call Service B. B runs on 5 pods with dynamic IPs. How does A find B?

**Two approaches**:

**Server-side discovery** (classic, K8s default):
```
A → [Load Balancer / K8s Service] → B-pod-1 / B-pod-2 / B-pod-3
```
The LB knows where B is. A just calls a stable DNS name.

**Client-side discovery** (Spring Cloud):
```
A → [Service Registry: Eureka/Consul] → discovers B's instances → calls one directly
```
A is responsible for load balancing (ribbon/spring-lb).

**In Kubernetes**: Server-side is built-in. A calls `http://order-service:8080` — K8s Service handles the rest. No Eureka needed.

**Load balancing algorithms**:
- **Round Robin** — requests distributed evenly in order
- **Least Connections** — route to the instance with fewest active connections
- **Consistent Hashing** — same user always hits same instance (session affinity)

---
<div style="break-after: page;"></div>

## 🚪 API Gateway

**TL;DR**: Single entry point for all external traffic. Handles cross-cutting concerns.

```
Client
  → API Gateway
      → auth (JWT validation)
      → rate limiting
      → routing  → order-service
                 → user-service
                 → product-service
      → request/response transformation
      → logging, tracing
```

**What API Gateway does**:

| Concern | Without Gateway | With Gateway |
|---|---|---|
| Auth | Every service validates JWT | Gateway validates once |
| Rate limiting | Every service implements it | Centralized |
| SSL termination | Every service handles TLS | Gateway only |
| Routing | Client knows all service URLs | Client knows one URL |
| Versioning | Complex | `/v1/`, `/v2/` routing rules |

**Tools**: Kong, AWS API Gateway, Spring Cloud Gateway, Nginx, Istio.

**Anti-pattern — God Gateway**: Don't put business logic in the Gateway. It should be thin and infrastructure-only.

---
<div style="break-after: page;"></div>

## 💾 Caching Strategies

### Where to cache

```
Client → API Gateway cache → Service → Redis cache → Database
```

### Cache-Aside (Lazy Loading)

Most common pattern:

```
1. Read from cache
2. Cache miss → read from DB → write to cache → return
3. Cache hit → return directly
```

```java
public Product getProduct(String id) {
    Product cached = redis.get(id);
    if (cached != null) return cached;
    
    Product product = db.findById(id);
    redis.set(id, product, Duration.ofMinutes(10));
    return product;
}
```

**Invalidation problem**: When DB changes, cache becomes stale. Options:
- TTL expiry (simplest, eventual consistency)
- Explicit eviction on write (`redis.delete(id)` after update)
- Write-through: update cache and DB together on every write

### What NOT to cache

- Frequently changing data (stock levels in real-time trading)
- User-specific data that changes per-request (cart totals)
- Anything that requires strong consistency (payment state)

### Interview question: "How do you handle cache stampede?"

When cache expires, thousands of requests hit the DB simultaneously:
- **Mutex/Lock**: first request acquires lock, populates cache, others wait
- **Probabilistic early expiration**: refresh before TTL actually expires
- **Staggered TTLs**: add random jitter to expiration times

---
<div style="break-after: page;"></div>

## 🎯 Interview Scenarios

These are the scenarios recruiters walk through with senior candidates. For each: identify the **problem**, name the **patterns**, describe the **tradeoffs**.

---

### Scenario 1: Payment service is slow — cascading failure

> "Our payment service starts responding in 10 seconds instead of 200ms. Users notice the whole order service becoming unresponsive. What's happening and how do you fix the design?"

**What's happening**:
1. Payment service is slow (GC pause, DB overload, downstream API issue)
2. Order service calls payment — threads block waiting for 10s response
3. Under load, all order service threads are occupied waiting for payment
4. Order service appears hung — not because of its own code, but because it's waiting

**Defence layers**:

```
Order Service → [Timeout: 2s] → fail fast, don't wait 10s
             → [Circuit Breaker] → after N failures, stop calling payment for 30s
             → [Bulkhead] → payment calls on isolated thread pool, 
                            other features (browse, cart) unaffected
             → [Fallback] → "Payment processing — you'll receive confirmation shortly"
```

**Key answer points**:
- Name the failure mode: thread pool exhaustion / cascading failure
- Timeout is the first line of defence — without it, nothing else works
- Circuit Breaker prevents wasting resources on a known-bad service
- Bulkhead isolates payment from affecting unrelated features
- Fallback gives a graceful UX instead of 500 errors

---

### Scenario 2: Multi-step process — partial failure

> "Placing an order requires: (1) reserve inventory, (2) charge payment, (3) send confirmation email. Payment succeeds but inventory reservation fails. What happens?"

**This is a Saga scenario.**

**Without Saga**: Distributed transaction (2PC) — works but:
- Locks resources across services during the transaction
- Any service going down = deadlock
- Doesn't scale

**With Saga (choreography)**:
```
OrderService: emit OrderCreated
InventoryService: listens → reserves stock → emit InventoryReserved
PaymentService: listens → charges → emit PaymentProcessed
EmailService: listens → sends email → emit OrderConfirmed
```

On failure:
```
InventoryService: can't reserve → emit InventoryFailed
PaymentService: listens to InventoryFailed → emit PaymentRefunded
OrderService: listens → emit OrderCancelled
```

**Key answer points**:
- Each step is a local transaction with a compensating action
- Compensation ≠ rollback — it's a new forward action that undoes business effect
- Eventual consistency — there's a window where order exists but payment isn't confirmed yet
- Design compensations to be idempotent (they may execute more than once)

---

### Scenario 3: Customer placed the same order twice

> "Due to a network timeout, the frontend retried the checkout request. The customer sees two orders and was charged twice. How do you prevent this?"

**Idempotency pattern**:

```
Client generates: idempotency-key: "uuid-abc-123"
POST /orders
  Header: Idempotency-Key: uuid-abc-123
```

**Server side**:
```
1. Check if idempotency-key already processed
2. If yes → return same response as before (don't re-execute)
3. If no → execute, store key + response, return response
```

```java
// In a single DB transaction:
if (idempotencyStore.exists(key)) {
    return idempotencyStore.getResponse(key);
}
Order order = orderService.create(request);
idempotencyStore.save(key, order);  // same transaction
return order;
```

**Key answer points**:
- Client is responsible for generating the idempotency key (UUID)
- Server stores key → response mapping (in DB or Redis, with TTL)
- Works for payments too — Stripe, PayPal require this
- Related: Inbox pattern (same idea applied to message consumption)

---

### Scenario 4: User service is the bottleneck

> "Every service calls user-service to validate JWT tokens and fetch user profile. User-service has 95% of all traffic and is overwhelmed. How do you fix it?"

**Solutions in order of complexity**:

**1. Stateless auth (JWT)**:
- Instead of calling user-service to validate each request, validate JWT signature locally
- User-service issues tokens; services verify with public key — no network call needed
- Profile data embedded in JWT claims (or fetched lazily)

**2. Caching at the caller**:
```
order-service: check local Redis → found → no call to user-service
                                 → not found → call user-service → cache result (TTL 5min)
```

**3. API Gateway as auth layer**:
- Gateway validates JWT once for all services
- Passes `X-User-Id` / `X-User-Role` headers to downstream
- Services trust headers — zero calls to user-service per request

**4. Scale user-service horizontally**:
- Last resort (doesn't fix the design, just buys time)

**Key answer points**:
- Prefer stateless solutions (JWT) over centralised auth
- Caching reduces load but introduces staleness — revoked tokens live until TTL expires
- API Gateway is the clean architectural solution

---

### Scenario 5: New deployment broke 30% of users

> "We deployed v2 of the payment service. Within minutes, 30% of orders fail. How do you design deployments to minimize this blast radius, and what do you do now?"

**Immediately**: roll back
```bash
kubectl rollout undo deployment/payment-service
# or switch blue-green traffic back
```

**Design for the future**:

**Canary deployment**:
```
v1 → 95% of traffic
v2 → 5% (canary)

Monitor: error rate, p99 latency, business metrics (order completion rate)
Alert if canary error rate > threshold → auto-rollback
```

**Feature flags**:
```java
if (featureFlags.isEnabled("new-payment-flow")) {
    newPaymentProcessor.charge(order);
} else {
    legacyPaymentProcessor.charge(order);
}
```
→ Kill switch: flip flag, no deploy needed

**Contract testing** (prevention):
- Consumer-driven contract tests (Pact) ensure v2 doesn't break its API contract
- Run against CI pipeline before every release

**Key answer points**:
- Canary = smaller blast radius (5% of users, not 30%)
- Feature flags = instant kill switch
- Blue-green = instant rollback capability
- Monitoring + auto-rollback = the safety net

---

### Scenario 6: Search aggregates data from 3 services

> "The product search endpoint needs to return product data (product-service), pricing (pricing-service), and stock level (inventory-service). How do you design this?"

**Option A: API Composition (synchronous)**
```
search-service calls:
  → product-service (product details)
  → pricing-service (current price)
  → inventory-service (stock level)
  → merge → return combined response
```
- Simple to implement
- Latency = max(p-svc, pr-svc, inv-svc) if parallel; sum if sequential
- Fails if any service is down

**Option B: CQRS Read Model (event-driven)**
```
product-service   → emits ProductUpdated  →
pricing-service   → emits PriceChanged    → search-service maintains
inventory-service → emits StockUpdated    → its own read-optimised DB

search-service: reads from local DB → no outbound calls at query time
```
- Eventually consistent (small lag behind source)
- Extremely fast reads (local DB only)
- Higher complexity (event subscription, data duplication)

**Which to choose**:
- Small dataset, low traffic, strong consistency needed → API Composition
- High traffic, read performance critical, OK with eventual consistency → CQRS Read Model

---

### Scenario 7: Service A calls B calls C — C is down

> "Order-service calls notification-service which calls email-provider (external). Email provider is down for 2 hours. Describe the failure propagation and your design."

**Without patterns**:
```
email-provider DOWN
→ notification-service: timeouts, threads stuck
→ order-service: timeouts waiting for notification-service
→ order-service: unable to process orders (unrelated to email!)
```

**With patterns**:
```
email-provider DOWN
→ notification-service:
    Timeout: fail fast after 1s
    Retry: try 3 times with backoff → still fails
    Circuit Breaker: OPEN — stop calling email-provider for 60s
    Fallback: store notification in outbox for later delivery

→ order-service:
    Bulkhead: notification calls isolated → order processing unaffected
    Circuit Breaker on notification-service: if it starts failing → OPEN
    Fallback: "Order placed. Email confirmation may be delayed."
```

**Key answer points**:
- Async notifications (fire-and-forget + Outbox) make order placement independent of email delivery
- Never make a non-critical operation (email) block a critical one (order)
- Outbox pattern guarantees eventual delivery when provider recovers

---

### Scenario 8: How do you keep two services' data in sync?

> "Order-service and analytics-service both need order data. Order-service owns the data. How does analytics-service stay up to date?"

**Option A: Direct DB access** — never do this. Couples services at the DB level.

**Option B: REST polling** — analytics polls order-service every N minutes.
- Simple, but high latency, wasteful, doesn't scale.

**Option C: Events (recommended)**:
```
order-service: OrderPlaced, OrderCancelled, OrderShipped → Kafka
analytics-service: subscribes → maintains its own read model
```

With Outbox pattern for guaranteed delivery:
```
order-service: in one transaction → update orders table + insert to outbox
outbox publisher → reads outbox → publishes to Kafka
analytics-service → consumes Kafka → updates analytics DB
```

**Key answer points**:
- Event-driven = loose coupling, analytics scales independently
- analytics-service owns its own data model (no shared schema)
- Outbox guarantees no events are lost even if Kafka is temporarily down
- Eventual consistency lag is usually acceptable for analytics

---

### Scenario 9: Data consistency across 5 microservices

> "Each of your 5 microservices has its own database. A business operation spans all 5. How do you maintain consistency?"

**Why distributed transactions (2PC/XA) fail at scale**:
- Lock resources across all 5 services during transaction
- Any service crash = all 5 locked waiting for coordinator
- Network partition = deadlock
- Performance: round trips multiply

**Answer: Saga + Outbox + Idempotency**:

1. **Saga** — decompose into local transactions with compensations
2. **Outbox** — guarantee events are published atomically with each local transaction
3. **Idempotent handlers** — each service handles duplicate events safely (Inbox pattern)

**Accept eventual consistency**:
- There is a window where data is inconsistent between services
- Design the UX around it ("order is being processed...")
- Use versioning/timestamps to detect and handle stale data

**Key answer points**:
- The question is a trap — perfect consistency across 5 services doesn't scale
- Trade strong consistency for availability + partition tolerance (CAP)
- Compensating transactions are business logic, not technical rollbacks
- Chaos Engineering: regularly test what happens when one service fails mid-saga

---

### Scenario 10: Database reads can't keep up with load

> "Your product catalog has 10 million products. Reads peak at 50k/s during sales. The single DB falls over. How do you scale this?"

**Layered approach**:

**Layer 1: CDN / HTTP cache**
```
GET /products/123 → CDN (Cache-Control: max-age=300)
```
Serves static-ish data from edge. 95% of reads never reach your service.

**Layer 2: Application cache (Redis)**
```java
Product p = redis.get("product:123");
if (p == null) { p = db.find(123); redis.set("product:123", p, 5min); }
```

**Layer 3: Read replicas**
```
All writes → Primary DB
All reads  → Read Replica 1 / Replica 2 / Replica 3 (round-robin)
```
Lag typically < 100ms. Acceptable for product catalog.

**Layer 4: CQRS with separate read store**
```
product-service (write): PostgreSQL with full ACID
                       → emits ProductUpdated events
read-service: Elasticsearch (full-text search, facets)
            : denormalized view optimized for catalog queries
```

**Key answer points**:
- Start with caching (80% of the win, 20% of the effort)
- Read replicas for sustained load without caching complexity
- CQRS only when queries need a fundamentally different data model (search, aggregations)
- Measure before optimizing — identify the actual bottleneck first

---
