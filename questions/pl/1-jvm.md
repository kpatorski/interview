# 📘 JAVA (Core / JVM)

## 1️⃣ JVM i Model Pamięci

---

## 🔹 1. Czym jest JVM i z jakich głównych obszarów pamięci się składa?

### ✅ Odpowiedź

JVM (Java Virtual Machine) to środowisko uruchomieniowe, które:
- wykonuje bytecode (.class),
- zarządza pamięcią,
- zarządza wątkami,
- zapewnia izolację i bezpieczeństwo.

### Główne obszary pamięci:

#### 1️⃣ Heap
- Współdzielony między wątkami.
- Przechowuje obiekty i ich pola.
- Zarządzany przez Garbage Collector.
- Podzielony na:
  - Young Generation (Eden + Survivor)
  - Old Generation

#### 2️⃣ Stack (dla każdego wątku osobny)
- Przechowuje:
  - zmienne lokalne,
  - referencje do obiektów,
  - ramki metod (stack frames).
- Zarządzany automatycznie (LIFO).
- Nie podlega GC.

#### 3️⃣ Metaspace
- Przechowuje metadane klas.
- Zastąpił PermGen od Java 8.
- Alokowany w pamięci natywnej (poza heapem).

#### 4️⃣ PC Register
- Wskaźnik aktualnie wykonywanej instrukcji dla wątku.

#### 5️⃣ Native Method Stack
- Dla metod natywnych (JNI).

---

## 🔹 2. Czym jest Java Memory Model (JMM)?

### ✅ Odpowiedź

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

## 🔹 3. Co to jest reordering i dlaczego jest problemem?

### ✅ Odpowiedź

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

## 🔹 4. Czym jest relacja happens-before?

### ✅ Odpowiedź

Happens-before to gwarancja JMM mówiąca:

> Jeśli operacja A happens-before operacji B, to wszystkie zmiany pamięci wykonane przez A są widoczne dla B.

Przykłady:

- Zakończenie metody synchronized happens-before wejście do synchronized na tym samym monitorze.
- Zapis do zmiennej volatile happens-before jej odczyt.
- Wywołanie start() happens-before kod w nowym wątku.
- Zakończenie wątku happens-before join().

---

## 🔹 5. Czym różni się visibility od atomicity?

### ✅ Visibility (widoczność)

Czy zmiana dokonana przez jeden wątek jest widoczna dla innego.

Zapewniają:
- volatile
- synchronized
- locki

### ✅ Atomicity (niepodzielność)

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

## 🔹 6. Czym jest Escape Analysis?

### ✅ Odpowiedź

Escape Analysis to optymalizacja JIT.

Sprawdza, czy obiekt nie "ucieka" poza metodę (nie jest zwracany ani przekazywany dalej).

Jeśli nie ucieka:
- może zostać zaalokowany na stosie zamiast na heapie,
- może zostać wyeliminowany (scalar replacement),
- może zostać usunięta synchronizacja (lock elision).

---

## 🔹 7. Jak działa ClassLoader?

### ✅ Odpowiedź

ClassLoader:
- ładuje klasy do JVM,
- zamienia bytecode na obiekt klasy.

Hierarchia:
1. Bootstrap ClassLoader
2. Platform ClassLoader
3. Application ClassLoader

Działa w modelu parent-first — najpierw pyta rodzica, jeśli rodzic nie znajdzie klasy, ładuje ją sam.

---

## 🔹 8. Czym jest JIT?

### ✅ Odpowiedź

JIT (Just-In-Time compiler):
- kompiluje bytecode do natywnego kodu maszynowego podczas działania programu,
- optymalizuje "gorące" fragmenty kodu (hot spots).

Optymalizacje obejmują:
- inlining,
- loop unrolling,
- escape analysis,
- dead code elimination.

---

## 🔹 9. Jak działa Garbage Collector w skrócie?

### ✅ Odpowiedź

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

# 2️⃣ Współbieżność (Concurrency)

## 🔹 1. Jak działa `synchronized` w JVM?

### ✅ Odpowiedź

`synchronized` używa monitora (monitor lock) przypisanego do obiektu.

