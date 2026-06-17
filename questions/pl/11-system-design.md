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

#### 🔹 1. 🔴 Czym są trade-offs w architekturze?

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

#### 🔹 2. 🔴 Jak rozumieć CAP w praktyce projektowej?

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

#### 🔹 3. 🔴 Czym jest skalowalność funkcjonalna vs techniczna?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Skalowalność techniczna:
- Więcej instancji, więcej zasobów.

Skalowalność funkcjonalna:
- Możliwość rozwijania systemu bez eksplozji złożoności.
- Modularność, bounded contexts.

Obie są kluczowe dla systemów długowiecznych.

---

#### 🔹 4. 🔴 Czym jest latency budget?

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

#### 🔹 5. 🔴 Co oznacza "design for failure"?

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

#### 🔹 6. 🔴 Czym jest graceful degradation?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Graceful degradation oznacza, że przy awarii części systemu:
- system nadal działa,
- ale z ograniczoną funkcjonalnością.

Przykład:
- brak rekomendacji, ale działa koszyk zakupowy.

---

## 4️⃣ Backpressure i Przepływ Danych

#### 🔹 7. 🔴 Czym jest backpressure na poziomie systemowym?

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

#### 🔹 8. 🔴 Jak analizować failure modes systemu?

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

#### 🔹 9. 🔴 Jak podejmować decyzje technologiczne długoterminowo?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Należy brać pod uwagę:
- dojrzałość technologii,
- wsparcie społeczności,
- koszt utrzymania,
- łatwość rekrutacji,
- vendor lock-in.

Najlepsza technologia to taka, którą zespół potrafi utrzymać przez lata.

---

#### 🔹 10. 🔴 Jak zaprojektować URL shortener?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Wymagania: `POST /shorten` → zwraca short URL, `GET /{code}` → redirect 301/302.

Generowanie kodu:
- Base62 (a-z A-Z 0-9) z 7 znaków = 62^7 ≈ 3.5 biliona unikalnych URL-i,
- counter-based (Snowflake ID → Base62) lub losowy + check collision.

Skala:
- write: tabel Cassandra / Redis (kod → URL),
- read: CDN lub Redis cache (100M redirects/dzień → ~1200 req/s).

Redirect 301 (permanent, browser cache) vs 302 (temporary, zawsze odpytuje serwer) — zależy czy chcemy analytics.

---

#### 🔹 11. 🔴 Jak zaprojektować rate limiter?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Algorytm Token Bucket w Redis:
```
MULTI
  DECR user:123:tokens
  EXPIRE user:123:tokens 60
EXEC
```

Warianty:
- **Fixed Window**: prosty, ale spike na granicy okna,
- **Sliding Window Log**: dokładny, duże zużycie pamięci,
- **Token Bucket**: balansuje burst i steady rate.

Odpowiedź: `429 Too Many Requests` + `Retry-After`.

Distributed rate limiting: Redis centralny, ale dodaje latency — rozważ lokalne z synchronizacją.

---

#### 🔹 12. 🔴 Jak zaprojektować system powiadomień?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Komponenty:
- **Notification Service**: przyjmuje event, decyduje co i do kogo,
- **Template Service**: renderuje treść,
- **Channel Adapters**: Email (SES), SMS (Twilio), Push (FCM/APNs).

Skala:
- kolejka (Kafka) per kanał → consumers wysyłają,
- retry z exponential backoff,
- DLQ dla nieudanych.

Ważne:
- preferences per user (opt-out),
- rate limit (1 email/godzinę per typ),
- idempotency (nie wyślij dwa razy tego samego).

---

#### 🔹 13. 🔴 Czym jest PACELC theorem?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Rozszerzenie CAP: w przypadku partycji (P) wybierasz A lub C; **Even (E) w normalnym działaniu wybierasz Latency (L) lub Consistency (C)**.

PACELC = PA/EL lub PC/EC.

