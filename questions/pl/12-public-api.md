[💡 Questions](questions.md)

# 🌍 PUBLIC API DESIGN & SECURITY

<!-- TOC -->
* [🌍 PUBLIC API DESIGN & SECURITY](#-public-api-design--security)
  * [1️⃣ API Design](#1-api-design)
      * [🔹 1. Jak projektować zasoby (resources) w REST API?](#-1-jak-projektować-zasoby-resources-w-rest-api)
      * [🔹 2. Czym jest RFC 7807 Problem Details?](#-2-czym-jest-rfc-7807-problem-details)
      * [🔹 3. Jakie są strategie wersjonowania API?](#-3-jakie-są-strategie-wersjonowania-api)
      * [🔹 4. Czym jest contract-first API design?](#-4-czym-jest-contract-first-api-design)
      * [🔹 5. Jak obsługiwać backward compatibility?](#-5-jak-obsługiwać-backward-compatibility)
  * [2️⃣ Walidacja i obsługa błędów w Spring](#2-walidacja-i-obsługa-błędów-w-spring)
      * [🔹 6. Jak działają @Valid i Bean Validation w Spring?](#-6-jak-działają-valid-i-bean-validation-w-spring)
      * [🔹 7. Jak działa @ControllerAdvice i @ExceptionHandler?](#-7-jak-działa-controlleradvice-i-exceptionhandler)
      * [🔹 8. Czym jest @Validated i czym różni się od @Valid?](#-8-czym-jest-validated-i-czym-różni-się-od-valid)
  * [3️⃣ Bezpieczeństwo API](#3-bezpieczeństwo-api)
      * [🔹 9. Jak skonfigurować OAuth2 Resource Server w Spring Boot?](#-9-jak-skonfigurować-oauth2-resource-server-w-spring-boot)
      * [🔹 10. Czym różni się opaque token od JWT i co to token introspection?](#-10-czym-różni-się-opaque-token-od-jwt-i-co-to-token-introspection)
      * [🔹 11. Jak implementować scope-based authorization w Spring Security?](#-11-jak-implementować-scope-based-authorization-w-spring-security)
      * [🔹 12. Jak działają API Keys i kiedy je stosować?](#-12-jak-działają-api-keys-i-kiedy-je-stosować)
      * [🔹 13. Jak skonfigurować CORS w Spring Security?](#-13-jak-skonfigurować-cors-w-spring-security)
  * [4️⃣ API Gateway](#4-api-gateway)
      * [🔹 14. Czym różni się API Gateway od BFF?](#-14-czym-różni-się-api-gateway-od-bff)
      * [🔹 15. Jakie funkcje realizuje API Gateway?](#-15-jakie-funkcje-realizuje-api-gateway)
      * [🔹 16. Czym jest Spring Cloud Gateway?](#-16-czym-jest-spring-cloud-gateway)
  * [5️⃣ Caching i idempotency dla API](#5-caching-i-idempotency-dla-api)
      * [🔹 17. Jak cache'ować odpowiedzi REST API?](#-17-jak-cacheować-odpowiedzi-rest-api)
      * [🔹 18. Czym jest Idempotency-Key i jak go implementować?](#-18-czym-jest-idempotency-key-i-jak-go-implementować)
  * [6️⃣ Observability API](#6-observability-api)
      * [🔹 19. Jak logować żądania API bez ujawniania wrażliwych danych?](#-19-jak-logować-żądania-api-bez-ujawniania-wrażliwych-danych)
      * [🔹 20. Jak eksponować metryki API z Micrometer + Prometheus?](#-20-jak-eksponować-metryki-api-z-micrometer--prometheus)
      * [🔹 21. Jakie metryki SLO definiować dla publicznego API?](#-21-jakie-metryki-slo-definiować-dla-publicznego-api)
  * [7️⃣ Zaawansowane wzorce](#7-zaawansowane-wzorce)
      * [🔹 22. Jak projektować API pod high availability?](#-22-jak-projektować-api-pod-high-availability)
      * [🔹 23. Czym jest deprecation strategy dla API?](#-23-czym-jest-deprecation-strategy-dla-api)
      * [🔹 24. Jak testować publiczne API?](#-24-jak-testować-publiczne-api)
      * [🔹 25. Jak dokumentować API przez OpenAPI 3.x?](#-25-jak-dokumentować-api-przez-openapi-3x)
<!-- TOC -->

---

## 1️⃣ API Design

#### 🔹 1. 🧑‍💻 ⭐⭐⭐ Jak projektować zasoby (resources) w REST API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Zasady modelowania zasobów:

- **Rzeczowniki, nie czasowniki**: `/orders`, nie `/getOrders`,
- **Hierarchia odzwierciedla relacje**: `/orders/{id}/items`,
- **Kolekcje vs singleton**: `/orders` (lista), `/orders/{id}` (jeden),
- **Czysty identyfikator w URL**: ID w path, filtry jako query params.

HTTP verbs:
- `GET /orders` — lista, `GET /orders/{id}` — jeden,
- `POST /orders` — utwórz, `PUT /orders/{id}` — zamień, `PATCH /orders/{id}` — zmień część,
- `DELETE /orders/{id}` — usuń.

Unikaj czasowników w URL: `/activate` → `PATCH /accounts/{id}` z `{"status":"active"}`.

---

#### 🔹 2. 🧙‍♂️ ⭐ Czym jest RFC 7807 Problem Details?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

RFC 7807 definiuje standard formatu błędów HTTP (`application/problem+json`):

```json
{
  "type": "https://api.example.com/errors/insufficient-funds",
  "title": "Insufficient funds",
  "status": 400,
  "detail": "Balance 50.00 PLN is lower than requested 200.00 PLN",
  "instance": "/orders/8f3b7c"
}
```

Pola:
- `type` — URI identyfikujący typ błędu (dokumentacja),
- `title` — czytelna nazwa,
- `detail` — konkretny opis dla tej instancji,
- `instance` — URI konkretnego żądania.

Spring Boot 6 / Spring Framework 6: `ProblemDetail` wbudowany w framework.

---

#### 🔹 3. 🧑‍💻 ⭐⭐⭐ Jakie są strategie wersjonowania API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**URL path** (`/v1/orders`): najczęstsze, czytelne, łatwe do routowania w API Gateway. Wada: URL powinien identyfikować zasób, nie wersję.

**Header** (`API-Version: 2`): czystszy URL, trudniejszy do cache'owania i debugowania.

**Content negotiation** (`Accept: application/vnd.myapi.v2+json`): REST-owo poprawny, uciążliwy w implementacji.

Rekomendacja dla publicznego API:
- URL versioning (pragmatyczny, szeroka akceptacja),
- wspieraj N-1 wersji,
- Sunset header przy deprecation,
- changelog i migration guide.

---

#### 🔹 4. 🧙‍♂️ ⭐ Czym jest contract-first API design?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Contract-first: najpierw piszesz spec OpenAPI (YAML/JSON), potem generujesz kod lub implementujesz ręcznie.

Zalety:
- klienci mogą zacząć integrację zanim backend jest gotowy (mock server),
- wymusza myślenie o API jako produkcie,
- kontrakt jest source of truth — nie kod.

Code-first: piszesz kod, springdoc-openapi generuje spec. Szybszy start, ale spec może być niespójna z intencją.

Dla publicznego API: contract-first zdecydowanie lepszy.

---

#### 🔹 5. 🧑‍💻 ⭐⭐ Jak obsługiwać backward compatibility?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Zmiany bezpieczne (non-breaking):
- dodanie nowego pola w response,
- dodanie opcjonalnego pola w request,
- nowy endpoint,
- nowy query param (opcjonalny).

Zmiany breaking:
- usunięcie pola,
- zmiana semantyki istniejącego pola,
- zmiana kodu HTTP,
- nowe wymagane pole w request.

Zasada Postela dla konsumenta: "be liberal in what you accept" — ignoruj nieznane pola w JSON.

Testowanie: Consumer-Driven Contract (Pact) wykrywa breaking changes przed release.

---

## 2️⃣ Walidacja i obsługa błędów w Spring

#### 🔹 6. 🧙‍♂️ ⭐⭐ Jak działają @Valid i Bean Validation w Spring?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Bean Validation (JSR-380) to standard adnotacji do walidacji obiektów.

```java
record CreateOrderRequest(
    @NotBlank String customerId,
    @NotNull @Positive BigDecimal amount,
    @Size(max = 3) @NotNull String currency
) {}

@PostMapping("/orders")
ResponseEntity<Order> create(@Valid @RequestBody CreateOrderRequest req) { }
```

Przy błędzie walidacji Spring rzuca `MethodArgumentNotValidException` → domyślnie 400.

Własne ograniczenia:
```java
@Target(FIELD) @Retention(RUNTIME) @Constraint(validatedBy = IsoDateValidator.class)
public @interface IsoDate { String message() default "Invalid date"; ... }
```

---

#### 🔹 7. 🧑‍💻 ⭐⭐⭐ Jak działa @ControllerAdvice i @ExceptionHandler?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

`@ControllerAdvice` to globalny handler wyjątków dla wszystkich kontrolerów.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(400);
        pd.setTitle("Validation failed");
        pd.setProperty("violations", ex.getBindingResult().getFieldErrors()
            .stream().map(e -> e.getField() + ": " + e.getDefaultMessage())
            .toList());
        return pd;
    }

    @ExceptionHandler(EntityNotFoundException.class)
    ProblemDetail handleNotFound(EntityNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }
}
```

Hierarchia: bardziej szczegółowy `@ExceptionHandler` ma priorytet.

---

#### 🔹 8. 🧙‍♂️ ⭐ Czym jest @Validated i czym różni się od @Valid?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

`@Valid` — standard JSR-380, kaskadowa walidacja (rekurencja na polach obiektu).

`@Validated` — Spring-specific, obsługuje **validation groups**.

```java
interface OnCreate {}
interface OnUpdate {}

record ProductRequest(
    @NotNull(groups = OnCreate.class) String name,
    @NotNull(groups = {OnCreate.class, OnUpdate.class}) BigDecimal price
) {}

@PostMapping @Validated(OnCreate.class) create(@RequestBody ProductRequest req)
@PutMapping  @Validated(OnUpdate.class) update(@RequestBody ProductRequest req)
```

`@Validated` na klasie service-owej włącza walidację parametrów metod (method-level validation via AOP).

---

## 3️⃣ Bezpieczeństwo API

#### 🔹 9. 🧙‍♂️ ⭐⭐ Jak skonfigurować OAuth2 Resource Server w Spring Boot?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Dependency: `spring-boot-starter-oauth2-resource-server`

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.example.com
          # lub jwk-set-uri: https://auth.example.com/.well-known/jwks.json
```

```java
@Bean
SecurityFilterChain api(HttpSecurity http) throws Exception {
    return http
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/actuator/health").permitAll()
            .anyRequest().authenticated())
        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
        .csrf(AbstractHttpConfigurer::disable) // stateless API
        .build();
}
```

Spring weryfikuje podpis JWT przez JWKS, `exp`, `iss`, `aud`.

---

#### 🔹 10. 🧙‍♂️ ⭐ Czym różni się opaque token od JWT i co to token introspection?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**JWT** (self-contained): zawiera claims w payload, weryfikowany lokalnie przez podpis i JWKS. Szybki (bez sieciowego call), ale nie można go unieważnić przed `exp`.

**Opaque token**: losowy string bez znaczenia. Walidacja wymaga wywołania Authorization Server (token introspection, RFC 7662).

```yaml
spring.security.oauth2.resourceserver.opaquetoken:
  introspection-uri: https://auth.example.com/introspect
  client-id: resource-server
  client-secret: ${secret}
```

Kiedy opaque:
- wymagane natychmiastowe unieważnienie tokenów,
- nie chcesz eksponować claims klientowi.

Hybrydowo: krótki JWT (5-15min) + refresh token dla balance.

---

#### 🔹 11. 🧙‍♂️ ⭐ Jak implementować scope-based authorization w Spring Security?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Scope w OAuth2 to uprawnienie do zasobu (np. `orders:read`, `orders:write`).

Spring Security mapuje scope na `SCOPE_orders:read` authorities:

```java
// W HttpSecurity:
.authorizeHttpRequests(auth -> auth
    .requestMatchers(GET, "/orders/**").hasAuthority("SCOPE_orders:read")
    .requestMatchers(POST, "/orders").hasAuthority("SCOPE_orders:write")
    .anyRequest().authenticated())

// Lub przez adnotacje:
@PreAuthorize("hasAuthority('SCOPE_orders:write')")
public Order createOrder(CreateOrderRequest req) { }
```

Fine-grained: `@PostAuthorize("returnObject.userId == authentication.name")` — sprawdza właściciela po załadowaniu.

---

#### 🔹 12. 🧙‍♂️ ⭐ Jak działają API Keys i kiedy je stosować?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

API Key to prosty sekret (losowy string) identyfikujący klienta — zazwyczaj w nagłówku `X-API-Key` lub `Authorization: ApiKey <key>`.

Kiedy stosować:
- M2M bez user context (zewnętrzny klient, partner),
- prostsze niż OAuth2 Client Credentials,
- kiedy nie potrzeba granular scopes.

Implementacja w Spring: `OncePerRequestFilter` → wyciągnij klucz → lookup w DB/cache → ustaw `SecurityContext`.

Dobre praktyki:
- przechowuj hash klucza (nie plaintext),
- rate limit per klucz,
- rotacja kluczy (wiele aktywnych jednocześnie w oknie rotacji),
- audit log każdego użycia.

---

#### 🔹 13. 🧑‍💻 ⭐⭐ Jak skonfigurować CORS w Spring Security?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Dla publicznego API serwowanego z innej domeny niż frontend — CORS musi być skonfigurowany przez Spring, nie przez `@CrossOrigin` (nie działa z Spring Security).

```java
@Bean
CorsConfigurationSource corsConfig() {
    var config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("https://app.example.com"));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization","Content-Type"));
    config.setMaxAge(3600L); // cache preflight

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
}

// W HttpSecurity:
.cors(cors -> cors.configurationSource(corsConfig()))
```

Wildcard `*` w `allowedOrigins` nie działa z `allowCredentials(true)`.

---

## 4️⃣ API Gateway

#### 🔹 14. 🧙‍♂️ ⭐ Czym różni się API Gateway od BFF?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**API Gateway**: ogólny punkt wejścia dla wszystkich klientów — auth, rate limiting, routing, load balancing. Jeden gateway dla wielu klientów.

**BFF (Backend For Frontend)**: dedykowany backend per typ klienta (web BFF, mobile BFF). Agreguje dane specyficznie dla potrzeb danego frontendu.

Problem ogólnego gateway: każdy klient dostaje ten sam response — web chce duże dane, mobile chce małe.

BFF rozwiązuje: mobile BFF zwraca uproszczony response, web BFF pełny. Kosztem: N BFF do utrzymania.

---

#### 🔹 15. 🧑‍💻 ⭐⭐ Jakie funkcje realizuje API Gateway?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**Authentication & Authorization**: weryfikacja JWT/API Key, zanim request dotrze do serwisu.

**Rate Limiting**: per klient, per endpoint, ochrona przed nadużyciami.

**Routing**: `/orders/**` → order-service, `/payments/**` → payment-service.

**Load balancing**: rozkład między instancje.

**SSL termination**: HTTPS między klientem a gateway, HTTP (lub mTLS) wewnątrz.

**Request/Response transformation**: nagłówki, formaty, agregacja.

**Observability**: centralne logowanie requestów, metryki, tracing injection.

**Caching**: response cache dla GET.

Popularne: Kong, AWS API Gateway, Azure APIM, Nginx, Spring Cloud Gateway.

---

#### 🔹 16. 🧙‍♂️ ⭐ Czym jest Spring Cloud Gateway?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Spring Cloud Gateway to reaktywny API Gateway oparty na Netty i Project Reactor.

Konfiguracja:
```yaml
spring.cloud.gateway.routes:
  - id: order-service
    uri: lb://order-service  # service discovery
    predicates:
      - Path=/api/orders/**
    filters:
      - StripPrefix=1
      - AddRequestHeader=X-Gateway-Source,scg
      - name: CircuitBreaker
        args: { name: orderCB, fallbackUri: forward:/fallback }
      - name: RequestRateLimiter
        args: { redis-rate-limiter.replenishRate: 100 }
```

Filtr globalny: `GlobalFilter` dla auth, correlation ID, logging.

Reaktywny = nie blokuje wątków przy I/O — idealny do proxy i aggregation z wieloma upstream.

---

## 5️⃣ Caching i idempotency dla API

#### 🔹 17. 🧑‍💻 ⭐ Jak cache'ować odpowiedzi REST API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**HTTP Cache-Control**:
- `Cache-Control: public, max-age=3600` — cache'owalne przez CDN i klienta,
- `Cache-Control: private, max-age=300` — tylko browser cache,
- `Cache-Control: no-store` — dane wrażliwe, nigdy nie cache'uj.

**ETag + conditional GET**:
```
Response: ETag: "abc123"
Next request: If-None-Match: "abc123"
Server: 304 Not Modified (pusta odpowiedź, zaoszczędzony bandwidth)
```

**Vary**: `Vary: Authorization` — różne cache per użytkownik.

**Aplikacyjny cache** (Redis): `@Cacheable("orders")` — zanim trafisz do DB.

Dla publicznego API: HTTP caching + CDN (CloudFront) to duże oszczędności na skali.

---

#### 🔹 18. 🧙‍♂️ ⭐⭐ Czym jest Idempotency-Key i jak go implementować?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Problem: klient nie wie czy request dotarł (timeout) → powtarza POST → duplikat transakcji.

Rozwiązanie: klient wysyła unikalny `Idempotency-Key: <uuid>` w nagłówku.

```
POST /payments
Idempotency-Key: 3d9f7c82-1234-5678-abcd-ef0123456789
```

Implementacja serwera:
1. Sprawdź Redis: czy klucz już istnieje?
2. Jeśli tak — zwróć zapamiętaną odpowiedź.
3. Jeśli nie — przetwórz, zapisz `{key → response}` w Redis z TTL (np. 24h).

Ważne: zapis do Redis powinien być atomowy z przetworzeniem (lub optimistic lock) — race condition przy równoległych requestach.

Stripe, Adyen, Wise — wszystkie implementują ten wzorzec.

---

## 6️⃣ Observability API

#### 🔹 19. 🧙‍♂️ ⭐⭐ Jak logować żądania API bez ujawniania wrażliwych danych?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Co logować: method, path, status, latency, correlation ID, user ID.
Co NIE logować: hasła, tokeny, numery kart, PII w body.

Implementacja przez `OncePerRequestFilter` lub `CommonsRequestLoggingFilter`:

```java
MDC.put("correlationId", extractOrGenerate(request));
MDC.put("userId", extractUserId(authentication));
log.info("method={} path={} status={} ms={}", method, path, status, duration);
MDC.clear();
```

Maskowanie w logach:
- `"password":"***"` — interceptor modyfikujący log body,
- Splunk: `rex` do maskowania patterns (`\b\d{16}\b` → `****`).

Prawo: GDPR wymaga możliwości usunięcia PII z logów — przechowuj userId zamiast danych osobowych.

---

#### 🔹 20. 🧙‍♂️ ⭐ Jak eksponować metryki API z Micrometer + Prometheus?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Spring Boot Actuator + Micrometer auto-konfiguruje:
- `http.server.requests` — count, sum, histogram per endpoint/method/status.

```yaml
management:
  endpoints.web.exposure.include: health,prometheus
  metrics:
    distribution:
      percentiles-histogram.http.server.requests: true
      slo.http.server.requests: 100ms,200ms,500ms,1s
```

Custom metryki:
```java
@Autowired MeterRegistry registry;
Counter.builder("orders.created").tag("currency","PLN").register(registry).increment();
```

Grafana dashboard: `rate(http_server_requests_seconds_count[5m])` — throughput per endpoint.

---

#### 🔹 21. 🧙‍♂️ ⭐ Jakie metryki SLO definiować dla publicznego API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Typowe SLI/SLO dla REST API:

**Availability**: `% żądań bez 5xx` → SLO: 99.9% (43min downtime/miesiąc).

**Latency**: `p99 < 500ms` dla endpointów read, `p99 < 1s` dla write.

**Error rate**: `% 4xx i 5xx` → alert gdy > 1% na 5 min window.

**Throughput**: req/s jako baseline — alert gdy < 50% normy.

Alerting:
- Prometheus `ALERTS` + Alertmanager,
- PagerDuty/OpsGenie przy breach SLO,
- error budget burn rate alert (szybsze reakcje niż threshold).

---

## 7️⃣ Zaawansowane wzorce

#### 🔹 22. 🧙‍♂️ ⭐ Jak projektować API pod high availability?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Warstwa API:
- **Stateless** — każda instancja obsługuje każde żądanie,
- **Session persistence** — nie przechowuj stanu w pamięci instancji,
- **Health checks** — `/actuator/health/liveness` + `/actuator/health/readiness`,
- **Graceful shutdown** — dokończ in-flight requests (Spring Boot: `server.shutdown=graceful`).

Infrastruktura:
- min 2 instancje w różnych AZ,
- HPA w Kubernetes (min replicas ≥ 2),
- PodDisruptionBudget (`maxUnavailable: 1`).

Circuit breaker na downstream dependencies — API nie może padać przez wolną bazę.

---

#### 🔹 23. 🧙‍♂️ ⭐ Czym jest deprecation strategy dla API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Fazy:
1. **Announce**: ogłoszenie deprecation z datą sunset (min 6-12 miesięcy wcześniej),
2. **Sunset header**: `Sunset: Sat, 01 Jan 2026 00:00:00 GMT` w każdej odpowiedzi deprecated endpoint,
3. **Warning header**: `Deprecation: true; msg="Use /v2/orders instead"`,
4. **Monitor usage**: alert gdy ktoś nadal używa deprecated endpoint po sunset,
5. **Remove**: usuń po sunset date.

Versioning + deprecation = razem tworzą API lifecycle management.

Changelog + migration guide muszą być dostępne zanim ogłosisz deprecation.

---

#### 🔹 24. 🧙‍♂️ ⭐ Jak testować publiczne API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Warstwy testów:

**Unit**: logika biznesowa, walidacja, mapowanie.

**Integration** (`@SpringBootTest` + Testcontainers):
```java
webTestClient.post().uri("/orders")
    .header("Authorization", "Bearer " + validToken)
    .bodyValue(request)
    .exchange()
    .expectStatus().isCreated()
    .expectBody().jsonPath("$.orderId").isNotEmpty();
```

**Contract** (Pact): sprawdzenie kontraktu z konsumentami przed każdym deploy.

**Security testing**: sprawdź że `401` bez tokenu, `403` z niewystarczającymi scope, `400` dla invalid input.

**Performance**: Gatling/k6 — test p99 latency i throughput pod obciążeniem.

---

#### 🔹 25. 🧙‍♂️ ⭐⭐ Jak dokumentować API przez OpenAPI 3.x?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

springdoc-openapi automatycznie generuje spec z kodu:

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
</dependency>
```

Wzbogacanie spec:
```java
@Operation(summary = "Place a new order", security = @SecurityRequirement(name = "bearer-jwt"))
@ApiResponse(responseCode = "201", description = "Order created")
@ApiResponse(responseCode = "400", description = "Validation failed",
    content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
@PostMapping("/orders")
public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest req) { }
```

`springdoc.api-docs.path=/api-docs` → Swagger UI na `/swagger-ui.html`.

Dla contract-first: generuj stubs z `openapi-generator-maven-plugin` zamiast pisać kontrolery ręcznie.

---

#### 🔹 26. 🧑‍💻 ⭐⭐ Jak kompleksowo zabezpieczyć publiczne REST API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Bezpieczeństwo API to warstwy — każda kolejna redukuje ryzyko, gdy poprzednia zawiedzie.

**1. Transport**: TLS 1.2+, HSTS header, bez HTTP.

**2. Autentykacja**:
- Użytkownicy: OAuth2 Authorization Code + PKCE → JWT access token (krótki TTL 5–15 min).
- Serwisy M2M: OAuth2 Client Credentials.
- Partnerzy zewnętrzni: API Keys (rotowane, odwoływalne).

**3. Autoryzacja**: scope-based (`orders:read`, `orders:write`) + `@PreAuthorize` na metodzie.

**4. Walidacja inputu**: `@Valid` + Bean Validation na każdym `@RequestBody`. Odrzucaj nieznane pola.

**5. Rate limiting**: w API Gateway — per klucz/IP, `429 + Retry-After`.

**6. Security headers**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.

**7. Audit logging**: każde żądanie z userId/clientId, endpoint, status — bez PII/tokenów w logach.

**8. API Gateway jako pierwsza linia**: auth, rate limit, TLS termination zanim żądanie dotrze do serwisu.

**9. Regularne**: dependency scanning (CVE), pen testing, OWASP Top 10 checklist.