Każdy obiekt w Javie posiada nagłówek (object header), który zawiera informacje o stanie blokady.

### Co dzieje się przy wejściu do bloku synchronized?

1. Wątek próbuje przejąć monitor.
2. Jeśli monitor jest wolny — zostaje właścicielem.
3. Jeśli zajęty — wątek przechodzi w stan BLOCKED.
4. Po wyjściu z bloku monitor jest zwalniany.

### Gwarancje:
- Mutual exclusion (tylko jeden wątek naraz).
- Visibility (flush do pamięci głównej przy wyjściu).
- Relacja happens-before między unlock → lock.

---

## 🔹 2. Czym jest `volatile` i co dokładnie gwarantuje?

### ✅ Odpowiedź

`volatile` zapewnia:

1️⃣ Visibility — zapis trafia bezpośrednio do pamięci głównej, a odczyt zawsze pobiera aktualną wartość.

2️⃣ Zakaz reordering wokół zmiennej volatile.

Nie zapewnia atomicity dla operacji złożonych (np. i++).

JVM generuje instrukcje z barierami pamięci (memory barriers), które wymuszają synchronizację cache CPU.

---

## 🔹 3. Dlaczego `i++` nie jest bezpieczne wielowątkowo?

### ✅ Odpowiedź

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

## 🔹 4. Czym jest CAS (Compare-And-Swap)?

### ✅ Odpowiedź

CAS to atomowa instrukcja procesora wykonująca operację:

Jeśli currentValue == expectedValue → ustaw newValue.
W przeciwnym razie operacja się nie powiedzie.

Operacja jest niepodzielna na poziomie CPU.

W Javie używana przez:
- AtomicInteger
- ConcurrentHashMap
- Struktury lock-free

---

## 🔹 5. Jak działają klasy Atomic*?

### ✅ Odpowiedź

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

## 🔹 6. Czym różni się ReentrantLock od synchronized?

### ✅ Odpowiedź

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

## 🔹 7. Czym jest deadlock?

### ✅ Odpowiedź

Deadlock to sytuacja, gdy dwa lub więcej wątków czekają na zasoby trzymane przez siebie nawzajem.

Warunki deadlocka:
1. Mutual exclusion
2. Hold and wait
3. No preemption
4. Circular wait

---

## 🔹 8. Czym jest livelock?

### ✅ Odpowiedź

Wątki nie są zablokowane, ale stale reagują na siebie i nie wykonują postępu.

---

## 🔹 9. Czym jest starvation?

### ✅ Odpowiedź

Wątek nigdy nie otrzymuje zasobu, ponieważ inne wątki są preferowane.

---

## 🔹 10. Czym jest False Sharing?

### ✅ Odpowiedź

False sharing występuje, gdy dwie zmienne modyfikowane przez różne wątki znajdują się w tej samej cache line CPU.

Powoduje to częstą synchronizację cache między rdzeniami i spadek wydajności.

Rozwiązania:
- padding
- adnotacja @Contended (z odpowiednią flagą JVM)


---

## 🔹 11. Jaki jest cykl życia wątku w Javie?

### ✅ Odpowiedź

Stany wątku (Thread.State):

1. NEW — wątek utworzony, ale nieuruchomiony.
2. RUNNABLE — gotowy do wykonania lub wykonywany przez CPU.
3. BLOCKED — oczekuje na monitor (np. wejście do synchronized).
4. WAITING — czeka bez limitu czasu (np. wait(), join()).
5. TIMED_WAITING — czeka przez określony czas (sleep(), wait(timeout)).
6. TERMINATED — zakończył wykonanie.

Metoda start() powoduje przejście z NEW do RUNNABLE.

---

## 🔹 12. Dlaczego nie powinniśmy tworzyć wątków ręcznie (new Thread)?

### ✅ Odpowiedź

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

## 🔹 13. Czym jest ExecutorService?

### ✅ Odpowiedź

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

## 🔹 14. Jak działa ThreadPoolExecutor?

### ✅ Odpowiedź

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

## 🔹 15. Jakie są typowe implementacje ExecutorService?

### ✅ Odpowiedź

