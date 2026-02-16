[💡 Questions](questions.md)

# 🧠 SYSTEM DESIGN / THINKING

<!-- TOC -->
* [🧠 SYSTEM DESIGN / THINKING](#-system-design--thinking)
  * [1️⃣ Myślenie Architektoniczne](#1-myślenie-architektoniczne)
      * [🔹 1. Czym są trade-offs w architekturze?](#-1-czym-są-trade-offs-w-architekturze)
      * [🔹 2. Jak rozumieć CAP w praktyce projektowej?](#-2-jak-rozumieć-cap-w-praktyce-projektowej)
  * [2️⃣ Projektowanie pod Skalę](#2-projektowanie-pod-skalę)
      * [🔹 3. Czym jest skalowalność funkcjonalna vs techniczna?](#-3-czym-jest-skalowalność-funkcjonalna-vs-techniczna)
      * [🔹 4. Czym jest latency budget?](#-4-czym-jest-latency-budget)
  * [3️⃣ Projektowanie na Awarię](#3-projektowanie-na-awarię)
      * [🔹 5. Co oznacza "design for failure"?](#-5-co-oznacza-design-for-failure)
      * [🔹 6. Czym jest graceful degradation?](#-6-czym-jest-graceful-degradation)
  * [4️⃣ Backpressure i Przepływ Danych](#4-backpressure-i-przepływ-danych)
      * [🔹 7. Czym jest backpressure na poziomie systemowym?](#-7-czym-jest-backpressure-na-poziomie-systemowym)
  * [5️⃣ Failure Modes i Analiza Ryzyka](#5-failure-modes-i-analiza-ryzyka)
      * [🔹 8. Jak analizować failure modes systemu?](#-8-jak-analizować-failure-modes-systemu)
  * [6️⃣ Myślenie Długoterminowe](#6-myślenie-długoterminowe)
      * [🔹 9. Jak podejmować decyzje technologiczne długoterminowo?](#-9-jak-podejmować-decyzje-technologiczne-długoterminowo)
<!-- TOC -->

---

## 1️⃣ Myślenie Architektoniczne

#### 🔹 1. Czym są trade-offs w architekturze?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Każda decyzja architektoniczna to kompromis między:
- wydajnością,
- skalowalnością,
- złożonością,
- kosztem utrzymania,
- czasem dostarczenia.

Nie istnieje rozwiązanie idealne — istnieje rozwiązanie najlepsze w danym kontekście.

Architekt powinien jasno rozumieć konsekwencje wyborów.

---

#### 🔹 2. Jak rozumieć CAP w praktyce projektowej?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

W systemach rozproszonych Partition Tolerance jest obowiązkowe.

Pozostaje wybór między:
- Consistency (CP)
- Availability (AP)

System finansowy → preferuje CP.
System social media → często AP.

Projekt musi uwzględniać konsekwencje chwilowej niespójności.

---

## 2️⃣ Projektowanie pod Skalę

#### 🔹 3. Czym jest skalowalność funkcjonalna vs techniczna?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Skalowalność techniczna:
- Więcej instancji, więcej zasobów.

Skalowalność funkcjonalna:
- Możliwość rozwijania systemu bez eksplozji złożoności.
- Modularność, bounded contexts.

Obie są kluczowe dla systemów długowiecznych.

---

#### 🔹 4. Czym jest latency budget?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Latency budget to maksymalny czas odpowiedzi systemu rozłożony na komponenty.

Przykład:
- API ma 300ms SLA.
- DB może użyć 100ms.
- Zewnętrzny serwis 80ms.
- Reszta to logika.

Pomaga kontrolować zależności i unikać kaskadowych opóźnień.

---

## 3️⃣ Projektowanie na Awarię

#### 🔹 5. Co oznacza "design for failure"?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

W systemach rozproszonych zakładamy, że:
- sieć zawiedzie,
- serwis zawiedzie,
- baza zawiedzie.

System powinien:
- degradować się łagodnie (graceful degradation),
- mieć timeouty,
- mieć retry z ograniczeniami,
- stosować circuit breaker.

---

#### 🔹 6. Czym jest graceful degradation?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Graceful degradation oznacza, że przy awarii części systemu:
- system nadal działa,
- ale z ograniczoną funkcjonalnością.

Przykład:
- brak rekomendacji, ale działa koszyk zakupowy.

---

## 4️⃣ Backpressure i Przepływ Danych

#### 🔹 7. Czym jest backpressure na poziomie systemowym?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Backpressure to kontrola przepływu danych między komponentami.

Bez backpressure:
- kolejki rosną,
- pamięć się wyczerpuje,
- system się zapada.

Mechanizmy:
- bounded queues,
- rate limiting,
- reactive streams (request(n)).

---

## 5️⃣ Failure Modes i Analiza Ryzyka

#### 🔹 8. Jak analizować failure modes systemu?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Należy zidentyfikować:
- pojedyncze punkty awarii (SPOF),
- zależności zewnętrzne,
- operacje długotrwałe,
- miejsca blokad.

Stosowane techniki:
- Chaos engineering,
- testy awarii,
- analiza scenariuszy ("what if").

Celem jest zwiększenie odporności systemu.

---

## 6️⃣ Myślenie Długoterminowe

#### 🔹 9. Jak podejmować decyzje technologiczne długoterminowo?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Należy brać pod uwagę:
- dojrzałość technologii,
- wsparcie społeczności,
- koszt utrzymania,
- łatwość rekrutacji,
- vendor lock-in.

Najlepsza technologia to taka, którą zespół potrafi utrzymać przez lata.

