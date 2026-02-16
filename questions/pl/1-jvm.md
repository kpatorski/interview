[💡 Questions](questions.md)

# 📘 JAVA (Core / JVM)

<!-- TOC -->
* [📘 JAVA (Core / JVM)](#-java-core--jvm)
  * [1️⃣ JVM i Model Pamięci](#1-jvm-i-model-pamięci)
      * [🔹 1. Czym jest JVM i z jakich głównych obszarów pamięci się składa?](#-1-czym-jest-jvm-i-z-jakich-głównych-obszarów-pamięci-się-składa)
      * [🔹 2. Czym jest Java Memory Model (JMM)?](#-2-czym-jest-java-memory-model-jmm)
      * [🔹 3. Co to jest reordering i dlaczego jest problemem?](#-3-co-to-jest-reordering-i-dlaczego-jest-problemem)
      * [🔹 4. Czym jest relacja happens-before?](#-4-czym-jest-relacja-happens-before)
      * [🔹 5. Czym różni się visibility od atomicity?](#-5-czym-różni-się-visibility-od-atomicity)
          * [✅ Visibility (widoczność)](#-visibility-widoczność)
          * [✅ Atomicity (niepodzielność)](#-atomicity-niepodzielność)
      * [🔹 6. Czym jest Escape Analysis?](#-6-czym-jest-escape-analysis)
      * [🔹 7. Jak działa ClassLoader?](#-7-jak-działa-classloader)
      * [🔹 8. Czym jest JIT?](#-8-czym-jest-jit)
      * [🔹 9. Jak działa Garbage Collector w skrócie?](#-9-jak-działa-garbage-collector-w-skrócie)
  * [2️⃣ Współbieżność (Concurrency)](#2-współbieżność-concurrency)
      * [🔹 1. Jak działa `synchronized` w JVM?](#-1-jak-działa-synchronized-w-jvm)
          * [Co dzieje się przy wejściu do bloku synchronized?](#co-dzieje-się-przy-wejściu-do-bloku-synchronized)
          * [Gwarancje:](#gwarancje)
      * [🔹 2. Czym jest `volatile` i co dokładnie gwarantuje?](#-2-czym-jest-volatile-i-co-dokładnie-gwarantuje)
      * [🔹 3. Dlaczego `i++` nie jest bezpieczne wielowątkowo?](#-3-dlaczego-i-nie-jest-bezpieczne-wielowątkowo)
      * [🔹 4. Czym jest CAS (Compare-And-Swap)?](#-4-czym-jest-cas-compare-and-swap)
      * [🔹 5. Jak działają klasy Atomic*?](#-5-jak-działają-klasy-atomic)
      * [🔹 6. Czym różni się ReentrantLock od synchronized?](#-6-czym-różni-się-reentrantlock-od-synchronized)
      * [🔹 7. Czym jest deadlock?](#-7-czym-jest-deadlock)
      * [🔹 8. Czym jest livelock?](#-8-czym-jest-livelock)
      * [🔹 9. Czym jest starvation?](#-9-czym-jest-starvation)
      * [🔹 10. Czym jest False Sharing?](#-10-czym-jest-false-sharing)
      * [🔹 11. Jaki jest cykl życia wątku w Javie?](#-11-jaki-jest-cykl-życia-wątku-w-javie)
      * [🔹 12. Dlaczego nie powinniśmy tworzyć wątków ręcznie (new Thread)?](#-12-dlaczego-nie-powinniśmy-tworzyć-wątków-ręcznie-new-thread)
      * [🔹 13. Czym jest ExecutorService?](#-13-czym-jest-executorservice)
      * [🔹 14. Jak działa ThreadPoolExecutor?](#-14-jak-działa-threadpoolexecutor)
      * [🔹 15. Jakie są typowe implementacje ExecutorService?](#-15-jakie-są-typowe-implementacje-executorservice)
      * [🔹 16. Czym jest ForkJoinPool i do czego służy?](#-16-czym-jest-forkjoinpool-i-do-czego-służy)
      * [🔹 17. Czym jest work-stealing?](#-17-czym-jest-work-stealing)
      * [🔹 18. Czym jest CompletableFuture?](#-18-czym-jest-completablefuture)
      * [🔹 19. Czym różni się thenApply od thenCompose?](#-19-czym-różni-się-thenapply-od-thencompose)
      * [🔹 20. Co oznacza blocking vs non-blocking?](#-20-co-oznacza-blocking-vs-non-blocking)
      * [🔹 21. Czym jest backpressure?](#-21-czym-jest-backpressure)
  * [3️⃣ Kolekcje i Struktury Danych](#3-kolekcje-i-struktury-danych)
      * [🔹 22. Jak działa HashMap krok po kroku?](#-22-jak-działa-hashmap-krok-po-kroku)
      * [🔹 23. Dlaczego equals() i hashCode() muszą być spójne?](#-23-dlaczego-equals-i-hashcode-muszą-być-spójne)
      * [🔹 24. Czym jest loadFactor i dlaczego ma znaczenie?](#-24-czym-jest-loadfactor-i-dlaczego-ma-znaczenie)
      * [🔹 25. Czym jest Red-Black Tree?](#-25-czym-jest-red-black-tree)
      * [🔹 26. Czym różni się HashMap od ConcurrentHashMap?](#-26-czym-różni-się-hashmap-od-concurrenthashmap)
      * [🔹 27. Co to jest segment-based locking?](#-27-co-to-jest-segment-based-locking)
      * [🔹 28. Czym jest CopyOnWriteArrayList?](#-28-czym-jest-copyonwritearraylist)
      * [🔹 29. Jakie są złożoności czasowe (Big-O) podstawowych kolekcji?](#-29-jakie-są-złożoności-czasowe-big-o-podstawowych-kolekcji)
  * [4️⃣ Stream API](#4-stream-api)
      * [🔹 30. Czym jest lazy evaluation w Stream API?](#-30-czym-jest-lazy-evaluation-w-stream-api)
      * [🔹 31. Czym różnią się operacje stateless i stateful?](#-31-czym-różnią-się-operacje-stateless-i-stateful)
      * [🔹 32. Czym różni się map od flatMap?](#-32-czym-różni-się-map-od-flatmap)
      * [🔹 33. Dlaczego funkcja w reduce musi być asocjacyjna?](#-33-dlaczego-funkcja-w-reduce-musi-być-asocjacyjna)
      * [🔹 34. Czym jest Spliterator?](#-34-czym-jest-spliterator)
      * [🔹 35. Dlaczego parallel stream może być niebezpieczny?](#-35-dlaczego-parallel-stream-może-być-niebezpieczny)
      * [🔹 36. Dlaczego efekty uboczne (side effects) łamią parallel stream?](#-36-dlaczego-efekty-uboczne-side-effects-łamią-parallel-stream)
      * [🔹 37. Czym różni się forEach od forEachOrdered?](#-37-czym-różni-się-foreach-od-foreachordered)
  * [5️⃣ Typy, OOP i Generics](#5-typy-oop-i-generics)
      * [🔹 38. Czym jest type erasure w Generics?](#-38-czym-jest-type-erasure-w-generics)
      * [🔹 39. Czym jest covariance i contravariance?](#-39-czym-jest-covariance-i-contravariance)
      * [🔹 40. Dlaczego immutable objects są bezpieczne wielowątkowo?](#-40-dlaczego-immutable-objects-są-bezpieczne-wielowątkowo)
      * [🔹 41. Czym różni się equals od ==?](#-41-czym-różni-się-equals-od-)
      * [🔹 42. Czym jest record w Javie?](#-42-czym-jest-record-w-javie)
      * [🔹 43. Czym są sealed classes?](#-43-czym-są-sealed-classes)
      * [🔹 44. Kiedy Optional jest dobrym pomysłem, a kiedy złym?](#-44-kiedy-optional-jest-dobrym-pomysłem-a-kiedy-złym)
      * [🔹 45. Czym są value-based classes?](#-45-czym-są-value-based-classes)
  * [6️⃣ IO / NIO](#6-io--nio)
      * [🔹 46. Czym różni się IO od NIO?](#-46-czym-różni-się-io-od-nio)
      * [🔹 47. Czym jest Channel?](#-47-czym-jest-channel)
      * [🔹 48. Czym jest Buffer?](#-48-czym-jest-buffer)
      * [🔹 49. Czym jest Selector?](#-49-czym-jest-selector)
      * [🔹 50. Czym jest memory-mapped file?](#-50-czym-jest-memory-mapped-file)
  * [7️⃣ Wyjątki i API Design](#7-wyjątki-i-api-design)
      * [🔹 51. Czym różnią się checked i unchecked exceptions?](#-51-czym-różnią-się-checked-i-unchecked-exceptions)
      * [🔹 52. Czym jest exception wrapping?](#-52-czym-jest-exception-wrapping)
      * [🔹 53. Czym są suppressed exceptions?](#-53-czym-są-suppressed-exceptions)
      * [🔹 54. Czym jest defensive copying?](#-54-czym-jest-defensive-copying)
      * [🔹 55. Jak projektować dobre API?](#-55-jak-projektować-dobre-api)
<!-- TOC -->

## 1️⃣ JVM i Model Pamięci

---

#### 🔹 1. Czym jest JVM i z jakich głównych obszarów pamięci się składa?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

JVM (Java Virtual Machine) to środowisko uruchomieniowe, które:
- wykonuje bytecode (.class),
- zarządza pamięcią,
- zarządza wątkami,
- zapewnia izolację i bezpieczeństwo.

<span style='color:##a9b8c6;font-weight:bold;font-size:small;list-style-type:none'>Główne obszary pamięci:</span>

🔸 **Heap**
- Współdzielony między wątkami.
- Przechowuje obiekty i ich pola.
- Zarządzany przez Garbage Collector.
- Podzielony na:
  - Young Generation (Eden + Survivor)
  - Old Generation

🔸 **Stack (dla każdego wątku osobny)**
- Przechowuje:
  - zmienne lokalne,
  - referencje do obiektów,
  - ramki metod (stack frames).
- Zarządzany automatycznie (LIFO).
- Nie podlega GC.

🔸 **3️⃣ Metaspace**
- Przechowuje metadane klas.
- Zastąpił PermGen od Java 8.
- Alokowany w pamięci natywnej (poza heapem).

🔸 **4️⃣ PC Register**
- Wskaźnik aktualnie wykonywanej instrukcji dla wątku.

🔸 **5️⃣ Native Method Stack**
- Dla metod natywnych (JNI).

---

#### 🔹 2. Czym jest Java Memory Model (JMM)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

JMM to specyfikacja opisująca:

- jak wątki widzą zmiany w pamięci,
- jakie operacje mogą być reorderyzowane przez kompilator/JIT/CPU,
- kiedy zmiany są widoczne między wątkami.

JMM definiuje:
- reguły widoczności,
- reguły synchronizacji,
- relację happens-before.

Bez JMM kod wielowątkowy byłby nieprzewidywalny.

---

#### 🔹 3. Co to jest reordering i dlaczego jest problemem?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Reordering to zmiana kolejności instrukcji przez:
- kompilator,
- JIT,
- CPU (out-of-order execution).

Jeśli inny wątek odczyta zmienne między operacjami, może zobaczyć niespójny stan.

Dlatego potrzebujemy:
- synchronized,
- volatile,
- locków,
- atomics.

---

#### 🔹 4. Czym jest relacja happens-before?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Happens-before to gwarancja JMM mówiąca:

> Jeśli operacja A happens-before operacji B, to wszystkie zmiany pamięci wykonane przez A są widoczne dla B.

Przykłady:

- Zakończenie metody synchronized happens-before wejście do synchronized na tym samym monitorze.
- Zapis do zmiennej volatile happens-before jej odczyt.
- Wywołanie start() happens-before kod w nowym wątku.
- Zakończenie wątku happens-before join().

---

#### 🔹 5. Czym różni się visibility od atomicity?

###### ✅ Visibility (widoczność)

Czy zmiana dokonana przez jeden wątek jest widoczna dla innego.

Zapewniają:
- volatile
- synchronized
- locki

###### ✅ Atomicity (niepodzielność)

Czy operacja wykona się w całości, bez możliwości przerwania.

Np operacja i++ nie jest atomowa, ponieważ składa się z:
1. odczytu
2. inkrementacji
3. zapisu

Atomowość zapewniają:
- synchronized
- Lock
- klasy Atomic*
- CAS (Compare-And-Swap)

---

#### 🔹 6. Czym jest Escape Analysis?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Escape Analysis to optymalizacja JIT.

Sprawdza, czy obiekt nie "ucieka" poza metodę (nie jest zwracany ani przekazywany dalej).

Jeśli nie ucieka:
- może zostać zaalokowany na stosie zamiast na heapie,
- może zostać wyeliminowany (scalar replacement),
- może zostać usunięta synchronizacja (lock elision).

---

#### 🔹 7. Jak działa ClassLoader?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

ClassLoader:
- ładuje klasy do JVM,
- zamienia bytecode na obiekt klasy.

Hierarchia:
1. Bootstrap ClassLoader
2. Platform ClassLoader
3. Application ClassLoader

Działa w modelu parent-first — najpierw pyta rodzica, jeśli rodzic nie znajdzie klasy, ładuje ją sam.

---

#### 🔹 8. Czym jest JIT?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

JIT (Just-In-Time compiler):
- kompiluje bytecode do natywnego kodu maszynowego podczas działania programu,
- optymalizuje "gorące" fragmenty kodu (hot spots).

Optymalizacje obejmują:
- inlining,
- loop unrolling,
- escape analysis,
- dead code elimination.

---

#### 🔹 9. Jak działa Garbage Collector w skrócie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

GC usuwa obiekty, do których nie ma referencji.

Główne etapy:
1. Mark — oznaczenie obiektów osiągalnych
2. Sweep — usunięcie nieosiągalnych
3. Compact — defragmentacja

Nowoczesne GC:
- G1
- ZGC
- Shenandoah


---

## 2️⃣ Współbieżność (Concurrency)

#### 🔹 1. Jak działa `synchronized` w JVM?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

`synchronized` używa monitora (monitor lock) przypisanego do obiektu.

Każdy obiekt w Javie posiada nagłówek (object header), który zawiera informacje o stanie blokady.

###### Co dzieje się przy wejściu do bloku synchronized?

1. Wątek próbuje przejąć monitor.
2. Jeśli monitor jest wolny — zostaje właścicielem.
3. Jeśli zajęty — wątek przechodzi w stan BLOCKED.
4. Po wyjściu z bloku monitor jest zwalniany.

###### Gwarancje:
- Mutual exclusion (tylko jeden wątek naraz).
- Visibility (flush do pamięci głównej przy wyjściu).
- Relacja happens-before między unlock → lock.

---

#### 🔹 2. Czym jest `volatile` i co dokładnie gwarantuje?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

`volatile` zapewnia:

1️⃣ Visibility — zapis trafia bezpośrednio do pamięci głównej, a odczyt zawsze pobiera aktualną wartość.

2️⃣ Zakaz reordering wokół zmiennej volatile.

Nie zapewnia atomicity dla operacji złożonych (np. i++).

JVM generuje instrukcje z barierami pamięci (memory barriers), które wymuszają synchronizację cache CPU.

---

#### 🔹 3. Dlaczego `i++` nie jest bezpieczne wielowątkowo?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Operacja `i++` składa się z:
1. read
2. increment
3. write

Dwa wątki mogą odczytać tę samą wartość i nadpisać się nawzajem (lost update).

Rozwiązania:
- synchronized
- AtomicInteger
- Lock

---

#### 🔹 4. Czym jest CAS (Compare-And-Swap)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

CAS to atomowa instrukcja procesora wykonująca operację:

Jeśli currentValue == expectedValue → ustaw newValue.
W przeciwnym razie operacja się nie powiedzie.

Operacja jest niepodzielna na poziomie CPU.

W Javie używana przez:
- AtomicInteger
- ConcurrentHashMap
- Struktury lock-free

---

#### 🔹 5. Jak działają klasy Atomic*?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Np. AtomicInteger:
- przechowuje wartość jako volatile,
- używa CAS w pętli retry.

Schemat działania:
1. Odczytaj aktualną wartość.
2. Oblicz nową wartość.
3. Spróbuj wykonać CAS.
4. Jeśli się nie uda — powtórz.

To jest podejście lock-free.

---

#### 🔹 6. Czym różni się ReentrantLock od synchronized?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

ReentrantLock oferuje:
- tryLock()
- lockInterruptibly()
- możliwość ustawienia fairness
- condition variables

`synchronized`:
- prostszy w użyciu
- automatycznie zwalnia lock przy wyjątku

Oba zapewniają mutual exclusion i visibility.

---

#### 🔹 7. Czym jest deadlock?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Deadlock to sytuacja, gdy dwa lub więcej wątków czekają na zasoby trzymane przez siebie nawzajem.

Warunki deadlocka:
1. Mutual exclusion
2. Hold and wait
3. No preemption
4. Circular wait

---

#### 🔹 8. Czym jest livelock?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Wątki nie są zablokowane, ale stale reagują na siebie i nie wykonują postępu.

---

#### 🔹 9. Czym jest starvation?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Wątek nigdy nie otrzymuje zasobu, ponieważ inne wątki są preferowane.

---

#### 🔹 10. Czym jest False Sharing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

False sharing występuje, gdy dwie zmienne modyfikowane przez różne wątki znajdują się w tej samej cache line CPU.

Powoduje to częstą synchronizację cache między rdzeniami i spadek wydajności.

Rozwiązania:
- padding
- adnotacja @Contended (z odpowiednią flagą JVM)


---

#### 🔹 11. Jaki jest cykl życia wątku w Javie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Stany wątku (Thread.State):

1. NEW — wątek utworzony, ale nieuruchomiony.
2. RUNNABLE — gotowy do wykonania lub wykonywany przez CPU.
3. BLOCKED — oczekuje na monitor (np. wejście do synchronized).
4. WAITING — czeka bez limitu czasu (np. wait(), join()).
5. TIMED_WAITING — czeka przez określony czas (sleep(), wait(timeout)).
6. TERMINATED — zakończył wykonanie.

Metoda start() powoduje przejście z NEW do RUNNABLE.

---

#### 🔹 12. Dlaczego nie powinniśmy tworzyć wątków ręcznie (new Thread)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Tworzenie wątków jest kosztowne:
- alokacja pamięci stosu,
- rejestracja w systemie operacyjnym,
- przełączanie kontekstu (context switching).

Tworzenie wielu krótkotrwałych wątków prowadzi do:
- wysokiego narzutu systemowego,
- spadku wydajności,
- ryzyka OutOfMemoryError.

Dlatego stosuje się pule wątków.

---

#### 🔹 13. Czym jest ExecutorService?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

ExecutorService to interfejs zarządzający wykonywaniem zadań asynchronicznych.

Oddziela:
- tworzenie wątków,
- zarządzanie nimi,
- wykonywanie zadań.

Pozwala:
- submit() — zwraca Future,
- execute() — bez zwracania wyniku,
- shutdown() — inicjuje zamknięcie,
- shutdownNow() — próbuje przerwać wątki.

---

#### 🔹 14. Jak działa ThreadPoolExecutor?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

ThreadPoolExecutor zarządza pulą wątków według parametrów:

1. corePoolSize — minimalna liczba wątków.
2. maximumPoolSize — maksymalna liczba wątków.
3. keepAliveTime — czas utrzymywania nadmiarowych wątków.
4. workQueue — kolejka zadań.

Schemat działania:

1. Jeśli liczba aktywnych wątków < corePoolSize → tworzony nowy wątek.
2. Jeśli osiągnięto corePoolSize → zadanie trafia do kolejki.
3. Jeśli kolejka pełna i liczba wątków < maximumPoolSize → tworzony nowy wątek.
4. Jeśli osiągnięto maximumPoolSize i kolejka pełna → uruchamiany RejectedExecutionHandler.

---

#### 🔹 15. Jakie są typowe implementacje ExecutorService?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

- newFixedThreadPool(n) — stała liczba wątków.
- newCachedThreadPool() — dynamiczna liczba wątków, brak ograniczenia (może być niebezpieczne).
- newSingleThreadExecutor() — jeden wątek.
- newScheduledThreadPool(n) — zadania cykliczne/opóźnione.

W środowisku produkcyjnym zaleca się jawne konfigurowanie ThreadPoolExecutor.


---

#### 🔹 16. Czym jest ForkJoinPool i do czego służy?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

ForkJoinPool to specjalizowana pula wątków zaprojektowana do zadań dzielonych rekurencyjnie (divide-and-conquer).

Kluczowe cechy:
- Używa algorytmu work-stealing.
- Każdy wątek posiada własną dwukierunkową kolejkę (deque).
- Jeśli wątek kończy swoje zadania — "kradnie" zadania z końca kolejki innego wątku.

Dzięki temu minimalizuje bezczynność wątków i poprawia wykorzystanie CPU.

Używany przez:
- Parallel Stream
- CompletableFuture (domyślnie commonPool)

---

#### 🔹 17. Czym jest work-stealing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Work-stealing to strategia równoważenia obciążenia:

- Wątek wykonuje zadania ze swojej kolejki (LIFO — dla lepszej lokalności cache).
- Jeśli nie ma zadań — kradnie z innego wątku (FIFO — z końca kolejki).

Zmniejsza contention na wspólnej kolejce i poprawia skalowalność.

---

#### 🔹 18. Czym jest CompletableFuture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

CompletableFuture to rozszerzenie Future pozwalające na:
- asynchroniczne przetwarzanie,
- łączenie operacji w pipeline,
- obsługę wyjątków,
- kompozycję wielu zadań.

Różnice względem Future:
- Future jest blokujące (get()).
- CompletableFuture umożliwia non-blocking chaining (thenApply, thenCompose).

Przykłady metod:
- supplyAsync()
- thenApply()
- thenCompose()
- thenCombine()
- exceptionally()

---

#### 🔹 19. Czym różni się thenApply od thenCompose?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

thenApply:
- Przekształca wynik synchronizacyjnie.
- Jeśli zwraca CompletableFuture — powstaje zagnieżdżenie (CompletableFuture<CompletableFuture<T>>).

thenCompose:
- Służy do spłaszczania zagnieżdżonych future.
- Analogiczny do flatMap w Stream API.

---

#### 🔹 20. Co oznacza blocking vs non-blocking?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Blocking:
- Wątek czeka na zakończenie operacji.
- CPU może być bezczynne.
- Przykład: Future.get().

Non-blocking:
- Wątek nie czeka.
- Rejestruje callback i wykonuje inne zadania.
- Przykład: CompletableFuture.thenApply().

Non-blocking poprawia skalowalność przy operacjach IO.

---

#### 🔹 21. Czym jest backpressure?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Backpressure to mechanizm kontroli przepływu danych między producentem a konsumentem.

Problem:
- Producent generuje dane szybciej niż konsument je przetwarza.
- Może to prowadzić do przepełnienia pamięci.

Rozwiązania:
- Ograniczone kolejki (bounded queue).
- Odrzucanie zadań.
- Reactive Streams (request(n)).

W kontekście ThreadPoolExecutor:
- Ograniczenie workQueue zapobiega niekontrolowanemu wzrostowi pamięci.


---

## 3️⃣ Kolekcje i Struktury Danych

#### 🔹 22. Jak działa HashMap krok po kroku?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

1. Obliczany jest hashCode() klucza.
2. Hash jest mieszany (bit spreading), aby lepiej rozłożyć bity.
3. Na podstawie hasha wyliczany jest indeks w tablicy: (n - 1) & hash.
4. Jeśli bucket jest pusty → tworzony nowy Node.
5. Jeśli kolizja:
   - porównanie equals(),
   - jeśli klucz istnieje → nadpisanie wartości,
   - jeśli nie → dodanie do listy lub drzewa.

Od Java 8:
- Jeśli w bucket jest ≥ 8 elementów → lista zamieniana na Red-Black Tree.
- Jeśli liczba spadnie < 6 → powrót do listy.

Resize następuje po przekroczeniu threshold = capacity × loadFactor.

---

#### 🔹 23. Dlaczego equals() i hashCode() muszą być spójne?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Kontrakt:

1. Jeśli a.equals(b) == true → a.hashCode() == b.hashCode().
2. Jeśli hashCode różne → obiekty na pewno różne.

Jeśli złamiemy kontrakt:
- HashMap może nie znaleźć klucza,
- dane mogą zostać "zgubione".

Typowy błąd: nadpisanie equals bez hashCode.

---

#### 🔹 24. Czym jest loadFactor i dlaczego ma znaczenie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

loadFactor określa, przy jakim zapełnieniu nastąpi resize.

Domyślnie: 0.75.

- Niższy loadFactor → mniej kolizji, większe zużycie pamięci.
- Wyższy loadFactor → więcej kolizji, mniejsza pamięć.

---

#### 🔹 25. Czym jest Red-Black Tree?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Red-Black Tree to samobalansujące drzewo binarne.

Właściwości:
1. Każdy węzeł jest czerwony lub czarny.
2. Korzeń jest czarny.
3. Czerwony węzeł nie może mieć czerwonego dziecka.
4. Każda ścieżka do liścia ma tę samą liczbę czarnych węzłów.

Zapewnia operacje w czasie O(log n).

---

#### 🔹 26. Czym różni się HashMap od ConcurrentHashMap?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

HashMap:
- Nie jest thread-safe.
- Może wejść w nieskończoną pętlę przy równoległym resize (Java < 8).

ConcurrentHashMap:
- Thread-safe bez globalnego locka.
- Używa CAS i synchronizacji na poziomie bucket.
- Brak segmentów od Java 8 (wcześniej segment-based locking).

Operacje odczytu są w większości bezblokujące.

---

#### 🔹 27. Co to jest segment-based locking?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

W starszych wersjach ConcurrentHashMap (Java 7):
- Mapa była podzielona na segmenty.
- Każdy segment miał własny lock.
- Zmniejszało to contention względem jednego globalnego locka.

Od Java 8 zastąpione synchronizacją na bucket.

---

#### 🔹 28. Czym jest CopyOnWriteArrayList?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

CopyOnWriteArrayList:
- Przy każdej modyfikacji tworzy nową kopię tablicy.
- Odczyty są bezblokujące.

Dobre dla:
- wielu odczytów,
- rzadkich zapisów.

Kosztowne przy częstych modyfikacjach.

---

#### 🔹 29. Jakie są złożoności czasowe (Big-O) podstawowych kolekcji?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

HashMap:
- get/put: O(1) średnio, O(log n) przy drzewie.

ArrayList:
- get: O(1)
- add (na końcu): O(1) amortyzowane
- insert/remove w środku: O(n)

LinkedList:
- get: O(n)
- add/remove na początku: O(1)

TreeMap:
- get/put: O(log n)


---

## 4️⃣ Stream API

#### 🔹 30. Czym jest lazy evaluation w Stream API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Lazy evaluation oznacza, że operacje pośrednie (intermediate operations) nie są wykonywane od razu.

Są wykonywane dopiero, gdy pojawi się operacja terminalna (np. collect, forEach, reduce).

Pozwala to na:
- optymalizację przetwarzania,
- przetwarzanie elementów "na żądanie",
- łączenie operacji w jeden pipeline.

---

#### 🔹 31. Czym różnią się operacje stateless i stateful?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Stateless:
- Nie zależą od innych elementów.
- Przykład: map, filter.
- Łatwe do równoległego przetwarzania.

Stateful:
- Wymagają wiedzy o innych elementach.
- Przykład: sorted, distinct.
- Wymagają buforowania danych.

Operacje stateful są droższe i trudniejsze do zrównoleglenia.

---

#### 🔹 32. Czym różni się map od flatMap?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

map:
- Przekształca element na inny element.
- 1 → 1

flatMap:
- Przekształca element na strumień elementów.
- 1 → N
- Spłaszcza wynik.

flatMap jest odpowiednikiem flatMap z programowania funkcyjnego.

---

#### 🔹 33. Dlaczego funkcja w reduce musi być asocjacyjna?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Operacja asocjacyjna spełnia warunek:

(a op b) op c = a op (b op c)

W parallel stream:
- Dane są dzielone na części.
- Wyniki częściowe są łączone w dowolnej kolejności.

Jeśli operacja nie jest asocjacyjna — wynik może być niepoprawny.

---

#### 🔹 34. Czym jest Spliterator?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Spliterator to iterator zaprojektowany do przetwarzania równoległego.

Posiada metodę trySplit(), która:
- dzieli dane na części,
- umożliwia przetwarzanie równoległe.

Definiuje charakterystyki:
- SIZED
- ORDERED
- DISTINCT
- SORTED
- IMMUTABLE

Stream używa Spliterator do podziału pracy w parallel stream.

---

#### 🔹 35. Dlaczego parallel stream może być niebezpieczny?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Problemy:

1. Side effects — współdzielony mutowalny stan może powodować race condition.
2. Operacje stateful są kosztowne.
3. Małe kolekcje — narzut przewyższa zysk.
4. Współdzielenie ForkJoinPool commonPool — może blokować inne zadania.

Parallel stream jest dobry dla:
- dużych, CPU-bound operacji,
- operacji asocjacyjnych,
- braku efektów ubocznych.

---

#### 🔹 36. Dlaczego efekty uboczne (side effects) łamią parallel stream?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Side effect to modyfikacja współdzielonego stanu.

W parallel stream:
- Elementy są przetwarzane równolegle.
- Brak synchronizacji prowadzi do race condition.

Przykład niepoprawny:

list.parallelStream().forEach(e -> sharedList.add(e));

Poprawne podejście:
- collect(Collectors.toList())

Stream powinien być funkcjonalny i bez efektów ubocznych.

---

#### 🔹 37. Czym różni się forEach od forEachOrdered?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

forEach:
- Nie gwarantuje kolejności w parallel stream.
- Szybszy.

forEachOrdered:
- Zachowuje kolejność źródła.
- Może ograniczać równoległość.

W sequential stream działają identycznie.


---

## 5️⃣ Typy, OOP i Generics

#### 🔹 38. Czym jest type erasure w Generics?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Type erasure oznacza, że informacje o typach generycznych są usuwane w czasie kompilacji.

Przykład:
List<String> i List<Integer> w runtime są widziane jako List.

Konsekwencje:
- Brak informacji o typie w runtime.
- Nie można tworzyć new T().
- Nie można tworzyć tablic generycznych (new T[]).

Kompilator dodaje casty w bytecode, aby zachować bezpieczeństwo typów.

---

#### 🔹 39. Czym jest covariance i contravariance?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Covariance — pozwala używać typu bardziej szczegółowego.

List<? extends Number>
- Można czytać jako Number.
- Nie można bezpiecznie dodawać elementów.

Contravariance — pozwala używać typu bardziej ogólnego.

List<? super Integer>
- Można dodawać Integer.
- Odczyt jako Object.

Zasada PECS:
- Producer → extends
- Consumer → super

---

#### 🔹 40. Dlaczego immutable objects są bezpieczne wielowątkowo?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Obiekt immutable:
- Nie zmienia stanu po konstrukcji.
- Wszystkie pola final.
- Brak setterów.

Gwarancje:
- Brak race condition.
- Bezpieczne publikowanie (safe publication), jeśli pola są final.

Immutable upraszcza concurrency.

---

#### 🔹 41. Czym różni się equals od ==?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

== porównuje referencje (czy to ten sam obiekt).

equals porównuje logiczną równość (zawartość).

Dla klas własnych należy nadpisać equals i hashCode.

---

#### 🔹 42. Czym jest record w Javie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

record to skrócona forma klasy immutable.

Automatycznie generuje:
- konstruktor,
- equals,
- hashCode,
- toString,
- gettery.

Record jest final i przeznaczony do przechowywania danych.

---

#### 🔹 43. Czym są sealed classes?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Sealed class ogranicza, które klasy mogą ją rozszerzać.

Przykład:
sealed class Shape permits Circle, Square {}

Pozwala:
- kontrolować hierarchię dziedziczenia,
- ułatwiać exhaustive switch.

---

#### 🔹 44. Kiedy Optional jest dobrym pomysłem, a kiedy złym?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Dobry:
- jako typ zwracany z metody.
- aby uniknąć null.

Zły:
- jako pole w encji.
- jako parametr metody.
- w serializacji.

Optional nie jest zamiennikiem każdego null.

---

#### 🔹 45. Czym są value-based classes?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Value-based class:
- Reprezentuje wartość, nie tożsamość.
- Nie należy polegać na referencyjnej równości (==).

Przykład: Integer, Optional.

W przyszłości Project Valhalla wprowadzi value types bez narzutu obiektowego.



---

## 6️⃣ IO / NIO

#### 🔹 46. Czym różni się IO od NIO?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

IO (java.io):
- Model strumieniowy (InputStream/OutputStream).
- Operacje blokujące.
- Jeden wątek na jedno połączenie.

NIO (java.nio):
- Kanały (Channel) i bufory (Buffer).
- Możliwość trybu non-blocking.
- Selector pozwala obsługiwać wiele połączeń jednym wątkiem.

NIO jest bardziej skalowalne przy dużej liczbie połączeń.

---

#### 🔹 47. Czym jest Channel?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Channel to dwukierunkowe połączenie do źródła danych.

Przykłady:
- FileChannel
- SocketChannel
- ServerSocketChannel

Współpracuje z Buffer.

---

#### 🔹 48. Czym jest Buffer?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Buffer to kontener na dane z polami:
- capacity — maksymalny rozmiar,
- position — aktualna pozycja,
- limit — granica odczytu/zapisu.

Tryb zapisu → flip() → tryb odczytu.

---

#### 🔹 49. Czym jest Selector?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Selector pozwala jednemu wątkowi monitorować wiele kanałów.

Działa poprzez:
- rejestrowanie kanałów,
- sprawdzanie gotowości do operacji (read, write, accept).

Umożliwia model event-driven.

---

#### 🔹 50. Czym jest memory-mapped file?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Memory-mapped file (MappedByteBuffer):
- Mapuje plik bezpośrednio do pamięci.
- OS zarządza synchronizacją z dyskiem.

Zalety:
- Szybki dostęp do dużych plików.
- Brak kopiowania danych między buforami.

Wady:
- Trudniejsze zarządzanie pamięcią.

---

## 7️⃣ Wyjątki i API Design

#### 🔹 51. Czym różnią się checked i unchecked exceptions?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Checked:
- Muszą być zadeklarowane lub obsłużone.
- Reprezentują sytuacje, które można przewidzieć.

Unchecked (RuntimeException):
- Nie wymagają deklaracji.
- Reprezentują błędy programistyczne.

W nowoczesnym kodzie preferuje się unchecked.

---

#### 🔹 52. Czym jest exception wrapping?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Exception wrapping polega na opakowaniu niższego wyjątku w wyższy:

throw new CustomException("msg", cause);

Pozwala:
- zachować stack trace,
- oddzielić warstwy aplikacji.

---

#### 🔹 53. Czym są suppressed exceptions?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Powstają przy try-with-resources.

Jeśli:
- wyjątek wystąpi w bloku try,
- oraz podczas zamykania zasobu,

Wyjątek z close() jest suppressed i dostępny przez getSuppressed().

---

#### 🔹 54. Czym jest defensive copying?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Defensive copying polega na tworzeniu kopii mutowalnych obiektów przekazywanych do klasy.

Chroni przed:
- niekontrolowaną modyfikacją stanu.

Stosowane w klasach immutable.

---

#### 🔹 55. Jak projektować dobre API?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Zasady:
- Minimalna powierzchnia publiczna.
- Brak null (Optional lub wyjątek).
- Immutable gdy możliwe.
- Spójne nazewnictwo.
- Jasne kontrakty (JavaDoc).
- Nie ujawniać implementacji.

Dobre API jest łatwe do użycia i trudne do użycia błędnie.