- newFixedThreadPool(n) — stała liczba wątków.
- newCachedThreadPool() — dynamiczna liczba wątków, brak ograniczenia (może być niebezpieczne).
- newSingleThreadExecutor() — jeden wątek.
- newScheduledThreadPool(n) — zadania cykliczne/opóźnione.

W środowisku produkcyjnym zaleca się jawne konfigurowanie ThreadPoolExecutor.


---

## 🔹 16. Czym jest ForkJoinPool i do czego służy?

### ✅ Odpowiedź

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

## 🔹 17. Czym jest work-stealing?

### ✅ Odpowiedź

Work-stealing to strategia równoważenia obciążenia:

- Wątek wykonuje zadania ze swojej kolejki (LIFO — dla lepszej lokalności cache).
- Jeśli nie ma zadań — kradnie z innego wątku (FIFO — z końca kolejki).

Zmniejsza contention na wspólnej kolejce i poprawia skalowalność.

---

## 🔹 18. Czym jest CompletableFuture?

### ✅ Odpowiedź

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

## 🔹 19. Czym różni się thenApply od thenCompose?

### ✅ Odpowiedź

thenApply:
- Przekształca wynik synchronizacyjnie.
- Jeśli zwraca CompletableFuture — powstaje zagnieżdżenie (CompletableFuture<CompletableFuture<T>>).

thenCompose:
- Służy do spłaszczania zagnieżdżonych future.
- Analogiczny do flatMap w Stream API.

---

## 🔹 20. Co oznacza blocking vs non-blocking?

### ✅ Odpowiedź

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

## 🔹 21. Czym jest backpressure?

### ✅ Odpowiedź

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

# 3️⃣ Kolekcje i Struktury Danych

## 🔹 22. Jak działa HashMap krok po kroku?

### ✅ Odpowiedź

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

## 🔹 23. Dlaczego equals() i hashCode() muszą być spójne?

### ✅ Odpowiedź

Kontrakt:

1. Jeśli a.equals(b) == true → a.hashCode() == b.hashCode().
2. Jeśli hashCode różne → obiekty na pewno różne.

Jeśli złamiemy kontrakt:
- HashMap może nie znaleźć klucza,
- dane mogą zostać "zgubione".

Typowy błąd: nadpisanie equals bez hashCode.

---

## 🔹 24. Czym jest loadFactor i dlaczego ma znaczenie?

### ✅ Odpowiedź

loadFactor określa, przy jakim zapełnieniu nastąpi resize.

Domyślnie: 0.75.

- Niższy loadFactor → mniej kolizji, większe zużycie pamięci.
- Wyższy loadFactor → więcej kolizji, mniejsza pamięć.

---

## 🔹 25. Czym jest Red-Black Tree?

### ✅ Odpowiedź

Red-Black Tree to samobalansujące drzewo binarne.

Właściwości:
1. Każdy węzeł jest czerwony lub czarny.
2. Korzeń jest czarny.
3. Czerwony węzeł nie może mieć czerwonego dziecka.
4. Każda ścieżka do liścia ma tę samą liczbę czarnych węzłów.

Zapewnia operacje w czasie O(log n).

---

## 🔹 26. Czym różni się HashMap od ConcurrentHashMap?

### ✅ Odpowiedź

HashMap:
- Nie jest thread-safe.
- Może wejść w nieskończoną pętlę przy równoległym resize (Java < 8).

ConcurrentHashMap:
- Thread-safe bez globalnego locka.
- Używa CAS i synchronizacji na poziomie bucket.
- Brak segmentów od Java 8 (wcześniej segment-based locking).

Operacje odczytu są w większości bezblokujące.

---

## 🔹 27. Co to jest segment-based locking?

### ✅ Odpowiedź

W starszych wersjach ConcurrentHashMap (Java 7):
- Mapa była podzielona na segmenty.
- Każdy segment miał własny lock.
- Zmniejszało to contention względem jednego globalnego locka.

Od Java 8 zastąpione synchronizacją na bucket.

---

## 🔹 28. Czym jest CopyOnWriteArrayList?

### ✅ Odpowiedź

