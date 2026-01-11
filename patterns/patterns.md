[Back to interview](../interview.md)

# Patterns

<!-- TOC -->
* [Patterns](#patterns)
  * [Inbox pattern](#inbox-pattern)
  * [Outbox pattern](#outbox-pattern)
  * [Inbox vs Outbox pattern](#inbox-vs-outbox-pattern)
  * [Saga pattern](#saga-pattern)
  * [Circuit breaker pattern](#circuit-breaker-pattern)
<!-- TOC -->

## Inbox pattern

The Inbox Pattern is a reliable messaging design pattern in microservices used on the consumer side to ensure exactly-once processing. 
While most message brokers provide "at-least-once" delivery, the Inbox Pattern **prevents a service from processing the same message multiple times** due to network retries or crashes.

ℹ️ **How It Works**

1. **Message Receipt**: The consumer service receives a message from a broker (like Kafka or RabbitMQ).
2. **Deduplication Check**: Before executing any logic, the service checks an inbox table in its database for the unique `message_id`.
3. **<span style='color:cornflowerblue'>Atomic Transaction</span>**: In a single database transaction, the service:
   1. Inserts the new `message_id` into the inbox table to mark it as "received".
   2. Executes the required business logic (e.g., updating an inventory count).
4. **Acknowledgment**: Once the transaction commits, the message is acknowledged to the broker. If the same message arrives again, the inbox check will find the existing ID and skip processing.

ℹ️ **Key Benefits**
- **Idempotency**: Guarantees that even if a message is delivered multiple times, the business state is only updated once.
- **Resilience**: If the service crashes mid-processing, the database transaction rolls back, allowing the message to be safely retried later without partial data corruption.
- **Auditing**: The inbox table serves as a historical log of all events processed by that specific service, aiding in debugging and monitoring.

---
<div style="break-after: page;"></div>

## Outbox pattern

The Transactional Outbox Pattern is a reliable messaging design used in microservices to solve the "dual-write" problem—the risk that a database update succeeds but the corresponding message publication fails (or vice versa).

ℹ️ **How It Works**

1. **Atomic Transaction**: When a service performs an action (e.g., placing an order), it saves the business data to its primary table and writes an event message to a dedicated Outbox table within the same database transaction.
2. **Message Relay**: A separate background process—either a poller that queries the table or a Change Data Capture (CDC) tool that tails the transaction log—identifies unprocessed messages in the outbox.
3. **Publication**: The relay publishes these messages to a message broker (like Kafka, RabbitMQ, or Azure Service Bus).
4. **Cleanup**: Once the broker acknowledges receipt, the relay marks the message as "sent" or deletes it from the outbox table.

ℹ️ **Key Benefits**

- **Guaranteed Delivery**: Messages are sent if and only if the original database transaction commits, ensuring eventual consistency.
- **No 2PC Required**: It avoids the complexity and performance penalties of Two-Phase Commit (2PC) by using the local database's ACID properties.
- **Resilience**: If the message broker is temporarily down, the outbox acts as a persistent buffer until the connection is restored.

---
<div style="break-after: page;"></div>

## Inbox vs Outbox pattern

| Pattern        | Side     | Primary Goal                                                                                 |
|----------------|----------|----------------------------------------------------------------------------------------------|
| Outbox Pattern | Producer | **Reliable Send**: Ensures an event is published only if the database transaction succeeds.  |
| Inbox Pattern  | Consumer | **Reliable Receive**: Ensures a received event is processed exactly once without duplicates. |

<img src="outbox-inbox-pattern.png" alt="drawing" width="600"/>

---
<div style="break-after: page;"></div>

## Saga pattern

---
<div style="break-after: page;"></div>

## Circuit breaker pattern

---
<div style="break-after: page;"></div>
