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

#### 🔹 1. Czym jest Separation of Concerns?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

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

#### 🔹 2. Czym jest Dependency Inversion Principle?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Dependency Inversion Principle (DIP):

- Moduły wysokiego poziomu nie powinny zależeć od modułów niskiego poziomu.
- Oba powinny zależeć od abstrakcji.

Przykład:
- Serwis biznesowy zależy od interfejsu Repozytorium.
- Implementacja repozytorium zależy od bazy danych.

Zmniejsza sprzężenie i ułatwia testowanie.

---

## 2️⃣ Clean / Hexagonal / Onion

#### 🔹 3. Czym jest Clean Architecture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Clean Architecture dzieli system na warstwy koncentryczne:

- Entities (logika biznesowa)
- Use Cases
- Interface Adapters
- Frameworks & Drivers

Zasada:
- Zależności skierowane do środka.
- Rdzeń domeny nie zna frameworków.

---

#### 🔹 4. Czym jest Hexagonal Architecture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Hexagonal (Ports & Adapters):

- Domena w centrum.
- Porty (interfejsy) definiują komunikację.
- Adaptery implementują porty.

Pozwala oddzielić:
- logikę biznesową,
- technologię (DB, HTTP, messaging).

---

#### 🔹 5. Czym jest Onion Architecture?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Onion Architecture:
- Warstwy koncentryczne.
- Rdzeń domenowy w środku.
- Zależności skierowane do środka.

Podobna do Clean i Hexagonal — różni się nazewnictwem i akcentem.

---

## 3️⃣ Domain-Driven Design (DDD)

#### 🔹 6. Czym jest Bounded Context?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Bounded Context to granica modelu domenowego.

W obrębie kontekstu:
- Model ma jednoznaczne znaczenie.

Między kontekstami:
- Możliwe różne definicje tego samego pojęcia.

Ułatwia modularność i skalowanie organizacyjne.

---

#### 🔹 7. Czym jest Aggregate?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Aggregate to klaster encji traktowany jako jedna jednostka spójności.

Cechy:
- Ma Aggregate Root.
- Tylko Root jest dostępny z zewnątrz.
- Spójność utrzymywana w obrębie agregatu.

Transakcje powinny obejmować jeden agregat.

---

#### 🔹 8. Czym jest CQRS?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

CQRS (Command Query Responsibility Segregation):

- Oddziela operacje zapisu (Command) od odczytu (Query).

Zalety:
- Możliwość optymalizacji odczytu i zapisu niezależnie.
- Lepsza skalowalność.

Wady:
- Większa złożoność.

---

#### 🔹 9. Czym jest Event Sourcing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

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

#### 🔹 10. Czym jest Modular Monolith?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Modular Monolith:
- Jedna aplikacja.
- Silna modularność wewnętrzna.
- Wyraźne granice między modułami.

Zalety:
- Prostota wdrożenia.
- Brak kosztów sieciowych.

Może być etapem przed mikroserwisami.

---

#### 🔹 11. Jak podejmować decyzje architektoniczne?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Architektura to kompromisy.

Należy analizować:
- Skalowalność
- Złożoność
- Koszt utrzymania
- Wymagania niefunkcjonalne

Nie istnieje jedna "najlepsza" architektura — zależy od kontekstu.

