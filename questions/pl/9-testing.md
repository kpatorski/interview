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

#### 🔹 1. 🟢 Czym różni się test jednostkowy od integracyjnego?

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

#### 🔹 2. 🟢 Czym jest test end-to-end (E2E)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Test E2E testuje cały system jako całość.

- Obejmuje warstwę HTTP, bazę danych, integracje.
- Symuluje zachowanie użytkownika.
- Najbardziej realistyczny, ale najwolniejszy i najbardziej kruchy.

---

## 2️⃣ Mockowanie i Izolacja

#### 🔹 3. 🟢 Czym jest mock, stub i spy?

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

#### 🔹 4. 🟢 Kiedy mockowanie jest złym pomysłem?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

- Gdy test staje się testem implementacji zamiast zachowania.
- Gdy mockujemy zbyt wiele zależności.
- Gdy test jest kruchy przy refaktorze.

Preferować testowanie zachowania, nie implementacji.

---

## 3️⃣ Testy Integracyjne i Środowisko

#### 🔹 5. 🟢 Czym jest Testcontainers i dlaczego jest użyteczny?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Testcontainers pozwala uruchomić prawdziwe zależności (DB, Kafka) w Dockerze podczas testów.

Zalety:
- Realne środowisko.
- Brak zależności od lokalnej konfiguracji.
- Reproducibility.

---

#### 🔹 6. 🟢 Czym jest Contract Testing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Contract Testing weryfikuje zgodność między serwisami.

- Consumer definiuje kontrakt.
- Provider musi go spełniać.

Zapobiega breaking changes w mikroserwisach.

---

## 4️⃣ Zaawansowane Techniki

#### 🔹 7. 🟢 Czym jest TDD?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

TDD (Test-Driven Development):

1. Napisz test.
2. Napisz minimalny kod, by test przeszedł.
3. Refaktor.

Cel:
- Lepszy design.
- Większa pewność zmian.

---

#### 🔹 8. 🔴 Czym jest property-based testing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Property-based testing polega na testowaniu ogólnych właściwości funkcji zamiast konkretnych przypadków.

Przykład:
- Funkcja sortująca powinna zwracać listę uporządkowaną rosnąco.

Generowane są losowe dane wejściowe.

---

#### 🔹 9. 🔴 Czym jest mutation testing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Mutation testing sprawdza jakość testów poprzez wprowadzanie małych zmian w kodzie (mutacje).

Jeśli testy nie wykryją zmiany — są niewystarczające.

Pozwala ocenić skuteczność testów, nie tylko ich pokrycie.

---

#### 🔹 10. 🔴 Czym jest piramida testów i dlaczego jest ważna?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Piramida testów (Mike Cohn):
- **Unit** (podstawa) — dużo, szybkie, tanie,
- **Integration** (środek) — umiarkowanie,
- **E2E/UI** (szczyt) — mało, wolne, drogie.

Anty-wzorzec: "odwrócona piramida" — dużo E2E, brak unit testów → wolne CI, kruche testy.

W mikroserwisach: unit + integration (Testcontainers) + contract testing (Pact).

---

#### 🔹 11. 🟢 Czym jest BDD i czym różni się od TDD?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**TDD**: programista pisze test, potem kod — fokus na design i implementację.

**BDD** (Behavior-Driven Development): testy opisane w języku biznesowym (Given/When/Then) — dialog między biznesem a developerem.

```gherkin
Given użytkownik ma 100 PLN na koncie
When przeleje 150 PLN
Then transakcja zostaje odrzucona
```

Narzędzia: Cucumber, JBehave. BDD nie zastępuje TDD — to uzupełniające podejścia.

---

#### 🔹 12. 🟢 Jak testować kod asynchroniczny?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Wyzwania:
- wynik dostępny po czasie — test musi poczekać,
- race conditions w testach.

Techniki:
- **Awaitility** — pollinguje warunek z timeoutem:
  ```java
  await().atMost(5, SECONDS).until(() -> repo.count() == 1);
  ```
