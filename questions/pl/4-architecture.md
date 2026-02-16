# 🏗 ARCHITEKTURA APLIKACJI

---

# 1️⃣ Fundamenty Architektoniczne

## 🔹 1. Czym jest Separation of Concerns?

### ✅ Odpowiedź

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

## 🔹 2. Czym jest Dependency Inversion Principle?

### ✅ Odpowiedź

Dependency Inversion Principle (DIP):

- Moduły wysokiego poziomu nie powinny zależeć od modułów niskiego poziomu.
- Oba powinny zależeć od abstrakcji.

Przykład:
- Serwis biznesowy zależy od interfejsu Repozytorium.
- Implementacja repozytorium zależy od bazy danych.

Zmniejsza sprzężenie i ułatwia testowanie.

---

# 2️⃣ Clean / Hexagonal / Onion

## 🔹 3. Czym jest Clean Architecture?

### ✅ Odpowiedź

Clean Architecture dzieli system na warstwy koncentryczne:

- Entities (logika biznesowa)
- Use Cases
- Interface Adapters
- Frameworks & Drivers

Zasada:
- Zależności skierowane do środka.
- Rdzeń domeny nie zna frameworków.

---

## 🔹 4. Czym jest Hexagonal Architecture?

### ✅ Odpowiedź

Hexagonal (Ports & Adapters):

- Domena w centrum.
- Porty (interfejsy) definiują komunikację.
- Adaptery implementują porty.

Pozwala oddzielić:
- logikę biznesową,
- technologię (DB, HTTP, messaging).

---

## 🔹 5. Czym jest Onion Architecture?

### ✅ Odpowiedź

Onion Architecture:
- Warstwy koncentryczne.
- Rdzeń domenowy w środku.
- Zależności skierowane do środka.

Podobna do Clean i Hexagonal — różni się nazewnictwem i akcentem.

---

# 3️⃣ Domain-Driven Design (DDD)

## 🔹 6. Czym jest Bounded Context?

### ✅ Odpowiedź

Bounded Context to granica modelu domenowego.

W obrębie kontekstu:
- Model ma jednoznaczne znaczenie.

Między kontekstami:
- Możliwe różne definicje tego samego pojęcia.

Ułatwia modularność i skalowanie organizacyjne.

---

## 🔹 7. Czym jest Aggregate?

### ✅ Odpowiedź

Aggregate to klaster encji traktowany jako jedna jednostka spójności.

Cechy:
- Ma Aggregate Root.
- Tylko Root jest dostępny z zewnątrz.
- Spójność utrzymywana w obrębie agregatu.

Transakcje powinny obejmować jeden agregat.

---

## 🔹 8. Czym jest CQRS?

### ✅ Odpowiedź

CQRS (Command Query Responsibility Segregation):

- Oddziela operacje zapisu (Command) od odczytu (Query).

Zalety:
- Możliwość optymalizacji odczytu i zapisu niezależnie.
- Lepsza skalowalność.

Wady:
- Większa złożoność.

---

## 🔹 9. Czym jest Event Sourcing?

### ✅ Odpowiedź

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

# 4️⃣ Modularność i Skalowanie

## 🔹 10. Czym jest Modular Monolith?

### ✅ Odpowiedź

Modular Monolith:
- Jedna aplikacja.
- Silna modularność wewnętrzna.
- Wyraźne granice między modułami.

Zalety:
- Prostota wdrożenia.
- Brak kosztów sieciowych.

Może być etapem przed mikroserwisami.

---

## 🔹 11. Jak podejmować decyzje architektoniczne?

### ✅ Odpowiedź

Architektura to kompromisy.

Należy analizować:
- Skalowalność
- Złożoność
- Koszt utrzymania
- Wymagania niefunkcjonalne

Nie istnieje jedna "najlepsza" architektura — zależy od kontekstu.