Przykłady:
- DynamoDB: PA/EL — dostępność i niska latency,
- PostgreSQL synchronous replication: PC/EC — konsystencja zawsze,
- Cassandra (quorum): konfigurowalny.

CAP mówi co robisz przy awarii. PACELC mówi co robisz na co dzień.

---

#### 🔹 14. 🔴 Jak zaimplementować Distributed Lock?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Problem: wiele instancji nie może wykonywać tej samej operacji jednocześnie.

Redis (Redlock):
```
SET lock:resource <unique-id> NX PX 30000
```
- `NX` — tylko jeśli nie istnieje,
- `PX 30000` — TTL 30s (zapobiega deadlock przy crashu).

Ważne:
- każda instancja ma unikalny `unique-id` (nie nadpisuje cudzego locka),
- Redlock na 3+ node Redis dla odporności na split-brain.

Alternatywy: ZooKeeper (ZNode ephemeral), PostgreSQL advisory locks.

---

#### 🔹 15. 🔴 Czym jest Leader Election?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Leader Election: spośród wielu instancji wybierana jest jedna jako leader (np. do zadań cron, processing partitioned work).

Mechanizmy:
- **ZooKeeper**: ephemeral node — instancja która stworzy node jako pierwsza jest leaderem. Przy crashu node znika, reszta rerywalizuje,
- **Redis** (Redlock z renewal): leader co N sekund odnawia lock,
- **Kubernetes leader election**: biblioteka `k8s.io/client-go/tools/leaderelection` przez Lease object.

Spring: `@SchedulerLock` (ShedLock) dla prostszych przypadków.

---

#### 🔹 16. 🔴 Jak generować unikalne ID at scale?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**UUID v4**: losowy, 128-bit — prosty, ale niezoptymalizowany dla B-tree indexes (random insert).

**UUID v7**: timestamp + random — monotoniczny (lepszy dla indexów).

**Snowflake ID** (Twitter): 64-bit int = `timestamp(41bit) | datacenter(5) | worker(5) | sequence(12)`.
- Sortable, kompaktowy, generowany lokalnie bez DB.

**ULID**: podobny do Snowflake, Base32, czytelny.

Unikaj: auto-increment z jednej bazy przy shardingu — bottleneck i nie unikalny globalnie.

---

#### 🔹 17. 🔴 Czym jest Fan-out pattern?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Fan-out: jeden event/message jest dostarczony do wielu odbiorców.

**Fan-out on write**: przy tweecie zapisz do timeline każdego followera z góry.
- Zaleta: szybki odczyt (gotowy timeline).
- Wada: drogi zapis przy dużej liczbie followerów (celebrity problem).

**Fan-out on read**: pobierz tweety od obserwowanych dynamicznie.
- Zaleta: prosty zapis.
- Wada: wolny odczyt.

W praktyce: hybryda — fan-out on write dla zwykłych użytkowników, on read dla celebrytów.

---

#### 🔹 18. 🔴 Read-heavy vs write-heavy — jak wpływa na design?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**Read-heavy** (10:1 read/write):
- agresywne cache'owanie (Redis, CDN),
- read replicas,
- denormalizacja (precomputed views),
- CQRS z osobnym read modelem.

**Write-heavy** (1:10 read/write):
- write batching,
- append-only log (Kafka jako durable buffer),
- asynchroniczne zapisy,
- sharding po write key,
- unikaj expensive indexes.

---

#### 🔹 19. 🔴 Czym są consistency patterns w systemach rozproszonych?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**Strong consistency**: każdy odczyt widzi ostatni zapis. Wymaga synchronizacji (quorum, 2PC). Wysoka latency.

**Eventual consistency**: wszystkie repliki w końcu zbiegają. Tymczasowe niespójności są akceptowalne. Wysoka dostępność.

**Causal consistency**: operacje powiązane przyczynowo są widziane w odpowiedniej kolejności.

**Read-your-writes**: po zapisie zawsze widzisz swój ostatni zapis (nie cudzych).

Wybór zależy od wymagań biznesowych — system bankowy = strong, social media = eventual.

---

