[Back to interview](../interview.md)

# 🔒 How to Secure a Public REST API — Comprehensively

<!-- TOC -->
* [TL;DR](#tldr)
* [Analogy — A Bank Building](#analogy--a-bank-building)
* [How It Works — Step by Step](#how-it-works--step-by-step)
  * [Step 1: Encrypt the Channel (TLS)](#step-1-encrypt-the-channel-tls)
  * [Step 2: Verify Identity (Authentication)](#step-2-verify-identity-authentication)
  * [Step 3: Check Permissions (Authorization)](#step-3-check-permissions-authorization)
  * [Step 4: Validate Every Byte of Input](#step-4-validate-every-byte-of-input)
  * [Step 5: Limit Traffic (Rate Limiting)](#step-5-limit-traffic-rate-limiting)
  * [Step 6: Add Security Headers](#step-6-add-security-headers)
  * [Step 7: Log Everything (Audit Log)](#step-7-log-everything-audit-log)
  * [Step 8: Put an API Gateway at the Front](#step-8-put-an-api-gateway-at-the-front)
  * [Step 9: Keep Security Up to Date](#step-9-keep-security-up-to-date)
* [Technical Terms Glossary](#technical-terms-glossary)
* [Layer Map — Who Does What](#layer-map--who-does-what)
* [Most Common Gaps (OWASP API Security Top 10)](#most-common-gaps-owasp-api-security-top-10)
* [Sources](#sources)
<!-- TOC -->

---

## TL;DR

A public REST API is a door to your system — open to the entire internet.
Securing it is not one lock, but **eight layers**: encrypt the channel, verify identity, check permissions, validate input, limit traffic, set browser policies via headers, audit log, and put a gateway in front.
One layer is never enough — when one fails, the next one stops the attack.

---

## Analogy — A Bank Building

Think of a bank building with a vault inside.

| Security layer | Bank equivalent |
|---|---|
| **TLS** | Bulletproof glass and encrypted phones — nobody outside can hear the conversation |
| **Authentication** | Security guard checking your ID at the entrance |
| **Authorization** | Access cards — a customer goes to the counter, not into the vault |
| **Input validation** | Metal detector — you can't bring in things that don't belong |
| **Rate limiting** | A queue — one customer can't occupy all the tellers at once |
| **Security headers** | Rules posted on the door — what's allowed, what isn't |
| **Audit log** | CCTV camera and visitor log — who came, when, what they did |
| **API Gateway** | Reception desk — the first person you meet before reaching any employee |

Each layer works independently. If the guard misses a fake ID, the camera still recorded the face. If the access card fails, the vault stays locked.

---

## How It Works — Step by Step

---

### Step 1: Encrypt the Channel (TLS)

**🧑‍💻 middle**

Data on the internet passes through dozens of intermediate servers. Without encryption, any one of them can read it. TLS (what sits behind `https://`) creates an encrypted tunnel — nobody in between sees the content.

```
# Get a certificate — Let's Encrypt is free and auto-renews via Certbot
# HSTS header: tells the browser to NEVER connect over plain HTTP again
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Without this: an attacker on the same Wi-Fi (café, airport) reads every token and request body in transit — classic man-in-the-middle attack.

---

### Step 2: Verify Identity (Authentication)

**🧑‍💻 middle — Users: OAuth2 + JWT**

The user logs in through an Authorization Server (Keycloak, Auth0, Cognito — not your app). The server issues a JWT: a small, digitally signed document containing the user's identity.

```
1. User clicks "Login" → app redirects to Authorization Server
2. User enters credentials THERE, never in your app
3. Auth Server returns JWT access token
4. App attaches it to every request: Authorization: Bearer <token>
5. Your service verifies the signature — no extra network call needed
```

Short TTL (5–15 minutes) is critical: if the token leaks, it goes stale quickly.

**🧑‍💻 middle — External Partners: API Keys**

```
X-API-Key: sk_live_abc123xyz
```

Simpler than OAuth2. The key doesn't expire automatically — you must rotate it manually and revoke it immediately if compromised. Use for trusted third-party integrations with a limited surface area.

**🧙‍♂️ senior — How JWT signature verification works (JWKS)**

Your service doesn't call the Authorization Server on every request. Instead, it fetches the server's public keys once (from the JWKS endpoint) and verifies the JWT signature locally. This makes the system stateless and fast, but means a revoked token stays valid until it expires — which is why short TTL matters.

```java
// Spring Boot: configure JWKS auto-verification
@Bean
SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt.jwkSetUri("https://auth.example.com/.well-known/jwks.json")))
        .build();
}
```

**🧙‍♂️ senior — Service-to-Service (M2M): OAuth2 Client Credentials**

When a service needs to call another service without a human user, it uses its own identity (client_id + client_secret) to obtain a token.

```
Billing Service → POST /token
  grant_type=client_credentials
  client_id=billing-svc
  client_secret=<secret>
← JWT access token (short-lived)
→ Billing calls Orders API with: Authorization: Bearer <token>
```

In Kubernetes, prefer Workload Identity (IRSA on AWS, Workload Identity on GKE) over static secrets — the pod gets credentials automatically from the cloud provider.

---

### Step 3: Check Permissions (Authorization)

**🧑‍💻 middle — Authentication ≠ Authorization**

Authentication tells you *who* is calling. Authorization tells you *what they are allowed to do*. A logged-in user should not see another user's orders.

The JWT contains **scopes** — named permissions granted to the caller:

```java
@GetMapping("/orders")
@PreAuthorize("hasAuthority('SCOPE_orders:read')")
public List<Order> getMyOrders(Authentication auth) {
    // Filter by the userId FROM THE TOKEN — never trust a userId from the URL
    return orderRepository.findByUserId(auth.getName());
}
```

**🧑‍💻 middle — The classic mistake: IDOR**

`GET /orders/12345` — if your code doesn't check that order 12345 belongs to the logged-in user, any authenticated user can increment the ID and read someone else's data. Authentication passed; authorization failed. This is OWASP #1.

**🧙‍♂️ senior — Fine-grained authorization: @PostAuthorize and domain objects**

`@PreAuthorize` runs *before* the method and can only see the input. `@PostAuthorize` runs *after* and can inspect the return value — useful when ownership can only be confirmed after loading the resource:

```java
@GetMapping("/orders/{id}")
@PostAuthorize("returnObject.userId == authentication.name")
public Order getOrder(@PathVariable Long id) {
    return orderRepository.findById(id).orElseThrow();
}
```

For complex rules (e.g., "admin sees all, manager sees their team's, user sees their own"), Spring Security ACL or a policy engine (OPA, Casbin) replaces scattered `if` checks.

**🧙‍♂️ senior — Role vs Scope vs Claim-based authorization**

| Strategy | Best for |
|---|---|
| Roles (`ROLE_ADMIN`) | Coarse-grained, monolith |
| Scopes (`orders:read`) | API surface, OAuth2 clients |
| Custom claims (`departmentId`) | Multi-tenant, attribute-based rules |

---

### Step 4: Validate Every Byte of Input

**🧑‍💻 middle — Basic Bean Validation**

A client can send literally anything as JSON. Validate at the HTTP boundary before any business logic runs.

```java
record CreateOrderRequest(
    @NotBlank String customerId,       // not null, not ""
    @NotNull @Positive BigDecimal amount,
    @Pattern(regexp = "[A-Z]{3}") String currency
) {}

@PostMapping("/orders")
public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody CreateOrderRequest req) {
    // If validation fails, Spring returns 400 automatically — this line never runs
}
```

**Never trust input from outside** — even from "trusted" internal services. Always validate at HTTP boundaries.

**🧙‍♂️ senior — Custom constraint annotations**

When built-in annotations aren't enough (e.g., validate a bank account number format), write your own:

```java
@Target(FIELD) @Retention(RUNTIME)
@Constraint(validatedBy = IbanValidator.class)
public @interface ValidIban {
    String message() default "Invalid IBAN";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class IbanValidator implements ConstraintValidator<ValidIban, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext ctx) {
        return IbanUtils.isValid(value); // your business rule
    }
}
```

**🧙‍♂️ senior — Validation at domain level vs API level**

Bean Validation catches format errors (negative amount, blank field). Business invariants live in the domain:

```java
// Domain enforces its own rules — even if input passes API validation
public void place(Order order, Account account) {
    if (order.amount().compareTo(account.balance()) > 0)
        throw new InsufficientFundsException(order.amount(), account.balance());
}
```

Two distinct concerns, two distinct places. Don't mix them.

---

### Step 5: Limit Traffic (Rate Limiting)

**🧑‍💻 middle — The problem and the response**

A single script can send 50,000 requests per second, taking your service down for everyone. Count requests per client; when the limit is exceeded:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718352000
```

`Retry-After: 60` is essential. Without it, clients retry immediately → thundering herd → overload compounds. With it, they back off for 60 seconds.

**🧙‍♂️ senior — Algorithms and distributed implementation**

| Algorithm | Characteristic |
|---|---|
| **Fixed window** | Simple, but allows 2× burst at window boundary |
| **Sliding window** | Smooth, slightly more memory |
| **Token bucket** | Allows short bursts, then enforces rate |
| **Leaky bucket** | Constant outflow, no bursts |

In a multi-instance deployment, counters must live in Redis (not in-process):

```java
// Resilience4j: per-user token bucket backed by Redis
RateLimiter limiter = RateLimiter.of("orders-api",
    RateLimiterConfig.custom()
        .limitForPeriod(100)
        .limitRefreshPeriod(Duration.ofSeconds(1))
        .build());
```

**🧙‍♂️ senior — Tiered limits**

Different clients get different limits:
- Free tier: 100 req/min
- Paid tier: 10,000 req/min
- Internal services: unlimited (bypass the limiter, authenticated via mTLS)

Separate limits per endpoint: `POST /payments` is far more expensive than `GET /orders` — treat them differently.

---

### Step 6: Add Security Headers

**🧑‍💻 middle — What to add and why**

Each header protects against one specific attack:

```
X-Content-Type-Options: nosniff         # browser must not guess content type (MIME confusion)
X-Frame-Options: DENY                   # page cannot be embedded in an iframe (clickjacking)
Strict-Transport-Security: max-age=31536000; includeSubDomains  # always HTTPS
Referrer-Policy: no-referrer-when-downgrade  # don't leak URL to third-party domains
Content-Security-Policy: default-src 'self'  # scripts/styles only from our domain (XSS)
```

Spring Security adds most of these automatically; tune to your needs:

```java
http.headers(headers -> headers
    .frameOptions(frame -> frame.deny())
    .contentTypeOptions(Customizer.withDefaults())
    .httpStrictTransportSecurity(hsts -> hsts.maxAgeInSeconds(31536000).includeSubdomains(true))
);
```

**🧙‍♂️ senior — Content Security Policy at depth**

A permissive CSP (`default-src 'self'`) is a starting point. Production CSPs are complex because real apps load fonts from Google, analytics from third parties, etc. Nonces prevent inline script injection while allowing specific trusted scripts:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123';   # allow only scripts with matching nonce
  style-src 'self' fonts.googleapis.com;
  report-uri /csp-report              # collect violations without blocking (report-only mode)
```

Use `Content-Security-Policy-Report-Only` first to collect violations before enforcing — otherwise you'll break your own app.

---

### Step 7: Log Everything (Audit Log)

**🧑‍💻 middle — What to log and what NOT to log**

When something goes wrong (security breach, client dispute), you need a record. Every request gets logged:

```json
{ "ts": "2026-06-14T10:22:01Z", "userId": "u-456", "method": "POST", "path": "/orders", "status": 201 }
```

Never log: passwords, tokens, card numbers, SSN. If you need to confirm a token was present:

```json
// ❌ "authorization": "Bearer eyJhbGciOiJSUzI1NiJ9..."
// ✅ "authTokenPresent": true
```

**🧙‍♂️ senior — Structured logging with Correlation ID**

Every request gets a unique `traceId` generated at entry (or taken from the incoming `X-Correlation-ID` header). Propagate it to all downstream calls and include it in every log line:

```java
// MDC (Mapped Diagnostic Context) puts the traceId in every log line automatically
MDC.put("traceId", request.getHeader("X-Correlation-ID") != null
    ? request.getHeader("X-Correlation-ID")
    : UUID.randomUUID().toString());
```

This lets you reconstruct the entire journey of a single request across 10 microservices in Splunk with one query: `traceId="abc-123"`.

**🧙‍♂️ senior — Compliance requirements**

In regulated environments (fintech, healthcare), audit logs are not optional:
- **Immutability**: logs must not be modifiable after the fact (write to append-only storage, ship to SIEM immediately).
- **PII handling**: in GDPR scope, you may need to mask or pseudonymize user IDs — discuss with legal.
- **Retention**: financial regulations often require 5–7 years of audit logs.
- **Separate from application logs**: audit log is a compliance artifact; don't mix it with debug output.

---

### Step 8: Put an API Gateway at the Front

**🧑‍💻 middle — The concept**

Your service shouldn't implement TLS termination, JWT validation, rate limiting, and request logging separately — these are cross-cutting concerns that belong at the infrastructure level. An API Gateway sits in front:

```
Client → [API Gateway] → [Your Service]
              ↓
     TLS termination
     JWT validation
     Rate limiting
     Request logging
     Routing / load balancing
```

Your service receives an already-authenticated request and focuses purely on business logic.

**🧙‍♂️ senior — Responsibilities: gateway vs service**

| Concern | Gateway | Service |
|---|---|---|
| TLS termination | ✅ | ❌ |
| Auth token validation | ✅ | ❌ (trust the gateway) |
| Rate limiting | ✅ | ❌ (unless per-business-logic rules) |
| Authorization (`@PreAuthorize`) | ❌ | ✅ |
| Input validation | ❌ | ✅ |
| Business audit logging | ❌ | ✅ |

A service that relies on the gateway for authorization is unsafe — if you add a direct route (debug endpoint, internal network), authorization disappears. Always authorize at the service level too.

**🧙‍♂️ senior — Choosing a gateway**

| Gateway | Best for |
|---|---|
| **Spring Cloud Gateway** | JVM-native, tight Spring Boot integration, reactive |
| **Kong** | Plugin ecosystem, language-agnostic, Lua scripting |
| **AWS API Gateway** | Serverless, managed, tight AWS IAM integration |
| **Nginx / Envoy** | High performance, service mesh companion |

---

### Step 9: Keep Security Up to Date

**🧑‍💻 middle — Dependency scanning**

Your app's libraries have vulnerabilities discovered after you shipped. Check them regularly:
- **Dependabot** (GitHub): opens PRs automatically when CVEs are found.
- **OWASP Dependency Check**: `mvn verify` adds a CVE report to your build.

If a critical CVE appears, patch within 24 hours — don't wait for the next sprint.

**🧙‍♂️ senior — Secret rotation**

Secrets (API keys, DB passwords, JWT signing keys) should be rotated on a schedule and immediately on suspicion of compromise:

```yaml
# Vault dynamic secrets: DB credentials that expire automatically
vault write database/config/mydb
  plugin_name=postgresql-database-plugin
  connection_url="postgresql://{{username}}:{{password}}@db:5432/app"
  allowed_roles="app-role"
  lease_duration=1h      # credentials expire after 1 hour
```

App checks out new credentials before each startup (or via Vault Agent sidecar in Kubernetes). No long-lived secrets.

**🧙‍♂️ senior — Pen testing and threat modeling**

Before a major release or once per quarter:
1. **Threat modeling** (STRIDE) — enumerate attack surfaces before writing code.
2. **DAST** (Dynamic Application Security Testing) — tools like OWASP ZAP probe the running app.
3. **External pen test** — third-party testers with no prior knowledge of the system.

Results go into the backlog with severity labels (CVSS score). Critical/High block the release.

---

## Technical Terms Glossary

**🧑‍💻 middle — Core terms**

| Term | What it is |
|---|---|
| **TLS** | Encryption protocol for network connections; `https://` uses TLS |
| **JWT** (JSON Web Token) | A small, digitally signed document containing identity and permissions |
| **OAuth2** | Standard that lets apps act on behalf of a user without knowing their password |
| **Scope** | A named permission in OAuth2, e.g. `orders:read` = "can read orders" |
| **Rate limiting** | Restricting the number of requests per unit of time per client/IP |
| **IDOR** | Insecure Direct Object Reference — accessing another user's resource by changing an ID |
| **DoS** | Denial of Service — flooding a service with requests to take it down |
| **Bean Validation** | Spring/Jakarta mechanism for validating objects via annotations (`@NotBlank`, `@Positive`) |

**🧙‍♂️ senior — Advanced terms**

| Term | What it is |
|---|---|
| **JWKS** | Public keys of the Authorization Server — your service fetches them to verify JWT signatures |
| **API Gateway** | A proxy between clients and backend services handling cross-cutting concerns |
| **HSTS** | HTTP header: tells the browser to always use HTTPS for this domain, permanently |
| **CSP** (Content Security Policy) | Header restricting where the browser can load scripts, styles, fonts from |
| **Correlation ID** | A unique request identifier propagated through all services for distributed tracing |
| **CVE** | Common Vulnerabilities and Exposures — public database of known security vulnerabilities |
| **mTLS** | Mutual TLS — both client and server authenticate with certificates |
| **SIEM** | Security Information and Event Management — centralized log analysis platform |

---

## Layer Map — Who Does What

**🧑‍💻 middle — Mental model**

```
        INTERNET
            │
     ┌──────▼──────┐
     │ API Gateway  │  ← TLS, JWT validation, rate limiting, request logging
     └──────┬──────┘
            │
   ┌────────▼────────┐
   │   Spring Boot   │  ← @PreAuthorize, @Valid, business audit log, security headers
   └────────┬────────┘
            │
   ┌────────▼────────┐
   │    Database     │  ← encryption at rest, least-privilege DB account
   └─────────────────┘
```

**🧙‍♂️ senior — Request lifecycle through security layers**

```
Request arrives
  → Gateway: TLS decryption
  → Gateway: JWT signature verified against JWKS
  → Gateway: rate limit counter incremented (Redis)
  → Gateway: request logged with traceId
  → Service: @PreAuthorize checks scope
  → Service: @Valid validates request body
  → Service: business logic runs
  → Service: audit event written (separate from app log)
  → Response: security headers added (middleware)
  → Gateway: response logged (status, latency)
```

---

## Most Common Gaps (OWASP API Security Top 10)

**🧑‍💻 middle — Know these exist**

| # | Vulnerability | One-line fix |
|---|---|---|
| 1 | **Broken Object Level Authorization (IDOR)** | Filter by `userId` from token, not from URL |
| 2 | **Broken Authentication** | Short JWT TTL, PKCE, no secrets in code |
| 4 | **Unrestricted Resource Consumption** | Rate limiting + max request body size |
| 5 | **Broken Function Level Authorization** | Admin endpoints need a dedicated scope |
| 8 | **Security Misconfiguration** | Disable debug endpoints, never expose stack traces |

**🧙‍♂️ senior — These require deeper understanding**

| # | Vulnerability | What makes it hard |
|---|---|---|
| 3 | **Broken Object Property Level Authorization** | `@JsonView` or explicit DTO per role — easy to forget one field |
| 6 | **Unrestricted Access to Sensitive Flows** | Rate limiting password reset separately from `GET /products` |
| 7 | **Server-Side Request Forgery (SSRF)** | Attacker uses your server as a proxy; whitelist outbound URLs |
| 9 | **Improper Inventory Management** | Shadow APIs, forgotten v1 endpoints, undocumented admin routes |
| 10 | **Unsafe Consumption of External APIs** | Validate and sanitize external API responses — they can be compromised |

---

## Sources

- [`questions/pl/12-public-api.md`](../questions/pl/12-public-api.md) — card 26: API security overview
- [`questions/pl/8-security.md`](../questions/pl/8-security.md) — cards: TLS, OAuth2, JWT, OWASP Top 10, SSRF, security headers
- [`security/security.md`](security.md) — JWT deep dive, encryption basics
- [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/editions/2023/en/0x00-header/)
- Spring Security reference: `oauth2ResourceServer`, CORS, headers configuration
