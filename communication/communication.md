[Back to interview](../interview.md)

# Communication

<!-- TOC -->
* [Communication](#communication)
  * [🌐 REST API](#-rest-api)
    * [ℹ️ HTTP Methods](#ℹ-http-methods)
      * [ℹ️ PUT vs POST](#ℹ-put-vs-post)
      * [ℹ️ HTTP Status Codes](#ℹ-http-status-codes)
      * [ℹ️ Retry rules](#ℹ-retry-rules)
      * [ℹ️ Idempotency keys (POST safety)](#ℹ-idempotency-keys-post-safety)
    * [ℹ️ API Versioning](#ℹ-api-versioning)
  * [🔌 WebSockets — real-time communication](#-websockets--real-time-communication)
    * [ℹ️ What is WebSocket?](#ℹ-what-is-websocket)
    * [ℹ️ WebSocket vs HTTP](#ℹ-websocket-vs-http)
    * [ℹ️ When should you use WebSockets?](#ℹ-when-should-you-use-websockets)
    * [ℹ️ When should you NOT use WebSockets?](#ℹ-when-should-you-not-use-websockets)
  * [📩 Messaging — Kafka vs RabbitMQ](#-messaging--kafka-vs-rabbitmq)
    * [ℹ️ Apache Kafka](#ℹ-apache-kafka)
      * [🔶 Three absolute Kafka basics](#-three-absolute-kafka-basics)
      * [🔶 Topic & Partitions](#-topic--partitions)
        * [Topic](#topic)
        * [Partition](#partition)
        * [Key → Partition Mapping](#key--partition-mapping)
        * [Partitions and Scalability](#partitions-and-scalability)
        * [Consumer Groups](#consumer-groups)
        * [Offsets](#offsets)
          * [What Happens When a Pod Restarts?](#what-happens-when-a-pod-restarts)
          * [Offset Commit Modes](#offset-commit-modes)
          * [Why Offsets Belong to the Group (Not the Instance)](#why-offsets-belong-to-the-group-not-the-instance)
      * [🔶 Delivery guarantees in Kafka](#-delivery-guarantees-in-kafka)
      * [🔶 Ordering guarantees in Kafka](#-ordering-guarantees-in-kafka)
      * [🔶 How Kafka chooses a partition](#-how-kafka-chooses-a-partition)
      * [🔶 Failure handling in Kafka](#-failure-handling-in-kafka)
      * [🔶 Kafka mental model](#-kafka-mental-model)
    * [ℹ️ RabbitMQ](#ℹ-rabbitmq)
      * [🔶 Three absolute RabbitMQ basics](#-three-absolute-rabbitmq-basics)
      * [🔶 Delivery guarantees in RabbitMQ](#-delivery-guarantees-in-rabbitmq)
      * [🔶 Ordering guarantees in RabbitMQ](#-ordering-guarantees-in-rabbitmq)
      * [🔶 Failure handling in RabbitMQ](#-failure-handling-in-rabbitmq)
      * [🔶 RabbitMQ mental model](#-rabbitmq-mental-model)
    * [Kafka vs RabbitMQ](#kafka-vs-rabbitmq)
      * [Core concepts](#core-concepts)
      * [Typical architecture fit](#typical-architecture-fit)
<!-- TOC -->

## 🌐 REST API

### ℹ️ HTTP Methods

> HTTP methods express intent, not implementation.

| Method | 	Purpose                | 	Idempotent | 	Retry-safe | 	Typical usage      |
|--------|-------------------------|-------------|-------------|---------------------|
| GET    | Read data               | ✅           | ✅           | 	Fetch resources    |
| POST   | Create / trigger action | 	❌          | 	❌          | *️Create new entity |
| PUT    | Replace resource        | ✅           | ✅           | Full update         |
| PATCH  | Partial update          | ⚠️ depends	 | ⚠️ depends  | Partial update      |
| DELETE | Remove resource         | ✅           | ✅           | Delete resource     |

*️⚠️ **POST** can be retry-safe only with an idempotency key.

---

#### ℹ️ PUT vs POST

| Aspect             | 	POST       | 	PUT               |
|--------------------|-------------|--------------------|
| Creates resource   | 	✅          | 	✅                 |                     
| Client supplies ID | 	❌          | 	✅                 |                   
| Idempotent         | 	❌	         | ✅                  |                           
| Retry-safe         | 	❌	         | ✅                  |                           
| Typical use        | 	create new | 	create or replace | 

👍 Rule of thumb:  

`POST → “please create something”`  
`PUT → “make this resource look exactly like this”`

---

#### ℹ️ HTTP Status Codes

🔶 **Client errors (4xx)**

| Code  | Name                  | Meaning                        | Retry |
|-------|-----------------------|--------------------------------|-------|
| `400` | 	Bad Request          | 	Invalid syntax / payload      | 	❌    |
| `401` | 	Unauthorized         | 	Missing or invalid auth       | 	❌    |
| `403` | 	Forbidden            | 	Authenticated but not allowed | 	❌    |
| `404` | 	Not Found            | 	Resource does not exist       | 	❌*   |
| `409` | 	Conflict             | 	State/version conflict        | 	❌    |
| `422` | 	Unprocessable Entity | 	Semantic validation failed    | 	❌    |

* `DELETE` on non-existing resource may still be OK.

🔶 **Server errors (5xx)**

| Code | 	Name                  | 	Meaning                 | 	Retry |
|------|------------------------|--------------------------|--------|
| 500  | 	Internal Server Error | 	Unexpected failure      | 	⚠️    |
| 502  | 	Bad Gateway           | 	Upstream failure	       | ✅      |
| 503  | 	Service Unavailable   | 	Overload / maintenance	 | ✅      |
| 504  | 	Gateway Timeout       | 	Upstream timeout	       | ✅      |

✅ Retry with backoff  
✅ Respect Retry-After if present

---

#### ℹ️ Retry rules

> Retry only what is idempotent or transient.  
> Retries should target transient server failures, never client-side validation errors.  
> POST is non-idempotent and risky to retry, while PUT and DELETE are safe to repeat.

📌 **Safe to retry**

✅ Network errors  
✅ Timeouts  
✅ 5xx responses  
✅ Idempotent methods (`GET`, `PUT`, `DELETE`)  

📌 **Dangerous to retry**

❌ `POST` without idempotency key  
❌ Any `4xx` error  
❌ Business validation failures  

---

#### ℹ️ Idempotency keys (POST safety)

To safely retry `POST`:

`Idempotency-Key: <uuid>`

Server must **guarantee**:

- same request → same result
- no duplicate side effects

---

### ℹ️ API Versioning

🔶 **Why version APIs?**

- introduce breaking changes
- keep old clients working
- evolve contracts safely

🔶 **Common strategies**

| Strategy          | Example                   | Pros              | Cons             |
|-------------------|---------------------------|-------------------|------------------|
| URL versioning    | `/api/v1/users`           | 	explicit, simple | 	URL pollution   |
| Header versioning | `Accept: vnd.app.v2+json` | clean URLs        | hard to debug    |
| Query param       | `?version=1`              | easy              | cache-unfriendly |

🔶 **Best practice:**

✅ URL versioning for public APIs  
✅ Version only breaking changes

---
<div style="break-after: page;"></div>

## 🔌 WebSockets — real-time communication

### ℹ️ What is WebSocket?

WebSocket is a protocol that provides:

`full-duplex, persistent communication over a single TCP connection`

Unlike HTTP:

- the connection stays open
- both sides can send messages at any time
- no request/response pairing

### ℹ️ WebSocket vs HTTP

| Aspect     | 	HTTP            | 	WebSocket     |
|------------|------------------|----------------|
| Connection | 	short-lived     | 	persistent    |
| Direction  | 	client → server | 	bidirectional |
| Overhead   | 	high (headers)  | 	low           |
| Latency    | 	higher          | 	very low      |
| Real-time  | 	❌               | 	✅             |

### ℹ️ When should you use WebSockets?

✅ Real-time updates  
✅ Chat systems  
✅ Live dashboards  
✅ Online games  
✅ Collaborative editors  
✅ Notifications  

### ℹ️ When should you NOT use WebSockets?

❌ Simple CRUD APIs  
❌ Rare updates  
❌ Stateless interactions  
❌ Heavy caching required  

---
<div style="break-after: page;"></div>

## 📩 Messaging — Kafka vs RabbitMQ

Messaging is asynchronous communication where:

- producers send messages
- consumers process messages
- sender and receiver are decoupled in time and space

Core goals:

- loose coupling
- scalability
- reliability
- resilience

---

### ℹ️ Apache Kafka

Kafka is a distributed event streaming platform designed for:

- high throughput
- durability
- replayability
- event-driven architectures

📌 Kafka <span style='color:darkseagreen'>is log-based</span>, <span style='color:hotpink'>not queue-based</span>.

> Kafka = distributed commit log

- messages are never removed immediately
- consumers track their own offsets
- the same message can be read many times

🔶 **Kafka core concepts**

| Concept        | Meaning                  |
|----------------|--------------------------|
| Topic          | named event stream       |
| Partition      | ordered, append-only log |
| Offset         | position in a partition  |
| Producer       | writes events            |
| Consumer       | reads events             |
| Consumer Group | parallel consumption     |
| Broker         | Kafka server             |

🔶 **What Kafka is great at**

✅ Event sourcing  
✅ Audit logs  
✅ Stream processing  
✅ High-volume pipelines  
✅ Replaying history  

🔶 **What Kafka is NOT good at**

❌ Simple task queues  
❌ Per-message acknowledgements with complex routing  
❌ Low-latency command handling  

#### 🔶 Three absolute Kafka basics

📌 **Kafka is NOT a queue**

Kafka is an append-only log.

- messages are written and kept
- messages are not removed when consumed
- Kafka does not know if a message was “processed”

📌 **Kafka does NOT push messages**

Consumers pull data.

Kafka answers only:

> “Give me messages starting from offset X”

📌 **Kafka splits data into partitions**

- A topic is not one list.
- A topic = many partitions.

This explains ordering, scaling, and failures.

---

#### 🔶 Topic & Partitions

##### Topic

A **topic** is a logical stream of events (e.g., `orders`, `payments`).

##### Partition

A **partition** is a physical shard of a topic.

A topic consists of **N partitions**

Each partition is:
- Ordered
- Append-only
- Independent
- Has its own offsets (0,1,2,3…)
  
❗ **Kafka guarantees ordering only within ONE partition**

Think of a topic as parallel logs:

```yaml
Topic: orders

Partition 0: [e1][e2][e3][e4]
Partition 1: [e5][e6][e7]
Partition 2: [e8][e9]
```

##### Key → Partition Mapping

Kafka does **<span style='color:hotpink'>not</span>** create one partition per key.

Instead, it uses a deterministic function:

> partition = hash(key) % numberOfPartitions

🔸 **This means:**

- The same key always goes to the same partition
- Many different keys share one partition
- Partitions are a fixed resource (not dynamically created per key)

🔸 **Why this matters**

- All events for the same `orderId` (if used as key) go to the same partition
- Therefore, order is preserved per aggregate/entity
- Different keys can be processed in parallel (if they land in
  different partitions)

##### Partitions and Scalability

> Partitions define **maximum parallelism** in consumption.

If:
- Topic has 12 partitions - Consumer group has 10 instances

Then:
- Up to 10 partitions are processed in parallel - 2 partitions are additionally assigned to some instances

If scaled to 15 instances: 
- Only 12 instances will receive partitions 
- 3 instances will remain idle

> Maximum concurrency = number of partitions

Partitions can be increased (but not safely decreased).

##### Consumer Groups

> A consumer group allows multiple instances of the same application to cooperate and share the workload.

Key rule:

> One partition is assigned to at most one consumer within a group.

🔸 **What Would Happen Without Consumer Groups?**

Imagine:

- Topic orders
- 6 partitions
- 3 instances of billing-service

If those 3 instances were not in the same consumer group:

- Each instance would read the entire topic
- Each event would be processed 3 times
- You would get broadcast semantics

📌 That’s **<span style='color:hotpink'>not scaling</span>** — that’s **<span style='color:hotpink'>duplication</span>**.

🔸 **What Does a Consumer Group Actually Do?**

If all instances use:
```java
group.id = billing-service
```

Kafka treats them as **<span style='color:darkseagreen'>one logical consumer</span>**.

Kafka will:

- Distribute partitions across instances
- Ensure one partition is assigned to only one consumer within the group
- Automatically rebalance if instances join or leave

Example:

| Partition | Assigned To |
|-----------|-------------|
| P0        | Instance A  |
| P1        | Instance B  |
| P2        | Instance C  |
| P3        | Instance A  |
| P4        | Instance B  |
| P5        | Instance C  |

Result:

- Each message is processed once
- Work is split
- Processing is parallel

🔸 **Consumer Group = Horizontal Scalability**

This fits perfectly with Kubernetes scaling:

- You scale deployment from `3 → 8` pods
- All pods use the same `group.id`
- Kafka performs a rebalance
- Partitions are reassigned automatically

✅ No code changes  
✅ No offset copying  
✅ No manual coordination  

🧠 Mental Model

- Topic = event log
- Consumer group = logical application
- Consumer instance = worker

##### Offsets

🔸 **What is an offset?**

An offset is: 
- A sequential number inside a partition
- A pointer to a specific message

Each partition maintains its own offsets:

```java
    Partition 0:
    offset 0
    offset 1
    offset 2
    ...
```

Offsets are:  
✅ Stored per **consumer group**  
✅ Saved inside Kafka in the `__consumer_offsets` topic  
❌ Not stored in your application  
❌ Not stored in Kubernetes  

###### What Happens When a Pod Restarts?

If: 
1. A consumer processed messages 
2. It committed offset **150** 
3. The pod crashes

After restart:

- New instance joins the same `group.id`
- Kafka assigns partitions
- Consumption resumes from offset **150**

📌 **No manual offset transfer is required.**

###### Offset Commit Modes

🔸 **Auto Commit (Default)**

```java
enable.auto.commit = true
```

Kafka commits offsets periodically (e.g., **every 5 seconds**).

⚠️ Risk: 
- If crash happens after processing but before commit 
- Message may be reprocessed

This gives:

> At-least-once delivery

🔸 **Manual Commit (Recommended for Microservices)**

``` properties
enable.auto.commit = false
```

Commit offset **only** after: 
- Business logic completed 
- Database write finished 
- Event published

This provides:  
✅ Control  
✅ Safety  
✅ Better reliability  

###### Why Offsets Belong to the Group (Not the Instance)

> Because instances are ephemeral (especially in Kubernetes).

The offset represents:

> The progress of the logical application, not a single pod.

If a pod crashes:

- A new pod joins the same group
- Kafka assigns partitions
- It resumes from the last committed offset

📌 **The system <span style='color:darkseagreen'>continues smoothly</span>.**

---

#### 🔶 Delivery guarantees in Kafka

Kafka does not track message processing.

Kafka only knows:
- offsets
- whether a consumer committed an offset

🔹 **At most once**

**How it happens**

1. Consumer commits offset first
2. Then processes the message
3. App crashes 💥

➡️ Message is lost

**Mental model**

> “Better to lose a message than process it twice”

📌 Rarely used  
📌 Metrics, debug logs  

🔹 **At least once (default!)**

**How it works**

1. Consumer reads message
2. Processes it
3. Commits offset only after success

If the app crashes before step 3:  
➡️ Message is processed again

**Mental model**

> “Messages may be duplicated, but never lost”

📌 Default Kafka mode  
📌 Consumers MUST be idempotent  

🔹 **Exactly once (the hard one)**

Kafka can guarantee:

- exactly-once within Kafka itself

But Kafka cannot guarantee:

❌ database writes  
❌ REST calls  

In practice:

> exactly-once = idempotent consumer + transactions

---

#### 🔶 Ordering guarantees in Kafka

📌 **Rule #1**

> Ordering is guaranteed only per partition

What this means in practice

Events:

```scss
OrderCreated(123)
OrderPaid(123)
OrderShipped(123)
```

If:
- all go to the same partition  
➡️ order is preserved

If:
- they go to different partitions  
➡️ order is NOT guaranteed

---

#### 🔶 How Kafka chooses a partition

Producer sends:

- topic
- key
- value

Kafka computes:

```ini
partition = hash(key) % numberOfPartitions
```

🔹 **Example**

`key = orderId`

- All events for order `123`  
- Always go to the same partition  
- Ordering per order is guaranteed  

📌 Key = ordering guarantee

---

#### 🔶 Failure handling in Kafka

🔹 **Consumer crashes**

Kafka:

- keeps messages
- keeps offsets

New consumer:

- resumes from last committed offset
- ⚠️ messages may be reprocessed

📌 **This is by design**

---

🔹 **Broker crashes**

Kafka:

- replicates partitions
- elects a new leader

📌 **Clients continue automatically**

---

🔹 **Poison messages**

Kafka **has no built-in** DLQ.

Typical patterns:

- retry topics
- dead-letter topics
- manual offset management

📌 **The application decides.**

---

#### 🔶 Kafka mental model

- Kafka = **history**
- Messages are **immutable**
- **Consumers** manage their own state
- **Duplicates** are **normal**
- **Keys** define **ordering**
---

### ℹ️ RabbitMQ

RabbitMQ is a message broker implementing:

- an open-standard `Advanced Message Queuing Protocol (AMQP)` protocol
- classic queue-based messaging
- RabbitMQ is message-oriented, not log-oriented.

> RabbitMQ = smart post office

- messages are pushed to consumers
- messages are removed once acknowledged
- broker handles routing logic

🔶 **RabbitMQ core concepts**

| Concept         | 	Meaning             |
|-----------------|----------------------|
| Producer        | 	sends messages      |
| Exchange        | 	routes messages     |
| Queue           | 	stores messages     |
| Binding         | 	routing rule        |
| Consumer        | 	receives messages   |
| Acknowledgement | 	confirms processing |

🔶 **What RabbitMQ is great at**

✅ Task queues  
✅ Work distribution  
✅ Command messaging  
✅ Request/response async  
✅ Fine-grained routing  

🔶 **What RabbitMQ is NOT good at**

❌ Massive event streams  
❌ Message replay  
❌ Long-term storage of events  

---

#### 🔶 Three absolute RabbitMQ basics

📌 **RabbitMQ IS a queue**

Messages:
- go into a queue
- are removed after successful processing

📌 **RabbitMQ PUSHES messages**

Consumers:
- receive messages automatically
- broker decides who gets what

📌 **RabbitMQ knows message state**

RabbitMQ tracks:

- delivered
- acknowledged
- rejected

**This is the opposite of Kafka.**

---

#### 🔶 Delivery guarantees in RabbitMQ

RabbitMQ delivery depends on acknowledgements (**acks**).

🔹 **At most once**

How it happens
- auto-ack enabled
- message is considered “done” immediately

If consumer crashes:  
➡️ message is lost

📌 Fast, unsafe  
📌 Rarely acceptable  

---

🔹 **At least once (most common)**

How it works

1. Broker sends message
2. Consumer processes it
3. Consumer sends **ACK**

If consumer crashes before ACK:  
➡️ message is requeued

📌 Duplicates possible  
📌 Idempotency still needed  

---

🔹 **Exactly once**

RabbitMQ <span style='color:hotpink'>**does not**</span> support exactly-once.

To approximate it:

- idempotent consumers
- deduplication
- transactional outbox

---

#### 🔶 Ordering guarantees in RabbitMQ

📌 **Rule #1**

> Ordering is guaranteed per queue

**What breaks ordering?**

- multiple consumers on one queue
- parallel processing
- retries and requeues

**Example:**

```css
msg1 → consumer A (slow)
msg2 → consumer B (fast)
```

⚠️ `msg2` finishes before `msg1`

📌 RabbitMQ prioritizes throughput, not ordering

---

#### 🔶 Failure handling in RabbitMQ

🔹 **Consumer crashes**

RabbitMQ:

- detects lost connection
- requeues unacked messages

➡️ Another consumer gets them

---

🔹 **Broker crashes**

If:

- queues are durable
- messages are persistent

➡️ Messages survive restart

If not:  
➡️ Messages are lost

--- 

🔹 **Poison messages**

RabbitMQ has first-class DLQ support.

Typical setup:

- retry queue
- dead-letter exchange
- TTL-based retries

📌 Broker-level support (unlike Kafka)

---

#### 🔶 RabbitMQ mental model

- RabbitMQ = **work distribution**
- Messages are **tasks**
- **Broker** manages **delivery**
- **ACK** = “I’m done”
- DLQ is built-in
---

### Kafka vs RabbitMQ

- Kafka → **“What happened?”**
- RabbitMQ → **“Do this”**

#### Core concepts

| Aspect            | Kafka             | RabbitMQ       |
|-------------------|-------------------|----------------|
| Model             | Log / stream      | Queue          |
| Message retention | Time / size based | Until consumed |
| Consumer model    | Pull              | Push           |
| Replay messages   | ✅                 | ❌              |
| Ordering          | Per partition     | Per queue      |
| Throughput        | Very high         | Medium         |
| Latency           | Medium            | Very low       |
| Routing           | Simple            | Very flexible  |
| Use cases         | Events            | Commands       |

#### Typical architecture fit

Use **Kafka** when:

✅ event-driven architecture  
✅ event sourcing  
✅ analytics pipelines  
✅ microservice integration via events  

Use **RabbitMQ** when:

✅ background jobs  
✅ async commands  
✅ workflows  
✅ request/response async  


---
<div style="break-after: page;"></div>

---
<div style="break-after: page;"></div>
