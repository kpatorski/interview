[💡 Questions](questions.md)

# 🏗 ARCHITEKTURA APLIKACJI

<!-- TOC -->
* [🏗 ARCHITEKTURA APLIKACJI](#-architektura-aplikacji)
  * [1️⃣ Fundamenty Architektoniczne](#1-fundamenty-architektoniczne)
      * [🔹 1. Czym jest Separation of Concerns?](#-1-czym-jest-separation-of-concerns)
      * [🔹 2. Czym jest Dependency Inversion Principle?](#-2-czym-jest-dependency-inversion-principle)
  * [2️⃣ Clean / Hexagonal / Onion](#2-clean--hexagonal--onion)
      * [🔹 3. Czym jest Clean Architecture?](#-3-czym-jest-clean-architecture)
      * [🔹 4. Czym jest Hexagonal Architecture?](#-4-czym-jest-hexagonal-architecture)
      * [🔹 5. Czym jest Onion Architecture?](#-5-czym-jest-onion-architecture)
  * [3️⃣ Domain-Driven Design (DDD)](#3-domain-driven-design-ddd)
      * [🔹 6. Czym jest Bounded Context?](#-6-czym-jest-bounded-context)
      * [🔹 7. Czym jest Aggregate?](#-7-czym-jest-aggregate)
      * [🔹 8. Czym jest CQRS?](#-8-czym-jest-cqrs)
      * [🔹 9. Czym jest Event Sourcing?](#-9-czym-jest-event-sourcing)
  * [4️⃣ Modularność i Skalowanie](#4-modularność-i-skalowanie)
      * [🔹 10. Czym jest Modular Monolith?](#-10-czym-jest-modular-monolith)
      * [🔹 11. Jak podejmować decyzje architektoniczne?](#-11-jak-podejmować-decyzje-architektoniczne)
<!-- TOC -->

---

## 1️⃣ Fundamenty Architektoniczne

#### 🔹 1. 🧑‍💻 ⭐⭐⭐ Czym jest Separation of Concerns?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Separation of Concerns (SoC) oznacza rozdzielenie systemu na części odpowiedzialne za różne aspekty.

Przykłady warstw:
- Warstwa prezentacji
- Warstwa aplikacyjna
- Warstwa domenowa
- Warstwa infrastruktury

Celem jest:
- mniejsza złożoność,
- większa testowalność,
- łatwiejsza wymiana technologii.

---

#### 🔹 2. 🧑‍💻 ⭐⭐⭐ Czym jest Dependency Inversion Principle?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Dependency Inversion Principle (DIP):

- Moduły wysokiego poziomu nie powinny zależeć od modułów niskiego poziomu.
- Oba powinny zależeć od abstrakcji.

Przykład:
- Serwis biznesowy zależy od interfejsu Repozytorium.
- Implementacja repozytorium zależy od bazy danych.

Zmniejsza sprzężenie i ułatwia testowanie.

---

## 2️⃣ Clean / Hexagonal / Onion

#### 🔹 3. 🧑‍💻 ⭐⭐ Czym jest Clean Architecture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Clean Architecture dzieli system na warstwy koncentryczne:

- Entities (logika biznesowa)
- Use Cases
- Interface Adapters
- Frameworks & Drivers

Zasada:
- Zależności skierowane do środka.
- Rdzeń domeny nie zna frameworków.

---

#### 🔹 4. 🧑‍💻 ⭐⭐ Czym jest Hexagonal Architecture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Hexagonal (Ports & Adapters):

- Domena w centrum.
- Porty (interfejsy) definiują komunikację.
- Adaptery implementują porty.

Pozwala oddzielić:
- logikę biznesową,
- technologię (DB, HTTP, messaging).

---

#### 🔹 5. 🧙‍♂️ ⭐ Czym jest Onion Architecture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Onion Architecture:
- Warstwy koncentryczne.
- Rdzeń domenowy w środku.
- Zależności skierowane do środka.

Podobna do Clean i Hexagonal — różni się nazewnictwem i akcentem.

---

## 3️⃣ Domain-Driven Design (DDD)

#### 🔹 6. 🧙‍♂️ ⭐⭐ Czym jest Bounded Context?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Bounded Context to granica modelu domenowego.

W obrębie kontekstu:
- Model ma jednoznaczne znaczenie.

Między kontekstami:
- Możliwe różne definicje tego samego pojęcia.

Ułatwia modularność i skalowanie organizacyjne.

---

#### 🔹 7. 🧙‍♂️ ⭐⭐ Czym jest Aggregate?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Aggregate to klaster encji traktowany jako jedna jednostka spójności.

Cechy:
- Ma Aggregate Root.
- Tylko Root jest dostępny z zewnątrz.
- Spójność utrzymywana w obrębie agregatu.

Transakcje powinny obejmować jeden agregat.

---

#### 🔹 8. 🧙‍♂️ ⭐⭐⭐ Czym jest CQRS?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

CQRS (Command Query Responsibility Segregation):

- Oddziela operacje zapisu (Command) od odczytu (Query).

Zalety:
- Możliwość optymalizacji odczytu i zapisu niezależnie.
- Lepsza skalowalność.

Wady:
- Większa złożoność.

---

#### 🔹 9. 🧙‍♂️ ⭐⭐ Czym jest Event Sourcing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Event Sourcing:
- Stan systemu przechowywany jako sekwencja zdarzeń.
- Aktualny stan rekonstruowany przez odtworzenie zdarzeń.

Zalety:
- Pełna historia.
- Audytowalność.

Wyzwania:
- Migracje eventów.
- Złożoność.

---

## 4️⃣ Modularność i Skalowanie

#### 🔹 10. 🧑‍💻 ⭐⭐ Czym jest Modular Monolith?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Modular Monolith:
- Jedna aplikacja.
- Silna modularność wewnętrzna.
- Wyraźne granice między modułami.

Zalety:
- Prostota wdrożenia.
- Brak kosztów sieciowych.

Może być etapem przed mikroserwisami.

---

#### 🔹 11. 🧙‍♂️ ⭐⭐ Jak podejmować decyzje architektoniczne?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Architektura to kompromisy.

Należy analizować:
- Skalowalność
- Złożoność
- Koszt utrzymania
- Wymagania niefunkcjonalne

Nie istnieje jedna "najlepsza" architektura — zależy od kontekstu.

---

#### 🔹 12. 🧑‍💻 ⭐⭐⭐ Czym jest Open/Closed Principle?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

OCP: klasa powinna być otwarta na rozszerzenie, zamknięta na modyfikację.

Praktycznie:
- nowe zachowanie dodajemy przez nowe implementacje interfejsów lub dziedziczenie,
- nie modyfikujemy istniejącego, przetestowanego kodu.

Narzędzia: polimorfizm, strategia, dekorator.

---

#### 🔹 13. 🧑‍💻 ⭐⭐ Czym jest Liskov Substitution Principle?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

LSP: obiekt podklasy musi dać się użyć wszędzie tam, gdzie używana jest klasa bazowa, bez zmiany poprawności programu.

Naruszenie LSP:
- podklasa wyrzuca wyjątek zamiast realizować kontrakt,
- podklasa osłabia warunki wstępne lub wzmacnia warunki końcowe.

Dobry test: czy możesz podmienić implementację bez zmiany kodu klienckiego?

---

#### 🔹 14. 🧑‍💻 ⭐⭐ Czym jest Interface Segregation Principle?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

ISP: lepiej mieć wiele małych, wyspecjalizowanych interfejsów niż jeden duży.

Problem z grubym interfejsem:
- implementacje muszą dostarczyć metody, które nie mają sensu w ich kontekście,
- zmiany w jednej metodzie wpływają na wszystkich implementatorów.

---

#### 🔹 15. 🧑‍💻 ⭐⭐ Czym różni się Value Object od Entity?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Entity:
- ma unikalną tożsamość (ID),
- równość oparta na ID,
- ma cykl życia i może się mutować.

Value Object:
- nie ma tożsamości,
- równość oparta na wartościach pól,
- niemutowalny,
- przykłady: Money, Address, Email.

VO są bezpieczne wielowątkowo i eliminują błędy związane z tożsamością.

---

#### 🔹 16. 🧙‍♂️ ⭐ Czym jest Domain Event?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Domain Event to zdarzenie opisujące coś, co wydarzyło się w domenie biznesowej.

Cechy:
- nazwa w czasie przeszłym: `OrderPlaced`, `PaymentReceived`,
- niesie dane istotne biznesowo,
- jest niemutowalny.

Zastosowania:
- dekoupling między agregatami,
- integracja między Bounded Contexts,
- podstawa Event Sourcing.

---

#### 🔹 17. 🧙‍♂️ ⭐ Czym jest Anti-Corruption Layer (ACL)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

ACL to warstwa tłumacząca model zewnętrznego systemu na wewnętrzny model domeny.

Cel:
- ochrona domeny przed „zanieczyszczeniem" pojęciami obcych systemów,
- izolacja zmiany — gdy zewnętrzny API się zmieni, zmieniamy tylko ACL.

Typowe miejsca: integracje z legacy systemami, zewnętrznymi API, innymi Bounded Contexts.

---

#### 🔹 18. 🧙‍♂️ ⭐⭐ Czym jest wzorzec Repository?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Repository to abstrakcja kolekcji agregatu, ukrywająca szczegóły persistencji.

Kontrakt domenowy:
```
interface OrderRepository {
    Order findById(OrderId id);
    void save(Order order);
}
```

Domena nie wie nic o JPA, SQL ani o bazie danych — to zadanie implementacji.
Pozwala testować logikę domenową bez bazy danych (in-memory implementation).

---

#### 🔹 19. 🧙‍♂️ ⭐ Czym różni się Application Service od Domain Service?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Domain Service:
- zawiera logikę domenową, która nie należy do żadnego agregatu,
- operuje na obiektach domenowych,
- jest bezstanowy,
- przykład: `PricingService.calculateDiscount(order, customer)`.

Application Service:
- orkiestruje przypadek użycia (use case),
- koordynuje: załaduj z repo → wykonaj logikę → zapisz → opublikuj event,
- nie zawiera logiki biznesowej — deleguje do domeny,
- zna infrastrukturę (transakcje, eventy).

---

#### 🔹 20. 🧙‍♂️ ⭐⭐ Czym jest wzorzec Strangler Fig?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Strangler Fig to strategia stopniowej migracji legacy systemu.

Proces:
1. Nowe funkcjonalności buduj w nowym systemie.
2. Stopniowo przenoś istniejące moduły.
3. Legacy system kurczy się aż zniknie.

Kluczowe: facade/proxy przed starym systemem przekierowuje ruch do nowego.

Alternatywa dla Big Bang rewrite, który prawie zawsze kończy się katastrofą.

---

#### 🔹 21. 🧙‍♂️ ⭐⭐ Czym jest Anemic Domain Model i dlaczego to anty-wzorzec?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Anemic Domain Model: klasy domenowe zawierają tylko pola i gettery/settery. Cała logika biznesowa jest w serwisach.

Problemy:
- brak enkapsulacji — każdy może naruszyć niezmienniki,
- logika rozproszona, trudna do znalezienia,
- klasy domenowe stają się Data Transfer Object.

Poprawne podejście: agregaty i encje zawierają logikę i chronią swoje niezmienniki metodami.

---

#### 🔹 22. 🧑‍💻 ⭐⭐⭐ Co to jest Cohesion i Coupling?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Cohesion (spójność):
- Ile rzeczy w module naprawdę do siebie należy.
- Wysoka spójność = moduł ma jedną, wyraźną odpowiedzialność.

Coupling (sprzężenie):
- Jak mocno moduły zależą od siebie.
- Niskie sprzężenie = zmiana jednego modułu nie wymaga zmian innych.

Cel: **wysokie cohesion, niskie coupling**.

---

#### 🔹 23. 🧙‍♂️ ⭐⭐ Czym jest Architecture Decision Record (ADR)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

ADR to krótki dokument opisujący decyzję architektoniczną: kontekst, rozważane opcje, wybór i konsekwencje.

Format (Markdown):
- **Status**: Accepted / Deprecated
- **Kontekst**: dlaczego decyzja była potrzebna
- **Decyzja**: co zdecydowano
- **Konsekwencje**: co zyskujemy, co tracimy

ADR-y żyją w repo razem z kodem — pozwalają przyszłym deweloperom zrozumieć *dlaczego*, nie tylko *co*.

---

#### 🔹 24. 🧑‍💻 ⭐⭐ Czym są Feature Flags i do czego służą?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Feature Flag to przełącznik umożliwiający włączanie/wyłączanie funkcjonalności bez deploy.

Zastosowania:
- trunk-based development — merge nieukończonej funkcji za flagą,
- canary release — włącz dla % użytkowników,
- A/B testy,
- kill switch dla awarii.

Ryzyko: akumulacja starych flag tworzy dług techniczny — flagi wymagają regularnego czyszczenia.

---

#### 🔹 25. 🧙‍♂️ ⭐ Czym jest Shared Kernel?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Shared Kernel to fragment modelu domenowego współdzielony przez dwa lub więcej Bounded Contexts.

Cechy:
- zmiana wymaga zgody wszystkich właścicieli,
- minimalizować — duży Shared Kernel to ukryta zależność,
- alternatywa: ACL lub własne kopie danych z mapowaniem.

Shared Kernel jest uzasadniony tylko gdy koszt synchronizacji jest niższy niż koszt duplikacji.

