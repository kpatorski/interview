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

#### 🔹 1. 🧑‍💻 ⭐⭐⭐ Czym jest kontener (Docker) i czym różni się od VM?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

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

#### 🔹 2. 🧑‍💻 ⭐⭐ Co powinno znaleźć się w dobrym Dockerfile dla aplikacji Java?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Dobre praktyki:
- Multi-stage build (osobno build i runtime).
- Użycie lekkiego obrazu runtime (np. JRE zamiast JDK).
- Uruchamianie jako non-root.
- Stabilne warstwy (kopiuj najpierw pliki zależności, potem kod).
- Parametry JVM dostosowane do kontenera (pamięć, GC).

Cel: mały obraz, szybki build, bezpieczeństwo.

---

## 2️⃣ CI/CD

#### 🔹 3. 🧑‍💻 ⭐⭐⭐ Czym jest CI/CD i jakie są typowe etapy pipeline?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

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

#### 🔹 4. 🧑‍💻 ⭐⭐ Czym różni się monitoring od observability?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Monitoring:
- Sprawdza znane metryki i alertuje na znane problemy.

Observability:
- Umożliwia diagnozę nieznanych problemów na podstawie sygnałów.

Trzy filary observability:
- Logs
- Metrics
- Traces

---

#### 🔹 5. 🧑‍💻 ⭐⭐ Co to jest structured logging i dlaczego jest ważny?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

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

#### 🔹 6. 🧑‍💻 ⭐ Czym jest distributed tracing?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

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

#### 🔹 7. 🧑‍💻 ⭐⭐⭐ Czym różni się liveness od readiness?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Liveness:
- Czy aplikacja żyje (nie zawiesiła się)?
- Jeśli nie — restart.

Readiness:
- Czy aplikacja jest gotowa przyjmować ruch?
- Jeśli nie — wyłączenie z load balancera (bez restartu).

W Kubernetes są to osobne probe.

---

#### 🔹 8. 🧑‍💻 ⭐⭐ Blue/Green vs Canary — czym się różnią?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

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

#### 🔹 9. 🧑‍💻 ⭐⭐ Horizontal vs Vertical scaling — różnice i konsekwencje

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Vertical scaling:
- Większa maszyna (CPU/RAM).
- Proste, ale ma limit sprzętowy.

Horizontal scaling:
- Więcej instancji.
- Wymaga stateless aplikacji lub zewnętrznego stanu.
- Lepsza dostępność i skalowalność.

W praktyce preferuje się horizontal scaling.

---

#### 🔹 10. 🧙‍♂️ ⭐⭐ Czym są Kubernetes Deployment vs StatefulSet?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**Deployment**:
- do aplikacji bezstanowych (stateless),
- pody są wymienne — każdy identyczny,
- rolling update domyślnie.

**StatefulSet**:
- do aplikacji stanowych (bazy danych, Kafka, ZooKeeper),
- każdy pod ma stałą tożsamość (pod-0, pod-1) i trwały wolumin (PVC),
- rolling update w kolejności — pod-N dopiero po pod-N-1.

Zasada: aplikacje Java powinny być stateless i uruchamiane jako Deployment.

---

#### 🔹 11. 🧑‍💻 ⭐⭐⭐ Czym są resource requests i limits w Kubernetes?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "512Mi"
  limits:
    cpu: "1"
    memory: "1Gi"
