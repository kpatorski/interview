# 🗄 BAZY DANYCH I PERSISTENCJA

---

# 1️⃣ Podstawy Teorii Transakcji

## 🔹 1. Czym jest ACID?

### ✅ Odpowiedź

ACID to cztery właściwości transakcji:

Atomicity (Atomowość)
- Transakcja wykonuje się w całości albo wcale.
- W przypadku błędu następuje rollback.

Consistency (Spójność)
- Po zakończeniu transakcji dane spełniają wszystkie ograniczenia (constraints, reguły biznesowe).

Isolation (Izolacja)
- Równoległe transakcje nie powinny wpływać na siebie w sposób łamiący spójność.

Durability (Trwałość)
- Po commit dane są zapisane trwale (np. w WAL — Write-Ahead Log).

---

## 🔹 2. Czym są poziomy izolacji i jakie anomalie eliminują?

### ✅ Odpowiedź

READ_UNCOMMITTED
- Pozwala na dirty reads (odczyt niezatwierdzonych danych).

READ_COMMITTED
- Brak dirty reads.
- Możliwe non-repeatable reads.

REPEATABLE_READ
- Brak dirty reads.
- Brak non-repeatable reads.
- Możliwe phantom reads.

SERIALIZABLE
- Najwyższa izolacja.
- Eliminuje wszystkie powyższe anomalie.
- Najmniej wydajny.

Anomalie:
- Dirty read — odczyt danych, które mogą zostać wycofane.
- Non-repeatable read — ten sam rekord zwraca różne wartości.
- Phantom read — nowe rekordy pojawiają się w zakresie zapytania.

---

## 🔹 3. Czym jest optimistic locking?

### ✅ Odpowiedź

Optimistic locking zakłada, że konflikt jest rzadki.

Mechanizm:
- Wiersz posiada pole version.
- Przy update sprawdzana jest wersja.
- Jeśli zmieniła się — wyjątek (OptimisticLockException).

Brak blokad na poziomie bazy.

---

## 🔹 4. Czym jest pessimistic locking?

### ✅ Odpowiedź

Pessimistic locking zakłada, że konflikt jest prawdopodobny.

Mechanizm:
- SELECT ... FOR UPDATE
- Wiersz jest blokowany.
- Inne transakcje czekają.

Większe bezpieczeństwo, mniejsza skalowalność.

---

## 🔹 5. Czym jest indeks i jak działa B-Tree?

### ✅ Odpowiedź

Indeks to struktura danych przyspieszająca wyszukiwanie.

B-Tree:
- Samobalansujące drzewo.
- Każdy węzeł zawiera wiele kluczy.
- Wyszukiwanie w czasie O(log n).

Indeks przyspiesza SELECT, ale spowalnia INSERT/UPDATE.

---

## 🔹 6. Czym jest execution plan?

### ✅ Odpowiedź

Execution plan to plan wykonania zapytania generowany przez optimizer.

Zawiera:
- sposób użycia indeksów,
- join strategy (nested loop, hash join),
- koszt operacji.

Analizowany przez EXPLAIN.

---

## 🔹 7. Czym jest connection pool?

### ✅ Odpowiedź

Connection pool zarządza pulą połączeń do bazy.

Zamiast tworzyć połączenie przy każdym zapytaniu:
- połączenia są utrzymywane i ponownie wykorzystywane.

Najpopularniejszy: HikariCP.

Parametry:
- maximumPoolSize
- connectionTimeout
- idleTimeout

Zmniejsza koszt tworzenia połączeń.


---

# 2️⃣ JPA Internals

## 🔹 8. Czym jest Persistence Context?

### ✅ Odpowiedź

Persistence Context to kontekst zarządzania encjami przez EntityManager.

Zawiera:
- zarządzane encje (managed entities),
- mechanizm śledzenia zmian,
- cache pierwszego poziomu.

Każda encja w kontekście ma tylko jedną reprezentację (identity guarantee).

---

## 🔹 9. Jakie są stany encji w JPA?

### ✅ Odpowiedź

1. Transient — nowa encja, niezarządzana.
2. Managed — zarządzana przez Persistence Context.
3. Detached — była zarządzana, ale kontekst został zamknięty.
4. Removed — oznaczona do usunięcia.

Tylko encje Managed podlegają dirty checking.

---

## 🔹 10. Czym jest 1st level cache?

### ✅ Odpowiedź

1st level cache to cache w ramach Persistence Context.

Cechy:
- Domyślnie włączony.
- Unikalna instancja encji na klucz.
- Zapobiega wielokrotnym zapytaniom do DB w jednej transakcji.

Jest powiązany z EntityManager.

---

## 🔹 11. Czym jest dirty checking?

### ✅ Odpowiedź

Dirty checking to mechanizm automatycznego wykrywania zmian w encjach.

Proces:
1. Przy załadowaniu encji tworzony jest snapshot.
2. Przy flush porównywany jest aktualny stan z snapshotem.
3. Jeśli są różnice — generowany jest UPDATE.

