[💡 Questions](questions.md)

# 🌐 MIKROSERWISY

<!-- TOC -->
* [🌐 MIKROSERWISY](#-mikroserwisy)
  * [1️⃣ Fundamenty Mikroserwisów](#1-fundamenty-mikroserwisów)
      * [🔹 1. Jak wyznaczać granice mikroserwisów?](#-1-jak-wyznaczać-granice-mikroserwisów)
      * [🔹 2. Synchroniczna vs asynchroniczna komunikacja — kiedy co?](#-2-synchroniczna-vs-asynchroniczna-komunikacja--kiedy-co)
      * [🔹 3. Czym jest API Gateway?](#-3-czym-jest-api-gateway)
  * [2️⃣ Odporność i Stabilność](#2-odporność-i-stabilność)
      * [🔹 4. Czym jest Circuit Breaker?](#-4-czym-jest-circuit-breaker)
      * [🔹 5. Czym jest retry i jakie są ryzyka?](#-5-czym-jest-retry-i-jakie-są-ryzyka)
      * [🔹 6. Czym jest idempotency i jak ją osiągnąć?](#-6-czym-jest-idempotency-i-jak-ją-osiągnąć)
  * [3️⃣ Spójność w systemie rozproszonym](#3-spójność-w-systemie-rozproszonym)
      * [🔹 7. Czym jest Saga?](#-7-czym-jest-saga)
      * [🔹 8. Czym jest Outbox Pattern?](#-8-czym-jest-outbox-pattern)
      * [🔹 9. Dlaczego współdzielona baza danych między mikroserwisami jest problemem?](#-9-dlaczego-współdzielona-baza-danych-między-mikroserwisami-jest-problemem)
  * [4️⃣ Obserwowalność](#4-obserwowalność)
      * [🔹 10. Czym jest observability w mikroserwisach?](#-10-czym-jest-observability-w-mikroserwisach)
<!-- TOC -->

---

## 1️⃣ Fundamenty Mikroserwisów

#### 🔹 1. 🧙‍♂️ ⭐⭐⭐ Jak wyznaczać granice mikroserwisów?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Granice mikroserwisów powinny wynikać z domeny biznesowej, nie z podziału technicznego.

Typowe podejścia:
- Bounded Context (DDD) jako granica serwisu.
- Wysoka spójność wewnątrz serwisu, niskie sprzężenie między serwisami.

Zły znak:
- Silne transakcje rozproszone.
- Wspólna baza danych między serwisami.

---

#### 🔹 2. 🧙‍♂️ ⭐⭐⭐ Synchroniczna vs asynchroniczna komunikacja — kiedy co?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Synchroniczna (HTTP/gRPC):
- Prostota.
- Natychmiastowa odpowiedź.
- Ryzyko propagacji awarii i większa latencja.

Asynchroniczna (Kafka/RabbitMQ):
- Luźniejsze powiązania.
- Lepsza odporność.
- Eventual consistency.
- Większa złożoność (idempotency, retry, ordering).

W praktyce często miesza się oba podejścia.

---

#### 🔹 3. 🧑‍💻 ⭐⭐⭐ Czym jest API Gateway?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

API Gateway to punkt wejścia do systemu mikroserwisów.

Funkcje:
- routing,
- auth,
- rate limiting,
- agregacja danych,
- observability.

Zaleta:
- klient nie musi znać topologii mikroserwisów.

Ryzyko:
- single point of failure (trzeba skalować i zabezpieczać).

---

## 2️⃣ Odporność i Stabilność

#### 🔹 4. 🧑‍💻 ⭐⭐⭐ Czym jest Circuit Breaker?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Circuit Breaker chroni system przed kaskadową awarią.

Stany:
- Closed — ruch przechodzi.
- Open — ruch blokowany, szybka porażka (fail fast).
- Half-open — testowe requesty.

Stosowany przy komunikacji synchronicznej.

---

#### 🔹 5. 🧑‍💻 ⭐⭐ Czym jest retry i jakie są ryzyka?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Retry to ponawianie żądania po błędzie.

Ryzyka:
- powielanie operacji (brak idempotency),
- retry storm (wiele usług retry jednocześnie),
- wzrost obciążenia i pogorszenie awarii.

Dobre praktyki:
- exponential backoff,
- jitter,
- limit prób,
- idempotency key.

---

#### 🔹 6. 🧑‍💻 ⭐⭐⭐ Czym jest idempotency i jak ją osiągnąć?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Idempotency oznacza, że wielokrotne wykonanie tej samej operacji daje ten sam efekt.

Przykład:
- PUT jest idempotentny,
- POST zwykle nie.

Techniki:
- Idempotency-Key przechowywany po stronie serwera,
- deduplikacja komunikatów,
- naturalny klucz biznesowy.

---

## 3️⃣ Spójność w systemie rozproszonym

#### 🔹 7. 🧙‍♂️ ⭐⭐⭐ Czym jest Saga?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Saga to wzorzec realizacji transakcji rozproszonej przez sekwencję lokalnych transakcji.

Każdy krok ma akcję kompensacyjną.

Rodzaje:
- Orchestrated saga — centralny orchestrator.
- Choreographed saga — serwisy reagują na eventy.

---

#### 🔹 8. 🧙‍♂️ ⭐⭐ Czym jest Outbox Pattern?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Outbox Pattern rozwiązuje problem atomowości między:
- zapisem do bazy,
- publikacją eventu.

Mechanizm:
1. Zapis danych i eventu w tej samej transakcji w DB (tabela outbox).
2. Osobny proces publikuje eventy do brokera.
3. Eventy są oznaczane jako wysłane.

Zapobiega utracie eventów.

---

#### 🔹 9. 🧙‍♂️ ⭐⭐ Dlaczego współdzielona baza danych między mikroserwisami jest problemem?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Współdzielona baza:
- zwiększa sprzężenie,
- wymusza wspólne wdrożenia,
- utrudnia niezależną ewolucję schematu,
- zwiększa ryzyko blokad i konfliktów.

Zasada: Database per service.

---

## 4️⃣ Obserwowalność

#### 🔹 10. 🧑‍💻 ⭐⭐ Czym jest observability w mikroserwisach?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Observability to zdolność zrozumienia stanu systemu na podstawie sygnałów.

Trzy filary:
- Logs (najlepiej structured)
- Metrics (np. Prometheus)
- Traces (distributed tracing)

Bez observability mikroserwisy są trudne w utrzymaniu.

---

#### 🔹 11. 🧙‍♂️ ⭐⭐ Czym jest Service Mesh?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Service Mesh to warstwa infrastruktury zarządzająca komunikacją między serwisami, niezależna od kodu aplikacji.

Realizuje:
- mTLS (szyfrowanie i autentykacja serwis-do-serwisu),
- circuit breaker, retry, timeout — bez kodu w aplikacji,
- distributed tracing i metryki ruchu,
- traffic management (canary, weight-based routing).

Popularne implementacje: Istio, Linkerd.
Sidecar proxy (np. Envoy) obok każdego poda przejmuje cały ruch.

---

#### 🔹 12. 🧙‍♂️ ⭐⭐ Czym jest Service Discovery?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Service Discovery to mechanizm dynamicznego znajdowania adresów serwisów w środowisku, gdzie instancje się zmieniają.

Client-side discovery:
- klient pyta rejestr (np. Eureka), dostaje listę instancji, sam wybiera.

Server-side discovery:
- klient wysyła żądanie do load balancera/DNS, który przekierowuje.

W Kubernetes: DNS-based discovery przez Service objects (ClusterIP).

---

#### 🔹 13. 🧑‍💻 ⭐ Czym jest Bulkhead Pattern?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Bulkhead (gródź) to izolacja zasobów między grupami serwisów, żeby awaria jednej grupy nie wyczerpała zasobów całego systemu.

Przykład:
- osobna pula wątków dla każdego downstream service,
- jeśli serwis A przestaje odpowiadać, jego pula blokuje się, ale inne serwisy działają normalnie.

Realizacja: Resilience4j `Bulkhead`, Hystrix `ThreadPoolBulkhead`.

---

#### 🔹 14. 🧙‍♂️ ⭐⭐ Czym jest Rate Limiting i jak go implementować?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Rate Limiting ogranicza liczbę żądań klienta w czasie, chroniąc system przed przeciążeniem i nadużyciami.

Algorytmy:
- **Token Bucket** — klient ma "wiadro" tokenów, każde żądanie zużywa token, tokeny regenerują się z czasem,
- **Leaky Bucket** — żądania wchodzą z dowolną szybkością, wypływają jednostajnie,
- **Fixed/Sliding Window** — licznik resetowany w oknie czasowym.

Implementacja: Redis (INCR + EXPIRE), API Gateway (Kong, Nginx), Resilience4j `RateLimiter`.

---

#### 🔹 15. 🧑‍💻 ⭐⭐ Jak wersjonować API w mikroserwisach?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Opcje wersjonowania:
- **URL path**: `/api/v1/orders` — najprostsze, czytelne,
- **Header**: `Accept: application/vnd.api+json;version=2`,
- **Query param**: `?version=2`.

Dobre praktyki:
- obsługuj co najmniej jedną poprzednią wersję,
- deprecate przez nagłówek (`Deprecation: true`),
- consumer-driven contracts (Pact) pomagają wykryć breaking changes.

---

#### 🔹 16. 🧑‍💻 ⭐⭐ Czym jest wzorzec Choreography vs Orchestration w Sadze?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Orchestration:
- centralny orchestrator (serwis lub workflow engine) wydaje polecenia każdemu serwisowi,
- łatwiej debugować, ale orchestrator staje się wąskim gardłem i punktem sprzężenia.

Choreography:
- każdy serwis reaguje na eventy i emituje kolejne,
- luźniejsze powiązania, ale trudniejsze do śledzenia przepływu.

W praktyce: małe sagas → choreography; złożone, wieloetapowe → orchestration (np. Temporal, Camunda).

---

#### 🔹 17. 🧙‍♂️ ⭐ Jak zapewnić mTLS między serwisami?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

mTLS (mutual TLS) — obie strony uwierzytelniają się certyfikatami.

Realizacja:
- Service Mesh (Istio) — automatycznie, sidecar zarządza certyfikatami,
- manualnie — PKI, certyfikaty rotowane (Vault PKI Secrets Engine).

Zapewnia: szyfrowanie + autentykację serwis-do-serwisu bez tokenu w nagłówku.
Ważne przy zero-trust networking.

---

#### 🔹 18. 🧙‍♂️ ⭐ Czym jest Distributed Configuration?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Distributed Configuration to centralny magazyn konfiguracji dla wszystkich serwisów, zamiast plików per instancja.

Narzędzia:
- Spring Cloud Config (Git-backed),
- HashiCorp Consul KV,
- AWS Parameter Store / Secrets Manager,
- Kubernetes ConfigMap.

Problemy do rozwiązania:
- hot reload konfiguracji bez restartu,
- wersjonowanie i audyt zmian,
- separacja sekretów od konfiguracji.

---

#### 🔹 19. 🧙‍♂️ ⭐⭐ Jak testować mikroserwisy?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Piramida testów w mikroserwisach:

- **Unit** — logika domenowa w izolacji,
- **Integration** — serwis + baza + broker (Testcontainers),
- **Contract** — weryfikacja kontraktów między serwisami (Pact),
- **E2E** — rzadko, tylko dla krytycznych ścieżek.

Unikać: testowanie kilku serwisów razem w pełnym środowisku — zbyt kruche i wolne.

---

#### 🔹 20. 🧑‍💻 ⭐⭐⭐ Kiedy mikroserwisy to zły wybór?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Mikroserwisy dodają złożoność operacyjną — warto je wybrać tylko gdy:
- organizacja jest wystarczająco duża (Conway's Law),
- masz dojrzałe DevOps i observability,
- domeny są jasno rozdzielone.

Złe sygnały:
- mały zespół (< 5 osób),
- nieznana domena (za wcześnie na granice),
- brak Kubernetes/CI/CD.

"Start with a monolith, extract when the pain is real."

---

#### 🔹 21. 🧙‍♂️ ⭐ Co to jest Conway's Law?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

"Organizacje projektują systemy odzwierciedlające ich strukturę komunikacyjną."

Praktyczna implikacja:
- jeśli masz 3 zespoły, dostaniesz 3-częściowy system,
- granice serwisów powinny pokrywać się z granicami własności zespołów.

Inverse Conway Maneuver: najpierw zaprojektuj pożądaną architekturę, potem dostosuj strukturę zespołów.

---

#### 🔹 22. 🧙‍♂️ ⭐⭐ Czym jest Dead Letter Queue (DLQ)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

DLQ to kolejka, do której trafiają wiadomości, których konsument nie był w stanie przetworzyć po N próbach.

Zastosowania:
- izolacja "trujących" wiadomości (poison pill),
- analiza błędów bez blokowania głównej kolejki,
- ręczne reprocessing po naprawie błędu.

Obowiązkowy element każdego produkcyjnego systemu event-driven.

---

#### 🔹 23. 🧙‍♂️ ⭐⭐ Jak obsługiwać distributed tracing w mikroserwisach?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Każde żądanie otrzymuje `traceId` (unikalny dla całego przepływu) i `spanId` (dla każdego kroku).

Propagacja:
- przez nagłówki HTTP: `traceparent` (W3C standard),
- przez nagłówki Kafka,
- automatycznie przez instrumentację (Micrometer Tracing, OpenTelemetry).

Stack: OpenTelemetry → Jaeger / Zipkin / Tempo.

---

#### 🔹 24. 🧑‍💻 ⭐ Czym jest timeout propagation i dlaczego jest ważne?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Timeout propagation oznacza przekazywanie pozostałego czasu na odpowiedź przez łańcuch serwisów.

Problem bez propagacji:
- Serwis A ma timeout 1s.
- Woła B z timeout 2s i C z timeout 2s.
- W efekcie A może czekać dłużej niż jego własny timeout, blokując zasoby.

Rozwiązanie: gRPC deadline propagation, `Context` z deadlinem, nagłówki `X-Request-Timeout`.

---

#### 🔹 25. 🧙‍♂️ ⭐⭐⭐ Czym jest Event-Driven Architecture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

EDA to styl architektoniczny, w którym komponenty komunikują się przez emisję i konsumpcję zdarzeń, bez bezpośrednich wywołań.

Zalety:
- luźne powiązania — producent nie zna konsumentów,
- skalowalność — konsumenci skalują niezależnie,
- naturalny audit log.

Wyzwania:
- eventual consistency,
- trudniejsze debugowanie przepływu,
- schema evolution.

Dobre do: integracji, pipeline'ów danych, systemów opartych o domenę.

