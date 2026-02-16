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

#### 🔹 1. Jak wyznaczać granice mikroserwisów?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Granice mikroserwisów powinny wynikać z domeny biznesowej, nie z podziału technicznego.

Typowe podejścia:
- Bounded Context (DDD) jako granica serwisu.
- Wysoka spójność wewnątrz serwisu, niskie sprzężenie między serwisami.

Zły znak:
- Silne transakcje rozproszone.
- Wspólna baza danych między serwisami.

---

#### 🔹 2. Synchroniczna vs asynchroniczna komunikacja — kiedy co?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

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

#### 🔹 3. Czym jest API Gateway?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

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

#### 🔹 4. Czym jest Circuit Breaker?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Circuit Breaker chroni system przed kaskadową awarią.

Stany:
- Closed — ruch przechodzi.
- Open — ruch blokowany, szybka porażka (fail fast).
- Half-open — testowe requesty.

Stosowany przy komunikacji synchronicznej.

---

#### 🔹 5. Czym jest retry i jakie są ryzyka?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

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

#### 🔹 6. Czym jest idempotency i jak ją osiągnąć?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

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

#### 🔹 7. Czym jest Saga?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Saga to wzorzec realizacji transakcji rozproszonej przez sekwencję lokalnych transakcji.

Każdy krok ma akcję kompensacyjną.

Rodzaje:
- Orchestrated saga — centralny orchestrator.
- Choreographed saga — serwisy reagują na eventy.

---

#### 🔹 8. Czym jest Outbox Pattern?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Outbox Pattern rozwiązuje problem atomowości między:
- zapisem do bazy,
- publikacją eventu.

Mechanizm:
1. Zapis danych i eventu w tej samej transakcji w DB (tabela outbox).
2. Osobny proces publikuje eventy do brokera.
3. Eventy są oznaczane jako wysłane.

Zapobiega utracie eventów.

---

#### 🔹 9. Dlaczego współdzielona baza danych między mikroserwisami jest problemem?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Współdzielona baza:
- zwiększa sprzężenie,
- wymusza wspólne wdrożenia,
- utrudnia niezależną ewolucję schematu,
- zwiększa ryzyko blokad i konfliktów.

Zasada: Database per service.

---

## 4️⃣ Obserwowalność

#### 🔹 10. Czym jest observability w mikroserwisach?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Observability to zdolność zrozumienia stanu systemu na podstawie sygnałów.

Trzy filary:
- Logs (najlepiej structured)
- Metrics (np. Prometheus)
- Traces (distributed tracing)

Bez observability mikroserwisy są trudne w utrzymaniu.