- Testowanie przez obserwowane skutki uboczne (stan w DB, wyemitowany event),
- Mocking executorów do kontroli czasu (np. `TestScheduler` w Reactor).

Unikaj: `Thread.sleep()` — kruche i spowalnia testy.

---

#### 🔹 13. 🟢 Czym są flaky tests i jak z nimi walczyć?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Flaky test to test, który raz przechodzi, raz nie — bez zmiany kodu.

Przyczyny:
- zależność od czasu (`Thread.sleep`),
- współdzielony stan między testami,
- zależność od kolejności testów,
- race conditions,
- zewnętrzne serwisy.

Walka:
- izolacja stanu (rollback transakcji, fresh containers per test),
- Awaitility zamiast sleep,
- quarantine flaky tests — wydziel, napraw lub usuń,
- retry w CI jest planem awaryjnym, nie rozwiązaniem.

---

#### 🔹 14. 🟢 Czym jest Consumer-Driven Contract Testing (Pact)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Pact: konsument definiuje kontrakt (oczekiwane żądania i odpowiedzi), provider weryfikuje czy go spełnia.

Przepływ:
1. Consumer pisze test → generuje plik kontraktu (`.json`).
2. Kontrakt jest publikowany do Pact Broker.
3. Provider pobiera kontrakt i uruchamia weryfikację.

Zalety vs E2E:
- brak zależności na żyjący serwis podczas testów,
- early detection breaking changes w pipeline CI.

---

#### 🔹 15. 🟢 Jak zarządzać danymi testowymi?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Strategie:
- **Test fixtures** — predefiniowane obiekty domenowe (factory methods, builder pattern),
- **SQL scripts** — wczytane przed testem, rollback po,
- **@Transactional na testach** — automatyczny rollback po każdym teście,
- **Object Mother / Test Data Builder** — centralne fabryki danych testowych.

Zasada: testy powinny tworzyć własne dane i nie zakładać stanu z poprzednich testów (izolacja).

Unikaj: shared fixtures mutowane przez testy — prowadzi do flakyness.

---

#### 🔹 16. 🔴 Jak testować z zewnętrznymi serwisami (WireMock)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

WireMock to HTTP stub server — zastępuje zewnętrzne API w testach.

```java
stubFor(get("/external/api/user/1")
    .willReturn(okJson("{\"name\": \"Jan\"}")));
```

Zalety vs mock:
- testuje rzeczywisty HTTP stack (serialization, headers, timeout),
- odtwarza edge cases (timeout, 503, powolna odpowiedź).

Spring Boot: `@WireMockTest` lub `WireMockServer` w Testcontainers.

---

#### 🔹 17. 🟢 Czym jest architektura testów integracyjnych w Spring Boot?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