```

**Request** — minimalna gwarantowana ilość (scheduler uwzględnia przy planowaniu).
**Limit** — maksimum (CPU throttling po przekroczeniu, OOM kill przy pamięci).

Ważne dla JVM:
- ustawić `-Xmx` mniejszy niż memory limit (np. limit 1Gi → `-Xmx768m`),
- `MaxRAMPercentage` pozwala JVM dostosować się dynamicznie.

---

#### 🔹 12. 🧑‍💻 ⭐⭐ Jakie są typy Service w Kubernetes?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

- **ClusterIP** — dostępny tylko wewnątrz klastra (domyślny),
- **NodePort** — ekspozycja na każdym node na statycznym porcie,
- **LoadBalancer** — tworzy zewnętrzny load balancer (np. AWS ALB),
- **ExternalName** — alias DNS do zewnętrznego serwisu.

Headless Service (ClusterIP=None): bezpośredni DNS do podów — używany przez StatefulSet.

---

#### 🔹 13. 🧑‍💻 ⭐⭐⭐ ConfigMap vs Secret w Kubernetes

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**ConfigMap**: niecitliwe dane konfiguracyjne (URL-e, porty, flagi).

**Secret**: dane wrażliwe (hasła, klucze API, certyfikaty) — zakodowane Base64, dostęp RBAC.

Ważne: Secret w Kubernetes domyślnie nie jest szyfrowany w etcd — wymagane:
- `EncryptionConfiguration` w etcd,
- lub External Secrets Operator (Vault, AWS Secrets Manager).

Nie commituj sekretów — używaj sealed-secrets lub External Secrets.

---

#### 🔹 14. 🧙‍♂️ ⭐⭐ Czym jest HPA (Horizontal Pod Autoscaler)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

HPA automatycznie skaluje liczbę replik Deployment na podstawie metryk.

Domyślna metryka: CPU utilization.
Custom metrics: throughput, queue depth, latency (przez Prometheus Adapter).

```yaml
metrics:
- type: Resource
  resource:
    name: cpu
    target:
      averageUtilization: 60
```

Pułapki:
- requests muszą być ustawione (HPA liczy % od request, nie limit),
- cooldown period zapobiega flapping.

---

#### 🔹 15. 🧑‍💻 ⭐⭐ Czym jest Kubernetes Ingress?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Ingress to reguły routingu HTTP/HTTPS do serwisów wewnątrz klastra.

Przykład:
```yaml
rules:
- host: api.example.com
  http:
    paths:
    - path: /orders
      backend:
        service:
          name: order-service