CopyOnWriteArrayList:
- Przy każdej modyfikacji tworzy nową kopię tablicy.
- Odczyty są bezblokujące.

Dobre dla:
- wielu odczytów,
- rzadkich zapisów.

Kosztowne przy częstych modyfikacjach.

---

## 🔹 29. Jakie są złożoności czasowe (Big-O) podstawowych kolekcji?

### ✅ Odpowiedź

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

# 4️⃣ Stream API

## 🔹 30. Czym jest lazy evaluation w Stream API?

### ✅ Odpowiedź

Lazy evaluation oznacza, że operacje pośrednie (intermediate operations) nie są wykonywane od razu.

Są wykonywane dopiero, gdy pojawi się operacja terminalna (np. collect, forEach, reduce).

Pozwala to na:
- optymalizację przetwarzania,
- przetwarzanie elementów "na żądanie",
- łączenie operacji w jeden pipeline.

---

## 🔹 31. Czym różnią się operacje stateless i stateful?

### ✅ Odpowiedź

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

## 🔹 32. Czym różni się map od flatMap?

### ✅ Odpowiedź

map:
- Przekształca element na inny element.
- 1 → 1

flatMap:
- Przekształca element na strumień elementów.
- 1 → N
- Spłaszcza wynik.

flatMap jest odpowiednikiem flatMap z programowania funkcyjnego.

---

## 🔹 33. Dlaczego funkcja w reduce musi być asocjacyjna?

### ✅ Odpowiedź

Operacja asocjacyjna spełnia warunek:

(a op b) op c = a op (b op c)

W parallel stream:
- Dane są dzielone na części.
- Wyniki częściowe są łączone w dowolnej kolejności.

Jeśli operacja nie jest asocjacyjna — wynik może być niepoprawny.

---

## 🔹 34. Czym jest Spliterator?

### ✅ Odpowiedź

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

## 🔹 35. Dlaczego parallel stream może być niebezpieczny?

### ✅ Odpowiedź

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

## 🔹 36. Dlaczego efekty uboczne (side effects) łamią parallel stream?

### ✅ Odpowiedź

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

## 🔹 37. Czym różni się forEach od forEachOrdered?

### ✅ Odpowiedź

forEach:
- Nie gwarantuje kolejności w parallel stream.
- Szybszy.

forEachOrdered:
- Zachowuje kolejność źródła.
- Może ograniczać równoległość.

W sequential stream działają identycznie.


---

# 5️⃣ Typy, OOP i Generics

## 🔹 38. Czym jest type erasure w Generics?

### ✅ Odpowiedź

Type erasure oznacza, że informacje o typach generycznych są usuwane w czasie kompilacji.

Przykład:
List<String> i List<Integer> w runtime są widziane jako List.

Konsekwencje:
- Brak informacji o typie w runtime.
- Nie można tworzyć new T().
- Nie można tworzyć tablic generycznych (new T[]).

Kompilator dodaje casty w bytecode, aby zachować bezpieczeństwo typów.

---

## 🔹 39. Czym jest covariance i contravariance?

### ✅ Odpowiedź

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

## 🔹 40. Dlaczego immutable objects są bezpieczne wielowątkowo?

### ✅ Odpowiedź

Obiekt immutable:
- Nie zmienia stanu po konstrukcji.
- Wszystkie pola final.
- Brak setterów.

Gwarancje:
- Brak race condition.
- Bezpieczne publikowanie (safe publication), jeśli pola są final.

Immutable upraszcza concurrency.

---

## 🔹 41. Czym różni się equals od ==?

### ✅ Odpowiedź

== porównuje referencje (czy to ten sam obiekt).

equals porównuje logiczną równość (zawartość).

Dla klas własnych należy nadpisać equals i hashCode.

---

## 🔹 42. Czym jest record w Javie?

### ✅ Odpowiedź

record to skrócona forma klasy immutable.

Automatycznie generuje:
- konstruktor,
- equals,
- hashCode,
- toString,
- gettery.

Record jest final i przeznaczony do przechowywania danych.

---

## 🔹 43. Czym są sealed classes?

### ✅ Odpowiedź

