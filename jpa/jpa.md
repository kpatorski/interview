[Back to index](../interview.md)

# 🧬 JPA

<!-- TOC -->
* [🧬 JPA](#-jpa)
  * [What is JPA?](#what-is-jpa)
  * [Persistence Context](#persistence-context)
  * [Entity States](#entity-states)
  * [Dirty Checking](#dirty-checking)
  * [Flush vs Commit](#flush-vs-commit)
  * [🕹 Transactions in JPA](#-transactions-in-jpa)
  * [Fetch types](#fetch-types)
    * [🧨 LazyInitializationException](#-lazyinitializationexception)
    * [What Makes Entity “Detached”?](#what-makes-entity-detached)
  * [N+1 Problem](#n1-problem)
  * [Cascading](#cascading)
  * [🔐 Locking](#-locking)
  * [Questions](#questions)
    * [1️⃣ What is Persistence Context?](#1-what-is-persistence-context)
    * [2️⃣ What is Dirty Checking?](#2-what-is-dirty-checking)
    * [3️⃣ Difference Between Flush and Commit](#3-difference-between-flush-and-commit)
    * [4️⃣ What is N+1 Problem?](#4-what-is-n1-problem)
    * [5️⃣ When to Use Fetch Join?](#5-when-to-use-fetch-join)
    * [6️⃣ What Does @Version Do?](#6-what-does-version-do)
    * [7️⃣ Why JPA Not Good for Batch Processing?](#7-why-jpa-not-good-for-batch-processing)
    * [8️⃣ Why EntityManager Not Thread-Safe?](#8-why-entitymanager-not-thread-safe)
<!-- TOC -->

## What is JPA?

JPA (Java Persistence API) is:

> A specification for ORM (Object-Relational Mapping) in Java.

Important:

- JPA <span style='color:hotpink'>**is NOT**</span> an implementation.
- Hibernate **<span style='color:darkseagreen'>is</span>** an implementation.
- EclipseLink **<span style='color:darkseagreen'>is</span>** another implementation.

**JPA** defines:

- annotations
- EntityManager API
- JPQL
- lifecycle rules

---

## Persistence Context

This is the most important concept.

> A first-level cache that tracks entity state and manages synchronization with the database.

It lives inside:

```java
EntityManager
```

🔸 **What it does?**

- Tracks managed entities
- Detects changes (dirty checking)
- Synchronizes changes on flush
- Ensures identity (same entity instance per ID)

Identity guarantee

Inside one persistence context:

```java
User userA = em.find(User.class, 1L);
User userB = em.find(User.class, 1L);
```

`userA == userB` → **<span style='color:darkseagreen'>true</span>**

📌 Same instance.

--- 

## Entity States

Entities can be:

- Transient (new, not managed)
- Managed (inside persistence context)
- Detached (outside context)
- Removed

🔸 **Example**

```java
User user = new User();       // transient
entityManager.persist(user);  // managed
entityManager.detach(user);   // detached
entityManager.remove(user);   // removed
```

---

## Dirty Checking

JPA tracks entity fields.

On flush:

- compares current state with snapshot
- generates UPDATE if changed

📌 You don’t call update explicitly.

**Important**

Dirty checking <span style='color:darkseagreen'>**works only for</span>** `managed entities`  
⚠️ **Detached** entities are **<span style='color:hotpink'>NOT</span>** tracked.

---

## Flush vs Commit

🔸 **Flush:**

- Synchronizes [persistence context](#persistence-context) with DB
- Executes SQL
- Does **<span style='color:hotpink'>NOT</span>** commit 🕹 **transaction**

🔸 **Commit:**

- **<span style='color:darkseagreen'>Ends</span>** 🕹 transaction
- Makes changes permanent

🔸 **Flush happens:**

- before commit
- before JPQL query
- manually via `em.flush()`

--- 

## 🕹 Transactions in JPA

**JPA** **<span style='color:hotpink'>does NOT</span>** manage transactions itself.

In Spring:

```java
@Transactional
```

Binds:

- EntityManager
- Persistence context
- Transaction

--- 

## Fetch types

🔸 **EAGER**

Load immediately.

**Default for:**

– `@ManyToOne`
– `@OneToOne`

🚨 **Danger:**

- hidden joins
- performance explosion

🔸 🥱 **LAZY**

Load when accessed.

**Default for:**

- `@OneToMany`
- `@ManyToMany`

**Example**

```java
@Entity
class User {

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
}
```

With LAZY:

- orders is NOT loaded when User is fetched
- Instead, Hibernate creates a proxy (or collection wrapper)

That proxy knows:

> “If someone accesses me, I must fetch data from DB.”

🚨 **Risk:**

[LazyInitializationException](#-lazyinitializationexception)

### 🧨 LazyInitializationException

LazyInitializationException occurs when:

> Hibernate tries to initialize a lazy association, but there is no active persistence context (session) available to load it from the database.

### What Makes Entity “Detached”?

Entity becomes detached when:

- Transaction ends
- EntityManager closed
- Explicit em.detach()
- Persistence context cleared

After that:

- No lazy loading possible

---

## N+1 Problem

Classic JPA issue.

Query:

```java
List<User> users = repo.findAll();
```

Then:

```java
users.forEach(u -> u.getOrders().size());
```

Produces:

- 1 query for users
- N queries for orders

⚠️ **Total: N+1 queries**

---

## Cascading

```java
@OneToMany(cascade = CascadeType.ALL)
```

Cascade types:

- PERSIST
- MERGE
- REMOVE
- REFRESH
- DETACH
- ALL

Danger:

- accidental massive deletes
- unexpected DB writes

---

## 🔐 Locking

🔸 **Optimistic:**

```java
@Version
```

Prevents lost updates.

🔸 **Pessimistic:**

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
```

Uses DB locks.

---

## Questions

### 1️⃣ What is Persistence Context?

Persistence Context is:

> A first-level cache and identity map that manages entity instances and their lifecycle within a transaction.

It is associated with:

- EntityManager
- usually one transaction (in Spring)

🔸 **What it does**

✅ Keeps track of managed entities  
✅ Ensures identity (one entity instance per DB row per context)  
✅ Performs dirty checking  
✅ Synchronizes changes with DB on flush  

Identity guarantee example
```java
User u1 = em.find(User.class, 1L);
User u2 = em.find(User.class, 1L);
```

`u1 == u2`  -> true

Within one persistence context, the same entity ID maps to the same object instance.

---

### 2️⃣ What is Dirty Checking?

Dirty checking is:

> Automatic detection of changes made to managed entities.

When transaction flushes:

1. JPA compares current state of entity
2. With snapshot taken when it was loaded
3. If different → generates UPDATE SQL

🔸 **Important**

Dirty checking works only for `managed entities`  
Detached entities are not tracked.

---

### 3️⃣ Difference Between Flush and Commit

🔸 **Flush**

- Synchronizes persistence context with DB
- Executes SQL statements
- Does NOT end transaction
- Can happen multiple times

🔸 **Commit**

- Ends transaction
- Makes changes permanent
- Implicitly triggers flush first

🔸 **Example**
```java
em.persist(user);
em.flush();   // SQL executed but still rollback possible
```

```java
transaction.commit(); // finalizes changes
```

---

### 4️⃣ What is N+1 Problem?

N+1 problem happens when:

**1** query loads **N** entities ➡️ **N** additional queries load their associations

Example:

```java
List<User> users = repo.findAll();
users.forEach(u -> u.getOrders().size());
```

🔸 🛠️ **Fix**

☑️ Use fetch join  
☑️ Use DTO projection  
☑️ Use batch fetching  

---

### 5️⃣ When to Use Fetch Join?

Use fetch join when:

✅ You know you will access association  
✅ You want to avoid N+1  
✅ You want single optimized query  

Example:

```sql
SELECT u FROM User u JOIN FETCH u.orders
```

🔸 ⚠️ **Caution**

- Fetch join on large collections → Cartesian explosion
- Multiple fetch joins on collections → illegal

---

### 6️⃣ What Does @Version Do?

`@Version` enables:

> Optimistic locking.

> Optimistic locking ensures consistency without blocking, detecting concurrent modification at commit time. 

Example:

```java
@Version
private Long version;
```

When updating:

```sql
UPDATE user
SET name=?, version=version+1
WHERE id=? AND version=?
```

If version changed:

- **0** rows updated
- `OptimisticLockException` thrown

🔸 **Prevents**

✅ Lost updates

---

### 7️⃣ Why JPA Not Good for Batch Processing?

> JPA is optimized for domain modeling, not high-volume bulk data operations.

Problems:

1️⃣ **Large persistence context**

- memory grows
- dirty checking expensive

2️⃣ **Each entity tracked**

- performance overhead

3️⃣ **Default no batching**

- many individual SQL statements

Correct approach for batch

✅ Use JDBC for large batch  
✅ Use `em.clear()` periodically  
✅ Use batch size config  

---

### 8️⃣ Why EntityManager Not Thread-Safe?

> EntityManager is not thread-safe because it maintains mutable state (persistence context) that assumes single-threaded transactional access.

EntityManager holds:

- Persistence context
- Managed entities
- Transaction state

It assumes:

- single-threaded access

If shared across threads:

- race conditions
- inconsistent state
- data corruption

In Spring

EntityManager is:

- proxied
- bound to transaction
- effectively thread-confined
