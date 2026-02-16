# 🧠 SYSTEM DESIGN / THINKING

---

# 1️⃣ Myślenie Architektoniczne

## 🔹 1. Czym są trade-offs w architekturze?

### ✅ Odpowiedź

Każda decyzja architektoniczna to kompromis między:
- wydajnością,
- skalowalnością,
- złożonością,
- kosztem utrzymania,
- czasem dostarczenia.

Nie istnieje rozwiązanie idealne — istnieje rozwiązanie najlepsze w danym kontekście.

Architekt powinien jasno rozumieć konsekwencje wyborów.

---

## 🔹 2. Jak rozumieć CAP w praktyce projektowej?

### ✅ Odpowiedź

W systemach rozproszonych Partition Tolerance jest obowiązkowe.

Pozostaje wybór między:
- Consistency (CP)
- Availability (AP)

System finansowy → preferuje CP.
System social media → często AP.

Projekt musi uwzględniać konsekwencje chwilowej niespójności.

---

# 2️⃣ Projektowanie pod Skalę

## 🔹 3. Czym jest skalowalność funkcjonalna vs techniczna?

### ✅ Odpowiedź

Skalowalność techniczna:
- Więcej instancji, więcej zasobów.

Skalowalność funkcjonalna:
- Możliwość rozwijania systemu bez eksplozji złożoności.
- Modularność, bounded contexts.

Obie są kluczowe dla systemów długowiecznych.

---

## 🔹 4. Czym jest latency budget?

### ✅ Odpowiedź

Latency budget to maksymalny czas odpowiedzi systemu rozłożony na komponenty.

Przykład:
- API ma 300ms SLA.
- DB może użyć 100ms.
- Zewnętrzny serwis 80ms.
- Reszta to logika.

Pomaga kontrolować zależności i unikać kaskadowych opóźnień.

---

# 3️⃣ Projektowanie na Awarię

## 🔹 5. Co oznacza "design for failure"?

### ✅ Odpowiedź

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

## 🔹 6. Czym jest graceful degradation?

### ✅ Odpowiedź

Graceful degradation oznacza, że przy awarii części systemu:
- system nadal działa,
- ale z ograniczoną funkcjonalnością.

Przykład:
- brak rekomendacji, ale działa koszyk zakupowy.

---

# 4️⃣ Backpressure i Przepływ Danych

## 🔹 7. Czym jest backpressure na poziomie systemowym?

### ✅ Odpowiedź

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

# 5️⃣ Failure Modes i Analiza Ryzyka

## 🔹 8. Jak analizować failure modes systemu?

### ✅ Odpowiedź

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

# 6️⃣ Myślenie Długoterminowe

## 🔹 9. Jak podejmować decyzje technologiczne długoterminowo?

### ✅ Odpowiedź

Należy brać pod uwagę:
- dojrzałość technologii,
- wsparcie społeczności,
- koszt utrzymania,
- łatwość rekrutacji,
- vendor lock-in.

Najlepsza technologia to taka, którą zespół potrafi utrzymać przez lata.

