# 📈 WYDAJNOŚĆ I DIAGNOSTYKA

---

# 1️⃣ Zrozumienie Wydajności

## 🔹 1. Czym różni się latency od throughput?

### ✅ Odpowiedź

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

## 🔹 2. Czym jest bottleneck i jak go znaleźć?

### ✅ Odpowiedź

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

# 2️⃣ JVM Profilowanie

## 🔹 3. Czym jest heap dump i kiedy go używać?

### ✅ Odpowiedź

Heap dump to zrzut pamięci heap w danym momencie.

Używany do:
- analizy wycieków pamięci,
- identyfikacji dużych obiektów,
- analizy referencji.

Narzędzia:
- VisualVM
- Eclipse MAT

---

## 🔹 4. Czym jest thread dump?

### ✅ Odpowiedź

Thread dump pokazuje stan wszystkich wątków.

Używany do:
- analizy deadlock,
- blokad,
- wysokiego zużycia CPU.

Zawiera stack trace każdego wątku.

---

## 🔹 5. Jak działa Garbage Collection i kiedy może być problemem?

### ✅ Odpowiedź

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

# 3️⃣ Analiza Algorytmiczna

## 🔹 6. Dlaczego Big-O jest ważne w systemach backendowych?

### ✅ Odpowiedź

Big-O opisuje złożoność algorytmu względem rozmiaru danych.

Przykład:
- O(1) — stały czas,
- O(log n) — logarytmiczny,
- O(n) — liniowy,
- O(n²) — kwadratowy.

Przy dużej skali różnice stają się krytyczne.

---

# 4️⃣ Load Testing

## 🔹 7. Czym jest load testing i czym różni się od stress testing?

### ✅ Odpowiedź

Load testing:
- Test przy oczekiwanym obciążeniu.
- Sprawdza czy system spełnia SLA.

Stress testing:
- Test powyżej zakładanego obciążenia.
- Sprawdza jak system zachowuje się przy przeciążeniu.

Celem jest poznanie granic systemu i jego zachowania w awarii.

