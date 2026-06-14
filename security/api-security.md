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

### Step 1: Encrypt the Channel (TLS)

**The problem**: Data on the internet passes through dozens of intermediate servers. Any one of them can read it if sent in plaintext.

**The solution**: TLS (what sits behind `https://`) creates an encrypted tunnel. Nobody in between sees the content — only that two IP addresses are talking.

**In practice**:
```
# Certificate (Let's Encrypt — free, auto-renewal via Certbot)
# HSTS header — tells the browser: never use HTTP for this domain
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Without this**: an attacker on the same Wi-Fi (café, airport) can read every token and request body in transit — man-in-the-middle attack.

---

### Step 2: Verify Identity (Authentication)

**The problem**: Who is knocking? The API is public — anyone can send a request.

Three types of callers, three strategies:

#### User from a browser/mobile app → OAuth2 + JWT

```
1. User clicks "Login" in the app
2. App redirects to Authorization Server (Keycloak, Auth0, Cognito...)
3. User enters credentials THERE, not in the app
4. Authorization Server returns an access token (JWT) — a small digitally signed document
5. App attaches the token to every request: Authorization: Bearer <token>
6. Your service verifies the signature (via JWKS) — without calling the Authorization Server again
```

Why JWT? Because the cryptographic signature guarantees authenticity without an extra network hop.
Key detail: short TTL (5–15 minutes) — if the token leaks, it expires quickly.

#### Service to service (M2M) → OAuth2 Client Credentials

```
Billing Service → requests a token: POST /token
  client_id=billing-svc
  client_secret=<secret>
  grant_type=client_credentials
← receives access token (JWT)
→ uses the token to call Orders API
```

There is no human user — the service acts on its own behalf.

#### External partner → API Key

```
X-API-Key: sk_live_abc123xyz
```

Simpler than OAuth2, but the key doesn't expire automatically — must be rotated manually and revoked immediately if compromised.

---

### Step 3: Check Permissions (Authorization)

**The problem**: You know who is calling — but what are they allowed to do? A logged-in user should not see other users' data.

**The solution**: The token (JWT) contains a list of permissions (scopes). The server checks whether the token has the required scope for the operation.

```java
// Spring Security: reads scope automatically from the JWT
@GetMapping("/orders")
@PreAuthorize("hasAuthority('SCOPE_orders:read')")
public List<Order> getMyOrders(Authentication auth) {
    // CRITICAL: filter by userId from the token, not from the URL parameter
    String userId = auth.getName();
    return orderRepository.findByUserId(userId);
}
```

**Classic mistake — IDOR**: endpoint `/orders/{id}` without checking whether the order belongs to the authenticated user. Change the `id` in the URL → you get someone else's order. Authentication worked, authorization didn't.

---

### Step 4: Validate Every Byte of Input

**The problem**: A client can send literally anything as JSON. `"amount": -99999` or `"name": "<script>alert('xss')</script>"`.

**The solution**: Bean Validation (Jakarta Validation) on every `@RequestBody`:

```java
record CreateOrderRequest(
    @NotBlank                          // not null, not ""
    String customerId,

    @NotNull @Positive                 // required and must be > 0
    BigDecimal amount,

    @Pattern(regexp = "[A-Z]{3}")      // exactly 3 uppercase letters (ISO currency code)
    String currency
) {}

@PostMapping("/orders")
public ResponseEntity<OrderResponse> placeOrder(
    @Valid @RequestBody CreateOrderRequest req  // @Valid triggers validation
) { ... }
```

When validation fails, Spring returns `400 Bad Request` automatically — before any business logic runs.

**The rule**: never trust any input from outside. Even from "trusted" internal services — always validate at HTTP boundaries.

---

### Step 5: Limit Traffic (Rate Limiting)

**The problem**: A single script can send 50,000 requests per second. Your service will go down. Every other legitimate client goes down with it. This is called a DoS (Denial of Service) attack.

**The solution**: Count requests per client (API Key, IP, userId). Exceeding the limit → `429 Too Many Requests`.

```
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718352000
```

`Retry-After: 60` is an important detail. Without it, clients retry immediately → thundering herd → the overload gets worse. With it — they wait 60 seconds and try once.

**Where to enforce**: in the API Gateway, before the request reaches your service. A service under DoS shouldn't see the traffic at all.

---

### Step 6: Add Security Headers

Small HTTP headers that tell the browser how to behave. Each one protects against a specific attack:

```
# Don't sniff the content type (prevents MIME confusion attacks)
X-Content-Type-Options: nosniff

# Don't allow embedding in iframes on other domains (prevents clickjacking)
X-Frame-Options: DENY

# Scripts only from our own domain (prevents XSS)
Content-Security-Policy: default-src 'self'

# Always use HTTPS, for one year, including subdomains
Strict-Transport-Security: max-age=31536000; includeSubDomains