```

Wymaga Ingress Controller (nginx, Traefik, AWS ALB Ingress Controller).
TLS terminowany na Ingress (certyfikaty przez cert-manager + Let's Encrypt).

---

#### 🔹 16. 🧑‍💻 ⭐ Czym jest GitOps?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

GitOps to podejście, w którym Git jest jedynym źródłem prawdy dla stanu infrastruktury i aplikacji.

Operator (Flux, ArgoCD) ciągle synchronizuje klaster z repozytory — zamiast ręcznego `kubectl apply`.

Zalety:
- pełny audit trail zmian (git log),
- rollback = git revert,
- nie ma "ręcznych" zmian w klastrze.

---

#### 🔹 17. 🧙‍♂️ ⭐⭐ Czym jest Infrastructure as Code (IaC)?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

IaC to zarządzanie infrastrukturą przez deklaratywne pliki konfiguracyjne wersjonowane w Git.

Narzędzia:
- **Terraform** — deklaratywny, wspiera wielu providerów (AWS, GCP, Azure),
- **Pulumi** — IaC w kodzie (TypeScript, Python),
- **AWS CDK** — AWS-specific, kod generuje CloudFormation.

Korzyści:
- reprodukowalne środowiska,
- code review dla zmian infrastruktury,
- eliminacja "snowflake servers".

---

#### 🔹 18. 🧙‍♂️ ⭐⭐ Jak przeprowadzić zero-downtime deployment?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Kubernetes Rolling Update jest domyślny i zapewnia zero-downtime przy spełnieniu warunków:

- **Readiness probe** — nowe pody muszą być gotowe przed przełączeniem ruchu,
- **terminationGracePeriodSeconds** — czas na dokończenie in-flight requestów,
- **podDisruptionBudget** — minimum X podów dostępnych podczas rolloutu.

Baza danych: migracje muszą być kompatybilne wstecznie (expand-contract pattern).

---

#### 🔹 19. 🧙‍♂️ ⭐⭐ Jak zarządzać migracjami bazy w CI/CD?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Zasady:
- migracje wersjonowane (Flyway, Liquibase) i w repozytorium,
- uruchamiane automatycznie przy starcie aplikacji lub jako init-container.

Expand-contract pattern dla zero-downtime:
1. Dodaj nową kolumnę (nullable) — stary kod ignoruje, nowy pisze.
2. Wypełnij dane migracyjne.
3. Zmień kod do użycia nowej kolumny.
4. Usuń starą kolumnę.

Nigdy nie modyfikuj istniejącej migracji Flyway — dodaj nową.

---

#### 🔹 20. 🧙‍♂️ ⭐ Czym jest Chaos Engineering?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Chaos Engineering to celowe wprowadzanie awarii do systemu w kontrolowany sposób, żeby weryfikować odporność.

Proces (Netflix Simian Army):
1. Zdefiniuj "steady state" (normalne metryki).
2. Hipoteza: system utrzyma steady state mimo awarii X.
3. Wprowadź awarię (kill pod, delay network, exhaust CPU).
4. Obserwuj.

Narzędzia: Chaos Monkey, Litmus, Chaos Mesh.

Ważne: zacznij od non-prod, przejdź do prod stopniowo.

---

#### 🔹 21. 🧙‍♂️ ⭐⭐ Czym są SLI, SLO i SLA?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**SLI** (Service Level Indicator): miara jakości usługi (np. % requestów z latency < 200ms).

**SLO** (Service Level Objective): cel dla SLI (np. 99,9% requestów < 200ms w miesiącu).

**SLA** (Service Level Agreement): kontrakt z klientem + konsekwencje (finansowe) przy naruszeniu.

Error budget: `1 - SLO` = budżet na błędy.
Gdy error budget wyczerpany → freeze nowych features, focus na reliability.

---

#### 🔹 22. 🧑‍💻 ⭐ Jak zarządzać sekretami w Kubernetes produkcyjnie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Opcje:
1. **External Secrets Operator** — synchronizuje sekrety z Vault/AWS SM do K8s Secret,
2. **Sealed Secrets** (Bitnami) — zaszyfrowane sekrety w Git, odszyfrowane przez controller w klastrze,
3. **Vault Agent Sidecar** — Vault wstrzykuje sekrety do pliku lub env kontenera,
4. **AWS Secrets Manager + IRSA** — pod ma IAM role i czyta bezpośrednio.

Zawsze: rotacja sekretów, audit kto i kiedy odczytał.

---

#### 🔹 23. 🧙‍♂️ ⭐ Czym jest container image security?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Dobre praktyki:
- **distroless / minimal base image** (np. `gcr.io/distroless/java21`) — brak shella, mniejsza powierzchnia ataku,
- **non-root user** — `USER 10001` w Dockerfile,
- **read-only filesystem** — montuj woluminy jako readOnly,
- **skanowanie obrazów** — Trivy, Snyk, AWS ECR scanning przy push,
- **image signing** — Cosign + policy admission (Kyverno).

Supply chain: nie używaj obrazów `latest`, przypinaj do digesta SHA.

---

#### 🔹 24. 🧙‍♂️ ⭐ Czym jest Service Mesh i czym różni się od API Gateway?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

**API Gateway** — punkt wejścia z zewnątrz (north-south traffic):
- auth, rate limiting, routing.

**Service Mesh** — komunikacja wewnątrz klastra (east-west traffic):
- mTLS, retry, circuit breaker, tracing — bez zmian w kodzie aplikacji.

Oba rozwiązują różne warstwy — często stosowane razem (Gateway + Istio/Linkerd).

---

#### 🔹 25. 🧙‍♂️ ⭐ Czym jest multi-environment configuration strategy?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:small'>Odpowiedź</span>

Ten sam artefakt (image Docker) wdrażany na dev/staging/prod — konfiguracja pochodzi ze środowiska, nie z obrazu.

Mechanizmy:
- zmienne środowiskowe (`APP_DB_URL=...`),
- Kubernetes ConfigMap/Secret per namespace,
- Spring Profiles + ConfigMap,
- External Secrets per environment.

Zasada 12-factor: "Store config in the environment". Image nie powinien zawierać żadnych środowiskowych danych.

