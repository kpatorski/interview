[Back to interview](../interview.md)

# Jak kompleksowo zabezpieczyć publiczne REST API?

<!-- TOC -->
* [TL;DR](#tldr)
* [Analogia — Bank z recepcją](#analogia--bank-z-recepcją)
* [Jak to działa — krok po kroku](#jak-to-działa--krok-po-kroku)
  * [Krok 1: Zaszyfruj kanał (TLS)](#krok-1-zaszyfruj-kanał-tls)
  * [Krok 2: Sprawdź tożsamość (Autentykacja)](#krok-2-sprawdź-tożsamość-autentykacja)
  * [Krok 3: Sprawdź uprawnienia (Autoryzacja)](#krok-3-sprawdź-uprawnienia-autoryzacja)
  * [Krok 4: Waliduj każdy bajt danych wejściowych](#krok-4-waliduj-każdy-bajt-danych-wejściowych)
  * [Krok 5: Ogranicz ruch (Rate Limiting)](#krok-5-ogranicz-ruch-rate-limiting)
  * [Krok 6: Dodaj security headers](#krok-6-dodaj-security-headers)
  * [Krok 7: Loguj wszystko (Audit Log)](#krok-7-loguj-wszystko-audit-log)
  * [Krok 8: Postaw API Gateway jako pierwszą linię obrony](#krok-8-postaw-api-gateway-jako-pierwszą-linię-obrony)
  * [Krok 9: Utrzymuj zabezpieczenia w czasie](#krok-9-utrzymuj-zabezpieczenia-w-czasie)
* [Pojęcia techniczne](#pojęcia-techniczne)
* [Mapa warstw — gdzie co realizujesz](#mapa-warstw--gdzie-co-realizujesz)
* [Najczęstsze luki (OWASP API Security Top 10)](#najczęstsze-luki-owasp-api-security-top-10)
* [Źródła](#źródła)
<!-- TOC -->

---

## TL;DR

Publiczne API to drzwi do Twojego systemu otwarte na internet — każdy może zapukać.
Zabezpieczenie to nie jeden zamek, ale **osiem warstw**: szyfrowanie rozmowy, sprawdzenie tożsamości, sprawdzenie uprawnień, walidacja danych, limit żądań, bezpieczne nagłówki, audit log i brama wejściowa.
Jedna warstwa to za mało — gdy jedna zawiedzie, kolejna zatrzymuje atak.

---

## Analogia — Bank z recepcją

Wyobraź sobie budynek banku ze skarbcem w środku.

| Warstwa bezpieczeństwa | Odpowiednik w banku |
|---|---|
| TLS (szyfrowanie) | Szyba kuloodporna i zaszyfrowane telefony — nikt z zewnątrz nie słyszy rozmowy |
| Autentykacja | Ochroniarz przy wejściu sprawdzający dowód tożsamości |
| Autoryzacja | Różne karty dostępu — klient idzie do okienka, nie do skarbca |
| Walidacja inputu | Bramka metalowa — nie wnosisz czegoś co nie powinno wejść |
| Rate limiting | Kolejka — jeden klient nie może zająć wszystkich kas jednocześnie |
| Security headers | Regulamin wywwieszony na drzwiach — co wolno, czego nie |
| Audit log | Kamera i rejestr odwiedzin — kto, kiedy, co robił |
| API Gateway | Recepcja — pierwsza osoba którą spotykasz, zanim dostaniesz się do pracownika |

Każde zabezpieczenie działa niezależnie. Jeśli ochroniarz nie zauważy fałszywego dowodu, kamera i tak nagra twarz. Jeśli karta dostępu nie przejdzie, skarbiec i tak pozostaje zamknięty.

---

## Jak to działa — krok po kroku

### Krok 1: Zaszyfruj kanał (TLS)

**Problem**: Dane w internecie przepływają przez dziesiątki serwerów pośrednich. Każdy z nich może je odczytać, jeśli lecą "gołe".

**Rozwiązanie**: TLS (to co stoi za `https://`) tworzy zaszyfrowany tunel. Nikt po drodze nie widzi treści — tylko że dwa adresy IP rozmawiają.

**W praktyce**:
```
# Certyfikat (Let's Encrypt — darmowy, auto-renewal)
# HSTS header — mówi przeglądarce: nigdy nie używaj HTTP dla tej domeny
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Luka bez tego**: haker w tej samej sieci Wi-Fi (kawiarnia, lotnisko) widzi wszystkie Twoje tokeny i dane — "man in the middle attack".

---

### Krok 2: Sprawdź tożsamość (Autentykacja)

**Problem**: Kto puka? API jest publiczne — może pukać ktokolwiek.

Trzy rodzaje klientów, trzy strategie:

#### Użytkownik z aplikacji/przeglądarki → OAuth2 + JWT

```
1. Użytkownik klika "Zaloguj" w aplikacji
2. Aplikacja przekierowuje do Authorization Servera (Keycloak, Auth0, własny)
3. Użytkownik podaje login/hasło TAM, nie w aplikacji
4. Authorization Server zwraca access token (JWT) — mały dokument z cyfrowym podpisem
5. Aplikacja dołącza token do każdego żądania: Authorization: Bearer <token>
6. Twój serwis weryfikuje podpis (JWKS) — bez pytania Authorization Servera
```

Dlaczego JWT? Bo podpis kryptograficzny gwarantuje autentyczność bez dodatkowego sieciowego call.
Ważne: krótki TTL (5–15 minut) — jeśli token wycieknie, szybko wygaśnie.

#### Serwis do serwisu (M2M) → OAuth2 Client Credentials

```
Billing Service → zamawia token: POST /token
  client_id=billing-svc
  client_secret=<sekret>
  grant_type=client_credentials
← dostaje access token (JWT)
→ używa tokenu do wywołania Orders API
```

Nie ma "użytkownika" — serwis działa we własnym imieniu.

#### Partner zewnętrzny → API Key

```
X-API-Key: sk_live_abc123xyz
```

Prostsze niż OAuth2, ale token nie wygasa automatycznie — trzeba rotować ręcznie i natychmiast odwołać przy kompromitacji.

---

### Krok 3: Sprawdź uprawnienia (Autoryzacja)

**Problem**: Wiesz kto puka — ale co mu wolno? Zalogowany użytkownik nie powinien widzieć danych innych użytkowników.

**Rozwiązanie**: Token (JWT) zawiera listę uprawnień (scopes). Serwer sprawdza czy token ma właściwy scope dla danej operacji.

```java
// Spring Security: automatycznie z tokenu JWT
@GetMapping("/orders")
@PreAuthorize("hasAuthority('SCOPE_orders:read')")
public List<Order> getMyOrders(Authentication auth) {
    // WAŻNE: filtruj po userId z tokenu, nie z parametru URL
    String userId = auth.getName();
    return orderRepository.findByUserId(userId);
}
```

**Typowy błąd — IDOR**: endpoint `/orders/{id}` bez sprawdzenia czy zamówienie należy do zalogowanego użytkownika. Zmień `id` w URL → dostaniesz cudze zamówienie. Autentykacja zadziałała, autoryzacja — nie.

---

### Krok 4: Waliduj każdy bajt danych wejściowych

**Problem**: Klient może wysłać dosłownie cokolwiek jako JSON. `"amount": -99999` albo `"script": "<script>alert('xss')</script>"`.

**Rozwiązanie**: Bean Validation (Jakarta Validation) na każdym `@RequestBody`:

```java
record CreateOrderRequest(
    @NotBlank                          // nie null, nie ""
    String customerId,

    @NotNull @Positive                 // wymagane, musi być > 0
    BigDecimal amount,

    @Pattern(regexp = "[A-Z]{3}")      // tylko 3 wielkie litery (kod waluty ISO)
    String currency
) {}

@PostMapping("/orders")
public ResponseEntity<OrderResponse> placeOrder(
    @Valid @RequestBody CreateOrderRequest req  // @Valid uruchamia walidację
) { ... }
```

Gdy walidacja się nie powiedzie, Spring zwraca `400 Bad Request` automatycznie — zanim wykonasz jakikolwiek kod biznesowy.

**Zasada**: nigdy nie ufaj żadnemu inputowi z zewnątrz. Nawet od "zaufanych" serwisów wewnętrznych — na granicach HTTP zawsze walidacja.

---

### Krok 5: Ogranicz ruch (Rate Limiting)

**Problem**: Jeden skrypt może wysłać 50 000 żądań na sekundę. Twój serwis padnie. Wszyscy inni klienci też przestaną działać. To się nazywa DoS (Denial of Service).

**Rozwiązanie**: Policz żądania per klient (API Key, IP, userId). Przekroczenie limitu → `429 Too Many Requests`.

```
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718352000
```

`Retry-After: 60` to ważny szczegół. Bez niego klienci retryują natychmiast → thundering herd → problem się pogłębia. Z nim — czekają 60 sekund i próbują raz.

**Gdzie realizować**: w API Gateway (Kong, AWS API Gateway, Spring Cloud Gateway) — zanim żądanie dotrze do serwisu. Serwis, który jest pod DoS, nie powinien w ogóle widzieć ruchu.

---

### Krok 6: Dodaj security headers

Małe nagłówki HTTP, które mówią przeglądarce jak ma się zachować. Każdy chroni przed konkretnym atakiem:

```
# Nie sniff-uj typu pliku (ochrona przed MIME confusion attacks)
X-Content-Type-Options: nosniff

# Nie pozwól osadzić w iframe na innych domenach (ochrona przed clickjacking)
X-Frame-Options: DENY

# Skrypty tylko z naszej domeny (ochrona przed XSS)
Content-Security-Policy: default-src 'self'

# Zawsze HTTPS, przez rok, w tym subdomeny
Strict-Transport-Security: max-age=31536000; includeSubDomains

# Nie wysyłaj referrer do innych domen
Referrer-Policy: no-referrer-when-downgrade
```

W Spring Security:
```java
http.headers(headers -> headers
    .frameOptions(frame -> frame.deny())
    .contentTypeOptions(Customizer.withDefaults())
    .httpStrictTransportSecurity(hsts -> hsts.maxAgeInSeconds(31536000))
);
```

---

### Krok 7: Loguj wszystko (Audit Log)

**Po co**: gdy coś pójdzie nie tak (naruszenie bezpieczeństwa, błąd, spór z klientem), musisz wiedzieć co się stało. W środowiskach regulowanych (fintech, healthcare) to też wymóg prawny.

**Co logować**:
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

**Czego NIE logować**: hasła, tokeny, numery kart, PESEL, pełne dane osobowe. Zamiast `"token": "Bearer eyJ..."` loguj `"tokenPresent": true`.

**Korelacja**: każde żądanie dostaje unikalny `traceId` (Correlation ID). Przekazujesz go przez wszystkie serwisy → możesz prześledzić jedno żądanie przez cały system w Splunk/Grafana.

---

### Krok 8: Postaw API Gateway jako pierwszą linię obrony

**Problem**: Twój serwis nie powinien martwić się o wszystkie powyższe rzeczy osobno — to cross-cutting concern.

**Rozwiązanie**: API Gateway (Spring Cloud Gateway, Kong, AWS API GW, Nginx) przed serwisami:

```
Klient → [API Gateway] → [Twój serwis]
              ↓
         realizuje:
         - TLS termination
         - JWT validation
         - Rate limiting
         - Request logging
         - Routing
```

Serwis otrzymuje już uwierzytelnione, przetworzone żądanie. Skupia się tylko na logice biznesowej.

**Dodatkowa korzyść**: jeden punkt do aktualizacji polityk bezpieczeństwa — zmiana rate limitów, dodanie nowej reguły auth — bez modyfikacji dziesiątek serwisów.

---

### Krok 9: Utrzymuj zabezpieczenia w czasie

Bezpieczeństwo to nie stan — to proces.

- **Dependency scanning**: co sprincie (Dependabot, OWASP Dependency Check) — czy Twoje biblioteki nie mają znanych CVE?
- **Secret rotation**: tokeny, API klucze, hasła do bazy — zmieniaj co 90 dni, natychmiast przy podejrzeniu kompromitacji.
- **Pen testing**: raz na kwartał lub po dużych zmianach.
- **OWASP checklist**: przed każdym major release przejrzyj OWASP API Security Top 10.

---

## Pojęcia techniczne

| Termin | Co to jest (prosto) |
|---|---|
| **TLS** | Protokół szyfrowania połączenia sieciowego; `https://` używa TLS |
| **OAuth2** | Standard pozwalający aplikacjom działać w imieniu użytkownika bez znajomości jego hasła |
| **JWT** (JSON Web Token) | Mały, podpisany cyfrowo dokument zawierający tożsamość i uprawnienia |
| **JWKS** | Publiczne klucze Authorization Servera — serwis używa ich do weryfikacji podpisu JWT |
| **Scope** | Nazwane uprawnienie w OAuth2, np. `orders:read` = "może odczytywać zamówienia" |
| **Rate limiting** | Ograniczenie liczby żądań w jednostce czasu per klient/IP |
| **API Gateway** | Serwis pośredniczący między klientem a backendowymi serwisami |
| **HSTS** | Nagłówek HTTP mówiący przeglądarce: zawsze używaj HTTPS dla tej domeny |
| **CSP** (Content Security Policy) | Nagłówek ograniczający skąd przeglądarka może ładować zasoby |
| **IDOR** | Insecure Direct Object Reference — dostęp do zasobu innego użytkownika przez zmianę ID |
| **DoS** | Denial of Service — atak polegający na zalaniu serwisu żądaniami |
| **Bean Validation** | Mechanizm Spring/Jakarta do walidacji obiektów przez adnotacje (`@NotBlank`, `@Positive`) |
| **Correlation ID** | Unikalny identyfikator żądania propagowany przez cały system do celów tracingu |
| **CVE** | Common Vulnerabilities and Exposures — baza znanych luk w oprogramowaniu |

---

## Mapa warstw — gdzie co realizujesz

```
                    INTERNET
                       │
                ┌──────▼──────┐
                │ API Gateway  │  ← TLS termination, auth, rate limiting, logging
                └──────┬──────┘
                       │
              ┌────────▼────────┐
              │   Twój serwis   │  ← autoryzacja (@PreAuthorize), walidacja inputu
              │  Spring Boot    │     audit log, security headers
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │    Baza danych  │  ← szyfrowanie at-rest, least privilege konta DB
              └─────────────────┘
```

---

## Najczęstsze luki (OWASP API Security Top 10)

| # | Luka | Jak chronić |
|---|---|---|
| 1 | Broken Object Level Authorization (IDOR) | Filtruj zasoby po userId z tokenu, nie z URL |
| 2 | Broken Authentication | Krótkie TTL tokenów, PKCE, nie przechowuj sekretów w kodzie |
| 3 | Broken Object Property Level Authorization | Nie zwracaj więcej pól niż klient powinien widzieć (DTO, @JsonView) |
| 4 | Unrestricted Resource Consumption | Rate limiting, max request body size, pagination limit |
| 5 | Broken Function Level Authorization | Endpointy admin wymagają osobnego scope, nie tylko zalogowania |
| 6 | Unrestricted Access to Sensitive Business Flows | Rate limit na wrażliwe operacje (reset hasła, zamówienie) |
| 7 | Server-Side Request Forgery (SSRF) | Whitelist dozwolonych URL w żądaniach do zewnętrznych serwisów |
| 8 | Security Misconfiguration | Disable debug endpoints, nie eksponuj stack trace klientom |
| 9 | Improper Inventory Management | Wersjonuj API, wyłączaj stare wersje, znaj swoje endpointy |
| 10 | Unsafe Consumption of APIs | Waliduj odpowiedzi od zewnętrznych API, nie ufaj im bezwarunkowo |

---

## Źródła

- [`questions/pl/12-public-api.md`](../questions/pl/12-public-api.md) — karta 26: overview zabezpieczenia API
- [`questions/pl/8-security.md`](../questions/pl/8-security.md) — karty: TLS, OAuth2, JWT, OWASP Top 10, SSRF, security headers
- [`security/security.md`](security.md) — JWT deep dive, encryption
- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x00-header/)
- Spring Security docs: `oauth2ResourceServer`, CORS, headers