# Don't send referrer to external domains
Referrer-Policy: no-referrer-when-downgrade
```

In Spring Security:
```java
http.headers(headers -> headers
    .frameOptions(frame -> frame.deny())
    .contentTypeOptions(Customizer.withDefaults())
    .httpStrictTransportSecurity(hsts -> hsts.maxAgeInSeconds(31536000))
);
```

---

### Step 7: Log Everything (Audit Log)

**Why**: when something goes wrong (security breach, bug, client dispute), you need to know what happened. In regulated environments (fintech, healthcare) it's also a legal requirement.

**What to log**:
```json
{
  "ts": "2026-06-14T10:22:01Z",
  "traceId": "abc-123",
  "userId": "u-456",
  "clientId": "billing-svc",
  "method": "POST",
  "path": "/orders",
  "status": 201,
  "ms": 45
}
```

**What NOT to log**: passwords, tokens, card numbers, personal data. Instead of `"token": "Bearer eyJ..."` log `"tokenPresent": true`.

**Correlation**: every request gets a unique `traceId` (Correlation ID). You propagate it through all services → you can trace a single request across the entire system in Splunk or Grafana.

---

### Step 8: Put an API Gateway at the Front

**The problem**: your service shouldn't have to handle all of the above separately — these are cross-cutting concerns.

**The solution**: API Gateway (Spring Cloud Gateway, Kong, AWS API GW, Nginx) sits in front of your services:

```
Client → [API Gateway] → [Your Service]
              ↓
         handles:
         - TLS termination
         - JWT validation
         - Rate limiting
         - Request logging
         - Routing
```

Your service receives an already-authenticated, pre-processed request and can focus solely on business logic.

**Additional benefit**: a single place to update security policies — change rate limits or add a new auth rule without modifying dozens of services.

---

### Step 9: Keep Security Up to Date

Security is not a state — it's a process.

- **Dependency scanning**: every sprint (Dependabot, OWASP Dependency Check) — do your libraries have known CVEs?
- **Secret rotation**: tokens, API keys, database passwords — rotate every 90 days, immediately on suspicion of compromise.
- **Pen testing**: once per quarter or after major changes.
- **OWASP checklist**: review OWASP API Security Top 10 before every major release.

---

## Technical Terms Glossary

| Term | What it is (simply) |
|---|---|
| **TLS** | Encryption protocol for network connections; `https://` uses TLS |
| **OAuth2** | Standard that lets apps act on behalf of a user without knowing their password |
| **JWT** (JSON Web Token) | A small, digitally signed document containing identity and permissions |
| **JWKS** | Public keys of the Authorization Server — your service uses them to verify JWT signatures |
| **Scope** | A named permission in OAuth2, e.g. `orders:read` = "can read orders" |
| **Rate limiting** | Restricting the number of requests per unit of time per client/IP |
| **API Gateway** | A proxy between clients and backend services handling cross-cutting concerns |
| **HSTS** | HTTP header telling the browser: always use HTTPS for this domain |
| **CSP** (Content Security Policy) | Header restricting where the browser can load resources from |
| **IDOR** | Insecure Direct Object Reference — accessing another user's resource by changing an ID |
| **DoS** | Denial of Service — flooding a service with requests to take it down |
| **Bean Validation** | Spring/Jakarta mechanism for validating objects via annotations (`@NotBlank`, `@Positive`) |
| **Correlation ID** | A unique request identifier propagated through all services for tracing |
| **CVE** | Common Vulnerabilities and Exposures — database of known software vulnerabilities |

---

## Layer Map — Who Does What

```
                    INTERNET
                       │
                ┌──────▼──────┐
                │ API Gateway  │  ← TLS termination, auth, rate limiting, logging
                └──────┬──────┘
                       │
              ┌────────▼────────┐
              │   Spring Boot   │  ← @PreAuthorize, @Valid, audit log, security headers
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │    Database     │  ← encryption at rest, least privilege DB account
              └─────────────────┘
```

---

## Most Common Gaps (OWASP API Security Top 10)

| # | Vulnerability | How to protect |
|---|---|---|
| 1 | Broken Object Level Authorization (IDOR) | Filter resources by `userId` from the token, not from the URL |
| 2 | Broken Authentication | Short token TTL, PKCE, never store secrets in code |
| 3 | Broken Object Property Level Authorization | Don't return more fields than the client should see (DTO, `@JsonView`) |
| 4 | Unrestricted Resource Consumption | Rate limiting, max request body size, pagination limits |
| 5 | Broken Function Level Authorization | Admin endpoints require a dedicated scope, not just being logged in |
| 6 | Unrestricted Access to Sensitive Business Flows | Rate limit sensitive operations (password reset, order placement) |
| 7 | Server-Side Request Forgery (SSRF) | Whitelist allowed URLs when making requests to external services |
| 8 | Security Misconfiguration | Disable debug endpoints, never expose stack traces to clients |
| 9 | Improper Inventory Management | Version your API, decommission old versions, know your endpoints |
| 10 | Unsafe Consumption of APIs | Validate responses from external APIs — don't trust them unconditionally |

---

## Sources

- [`questions/pl/12-public-api.md`](../questions/pl/12-public-api.md) — card 26: API security overview
- [`questions/pl/8-security.md`](../questions/pl/8-security.md) — cards: TLS, OAuth2, JWT, OWASP Top 10, SSRF, security headers
- [`security/security.md`](security.md) — JWT deep dive, encryption basics
- [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/editions/2023/en/0x00-header/)
- Spring Security reference: `oauth2ResourceServer`, CORS, headers configuration
