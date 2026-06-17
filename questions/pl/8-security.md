[💡 Questions](questions.md)

# 🛡 BEZPIECZEŃSTWO

<!-- TOC -->
* [🛡 BEZPIECZEŃSTWO](#-bezpieczeństwo)
  * [1️⃣ Podstawy Kryptografii](#1-podstawy-kryptografii)
      * [🔹 1. Czym różni się szyfrowanie od haszowania?](#-1-czym-różni-się-szyfrowanie-od-haszowania)
      * [🔹 2. Czym jest salt i dlaczego jest ważny?](#-2-czym-jest-salt-i-dlaczego-jest-ważny)
  * [2️⃣ TLS i Transport](#2-tls-i-transport)
      * [🔹 3. Jak działa TLS w skrócie?](#-3-jak-działa-tls-w-skrócie)
  * [3️⃣ OWASP i Najczęstsze Ataki](#3-owasp-i-najczęstsze-ataki)
      * [🔹 4. Czym jest SQL Injection?](#-4-czym-jest-sql-injection)
      * [🔹 5. Czym jest XSS?](#-5-czym-jest-xss)
      * [🔹 6. Czym jest CSRF?](#-6-czym-jest-csrf)
  * [4️⃣ Autoryzacja i Dostęp](#4-autoryzacja-i-dostęp)
      * [🔹 7. Czym jest RBAC vs ABAC?](#-7-czym-jest-rbac-vs-abac)
      * [🔹 8. Jak zabezpieczać sekrety w systemie?](#-8-jak-zabezpieczać-sekrety-w-systemie)
<!-- TOC -->

---

## 1️⃣ Podstawy Kryptografii

#### 🔹 1. 🧑‍💻 Czym różni się szyfrowanie od haszowania?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Szyfrowanie:
- Proces odwracalny.
- Używa klucza do zaszyfrowania i odszyfrowania danych.
- Stosowane do ochrony poufności (np. TLS).

Haszowanie:
- Proces nieodwracalny.
- Generuje skrót o stałej długości.
- Stosowane do przechowywania haseł.

Hasło nie powinno być szyfrowane — powinno być haszowane.

---

#### 🔹 2. 🧑‍💻 Czym jest salt i dlaczego jest ważny?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Salt to losowa wartość dodawana do hasła przed haszowaniem.

Zapobiega:
- atakom rainbow table,
- identycznym hashom dla tych samych haseł.

Każde hasło powinno mieć unikalny salt.

---

## 2️⃣ TLS i Transport

#### 🔹 3. 🧑‍💻 Jak działa TLS w skrócie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

TLS zapewnia poufność i integralność komunikacji.

Proces:
1. Handshake.
2. Wymiana kluczy (asymetryczna kryptografia).
3. Ustalenie klucza symetrycznego.
4. Szyfrowana komunikacja.

Chroni przed:
- podsłuchem,
- modyfikacją danych.

---

## 3️⃣ OWASP i Najczęstsze Ataki

#### 🔹 4. 🧑‍💻 Czym jest SQL Injection?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

SQL Injection to wstrzyknięcie złośliwego kodu SQL do zapytania.

Przyczyna:
- Konkatenacja stringów zamiast parametrów.

Zapobieganie:
- PreparedStatement,
- ORM,
- walidacja danych.

---

#### 🔹 5. 🧑‍💻 Czym jest XSS?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

XSS (Cross-Site Scripting):
- Wstrzyknięcie złośliwego skryptu do strony.

Rodzaje:
- Stored
- Reflected
- DOM-based

Zapobieganie:
- Escaping danych,
- CSP (Content Security Policy).

---

#### 🔹 6. 🧑‍💻 Czym jest CSRF?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

CSRF (Cross-Site Request Forgery):
- Wysłanie żądania w imieniu zalogowanego użytkownika bez jego wiedzy.

Ochrona:
- CSRF token,
- SameSite cookies.

---

## 4️⃣ Autoryzacja i Dostęp

#### 🔹 7. 🧑‍💻 Czym jest RBAC vs ABAC?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

RBAC (Role-Based Access Control):
- Uprawnienia przypisane do ról.

ABAC (Attribute-Based Access Control):
- Decyzja na podstawie atrybutów (rola, czas, lokalizacja).

ABAC daje większą elastyczność kosztem złożoności.

---

#### 🔹 8. 🧑‍💻 Jak zabezpieczać sekrety w systemie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Nie powinny być:
- w kodzie,
- w repozytorium,
- w obrazach Docker.

Powinny być:
- w Secret Manager (Vault, AWS Secrets Manager),
- w zmiennych środowiskowych,
- rotowane cyklicznie.

Zasada: najmniejsze możliwe uprawnienia (least privilege).

---

#### 🔹 9. 🧑‍💻 Jaka jest struktura JWT i jak go weryfikować?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

JWT = `header.payload.signature`, każda część zakodowana Base64URL.

**Header**: algorytm (`alg: RS256`) + typ.
**Payload**: claims (sub, iss, exp, iat, role...).
**Signature**: podpis HMAC lub RSA/ECDSA.

Weryfikacja:
1. Sprawdź podpis kluczem publicznym (JWKS endpoint).
2. Sprawdź `exp` (expiration).
3. Sprawdź `iss` (issuer) i `aud` (audience).

Nigdy nie ufaj payload bez weryfikacji podpisu. Nie przechowuj danych wrażliwych w payload.

---

#### 🔹 10. 🧑‍💻 Jakie są przepływy OAuth2?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**Authorization Code** (z PKCE): przeglądarka/mobile → najbezpieczniejszy, code wymieniony na token po stronie serwera.

**Client Credentials**: serwis-do-serwisu (M2M), bez udziału użytkownika. Client ID + Secret → access token.

**Implicit**: przestarzały, token w URL — nie używać.

**Resource Owner Password**: przestarzały — bezpośrednio hasło do OAuth serwera.

Senior powinien wiedzieć: Authorization Code + PKCE dla aplikacji user-facing, Client Credentials dla M2M.

---

#### 🔹 11. 🧑‍💻 Czym jest PKCE i dlaczego jest ważne?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

PKCE (Proof Key for Code Exchange) — rozszerzenie Authorization Code chroniące przed przechwyceniem authorization code.

Mechanizm:
1. Klient generuje losowy `code_verifier`.
2. Wysyła `code_challenge = SHA256(code_verifier)` z żądaniem autoryzacji.
3. Po otrzymaniu kodu, wysyła `code_verifier` przy wymianie na token.
4. Server weryfikuje hash.

Nawet jeśli authorization code wycieknie — jest bezużyteczny bez `code_verifier`.
Obowiązkowe dla SPA i mobile apps.

---

#### 🔹 12. 🧙‍♂️ Czym jest OIDC?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

OIDC (OpenID Connect) to warstwa tożsamości nad OAuth2.

OAuth2 = autoryzacja (co możesz zrobić).
OIDC = uwierzytelnienie (kto jesteś).

OIDC dodaje:
- **ID Token** (JWT z danymi użytkownika: sub, email, name),
- standardowy endpoint `/.well-known/openid-configuration`,
- endpoint `userinfo`.

Keycloak, Auth0, Google, AWS Cognito implementują OIDC.

---

#### 🔹 13. 🧙‍♂️ Czym jest Broken Access Control (OWASP #1)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Broken Access Control — użytkownik może wykonać akcję lub zobaczyć dane do których nie powinien mieć dostępu.

Przykłady:
- IDOR (Insecure Direct Object Reference): `/orders/12345` — zmień ID i dostaniesz cudzą zamówienie,
- privilege escalation: zwykły user dostaje admin endpoint,
- brakujące sprawdzenie uprawnień przy DELETE/PUT.

Mitygacja:
- sprawdzaj uprawnienia na serwerze, nie tylko ukrywaj w UI,
- DENY by default,
- testy autoryzacji jako część CI.

---

#### 🔹 14. 🧑‍💻 Czym jest SSRF (Server-Side Request Forgery)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

SSRF: atakujący zmusza serwer do wysłania żądania HTTP do dowolnego adresu — w tym infrastruktury wewnętrznej.

Przykład: endpoint `?url=http://...` — atakujący podaje `http://169.254.169.254/latest/meta-data/` (AWS metadata).

Mitygacja:
- allowlist adresów URL,
- blokada połączeń do 169.254.x.x, 10.x.x.x, 172.16.x.x,
- nie przekazuj zewnętrznych URL-i bezpośrednio do HTTP klienta.

---

#### 🔹 15. 🧙‍♂️ Jakie security headers powinien zwracać serwer?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

- **HSTS** (`Strict-Transport-Security`) — wymusza HTTPS,
- **CSP** (`Content-Security-Policy`) — ogranicza skąd mogą ładować się zasoby (ochrona XSS),
- **X-Frame-Options: DENY** — blokuje osadzanie w iframie (clickjacking),
- **X-Content-Type-Options: nosniff** — blokuje MIME type sniffing,
- **Referrer-Policy** — kontroluje co trafia w nagłówku Referer.

Spring Security ustawia większość domyślnie. Sprawdź przez [securityheaders.com](https://securityheaders.com).

---

#### 🔹 16. 🧑‍💻 Czym jest Injection (OWASP Top 10)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Injection to wstrzykiwanie złośliwych danych interpretowanych jako kod/polecenie.

Rodzaje:
- **SQL Injection** — nieprzypadkowe zapytania SQL,
- **Command Injection** — `Runtime.exec()` z danymi od użytkownika,
- **LDAP Injection** — manipulacja zapytaniami LDAP,
- **Log Injection** — wstrzykiwanie nowych linii do logów.

Mitygacja:
- parameterized queries / prepared statements,
- walidacja i sanityzacja wejścia,
- unikaj `Runtime.exec()` z danymi zewnętrznymi.

---

#### 🔹 17. 🧑‍💻 Czym jest Security Misconfiguration?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Jedna z najczęstszych klas błędów (OWASP Top 10 #5).

Przykłady:
- domyślne hasła (admin/admin),
- włączony debug/stack trace na produkcji,
- otwarte S3 bucket,
- niepotrzebne otwarte porty,
- brak HTTPS.

Mitygacja:
- hardening guide dla każdej technologii,
- Infrastructure as Code (nie "ręczna" konfiguracja),
- regularne security scany (DAST, infrastructure scans),
- zasada minimal exposure.

---

#### 🔹 18. 🧑‍💻 Jak wdrożyć audit logging?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Audit log rejestruje kto, co i kiedy zrobił — niezbędny do compliance (GDPR, PCI-DSS) i forensics.

Powinien zawierać:
- userId, IP, timestamp,
- akcja i zasób (np. `ORDER_CANCELLED orderId=123`),
- wynik (sukces/porażka).

Ważne:
- nie loguj danych wrażliwych (haseł, numerów kart),
- logi powinny być niemodyfikowalne (append-only, WORM storage),
- separacja od application logs.

---

#### 🔹 19. 🧙‍♂️ Czym jest zasada least privilege?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Least Privilege: każdy komponent systemu powinien mieć tylko minimalne uprawnienia niezbędne do działania.

Przykłady:
- serwis aplikacji: `SELECT, INSERT` na swojej tabeli, nie `GRANT ALL`,
- pod K8s: tylko RBAC do swoich ConfigMap/Secret,
- IAM role dla AWS: tylko S3 do konkretnego bucket,
- developer: read-only do prod, pełen dostęp do dev.

Ogranicza blast radius przy kompromitacji komponentu.

---

#### 🔹 20. 🧑‍💻 Czym jest secret rotation i jak ją zautomatyzować?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Secret rotation to cykliczna wymiana kluczy/haseł bez downtime.

Problem: aplikacja musi obsługiwać stary i nowy sekret w oknie rotacji.

Automatyzacja:
- **HashiCorp Vault dynamic secrets** — Vault generuje tymczasowe credentiale do DB (TTL np. 1h),
- **AWS Secrets Manager** — automatyczna rotacja co N dni z Lambda,
- **Kubernetes External Secrets** — synchronizuje rotowane sekrety do podów.

Zero-downtime rotation: najpierw dodaj nowy sekret, poczekaj na propagację, usuń stary.

---

#### 🔹 21. 🧙‍♂️ Czym jest supply chain security?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Supply chain security to ochrona przed atakami przez zależności (biblioteki, obrazy, pipeline CI).

Zagrożenia:
- złośliwa biblioteka w npm/Maven (typosquatting, kompromitacja maintainera),
- podatności w base image,
- kompromitacja CI/CD.

Mitygacja:
- **SBOM** (Software Bill of Materials) — inwentarz wszystkich zależności,
- skanowanie zależności (Snyk, Dependabot, OWASP Dependency-Check),
- image signing (Cosign, Sigstore),
- private artifact repository (Nexus, Artifactory) — cache i scan przed użyciem.

---

#### 🔹 22. 🧙‍♂️ Czym jest Zero Trust Architecture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Zero Trust: "Never trust, always verify" — brak domyślnego zaufania nawet wewnątrz sieci.

Założenie: sieć wewnętrzna jest skompromitowana.

Filar:
- każde żądanie wymaga uwierzytelnienia i autoryzacji,
- mTLS między serwisami,
- least privilege,
- mikrosegmentacja sieci,
- continuous monitoring.

Kontrast z tradycyjnym modelem: "twierdza" z zaufanym wnętrzem.

---

#### 🔹 23. 🧙‍♂️ Jak chronić przed Broken Authentication?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Broken Authentication (OWASP Top 10 #7) — słabe mechanizmy uwierzytelnienia.

Typowe błędy:
- słabe hasła (brak polityki),
- brak MFA,
- sesje nie wygasają,
- credential stuffing (brak rate limiting na login),
- JWT z algorytmem `alg: none`.

Mitygacja:
- MFA,
- bcrypt/Argon2 do haseł,
- rate limiting na endpoint logowania,
- weryfikacja `alg` w JWT (nie przyjmuj `none`).

---

#### 🔹 24. 🧑‍💻 Czym jest path traversal?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Path traversal (directory traversal): atakujący manipuluje ścieżką pliku by uzyskać dostęp poza dozwolonym katalogiem.

Przykład: `?file=../../etc/passwd`.

Mitygacja:
- walidacja i normalizacja ścieżki (`Path.normalize()`, `toRealPath()`),
- sprawdzenie czy wynikowa ścieżka jest wewnątrz dozwolonego katalogu,
- nie przekazuj ścieżek od użytkownika bezpośrednio do API systemu plików,
- sandboxed filesystem access.

---

#### 🔹 25. 🧑‍💻 Czym jest Sensitive Data Exposure?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Sensitive Data Exposure (OWASP): nieumyślne ujawnienie danych wrażliwych.

Przykłady:
- stack trace z danymi w response API,
- hasła w logach,
- numery kart w URL (GET request trafia do logów serwera),
- dane w cache bez szyfrowania.

Mitygacja:
- klasyfikuj dane (PII, PCI, PHI),
- szyfruj w spoczynku (AES-256) i w transporcie (TLS),
- maskuj w logach (`password=***`),
- GDPR: minimalizuj zbieranie i czas przechowywania danych.

