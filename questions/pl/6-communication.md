# 🔌 KOMUNIKACJA I INTEGRACJA

---

# 1️⃣ REST i Semantyka HTTP

## 🔹 1. Co oznacza idempotency w HTTP i które metody są idempotentne?

### ✅ Odpowiedź

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

## 🔹 2. Jakie są najważniejsze klasy kodów HTTP i jak ich używać?

### ✅ Odpowiedź

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

## 🔹 3. Czym jest caching w HTTP?

### ✅ Odpowiedź

Caching pozwala ograniczyć liczbę requestów i poprawić wydajność.

Mechanizmy:
- Cache-Control
- ETag + If-None-Match
- Last-Modified + If-Modified-Since

ETag pozwala na walidację wersji zasobu (304 Not Modified).

---

# 2️⃣ gRPC

## 🔹 4. Czym jest gRPC i kiedy jest lepsze od REST?

### ✅ Odpowiedź

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

# 3️⃣ Messaging: Kafka vs RabbitMQ

## 🔹 5. Kafka vs RabbitMQ — kluczowe różnice

### ✅ Odpowiedź

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

## 🔹 6. Co oznacza at-least-once, at-most-once, exactly-once delivery?

### ✅ Odpowiedź

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

## 🔹 7. Jak radzić sobie z duplikatami wiadomości?

### ✅ Odpowiedź

Ponieważ at-least-once jest częste, system powinien tolerować duplikaty.

Techniki:
- deduplikacja po messageId / idempotency key,
- "upsert" zamiast "insert",
- przechowywanie historii przetworzonych eventów.

---

## 🔹 8. Czym jest ordering i dlaczego jest trudny?

### ✅ Odpowiedź

Ordering oznacza zachowanie kolejności zdarzeń.

Wyzwania:
- partycje w Kafka — ordering jest gwarantowany tylko w obrębie partycji.
- równoległe konsumpcje.

Rozwiązanie:
- klucz partycji oparty o agregat (np. aggregateId).

---

# 4️⃣ Schema Evolution

## 🔹 9. Czym jest schema evolution?

### ✅ Odpowiedź

Schema evolution to zmiana formatu danych bez psucia kompatybilności.

Dobre praktyki:
- dodawanie pól jako opcjonalne,
- unikanie zmiany znaczenia pól,
- wersjonowanie kontraktów.

Protobuf/Avro wspierają kompatybilne zmiany lepiej niż "goły" JSON.

