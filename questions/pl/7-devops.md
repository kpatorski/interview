[💡 Questions](questions.md)

# 🧰 DEVOPS / RUNTIME / PRODUKCJA

<!-- TOC -->
* [🧰 DEVOPS / RUNTIME / PRODUKCJA](#-devops--runtime--produkcja)
  * [1️⃣ Kontenery i Artefakty](#1-kontenery-i-artefakty)
      * [🔹 1. Czym jest kontener (Docker) i czym różni się od VM?](#-1-czym-jest-kontener-docker-i-czym-różni-się-od-vm)
      * [🔹 2. Co powinno znaleźć się w dobrym Dockerfile dla aplikacji Java?](#-2-co-powinno-znaleźć-się-w-dobrym-dockerfile-dla-aplikacji-java)
  * [2️⃣ CI/CD](#2-cicd)
      * [🔹 3. Czym jest CI/CD i jakie są typowe etapy pipeline?](#-3-czym-jest-cicd-i-jakie-są-typowe-etapy-pipeline)
  * [3️⃣ Monitoring i Observability](#3-monitoring-i-observability)
      * [🔹 4. Czym różni się monitoring od observability?](#-4-czym-różni-się-monitoring-od-observability)
      * [🔹 5. Co to jest structured logging i dlaczego jest ważny?](#-5-co-to-jest-structured-logging-i-dlaczego-jest-ważny)
      * [🔹 6. Czym jest distributed tracing?](#-6-czym-jest-distributed-tracing)
  * [4️⃣ Health Checks i Deploy](#4-health-checks-i-deploy)
      * [🔹 7. Czym różni się liveness od readiness?](#-7-czym-różni-się-liveness-od-readiness)
      * [🔹 8. Blue/Green vs Canary — czym się różnią?](#-8-bluegreen-vs-canary--czym-się-różnią)
  * [5️⃣ Skalowanie](#5-skalowanie)
      * [🔹 9. Horizontal vs Vertical scaling — różnice i konsekwencje](#-9-horizontal-vs-vertical-scaling--różnice-i-konsekwencje)
<!-- TOC -->

---

## 1️⃣ Kontenery i Artefakty

#### 🔹 1. Czym jest kontener (Docker) i czym różni się od VM?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Kontener:
- Izoluje procesy na poziomie systemu operacyjnego (namespaces, cgroups).
- Współdzieli kernel z hostem.
- Jest lekki i szybko startuje.

VM:
- Wirtualizuje sprzęt.
- Każda VM ma własny system operacyjny.
- Jest cięższa i wolniej startuje.

Kontenery są lepsze do skalowania aplikacji, VM częściej do silnej izolacji.

---

#### 🔹 2. Co powinno znaleźć się w dobrym Dockerfile dla aplikacji Java?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Dobre praktyki:
- Multi-stage build (osobno build i runtime).
- Użycie lekkiego obrazu runtime (np. JRE zamiast JDK).
- Uruchamianie jako non-root.
- Stabilne warstwy (kopiuj najpierw pliki zależności, potem kod).
- Parametry JVM dostosowane do kontenera (pamięć, GC).

Cel: mały obraz, szybki build, bezpieczeństwo.

---

## 2️⃣ CI/CD

#### 🔹 3. Czym jest CI/CD i jakie są typowe etapy pipeline?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

CI (Continuous Integration):
- Częste integrowanie zmian.
- Automatyczne budowanie i testy.

CD (Continuous Delivery/Deployment):
- Automatyczne dostarczanie na środowiska.
- Deployment — automatyczne wdrożenie na produkcję.

Typowe etapy:
- build
- unit tests
- static analysis (np. Sonar)
- integration tests (np. Testcontainers)
- package (jar/docker)
- deploy

---

## 3️⃣ Monitoring i Observability

#### 🔹 4. Czym różni się monitoring od observability?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Monitoring:
- Sprawdza znane metryki i alertuje na znane problemy.

Observability:
- Umożliwia diagnozę nieznanych problemów na podstawie sygnałów.

Trzy filary observability:
- Logs
- Metrics
- Traces

---

#### 🔹 5. Co to jest structured logging i dlaczego jest ważny?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Structured logging to logowanie w formacie maszynowo czytelnym (np. JSON), z polami:
- timestamp
- level
- message
- traceId
- spanId
- userId / requestId

Ułatwia:
- filtrowanie,
- agregację,
- korelację logów w systemach rozproszonych.

---

#### 🔹 6. Czym jest distributed tracing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Distributed tracing śledzi przebieg jednego requestu przez wiele usług.

Pojęcia:
- Trace — całe żądanie end-to-end.
- Span — pojedynczy krok (np. HTTP call, DB query).

Wymaga propagacji:
- traceId
- spanId

Pozwala diagnozować:
- wąskie gardła,
- opóźnienia,
- błędy w komunikacji.

---

## 4️⃣ Health Checks i Deploy

#### 🔹 7. Czym różni się liveness od readiness?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Liveness:
- Czy aplikacja żyje (nie zawiesiła się)?
- Jeśli nie — restart.

Readiness:
- Czy aplikacja jest gotowa przyjmować ruch?
- Jeśli nie — wyłączenie z load balancera (bez restartu).

W Kubernetes są to osobne probe.

---

#### 🔹 8. Blue/Green vs Canary — czym się różnią?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Blue/Green:
- Dwa środowiska: stare (blue) i nowe (green).
- Przełączenie ruchu na green.
- Szybki rollback przez powrót na blue.

Canary:
- Nowa wersja dostaje mały procent ruchu.
- Stopniowe zwiększanie.
- Pozwala wykryć problemy zanim dotkną wszystkich.

---

## 5️⃣ Skalowanie

#### 🔹 9. Horizontal vs Vertical scaling — różnice i konsekwencje

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Vertical scaling:
- Większa maszyna (CPU/RAM).
- Proste, ale ma limit sprzętowy.

Horizontal scaling:
- Więcej instancji.
- Wymaga stateless aplikacji lub zewnętrznego stanu.
- Lepsza dostępność i skalowalność.

W praktyce preferuje się horizontal scaling.

