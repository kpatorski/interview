# 🧪 TESTOWANIE

---

# 1️⃣ Fundamenty Testowania

## 🔹 1. Czym różni się test jednostkowy od integracyjnego?

### ✅ Odpowiedź

Test jednostkowy (unit test):
- Testuje pojedynczą klasę lub metodę.
- Izoluje zależności (mocki, stuby).
- Szybki i deterministyczny.

Test integracyjny:
- Testuje współpracę komponentów.
- Może używać prawdziwej bazy, brokera, kontekstu Spring.
- Wolniejszy, ale bliższy rzeczywistości.

---

## 🔹 2. Czym jest test end-to-end (E2E)?

### ✅ Odpowiedź

Test E2E testuje cały system jako całość.

- Obejmuje warstwę HTTP, bazę danych, integracje.
- Symuluje zachowanie użytkownika.
- Najbardziej realistyczny, ale najwolniejszy i najbardziej kruchy.

---

# 2️⃣ Mockowanie i Izolacja

## 🔹 3. Czym jest mock, stub i spy?

### ✅ Odpowiedź

Mock:
- Obiekt symulujący zachowanie zależności.
- Pozwala weryfikować interakcje.

Stub:
- Zwraca z góry ustalone dane.
- Nie weryfikuje interakcji.

Spy:
- Częściowo prawdziwy obiekt.
- Pozwala nadpisać wybrane metody.

---

## 🔹 4. Kiedy mockowanie jest złym pomysłem?

### ✅ Odpowiedź

- Gdy test staje się testem implementacji zamiast zachowania.
- Gdy mockujemy zbyt wiele zależności.
- Gdy test jest kruchy przy refaktorze.

Preferować testowanie zachowania, nie implementacji.

---

# 3️⃣ Testy Integracyjne i Środowisko

## 🔹 5. Czym jest Testcontainers i dlaczego jest użyteczny?

### ✅ Odpowiedź

Testcontainers pozwala uruchomić prawdziwe zależności (DB, Kafka) w Dockerze podczas testów.

Zalety:
- Realne środowisko.
- Brak zależności od lokalnej konfiguracji.
- Reproducibility.

---

## 🔹 6. Czym jest Contract Testing?

### ✅ Odpowiedź

Contract Testing weryfikuje zgodność między serwisami.

- Consumer definiuje kontrakt.
- Provider musi go spełniać.

Zapobiega breaking changes w mikroserwisach.

---

# 4️⃣ Zaawansowane Techniki

## 🔹 7. Czym jest TDD?

### ✅ Odpowiedź

TDD (Test-Driven Development):

1. Napisz test.
2. Napisz minimalny kod, by test przeszedł.
3. Refaktor.

Cel:
- Lepszy design.
- Większa pewność zmian.

---

## 🔹 8. Czym jest property-based testing?

### ✅ Odpowiedź

Property-based testing polega na testowaniu ogólnych właściwości funkcji zamiast konkretnych przypadków.

Przykład:
- Funkcja sortująca powinna zwracać listę uporządkowaną rosnąco.

Generowane są losowe dane wejściowe.

---

## 🔹 9. Czym jest mutation testing?

### ✅ Odpowiedź

Mutation testing sprawdza jakość testów poprzez wprowadzanie małych zmian w kodzie (mutacje).

Jeśli testy nie wykryją zmiany — są niewystarczające.

Pozwala ocenić skuteczność testów, nie tylko ich pokrycie.