#### 🔹 20. 🔴 Jak projektować sharding strategię bazy danych?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Sharding = poziomy podział danych między wiele baz.

**Hash sharding**: `shard = hash(key) % N`. Równomierny rozkład, ale resharding trudny.

**Range sharding**: `shard 1: A-M, shard 2: N-Z`. Dobre dla range queries, ale hot spots możliwe.

**Directory sharding**: mapping table → który klucz na którym shardzie. Elastyczny, ale mapping table = SPOF.

Wyzwania:
- cross-shard queries (brak ACID),
- resharding = duża operacja,
- join między shardami niemożliwy.

---

#### 🔹 21. 🔴 Jak zaprojektować system obsługujący milion użytkowników?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Ewolucja architektury:

1. Jeden serwer (monolith) → wyczerpuje się przy ~10k users.
2. Dodaj CDN i statyczne zasoby na S3.
3. Separuj DB od app servera.
4. Load balancer + kilka instancji app.
5. Read replicas dla bazy.
6. Cache (Redis) dla gorących danych.
7. Async processing przez kolejkę.
8. Sharding lub NoSQL gdy DB staje się wąskim gardłem.
9. Mikroserwisy gdy zespoły i domeny to uzasadniają.

Kluczowe: nie skacz do kroku 9 od razu.

---

#### 🔹 22. 🔴 Czym jest Event Storming?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Event Storming to technika warsztatowa (Alberto Brandolini) do eksploracji domeny biznesowej przez wspólne mapowanie zdarzeń.

Uczestnicy: developrzy + eksperci domenowi.
Narzędzie: karteczki samoprzylepne na ścianie.

Fazy:
1. **Big Picture** — wszystkie eventy domenowe (pomarańczowe),
2. **Process Modelling** — komendy, aktorzy, polityki,
3. **Design Level** — agregaty, bounded contexts.

Wynik: mapa domeny, identyfikacja Bounded Contexts, gotowość do podziału na serwisy.

---

#### 🔹 23. 🔴 Jak projektować system pod high availability (HA)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

HA = eliminacja Single Point of Failure (SPOF).

Każda warstwa musi być redundantna:
- **Load balancer**: min 2 (active-active lub active-passive),
- **App servers**: min 2 instancje, health checks,
- **Baza danych**: primary + replica(s), automatic failover (Patroni dla PostgreSQL),
- **Cache**: Redis Sentinel lub Cluster,
- **Kolejki**: Kafka z replikacją partycji.

Multi-AZ deployment: instancje w co najmniej 2 strefach dostępności.

RTO (Recovery Time Objective) i RPO (Recovery Point Objective) definiują wymagania dla HA.

---

#### 🔹 24. 🔴 Czym jest data pipeline architecture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Data pipeline: przepływ danych od źródła do celu z transformacjami.

Wzorce:
- **Lambda Architecture**: batch layer (Spark) + speed layer (Kafka) → serving layer,
- **Kappa Architecture**: tylko streaming (Kafka + Flink) — upraszcza Lambda,
- **ELT** (Extract-Load-Transform): załaduj surowe dane → transformuj w DWH (dbt + Snowflake/BigQuery).

Narzędzia:
- Kafka (transport), Apache Flink (stream processing), Apache Spark (batch), dbt (transformacje SQL).

---

#### 🔹 25. 🔴 Jak ocenić architekturę systemu podczas code review / design review?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Pytania do zadania:

- **SPOF**: gdzie system padnie gdy jeden komponent zawiedzie?
- **Skalowalność**: gdzie jest wąskie gardło przy 10x obciążeniu?
- **Spójność**: jakie są gwarancje przy częściowej awarii (partial failure)?
- **Obserwowalność**: jak zdiagnozuję problem o 3 w nocy?
- **Złożoność**: czy ta złożoność jest uzasadniona wymaganiami?
- **Reversibility**: jak łatwo cofnąć tę decyzję za rok?

"Good architecture maximizes the number of decisions NOT made" (Uncle Bob).

