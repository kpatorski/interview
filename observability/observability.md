[Back to interview](../interview.md)

# 🔭 Observability — seeing what your system is really doing

<!-- TOC -->
* [🔭 Observability — seeing what your system is really doing](#-observability--seeing-what-your-system-is-really-doing)
  * [ℹ️ What is Observability?](#ℹ-what-is-observability)
  * [ℹ️ Popular observability frameworks & tools (ecosystem)](#ℹ-popular-observability-frameworks--tools-ecosystem)
  * [ℹ️ The three pillars of observability](#ℹ-the-three-pillars-of-observability)
  * [📜 Logs](#-logs)
    * [🔸What are logs?](#what-are-logs)
    * [🔸 When logs are useful](#-when-logs-are-useful)
    * [🔸 Logging best practices](#-logging-best-practices)
  * [📊 Metrics](#-metrics)
    * [🔸 What are metrics?](#-what-are-metrics)
    * [🔸 Metric types](#-metric-types)
    * [🔸When metrics are useful](#when-metrics-are-useful)
    * [🔸 Metrics best practices](#-metrics-best-practices)
  * [🧵 Tracing](#-tracing)
    * [🔸 What is distributed tracing?](#-what-is-distributed-tracing)
    * [🔸When tracing is useful](#when-tracing-is-useful)
    * [🔸Tracing best practices](#tracing-best-practices)
  * [🧩 Correlation pattern](#-correlation-pattern)
  * [Anti-patterns](#anti-patterns)
<!-- TOC -->

## ℹ️ What is Observability?

Observability is the ability to:

> understand the internal state of a system by looking at its outputs

Those outputs are:

- Logs
- Metrics
- Traces

📌 Monitoring tells you something is wrong  
📌 Observability helps you answer why it is wrong  

## ℹ️ Popular observability frameworks & tools (ecosystem)

🔸 **Core standards / instrumentation**

- OpenTelemetry (OTel) → unified standard for logs, metrics, traces

---

🔸 **Metrics stack**

- Prometheus
- Grafana

---

🔸 **Logging stack**

- ELK Stack (Elasticsearch, Logstash, Kibana)
- OpenSearch
- Loki (Grafana ecosystem)

---

🔸 **Tracing**

- Jaeger
- Zipkin
- Tempo (Grafana ecosystem)

---

🔸 **Commercial platforms (all-in-one)**

- Datadog
- New Relic
- Dynatrace
- Elastic Observability

---

## ℹ️ The three pillars of observability

```bash
Logs    → what happened?
Metrics → how often / how bad?
Traces  → where did it happen?
```

📌 They **complement**, not replace each other.

---
<div style="break-after: page;"></div>

## 📜 Logs

### 🔸What are logs?

Logs are:

- discrete events
- timestamped
- human-readable (usually)

**Example:**

```json
{
  "level": "ERROR",
  "service": "payment-service",
  "message": "Payment failed",
  "orderId": "123",
  "traceId": "abc-456"
}
```

### 🔸 When logs are useful

✅ debugging edge cases  
✅ investigating failures  
✅ auditing  
✅ understanding business flow  

### 🔸 Logging best practices

✅ Structured logs (JSON, not plain text)  
✅ Correlation IDs / trace IDs  
✅ Log events, not control flow  
✅ Avoid logging secrets  
✅ Log at boundaries (IO, errors)  

❌ Logging everything  
❌ Using logs as metrics

---
<div style="break-after: page;"></div>

## 📊 Metrics

### 🔸 What are metrics?

Metrics are:

- numeric
- aggregated over time
- cheap to store
- cheap to query

**Examples:**

```css
http_requests_total
http_request_duration_seconds
cpu_usage
memory_usage
```

### 🔸 Metric types

| Type      | Meaning          | Example       |
|-----------|------------------|---------------|
| Counter   | always increases | request count |
| Gauge     | up & down        | memory        |
| Histogram | distribution     | latency       |
| Summary   | quantiles        | p95 latency   |

### 🔸When metrics are useful

✅ alerting  
✅ dashboards  
✅ SLO / SLA tracking  
✅ capacity planning  

📌 Metrics answer:

> “Is the system healthy?”

### 🔸 Metrics best practices

✅ Low cardinality labels  
✅ Measure symptoms, not causes  
✅ Use RED / USE methods  
✅ Alert on user impact  

❌ Per-user labels  
❌ Logging as metrics  

---
<div style="break-after: page;"></div>

## 🧵 Tracing

### 🔸 What is distributed tracing?

Tracing follows a single request across:

- services
- threads
- async boundaries

A trace consists of spans.

**Example trace**

```css
HTTP request
 ├── API Gateway
 ├── Order Service
 │    ├── DB query
 │    └── Payment Service
 │         └── External API
```
Each span has:

- duration
- metadata
- parent/child relation

### 🔸When tracing is useful

✅ microservices
✅ latency analysis
✅ bottleneck detection
✅ debugging async flows

Tracing answers:

> “Where exactly is time being spent?”

### 🔸Tracing best practices

✅ Propagate trace context everywhere
✅ Sample intelligently
✅ Combine traces with logs
✅ Don’t trace everything at 100%

---
<div style="break-after: page;"></div>

## 🧩 Correlation pattern

📌 **Rule#1:**

> Logs, metrics, and traces must share identifiers

```css
traceId
spanId
requestId
``` 
---

## Anti-patterns

❌ Logging without context  
❌ Metrics without alerts  
❌ Alerts without runbooks  
❌ Tracing without sampling strategy  
❌ Dashboards no one looks at  

---
<div style="break-after: page;"></div>