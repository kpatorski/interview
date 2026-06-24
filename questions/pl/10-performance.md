[💡 Questions](questions.md)

# 📈 WYDAJNOŚĆ I DIAGNOSTYKA

<!-- TOC -->
* [📈 WYDAJNOŚĆ I DIAGNOSTYKA](#-wydajność-i-diagnostyka)
  * [1️⃣ Zrozumienie Wydajności](#1-zrozumienie-wydajności)
      * [🔹 1. Czym różni się latency od throughput?](#-1-czym-różni-się-latency-od-throughput)
      * [🔹 2. Czym jest bottleneck i jak go znaleźć?](#-2-czym-jest-bottleneck-i-jak-go-znaleźć)
  * [2️⃣ JVM Profilowanie](#2-jvm-profilowanie)
      * [🔹 3. Czym jest heap dump i kiedy go używać?](#-3-czym-jest-heap-dump-i-kiedy-go-używać)
      * [🔹 4. Czym jest thread dump?](#-4-czym-jest-thread-dump)
      * [🔹 5. Jak działa Garbage Collection i kiedy może być problemem?](#-5-jak-działa-garbage-collection-i-kiedy-może-być-problemem)
  * [3️⃣ Analiza Algorytmiczna](#3-analiza-algorytmiczna)
      * [🔹 6. Dlaczego Big-O jest ważne w systemach backendowych?](#-6-dlaczego-big-o-jest-ważne-w-systemach-backendowych)
  * [4️⃣ Load Testing](#4-load-testing)
      * [🔹 7. Czym jest load testing i czym różni się od stress testing?](#-7-czym-jest-load-testing-i-czym-różni-się-od-stress-testing)
<!-- TOC -->

---

## 1️⃣ Zrozumienie Wydajności

#### 🔹 1. 🧑‍💻 ⭐⭐⭐ Czym różni się latency od throughput?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Latency:
- Czas obsługi pojedynczego żądania.
- Mierzona np. w milisekundach.

Throughput:
- Liczba obsłużonych żądań w jednostce czasu.
- Mierzona np. w requests/second.

System może mieć:
- niską latency i niski throughput,
- wysoką latency i wysoki throughput.

Optymalizacja zależy od wymagań biznesowych.

---

#### 🔹 2. 🧑‍💻 ⭐⭐⭐ Czym jest bottleneck i jak go znaleźć?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Bottleneck to element systemu ograniczający wydajność całości.

Może to być:
- CPU,
- baza danych,
- I/O,
- lock contention,
- sieć.

Identyfikacja:
- Profilowanie CPU,
- analiza metryk,
- distributed tracing,
- analiza GC.

Optymalizuje się wąskie gardło, nie wszystko naraz.

---

## 2️⃣ JVM Profilowanie

#### 🔹 3. 🧑‍💻 ⭐⭐ Czym jest heap dump i kiedy go używać?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Heap dump to zrzut pamięci heap w danym momencie.

Używany do:
- analizy wycieków pamięci,
- identyfikacji dużych obiektów,
- analizy referencji.

Narzędzia:
- VisualVM
- Eclipse MAT

---

#### 🔹 4. 🧙‍♂️ ⭐ Czym jest thread dump?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Thread dump pokazuje stan wszystkich wątków.

Używany do:
- analizy deadlock,
- blokad,
- wysokiego zużycia CPU.

Zawiera stack trace każdego wątku.

---

#### 🔹 5. 🧑‍💻 ⭐⭐⭐ Jak działa Garbage Collection i kiedy może być problemem?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

GC usuwa nieosiągalne obiekty.

Problem gdy:
- długie pauzy (Stop-The-World),
- zbyt częste kolekcje,
- wysokie allocation rate.

Rozwiązania:
- zmiana GC (G1, ZGC),
- tuning heap size,
- zmniejszenie tworzenia obiektów.

---

## 3️⃣ Analiza Algorytmiczna

#### 🔹 6. 🧑‍💻 ⭐⭐ Dlaczego Big-O jest ważne w systemach backendowych?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Big-O opisuje złożoność algorytmu względem rozmiaru danych.

Przykład:
- O(1) — stały czas,
- O(log n) — logarytmiczny,
- O(n) — liniowy,
- O(n²) — kwadratowy.

Przy dużej skali różnice stają się krytyczne.

---

## 4️⃣ Load Testing

#### 🔹 7. 🧑‍💻 ⭐⭐ Czym jest load testing i czym różni się od stress testing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Load testing:
- Test przy oczekiwanym obciążeniu.
- Sprawdza czy system spełnia SLA.

Stress testing:
- Test powyżej zakładanego obciążenia.
- Sprawdza jak system zachowuje się przy przeciążeniu.

Celem jest poznanie granic systemu i jego zachowania w awarii.

---

#### 🔹 8. 🧑‍💻 ⭐⭐⭐ Czym jest N+1 problem i jak go rozwiązać?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

N+1: 1 zapytanie po listę + N zapytań po każdy powiązany element.

Przykład JPA:
```java
List<Order> orders = orderRepo.findAll(); // 1 query
orders.forEach(o -> o.getItems().size()); // N queries (LazyLoad)
```

Rozwiązania:
- `JOIN FETCH` w JPQL,
- `@EntityGraph`,
- `@BatchSize`,
- dedykowane DTO z projekcją (np. Spring Data Projections).

Wykrycie: Hibernate statistics, p6spy, Datasource Proxy.

---

#### 🔹 9. 🧑‍💻 ⭐⭐⭐ Jakie są strategie cache'owania?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**Cache-aside (Lazy Loading)**: aplikacja sprawdza cache → miss → wczytuje z DB → zapisuje do cache. Prosta, ale ryzyko cold start i race conditions.

**Write-through**: zapis idzie do DB i cache jednocześnie. Cache zawsze aktualny, ale zwiększa latency zapisu.

**Write-behind (Write-back)**: zapis do cache, asynchroniczny flush do DB. Szybki zapis, ale ryzyko utraty danych przy awarii cache.

**Read-through**: cache pobiera dane z DB automatycznie przy miss — aplikacja nie wie o bazie.

---

#### 🔹 10. 🧑‍💻 ⭐⭐ Redis jako cache — kluczowe koncepty

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Redis to in-memory data structure store — typowo jako cache i session store.

Kluczowe cechy:
- TTL per klucz (`EXPIRE`),
- atomowe operacje (INCR, SETNX),
- struktury danych: String, Hash, List, Set, Sorted Set,
- persistence opcjonalna (RDB snapshots, AOF log).

Eviction policies:
- `allkeys-lru` — usuwa najrzadziej używane (dobre dla cache),
- `volatile-lru` — tylko klucze z TTL.

Pułapki: cache stampede (wiele requestów przy miss), memory fragmentation.

---

#### 🔹 11. 🧑‍💻 ⭐⭐ Strategie indeksowania w bazach danych

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**B-tree index** (domyślny): dobry do range queries i equals.

**Composite index**: na wielu kolumnach. Kolejność ma znaczenie — `(a, b)` przyspiesza `WHERE a=? AND b=?` i `WHERE a=?`, ale nie `WHERE b=?`.

**Covering index** (index-only scan): index zawiera wszystkie kolumny potrzebne do zapytania — baza nie musi sięgać do tabeli.

**Partial index**: index tylko na wybranych wierszach (`WHERE status='ACTIVE'`).

Pułapka: każdy index spowalnia INSERT/UPDATE/DELETE.

---

#### 🔹 12. 🧑‍💻 ⭐⭐ Jak optymalizować zapytania SQL?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Proces:
1. `EXPLAIN ANALYZE` — sprawdź plan wykonania,
2. Szukaj: `Seq Scan` na dużych tabelach (brak indexu), `Nested Loop` z dużymi zbiorami.
3. Dodaj index na kolumnach w `WHERE`, `JOIN ON`, `ORDER BY`.
4. Unikaj funkcji na indeksowanych kolumnach (`WHERE LOWER(email) = ?` → `WHERE email = LOWER(?)`).
5. Unikaj `SELECT *` — wybieraj tylko potrzebne kolumny.

Statystyki: `ANALYZE` aktualizuje statystyki planisty.

---

#### 🔹 13. 🧙‍♂️ ⭐⭐ Percentyle vs średnia w metrykach latency

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Średnia (average) ukrywa ogon rozkładu — 1% requestów może trwać 10s ale średnia wygląda OK.

Percentyle:
- **p50** — mediana (50% requestów szybszych),
- **p95** — 95% requestów poniżej tej wartości,
- **p99** — ogon latency (odczuwany przez 1% użytkowników ale to może być miliony requestów),
- **p999** — tail latency.

SLO definiuje się przez percentyle: "p99 < 500ms". Zawsze monitoruj p99, nie tylko średnią.

---

#### 🔹 14. 🧙‍♂️ ⭐ Czym jest JVM tuning dla kontenerów?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

JVM nie widzi limitu pamięci kontenera bez odpowiednich flag (przed Java 11).

Nowoczesne ustawienia:
- `-XX:MaxRAMPercentage=75` — max 75% pamięci kontenera na heap,
- `-XX:+UseContainerSupport` — włączone domyślnie od Java 11,
- GC: `G1GC` (domyślny), `ZGC` (low-latency, Java 15+), `Shenandoah`.

Diagnostyka w runtime:
- `jcmd <pid> VM.native_memory` — szczegółowy breakdown pamięci JVM.

---

#### 🔹 15. 🧙‍♂️ ⭐⭐ Jak wykrywać memory leaks w Javie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Objawy: rosnące zużycie heap między GC, aż do OutOfMemoryError.

Typowe przyczyny:
- statyczne kolekcje trzymające referencje,
- listener/callback nigdy niezarejestrowany,
- thread-local variables nie czyszczone,
- cache bez TTL/eviction.

Narzędzia:
- heap dump (`jmap -dump:format=b,file=heap.hprof <pid>`),
- Eclipse MAT — analiza dominatorów i najgrubszych referencji,
- JFR (Java Flight Recorder) — profilowanie bez dużego narzutu.

---

#### 🔹 16. 🧙‍♂️ ⭐ Czym jest Java Flight Recorder (JFR)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

JFR to low-overhead profiler wbudowany w JVM (open source od Java 11).

Zbiera:
- CPU profiling (metody, stack traces),
- alokacje obiektów,
- GC events,
- I/O, monitor waits, thread states.

Uruchomienie:
```bash
java -XX:StartFlightRecording=duration=60s,filename=app.jfr MyApp
```

Analiza: JDK Mission Control (JMC). Narzut: < 2% na produkcji.

---

#### 🔹 17. 🧙‍♂️ ⭐ Czym są Virtual Threads (Project Loom)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Virtual Threads (Java 21) — lekkie wątki zarządzane przez JVM, nie przez OS.

Problem tradycyjnych wątków:
- 1 OS thread ≈ 1MB stack,
- zablokowany wątek (I/O) blokuje OS thread.

Virtual Threads:
- miliony jednocześnie,
- blokowanie na I/O = unmount z carrier thread,
- kod synchroniczny, semantyka jak reactive — bez callback hell.

Idealne do: aplikacji I/O-bound (HTTP, DB). Nie zastępują reaktywnego dla CPU-bound.

---

#### 🔹 18. 🧙‍♂️ ⭐ Czym jest cache stampede i jak mu zapobiec?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Cache stampede (dogpile effect): wszystkie instancje jednocześnie tracą ten sam klucz (TTL wygasł) i szturmują bazę danych.

Mitygacja:
- **Probabilistic Early Expiration** — losowo odświeżaj klucz przed wygaśnięciem,
- **Locking przy miss** — tylko jeden wątek pobiera z DB, reszta czeka na cache,
- **Soft/Hard TTL** — soft TTL służy do tła odświeżania, hard TTL do ostateczności.

Redis: `SET key value EX 60 NX` (Set if Not Exists) do atomic lock przy miss.

---

#### 🔹 19. 🧙‍♂️ ⭐⭐ Czym jest connection pool sizing i jaka jest optymalna wartość?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

HikariCP recommendation (PostgreSQL wiki):
```
pool_size = (core_count * 2) + effective_spindle_count
```

Dla typowego SSD serwera z 8 core: `(8 * 2) + 1 ≈ 17`.

Paradoks: **duży pool nie zawsze = lepsza wydajność**. Baza ma ograniczony planner, więcej połączeń → więcej context switching → wolniej.

Monitoruj:
- `hikaricp.pending.threads` — liczba requestów czekających na połączenie,
- `hikaricp.connections.timeout` — ile razy przekroczono `connectionTimeout`.

---

#### 🔹 20. 🧙‍♂️ ⭐ Czym jest Distributed Cache i kiedy go używać?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Distributed Cache (Redis Cluster, Hazelcast) — cache współdzielony przez wszystkie instancje aplikacji.

Kiedy:
- wiele instancji aplikacji — lokalny cache per instancja powoduje inconsistency,
- cache dużych obiektów (nie mieszczą się w heap),
- potrzeba TTL i automatic eviction.

Kiedy lokalny (Caffeine/Guava):
- małe, rzadko zmieniające się dane (konfiguracja, listy statyczne),
- bardzo niska latency wymagana (< 1ms).

Dwa poziomy: L1 (Caffeine) + L2 (Redis) — popularne dla hot data.

---

#### 🔹 21. 🧙‍♂️ ⭐⭐ Czym jest async processing i kiedy stosować?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Async processing: czasochłonne operacje są wykonywane w tle, klient dostaje natychmiastową odpowiedź (202 Accepted).

Wzorzec:
1. Przyjmij żądanie → zapisz do kolejki → zwróć `jobId`.
2. Worker przetwarza asynchronicznie.
3. Klient polling lub webhook po wynik.

Kiedy stosować:
- generowanie raportów, eksport danych,
- wysyłka emaili,
- przetwarzanie obrazów,
- długie transakcje.

Narzędzia: Kafka, RabbitMQ, Spring `@Async`, Spring Batch.

---

#### 🔹 22. 🧑‍💻 ⭐⭐ Jak mierzyć wydajność w produkcji (APM)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

APM (Application Performance Monitoring) daje wgląd w:
- latency per endpoint,
- error rate,
- dependency performance (DB, cache, zewnętrzne API),
- JVM metrics (heap, GC, threads).

Narzędzia:
- **Micrometer** + Prometheus + Grafana — open source stack,
- **Datadog, New Relic** — SaaS z auto-instrumentation,
- **OpenTelemetry** — standard zbierania telemetrii (traces, metrics, logs).

Spring Boot Actuator + Micrometer to minimum dla każdej aplikacji produkcyjnej.

---

#### 🔹 23. 🧙‍♂️ ⭐ Czym jest object pooling i kiedy go stosować?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Object pooling: ponowne użycie drogich obiektów zamiast tworzenia od nowa.

Kiedy sensowne:
- tworzenie obiektu jest kosztowne (połączenia DB, wątki),
- obiekt jest często potrzebny i krótko używany.

Kiedy NIE:
- zwykłe POJO — GC radzi sobie lepiej,
- przetrzymywanie pooled objects zwiększa retention i może powodować GC pause.

Przykłady: connection pooling (HikariCP), ByteBuffer pools (Netty), thread pools (ExecutorService).

---

#### 🔹 24. 🧙‍♂️ ⭐ Czym jest CDN i jak poprawia wydajność?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

CDN (Content Delivery Network) to sieć serwerów cache rozmieszczonych geograficznie.

Żądanie trafia do najbliższego edge node zamiast origin server.

Korzyści:
- mniejsza latency (mniej ms do edge niż do origin),
- odciążenie origin servera,
- absorpcja ruchu przy DDoS,
- caching statycznych assetów (CSS, JS, images) i API responses.

Popularne: CloudFront (AWS), Cloudflare, Fastly.
Ważne: poprawna konfiguracja cache headers (`Cache-Control`, `Vary`, `ETag`).

---

#### 🔹 25. 🧑‍💻 ⭐⭐ Czym są SLI, SLO i SLA w kontekście wydajności?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**SLI** (Service Level Indicator): konkretna miara: p99 latency, error rate, availability.

**SLO** (Service Level Objective): docelowa wartość SLI: "p99 < 200ms przez 99,9% czasu w miesiącu".

**SLA** (Service Level Agreement): kontrakt z konsekwencjami: "availability 99,9%, inaczej zwracamy x% opłaty".

Error budget = `1 - SLO` = budżet na błędy i eksperymenty.

Gdy error budget wyczerpany: zamróź deploye, zwiększ niezawodność.
Gdy pełny: możesz ryzykować nowe funkcje.

