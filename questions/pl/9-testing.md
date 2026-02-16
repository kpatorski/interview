[💡 Questions](questions.md)

# 🧪 TESTOWANIE

<!-- TOC -->
* [🧪 TESTOWANIE](#-testowanie)
  * [1️⃣ Fundamenty Testowania](#1-fundamenty-testowania)
      * [🔹 1. Czym różni się test jednostkowy od integracyjnego?](#-1-czym-różni-się-test-jednostkowy-od-integracyjnego)
      * [🔹 2. Czym jest test end-to-end (E2E)?](#-2-czym-jest-test-end-to-end-e2e)
  * [2️⃣ Mockowanie i Izolacja](#2-mockowanie-i-izolacja)
      * [🔹 3. Czym jest mock, stub i spy?](#-3-czym-jest-mock-stub-i-spy)
      * [🔹 4. Kiedy mockowanie jest złym pomysłem?](#-4-kiedy-mockowanie-jest-złym-pomysłem)
  * [3️⃣ Testy Integracyjne i Środowisko](#3-testy-integracyjne-i-środowisko)
      * [🔹 5. Czym jest Testcontainers i dlaczego jest użyteczny?](#-5-czym-jest-testcontainers-i-dlaczego-jest-użyteczny)
      * [🔹 6. Czym jest Contract Testing?](#-6-czym-jest-contract-testing)
  * [4️⃣ Zaawansowane Techniki](#4-zaawansowane-techniki)
      * [🔹 7. Czym jest TDD?](#-7-czym-jest-tdd)
      * [🔹 8. Czym jest property-based testing?](#-8-czym-jest-property-based-testing)
      * [🔹 9. Czym jest mutation testing?](#-9-czym-jest-mutation-testing)
<!-- TOC -->

---

## 1️⃣ Fundamenty Testowania

#### 🔹 1. Czym różni się test jednostkowy od integracyjnego?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Test jednostkowy (unit test):
- Testuje pojedynczą klasę lub metodę.
- Izoluje zależności (mocki, stuby).
- Szybki i deterministyczny.

Test integracyjny:
- Testuje współpracę komponentów.
- Może używać prawdziwej bazy, brokera, kontekstu Spring.
- Wolniejszy, ale bliższy rzeczywistości.

---

#### 🔹 2. Czym jest test end-to-end (E2E)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Test E2E testuje cały system jako całość.

- Obejmuje warstwę HTTP, bazę danych, integracje.
- Symuluje zachowanie użytkownika.
- Najbardziej realistyczny, ale najwolniejszy i najbardziej kruchy.

---

## 2️⃣ Mockowanie i Izolacja

#### 🔹 3. Czym jest mock, stub i spy?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

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

#### 🔹 4. Kiedy mockowanie jest złym pomysłem?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

- Gdy test staje się testem implementacji zamiast zachowania.
- Gdy mockujemy zbyt wiele zależności.
- Gdy test jest kruchy przy refaktorze.

Preferować testowanie zachowania, nie implementacji.

---

## 3️⃣ Testy Integracyjne i Środowisko

#### 🔹 5. Czym jest Testcontainers i dlaczego jest użyteczny?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Testcontainers pozwala uruchomić prawdziwe zależności (DB, Kafka) w Dockerze podczas testów.

Zalety:
- Realne środowisko.
- Brak zależności od lokalnej konfiguracji.
- Reproducibility.

---

#### 🔹 6. Czym jest Contract Testing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Contract Testing weryfikuje zgodność między serwisami.

- Consumer definiuje kontrakt.
- Provider musi go spełniać.

Zapobiega breaking changes w mikroserwisach.

---

## 4️⃣ Zaawansowane Techniki

#### 🔹 7. Czym jest TDD?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

TDD (Test-Driven Development):

1. Napisz test.
2. Napisz minimalny kod, by test przeszedł.
3. Refaktor.

Cel:
- Lepszy design.
- Większa pewność zmian.

---

#### 🔹 8. Czym jest property-based testing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Property-based testing polega na testowaniu ogólnych właściwości funkcji zamiast konkretnych przypadków.

Przykład:
- Funkcja sortująca powinna zwracać listę uporządkowaną rosnąco.

Generowane są losowe dane wejściowe.

---

#### 🔹 9. Czym jest mutation testing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Mutation testing sprawdza jakość testów poprzez wprowadzanie małych zmian w kodzie (mutacje).

Jeśli testy nie wykryją zmiany — są niewystarczające.

Pozwala ocenić skuteczność testów, nie tylko ich pokrycie.

