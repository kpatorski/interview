# 🌐 MIKROSERWISY

---

# 1️⃣ Fundamenty Mikroserwisów

## 🔹 1. Jak wyznaczać granice mikroserwisów?

### ✅ Odpowiedź

Granice mikroserwisów powinny wynikać z domeny biznesowej, nie z podziału technicznego.

Typowe podejścia:
- Bounded Context (DDD) jako granica serwisu.
- Wysoka spójność wewnątrz serwisu, niskie sprzężenie między serwisami.

Zły znak:
- Silne transakcje rozproszone.
- Wspólna baza danych między serwisami.

---

## 🔹 2. Synchroniczna vs asynchroniczna komunikacja — kiedy co?

### ✅ Odpowiedź

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

## 🔹 3. Czym jest API Gateway?

### ✅ Odpowiedź

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

# 2️⃣ Odporność i Stabilność

## 🔹 4. Czym jest Circuit Breaker?

### ✅ Odpowiedź

Circuit Breaker chroni system przed kaskadową awarią.

Stany:
- Closed — ruch przechodzi.
- Open — ruch blokowany, szybka porażka (fail fast).
- Half-open — testowe requesty.

Stosowany przy komunikacji synchronicznej.

---

## 🔹 5. Czym jest retry i jakie są ryzyka?

### ✅ Odpowiedź

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

## 🔹 6. Czym jest idempotency i jak ją osiągnąć?

### ✅ Odpowiedź

Idempotency oznacza, że wielokrotne wykonanie tej samej operacji daje ten sam efekt.

Przykład:
- PUT jest idempotentny,
- POST zwykle nie.

Techniki:
- Idempotency-Key przechowywany po stronie serwera,
- deduplikacja komunikatów,
- naturalny klucz biznesowy.

---

# 3️⃣ Spójność w systemie rozproszonym

## 🔹 7. Czym jest Saga?

### ✅ Odpowiedź

Saga to wzorzec realizacji transakcji rozproszonej przez sekwencję lokalnych transakcji.

Każdy krok ma akcję kompensacyjną.

Rodzaje:
- Orchestrated saga — centralny orchestrator.
- Choreographed saga — serwisy reagują na eventy.

---

## 🔹 8. Czym jest Outbox Pattern?

### ✅ Odpowiedź

Outbox Pattern rozwiązuje problem atomowości między:
- zapisem do bazy,
- publikacją eventu.

Mechanizm:
1. Zapis danych i eventu w tej samej transakcji w DB (tabela outbox).
2. Osobny proces publikuje eventy do brokera.
3. Eventy są oznaczane jako wysłane.

Zapobiega utracie eventów.

---

## 🔹 9. Dlaczego współdzielona baza danych między mikroserwisami jest problemem?

### ✅ Odpowiedź

Współdzielona baza:
- zwiększa sprzężenie,
- wymusza wspólne wdrożenia,
- utrudnia niezależną ewolucję schematu,
- zwiększa ryzyko blokad i konfliktów.

Zasada: Database per service.

---

# 4️⃣ Obserwowalność

## 🔹 10. Czym jest observability w mikroserwisach?

### ✅ Odpowiedź

Observability to zdolność zrozumienia stanu systemu na podstawie sygnałów.

Trzy filary:
- Logs (najlepiej structured)
- Metrics (np. Prometheus)
- Traces (distributed tracing)

Bez observability mikroserwisy są trudne w utrzymaniu.

