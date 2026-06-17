[💡 Questions](questions.md)

# 🔌 KOMUNIKACJA I INTEGRACJA

<!-- TOC -->
* [🔌 KOMUNIKACJA I INTEGRACJA](#-komunikacja-i-integracja)
  * [1️⃣ REST i Semantyka HTTP](#1-rest-i-semantyka-http)
      * [🔹 1. Co oznacza idempotency w HTTP i które metody są idempotentne?](#-1-co-oznacza-idempotency-w-http-i-które-metody-są-idempotentne)
      * [🔹 2. Jakie są najważniejsze klasy kodów HTTP i jak ich używać?](#-2-jakie-są-najważniejsze-klasy-kodów-http-i-jak-ich-używać)
      * [🔹 3. Czym jest caching w HTTP?](#-3-czym-jest-caching-w-http)
  * [2️⃣ gRPC](#2-grpc)
      * [🔹 4. Czym jest gRPC i kiedy jest lepsze od REST?](#-4-czym-jest-grpc-i-kiedy-jest-lepsze-od-rest)
  * [3️⃣ Messaging: Kafka vs RabbitMQ](#3-messaging-kafka-vs-rabbitmq)
      * [🔹 5. Kafka vs RabbitMQ — kluczowe różnice](#-5-kafka-vs-rabbitmq--kluczowe-różnice)
      * [🔹 6. Co oznacza at-least-once, at-most-once, exactly-once delivery?](#-6-co-oznacza-at-least-once-at-most-once-exactly-once-delivery)
      * [🔹 7. Jak radzić sobie z duplikatami wiadomości?](#-7-jak-radzić-sobie-z-duplikatami-wiadomości)
      * [🔹 8. Czym jest ordering i dlaczego jest trudny?](#-8-czym-jest-ordering-i-dlaczego-jest-trudny)
  * [4️⃣ Schema Evolution](#4-schema-evolution)
      * [🔹 9. Czym jest schema evolution?](#-9-czym-jest-schema-evolution)
<!-- TOC -->

---

## 1️⃣ REST i Semantyka HTTP

#### 🔹 1. 🧑‍💻 Co oznacza idempotency w HTTP i które metody są idempotentne?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Idempotency oznacza, że wielokrotne wykonanie tego samego requestu daje ten sam efekt końcowy.

Metody idempotentne:
- GET
- PUT
- DELETE (efekt końcowy ten sam: zasób usunięty)
- HEAD
- OPTIONS

Metody nie-idempotentne:
- POST (zwykle tworzy nowy zasób przy każdym wywołaniu).

Idempotency jest kluczowa dla retry.

---

#### 🔹 2. 🧑‍💻 Jakie są najważniejsze klasy kodów HTTP i jak ich używać?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

2xx — sukces
- 200 OK
- 201 Created
- 204 No Content

3xx — przekierowania
- 301/302

4xx — błąd klienta
- 400 Bad Request
- 401 Unauthorized (brak uwierzytelnienia)
- 403 Forbidden (brak uprawnień)
- 404 Not Found
- 409 Conflict

5xx — błąd serwera
- 500 Internal Server Error
- 503 Service Unavailable

Poprawne statusy zwiększają czytelność API i ułatwiają integracje.

---

#### 🔹 3. 🧑‍💻 Czym jest caching w HTTP?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Caching pozwala ograniczyć liczbę requestów i poprawić wydajność.

Mechanizmy:
- Cache-Control
- ETag + If-None-Match
- Last-Modified + If-Modified-Since

ETag pozwala na walidację wersji zasobu (304 Not Modified).

---

## 2️⃣ gRPC

#### 🔹 4. 🧙‍♂️ Czym jest gRPC i kiedy jest lepsze od REST?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

gRPC:
- Protokół RPC oparty o HTTP/2.
- Używa Protobuf.
- Wspiera streaming.

Lepsze niż REST gdy:
- potrzebujemy niskiej latencji,
- komunikacja serwis-serwis,
- silne kontrakty typów,
- streaming.

REST częściej dla komunikacji z frontendem (łatwiejsze debugowanie i kompatybilność).

---

## 3️⃣ Messaging: Kafka vs RabbitMQ

#### 🔹 5. 🧑‍💻 Kafka vs RabbitMQ — kluczowe różnice

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Kafka:
- Log zdarzeń (append-only).
- Konsumenci trzymają offset.
- Bardzo dobre do streamingu i dużej skali.

RabbitMQ:
- Klasyczna kolejka.
- Broker zarządza dostarczaniem.
- Dobre do task queue i routing.

Kafka świetna do event-driven i audytu.
RabbitMQ świetny do work distribution.

---

#### 🔹 6. 🧑‍💻 Co oznacza at-least-once, at-most-once, exactly-once delivery?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

At-most-once:
- Wiadomość może zginąć.
- Nigdy nie będzie duplikatu.

At-least-once:
- Wiadomość nie zginie.
- Mogą pojawić się duplikaty.

Exactly-once:
- Brak utraty i brak duplikatów.

W praktyce exactly-once jest trudne i zwykle osiąga się je przez:
- idempotency,
- deduplikację,
- transakcyjność brokera/producenta.

---

#### 🔹 7. 🧑‍💻 Jak radzić sobie z duplikatami wiadomości?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Ponieważ at-least-once jest częste, system powinien tolerować duplikaty.

Techniki:
- deduplikacja po messageId / idempotency key,
- "upsert" zamiast "insert",
- przechowywanie historii przetworzonych eventów.

---

#### 🔹 8. 🧙‍♂️ Czym jest ordering i dlaczego jest trudny?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Ordering oznacza zachowanie kolejności zdarzeń.

Wyzwania:
- partycje w Kafka — ordering jest gwarantowany tylko w obrębie partycji.
- równoległe konsumpcje.

Rozwiązanie:
- klucz partycji oparty o agregat (np. aggregateId).

---

## 4️⃣ Schema Evolution

#### 🔹 9. 🧙‍♂️ Czym jest schema evolution?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Schema evolution to zmiana formatu danych bez psucia kompatybilności.

Dobre praktyki:
- dodawanie pól jako opcjonalne,
- unikanie zmiany znaczenia pól,
- wersjonowanie kontraktów.

Protobuf/Avro wspierają kompatybilne zmiany lepiej niż "goły" JSON.

---

#### 🔹 10. 🧙‍♂️ Czym jest Richardson Maturity Model?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Model opisuje stopnie "dojrzałości" REST API:

- **Level 0** — jeden endpoint, różne operacje przez parametry,
- **Level 1** — osobne zasoby (resources) jako oddzielne URL-e,
- **Level 2** — HTTP verbs (GET, POST, PUT, DELETE) do wyrażania operacji,
- **Level 3** — HATEOAS: odpowiedź zawiera linki do kolejnych możliwych akcji.

Większość "REST" API w praktyce jest na poziomie 2.

---

#### 🔹 11. 🧑‍💻 WebSocket vs SSE vs Long Polling — kiedy co?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**WebSocket**:
- pełny duplex (klient i serwer mogą nadawać jednocześnie),
- stałe połączenie TCP,
- do: chaty, real-time collaboration, gry.

**SSE (Server-Sent Events)**:
- serwer pushuje zdarzenia do klienta przez HTTP,
- simplex (tylko serwer → klient),
- automatyczne reconnect, łatwe w implementacji.

**Long Polling**:
- klient trzyma otwarty request do momentu pojawienia się danych,
- kompatybilne z każdym serwerem HTTP,
- duże narzuty na połączenia.

---

#### 🔹 12. 🧑‍💻 Czym jest GraphQL i jakie są jego wady i zalety?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

GraphQL to język zapytań do API gdzie klient określa dokładnie jakich danych potrzebuje.

Zalety:
- brak over-fetching i under-fetching,
- jeden endpoint,
- silnie typowany schemat.

Wady:
- N+1 problem (DataLoader jako rozwiązanie),
- trudniejszy caching (nie GET),
- złożoność autoryzacji per field,
- learning curve.

Dobre do: BFF (Backend For Frontend), złożone frontendowe wymagania.

---

#### 🔹 13. 🧑‍💻 Czym jest Webhook i czym różni się od pollingu?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Webhook: zewnętrzny system wysyła HTTP POST na zarejestrowany URL gdy zajdzie zdarzenie.

Polling: aplikacja cyklicznie pyta zewnętrzny system o zmiany.

Webhook — bardziej efektywny (brak pustych odpowiedzi), ale wymaga publicznego URL i obsługi retry po stronie nadawcy.

Ważne przy odbiorze webhooków:
- weryfikacja sygnatury (HMAC),
- idempotent processing (duplikaty),
- szybka odpowiedź 200 + przetwarzanie asynchroniczne.

---

#### 🔹 14. 🧑‍💻 Czym jest API Pagination i jakie są strategie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**Offset pagination** (`?page=2&size=20`):
- prosta w implementacji,
- problemy: przy modyfikacjach danych strony się "przesuwają", wolna dla dużych offsetów.

**Cursor/keyset pagination** (`?after=lastId`):
- kursor wskazuje na konkretny rekord (ID lub timestamp),
- stabilna przy zmianach danych, wydajna (INDEX range scan),
- trudniejsza w implementacji.

Cursor to standard dla API produkcyjnych przy dużych zbiorach.

---

#### 🔹 15. 🧑‍💻 Czym jest Content Negotiation?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Mechanizm HTTP pozwalający klientowi i serwerowi uzgodnić format danych.

Klient wysyła:
- `Accept: application/json` — oczekiwany format odpowiedzi,
- `Content-Type: application/json` — format wysyłanego ciała.

Serwer odpowiada `Content-Type` wskazującym wybrany format lub `406 Not Acceptable`.

Pozwala serwerowi obsługiwać JSON, XML, Protobuf z tego samego endpointu.

---

#### 🔹 16. 🧙‍♂️ Czym jest Correlation ID?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Correlation ID (też: Request ID, Trace ID) to unikalny identyfikator propagowany przez cały łańcuch wywołań.

Cel:
- powiązanie logów z różnych serwisów w jeden przepływ,
- diagnostyka błędów w systemach rozproszonych.

Implementacja:
- generowany na wejściu (API Gateway lub pierwszy serwis),
- propagowany w nagłówkach HTTP (`X-Correlation-ID`, `traceparent`),
- dołączany do każdego logu (MDC w SLF4J).

---

#### 🔹 17. 🧑‍💻 HTTP/2 vs HTTP/1.1 — kluczowe różnice

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

HTTP/2 wprowadza:
- **multiplexing** — wiele requestów przez jedno połączenie TCP bez head-of-line blocking,
- **header compression** (HPACK) — mniejszy narzut na powtarzające się nagłówki,
- **server push** — serwer może wysłać zasoby zanim klient zapyta,
- binarny protokół zamiast tekstowego.

gRPC wymaga HTTP/2. Dla REST typowo HTTP/1.1 jest wystarczający, ale HTTP/2 poprawia wydajność przy dużej liczbie requestów.

---

#### 🔹 18. 🧑‍💻 Protobuf vs JSON vs Avro — kiedy co?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**JSON**: czytelny dla człowieka, szeroka kompatybilność, słaba typizacja, duży rozmiar.

**Protobuf** (Google): binarny, silnie typowany (`.proto` schemat), 3-10x mniejszy i szybszy niż JSON, wymaga schematu po obu stronach. Używany przez gRPC.

**Avro** (Apache): binarny, schemat przechowywany razem z danymi lub w Schema Registry, dominujący w ekosystemie Kafka.

Wybór:
- komunikacja serwis-serwis (latency) → Protobuf,
- Kafka event streaming → Avro + Schema Registry,
- publiczne API → JSON.

---

#### 🔹 19. 🧙‍♂️ Czym jest HATEOAS?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

HATEOAS (Hypermedia As The Engine Of Application State) to zasada REST Level 3: odpowiedź API zawiera linki do możliwych następnych akcji.

Przykład:
```json
{
  "orderId": "123",
  "status": "PENDING",
  "_links": {
    "cancel": { "href": "/orders/123/cancel" },
    "pay":    { "href": "/orders/123/pay" }
  }
}
```

Klient nie musi znać URL-i na sztywno — odkrywa je z odpowiedzi.
W praktyce rzadko stosowane (złożoność > korzyść).

---

#### 🔹 20. 🧑‍💻 Czym jest rate limiting na poziomie API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Rate limiting ogranicza liczbę żądań klienta w danym czasie.

Poziomy:
- per IP,
- per user/API key,
- per endpoint.

Odpowiedzi:
- `429 Too Many Requests` + nagłówek `Retry-After`.

Nagłówki informujące klienta:
- `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

Implementacja: API Gateway (Kong, AWS API GW), Redis (token bucket).

---

#### 🔹 21. 🧙‍♂️ Czym jest OpenAPI/Swagger?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

OpenAPI (dawniej Swagger) to standard opisu REST API w formacie YAML/JSON.

Umożliwia:
- generowanie dokumentacji (Swagger UI),
- generowanie klientów SDK (openapi-generator),
- walidację requestów/responses,
- contract testing.

W Spring Boot: `springdoc-openapi` generuje spec automatycznie z adnotacji.

Design-first vs code-first to wybór zależny od procesu — design-first lepiej wymusza kontrakt przed implementacją.

---

#### 🔹 22. 🧑‍💻 Czym jest Circuit Breaker na poziomie HTTP?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Circuit Breaker chroni przed kaskadową awarią gdy downstream serwis jest niedostępny.

Implementacja z Resilience4j:
- `CLOSED` → żądania przechodzą,
- po X błędach → `OPEN` → żądania fail fast (bez czekania na timeout),
- po czasie → `HALF_OPEN` → testowe żądanie,
- jeśli sukces → `CLOSED`.

Kluczowe: ustawić sensowny `timeout` przed circuit breakerem — bez timeoutu OPEN nigdy nie pomoże.

---

#### 🔹 23. 🧑‍💻 Czym jest connection keep-alive i connection pooling w HTTP?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**Keep-alive**: nagłówek `Connection: keep-alive` utrzymuje TCP po zakończeniu requestu, eliminując overhead TCP handshake dla kolejnych requestów.

**Connection pooling** (po stronie klienta HTTP):
- pula gotowych połączeń TCP (np. w Apache HttpClient, OkHttp),
- każde żądanie bierze połączenie z puli zamiast tworzyć nowe,
- kluczowe przy dużej liczbie wywołań serwis-serwis.

W RestTemplate/WebClient — skonfiguruj pool, nie używaj domyślnego klienta bez puli.

---

#### 🔹 24. 🧑‍💻 Czym jest mTLS i kiedy go używać?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

mTLS (mutual TLS) — obie strony połączenia uwierzytelniają się certyfikatami X.509.

Standardowy TLS: klient weryfikuje serwer.
mTLS: serwer weryfikuje też klienta.

Zastosowania:
- uwierzytelnianie serwisów w architekturze mikroserwisów (zero-trust),
- API do partnerów zewnętrznych,
- service mesh (Istio automatyzuje).

Zarządzanie certyfikatami to główna złożoność — HashiCorp Vault PKI lub cert-manager w Kubernetes.

---

#### 🔹 25. 🧑‍💻 Czym jest Request Hedging?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Request hedging to technika wysyłania tego samego żądania do kilku replik jednocześnie i użycie pierwszej odpowiedzi.

Cel: redukcja tail latency (p99, p99.9).
Koszt: dodatkowe obciążenie serwera (~2x żądania).

Stosowane gdy:
- mamy wiele replik tego samego serwisu,
- sporadyczne wolne instancje powodują skoki latency.

Popularne w Google (opisane w "The Tail at Scale" Jeff Dean).

---

#### 🔹 26. 🧙‍♂️ Jak Kafka decyduje, który event trafia do której partycji?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Kafka używa **partition key** — jeśli podany, wyznacza partycję przez `hash(key) % numPartitions`.

Konsekwencje:
- Ten sam klucz → zawsze ta sama partycja → **gwarantowany ordering** dla danego klucza.
- Bez klucza → round-robin między partycjami (lub sticky partitioning w nowszych wersjach) → brak orderingu.

W praktyce:
- Klucz = identyfikator agregatu, np. `orderId`, `userId` — wszystkie eventy dotyczące jednej encji lądują w tej samej partycji.
- Unikaj kluczy o niskiej kardynalności (np. kraj) — ryzyko hot partition.

Zmiana liczby partycji zaburza routing dla istniejących kluczy — zrób to przy starcie topiku.

---

#### 🔹 27. 🧙‍♂️ Czym jest consumer group i zasada 1 partycja = 1 konsumer?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**Consumer group** to zbiór konsumerów czytających ten sam topic jako jedna logiczna aplikacja. Kafka rozdziela partycje między członków grupy.

Zasada: **jedna partycja może być czytana przez co najwyżej jednego konsumera w danej grupie** w tym samym czasie.

Konsekwencje:
- Liczba partycji = max parallelism w grupie.
- 10 partycji + 10 konsumerów w grupie → idealne rozłożenie.
- 10 partycji + 15 konsumerów → 5 konsumerów idle (bez przypisanej partycji).
- 10 partycji + 5 konsumerów → każdy konsumer czyta 2 partycje.

Różne consumer groups (np. billing-service i audit-service) czytają te same partycje niezależnie — każda ma własny offset.

---

#### 🔹 28. 🧙‍♂️ Kto zakłada Kafka topic i w jaki sposób?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Trzy podejścia:

**1. Auto-create** (`auto.create.topics.enable=true`) — Kafka tworzy topic przy pierwszym publish/subscribe. Wygodne, ale niebezpieczne na produkcji (literówka w nazwie = nowy topic zamiast błędu).

**2. Kafka AdminClient (programatycznie)**:
```java
try (AdminClient admin = AdminClient.create(props)) {
    NewTopic topic = new NewTopic("orders.placed", 12, (short) 3); // partitions, replicas
    admin.createTopics(List.of(topic)).all().get();
}
```

**3. IaC / GitOps** — preferowane na produkcji:
- Terraform (`confluentcloud_kafka_topic`),
- Helm chart z init-container wywołującym kafka-topics.sh,
- Strimzi Kafka Operator w Kubernetes (`KafkaTopic` CRD).

Na produkcji zawsze wyłącz auto-create i zarządzaj topicami jako kodem (wersjonowanie, review, audit trail).

---

#### 🔹 29. 🧑‍💻 Jakich heurystyk używać przy podziale eventów na topiki?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**1. Jeden topic = jeden typ zdarzenia domenowego** (np. `orders.placed`, `orders.cancelled`).
Zaleta: różni konsumenci subskrybują tylko to, co potrzebują.

**2. Alternatywnie: topic per agregat** (np. `orders`) ze wszystkimi eventami dla danego agregatu.
Zaleta: gwarantowany ordering wszystkich eventów jednego agregatu (jeden klucz = jedna partycja).

**3. Separacja po środowisku**: `dev.orders.placed`, `prod.orders.placed` — izolacja środowisk.

**4. Unikaj "mega-topic"**: jeden topic na wszystko → brak możliwości selektywnego subskrybowania i trudne zarządzanie schematami.

**5. Schemat i kontrakt**: topic powinien mieć zdefiniowany schemat (Avro + Schema Registry) — zmiana schematu = wersjonowanie, nie nowy topic.

**6. Retencja**: topiki z wymaganiem "reply" (event sourcing) — długa retencja; topiki z wymaganiem "notify" — krótka retencja.

---

#### 🔹 30. 🧙‍♂️ Czym jest Retry-After i jak działa?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

`Retry-After` to nagłówek HTTP informujący klienta, **kiedy może ponowić żądanie**.

Używany z:
- `429 Too Many Requests` — przekroczono rate limit,
- `503 Service Unavailable` — serwis tymczasowo niedostępny.

Format:
```
Retry-After: 60          # liczba sekund
Retry-After: Fri, 14 Jun 2026 10:00:00 GMT  # data
```

Po stronie serwera (Spring Boot + Resilience4j):
```java
response.setHeader("Retry-After", "60");
response.setStatus(429);
```

Po stronie klienta (exponential backoff z Retry-After):
```java
if (response.status() == 429) {
    int wait = Integer.parseInt(response.header("Retry-After").orElse("30"));
    Thread.sleep(wait * 1000L);
}
```

Dlaczego ważne: bez `Retry-After` klienci retryują natychmiast → thundering herd → pogłębia problem przeciążenia.