Działa tylko dla encji Managed.

---

## 🔹 12. Czym jest flush?

### ✅ Odpowiedź

Flush synchronizuje stan Persistence Context z bazą danych.

Nie oznacza commit.

Może nastąpić:
- automatycznie przed zapytaniem JPQL,
- przy commit,
- ręcznie (entityManager.flush()).

---

## 🔹 13. Czym jest N+1 problem?

### ✅ Odpowiedź

N+1 występuje gdy:
- Pobieramy listę encji (1 zapytanie),
- Dla każdej wykonywane jest osobne zapytanie (N zapytań).

Powód:
- Lazy loading relacji.

Rozwiązania:
- JOIN FETCH
- EntityGraph
- Batch fetching

---

## 🔹 14. Czym różni się FetchType.LAZY od EAGER?

### ✅ Odpowiedź

LAZY:
- Relacja ładowana przy pierwszym użyciu.
- Domyślne dla @OneToMany.

EAGER:
- Relacja ładowana od razu.
- Może powodować nadmiarowe zapytania.

EAGER często prowadzi do problemów wydajnościowych.

---

## 🔹 15. Czym jest LazyInitializationException?

### ✅ Odpowiedź

Występuje gdy:
- Próbujemy odczytać relację LAZY,
- Po zamknięciu Persistence Context.

Typowy przypadek:
- Dostęp do relacji poza transakcją.

Rozwiązania:
- DTO projection,
- JOIN FETCH,
- OpenSessionInView (niezalecane w architekturze czystej).


---

# 3️⃣ SQL vs NoSQL i Architektoniczne Aspekty Danych

## 🔹 16. Czym jest normalizacja i denormalizacja?

### ✅ Odpowiedź

Normalizacja:
- Proces organizowania danych w celu eliminacji redundancji.
- Dane podzielone na wiele tabel.
- Spójność i mniejsze ryzyko anomalii aktualizacji.

Denormalizacja:
- Celowe wprowadzanie redundancji.
- Mniej joinów.
- Lepsza wydajność odczytu kosztem spójności i większej złożoności zapisu.

Systemy OLTP → zwykle normalizacja.
Systemy analityczne / read-heavy → często denormalizacja.

---

## 🔹 17. Czym jest twierdzenie CAP?

### ✅ Odpowiedź

CAP mówi, że w systemie rozproszonym można mieć maksymalnie dwie z trzech cech:

Consistency — wszystkie węzły widzą te same dane w tym samym czasie.
Availability — każdy request otrzymuje odpowiedź.
Partition Tolerance — system działa mimo podziałów sieci.

W praktyce w systemach rozproszonych zawsze zakładamy Partition Tolerance.

Wybór jest więc między:
- CP (Consistency + Partition Tolerance)
- AP (Availability + Partition Tolerance)

---

## 🔹 18. Czym różni się SQL od NoSQL?

### ✅ Odpowiedź

SQL:
- Relacyjny model danych.
- Silna spójność.
- Transakcje ACID.
- Schemat zdefiniowany z góry.

NoSQL:
- Dokumentowe, klucz-wartość, kolumnowe, grafowe.
- Często eventual consistency.
- Elastyczny schemat.
- Łatwiejsze skalowanie poziome.

SQL lepszy dla:
- złożonych relacji,
- transakcji finansowych.

NoSQL lepszy dla:
- dużej skali,
- dynamicznych struktur danych,
- systemów event-driven.

---

## 🔹 19. Czym jest eventual consistency?

### ✅ Odpowiedź

Eventual consistency oznacza, że:
- System może chwilowo zwracać niespójne dane,
- Ale ostatecznie wszystkie repliki się zsynchronizują.

Typowe w systemach AP.

Wymaga projektowania systemu z myślą o:
- idempotency,
- retry,
- mechanizmach kompensacji.

---

## 🔹 20. Czym jest replikacja?

### ✅ Odpowiedź

Replikacja to kopiowanie danych na wiele węzłów.

Rodzaje:
- Master-Slave (Primary-Replica).
- Multi-Master.

Zalety:
- Większa dostępność.
- Skalowanie odczytu.

Wady:
- Opóźnienia synchronizacji.

---

## 🔹 21. Czym jest sharding?

### ✅ Odpowiedź

Sharding to podział danych między wiele węzłów według klucza (shard key).

Cel:
- Skalowanie zapisu.
- Skalowanie pojemności.

Wyzwania:
- Wybór shard key.
- Migracja shardów.
- Zapytania cross-shard.

---

## 🔹 22. Jak skalować bazę danych?

### ✅ Odpowiedź

Vertical scaling:
- Więcej CPU/RAM.
- Ograniczony przez sprzęt.

Horizontal scaling:
- Replikacja (read scaling).
- Sharding (write scaling).

W systemach o dużej skali często łączy się oba podejścia.