`@SpringBootTest` + `@Testcontainers` — najlepszy setup do testów integracyjnych:

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class OrderIntegrationTest {
    @Container
    static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");
}
```

Optymalizacja:
- `@DirtiesContext` tylko gdy konieczne (tworzy nowy kontekst),
- współdzielony `@Container` między testami (static) — jeden start dla całej klasy,
- `@TestConfiguration` do nadpisania beansów.

---

#### 🔹 18. 🟢 Czym jest performance testing i jakie narzędzia stosować?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Performance testing weryfikuje czy system spełnia SLO pod obciążeniem.

Narzędzia:
- **Gatling** — Scala DSL, czytelne raporty, dobre do CI,
- **k6** — JavaScript, skrypty jako kod, świetne do CI/CD,
- **JMeter** — GUI, szeroka funkcjonalność.

Typy testów:
- **Load** — normalne obciążenie,
- **Stress** — powyżej normy,
- **Soak** — długotrwałe (memory leaks),
- **Spike** — nagły wzrost.

---

#### 🔹 19. 🟢 Co oznacza "test behavior, not implementation"?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Testowanie implementacji: weryfikujesz czy `repository.save()` został wywołany raz z konkretnym obiektem.

Testowanie zachowania: weryfikujesz że po wywołaniu `placeOrder()` zamówienie pojawia się w bazie i event został wyemitowany.

Testy implementacji są kruche — refaktor (np. zamiana metody wewnętrznej) łamie testy bez zmiany logiki.

Reguła: test powinien przejść po dowolnym refaktorze który nie zmienia obserwowalnego zachowania.

---

#### 🔹 20. 🟢 Jak testować security w aplikacji?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Warstwy testowania security:

- **Unit/Integration**: `@WithMockUser`, `@PreAuthorize` testy — czy endpoint odrzuca nieautoryzowanego?
- **SAST** (Static Application Security Testing): SonarQube, SpotBugs, Semgrep — statyczna analiza kodu,
- **DAST** (Dynamic): OWASP ZAP — skanuje działającą aplikację,
- **Dependency scan**: OWASP Dependency-Check, Snyk — podatności w bibliotekach,
- **Penetration testing** — ręczne lub automatyczne próby włamania.

Minimum w CI: SAST + dependency scan przy każdym merge.

---

#### 🔹 21. 🔴 Jakie są anti-patterns w testowaniu?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

- **Test zbyt mocno mockuje** — testuje interakcje, nie logikę,
- **Logika w testach** — if/else w testach ukrywa co jest sprawdzane,
- **Brak asercji** — test przechodzi zawsze (brak `assert`),
- **Jeden test sprawdza zbyt wiele** — trudno zdiagnozować błąd,
- **Testy zależne od kolejności** — test X musi przejść przed Y,
- **Komentowane testy** — "tymczasowo" wyłączone na zawsze.

---

#### 🔹 22. 🟢 Jak mierzyć jakość testów poza coverage?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Code coverage (% linii) mówi co *było* wywołane, nie czy zachowanie było sprawdzone.

Lepsze metryki:
- **Mutation score** (Pitest) — % mutantów zabitych przez testy,
- **Defect detection ratio** — ile bugów testy znalazły przed produkcją,
- **Test execution time** — czy testy są na tyle szybkie by uruchamiać je często,
- **Flakiness rate** — % testów z niestabilnym wynikiem.

80% coverage z 30% mutation score jest gorsze niż 60% coverage z 80% mutation score.

---

#### 🔹 23. 🔴 Czym jest Chaos Testing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Chaos Testing celowo wprowadza awarie do systemu by testować odporność.

Na poziomie testów integracyjnych:
- symulacja timeoutu (WireMock `withFixedDelay`),
- simulacja błędu serwisu (WireMock 503),
- Testcontainers + zatrzymanie kontenera w trakcie testu.

Na poziomie produkcyjnym: Chaos Monkey, Litmus.

Różnica od load testing: nie chodzi o skalę, ale o awarie.

---

#### 🔹 24. 🔴 Jak testować distributed transactions (Saga)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Saga jest trudna w testowaniu z powodu asynchroniczności i wielu kroków.

Strategie:
- **Testy jednostkowe** kroków Sagi niezależnie,
- **Testy integracyjne** z Testcontainers (DB + Kafka): wywołaj command → poczekaj na event → sprawdź stan,
- **Awaitility** do czekania na async wynik,
- **WireMock** do symulacji innych serwisów,
- **Testy kompensacji** — co się dzieje gdy krok N zawiedzie?

---

#### 🔹 25. 🔴 Czym jest Test Data Builder pattern?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Test Data Builder (Object Mother) — centralna fabryka obiektów testowych z wartościami domyślnymi.

```java
Order order = OrderBuilder.anOrder()
    .withStatus(PENDING)
    .withAmount(Money.of(100, PLN))
    .build();
```

Zalety:
- testy są czytelne — pokazują tylko relevantne dane,
- zmiana struktury obiektu wymaga zmiany tylko buildera,
- wartości domyślne ukryte w builderze — test skupia się na tym co testuje.

Każdy domenowy agregat powinien mieć swój builder w `src/test`.