Sealed class ogranicza, które klasy mogą ją rozszerzać.

Przykład:
sealed class Shape permits Circle, Square {}

Pozwala:
- kontrolować hierarchię dziedziczenia,
- ułatwiać exhaustive switch.

---

## 🔹 44. Kiedy Optional jest dobrym pomysłem, a kiedy złym?

### ✅ Odpowiedź

Dobry:
- jako typ zwracany z metody.
- aby uniknąć null.

Zły:
- jako pole w encji.
- jako parametr metody.
- w serializacji.

Optional nie jest zamiennikiem każdego null.

---

## 🔹 45. Czym są value-based classes?

### ✅ Odpowiedź

Value-based class:
- Reprezentuje wartość, nie tożsamość.
- Nie należy polegać na referencyjnej równości (==).

Przykład: Integer, Optional.

W przyszłości Project Valhalla wprowadzi value types bez narzutu obiektowego.



---

# 6️⃣ IO / NIO

## 🔹 46. Czym różni się IO od NIO?

### ✅ Odpowiedź

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

## 🔹 47. Czym jest Channel?

### ✅ Odpowiedź

Channel to dwukierunkowe połączenie do źródła danych.

Przykłady:
- FileChannel
- SocketChannel
- ServerSocketChannel

Współpracuje z Buffer.

---

## 🔹 48. Czym jest Buffer?

### ✅ Odpowiedź

Buffer to kontener na dane z polami:
- capacity — maksymalny rozmiar,
- position — aktualna pozycja,
- limit — granica odczytu/zapisu.

Tryb zapisu → flip() → tryb odczytu.

---

## 🔹 49. Czym jest Selector?

### ✅ Odpowiedź

Selector pozwala jednemu wątkowi monitorować wiele kanałów.

Działa poprzez:
- rejestrowanie kanałów,
- sprawdzanie gotowości do operacji (read, write, accept).

Umożliwia model event-driven.

---

## 🔹 50. Czym jest memory-mapped file?

### ✅ Odpowiedź

Memory-mapped file (MappedByteBuffer):
- Mapuje plik bezpośrednio do pamięci.
- OS zarządza synchronizacją z dyskiem.

Zalety:
- Szybki dostęp do dużych plików.
- Brak kopiowania danych między buforami.

Wady:
- Trudniejsze zarządzanie pamięcią.

---

# 7️⃣ Wyjątki i API Design

## 🔹 51. Czym różnią się checked i unchecked exceptions?

### ✅ Odpowiedź

Checked:
- Muszą być zadeklarowane lub obsłużone.
- Reprezentują sytuacje, które można przewidzieć.

Unchecked (RuntimeException):
- Nie wymagają deklaracji.
- Reprezentują błędy programistyczne.

W nowoczesnym kodzie preferuje się unchecked.

---

## 🔹 52. Czym jest exception wrapping?

### ✅ Odpowiedź

Exception wrapping polega na opakowaniu niższego wyjątku w wyższy:

throw new CustomException("msg", cause);

Pozwala:
- zachować stack trace,
- oddzielić warstwy aplikacji.

---

## 🔹 53. Czym są suppressed exceptions?

### ✅ Odpowiedź

Powstają przy try-with-resources.

Jeśli:
- wyjątek wystąpi w bloku try,
- oraz podczas zamykania zasobu,

Wyjątek z close() jest suppressed i dostępny przez getSuppressed().

---

## 🔹 54. Czym jest defensive copying?

### ✅ Odpowiedź

Defensive copying polega na tworzeniu kopii mutowalnych obiektów przekazywanych do klasy.

Chroni przed:
- niekontrolowaną modyfikacją stanu.

Stosowane w klasach immutable.

---

## 🔹 55. Jak projektować dobre API?

### ✅ Odpowiedź

Zasady:
- Minimalna powierzchnia publiczna.
- Brak null (Optional lub wyjątek).
- Immutable gdy możliwe.
- Spójne nazewnictwo.
- Jasne kontrakty (JavaDoc).
- Nie ujawniać implementacji.

Dobre API jest łatwe do użycia i trudne do użycia błędnie.
