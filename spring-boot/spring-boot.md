[Back to index](../interview.md)

# 🍃 Spring Boot

<!-- TOC -->
* [🍃 Spring Boot](#-spring-boot)
  * [ℹ️ IoC - Inversion of Control](#ℹ-ioc---inversion-of-control)
  * [ℹ️ Proxy](#ℹ-proxy)
    * [Two types of proxies](#two-types-of-proxies)
    * [When proxies DO NOT work](#when-proxies-do-not-work)
  * [ℹ️ AOP — Aspect-Oriented Programming](#ℹ-aop--aspect-oriented-programming)
  * [ℹ️ Transactions](#ℹ-transactions)
    * [@Transactional](#transactional)
    * [Propagation](#propagation)
    * [Isolation](#isolation)
    * [Rollback](#rollback)
    * [Thread boundaries](#thread-boundaries)
  * [ℹ️ Beans](#ℹ-beans)
<!-- TOC -->

## ℹ️ IoC - Inversion of Control

> Your application does not build itself. The container builds it.

🔸 **What really happens**

Spring:
1. Scans classes
2. Builds a dependency graph
3. Instantiates beans
4. Resolves constructor arguments
5. Applies post-processors
6. Wraps with proxies (if needed)

> You do NOT control object lifecycle — Spring does.

- Constructor injection is preferred (immutability, testability).
- Field injection is discouraged (hard to test, reflection-based).
- Circular dependency resolution only works with setter injection.
- Bean creation happens at container startup (unless lazy).

---
<div style="break-after: page;"></div>

## ℹ️ Proxy

> An object that wraps another object and intercepts method calls.

Spring uses proxies for:

- @Transactional
- @Async
- @Cacheable
- AOP
- Security

### Two types of proxies

| Type	             | When used                     |
|-------------------|-------------------------------|
| JDK Dynamic Proxy | 	If bean implements interface |
| CGLIB             | If no interface               |

> 📌 CGLIB creates subclass at runtime.
 
### When proxies DO NOT work

❌ Calling method internally:  

```java
this.save();  // bypass proxy
```

❌ Private methods  
❌ Final methods (CGLIB cannot override).  
❌ Static methods  
❌ Bean not managed by Spring   
❌ Calling method before proxy is initialized   

---
<div style="break-after: page;"></div>

## ℹ️ AOP — Aspect-Oriented Programming

🔸 **What is AOP?**

> Separating cross-cutting concerns from business logic.

Examples:

- Logging
- Security
- Transactions
- Monitoring 

🔸 **Spring AOP works:**

✅ only on **<span style='color:darkseagreen'>public</span>** methods  
✅ only on Spring beans  
✅ via proxies  
✅ only at runtime  

🔸 **It does NOT:**

❌ modify bytecode (unless using AspectJ)  
❌ intercept constructors  
❌ intercept private methods  

🔸 **Core concepts**

| Term       | Meaning              |
|------------|----------------------|
| Aspect     | cross-cutting logic  |
| Advice     | what runs            |
| Join point | method execution     |
| Pointcut   | where advice applies |
| Weaving    | applying proxy       |

**Example:**

```java
@Around("execution(* com.app.service.*.*(..))")
```

---
<div style="break-after: page;"></div>

## ℹ️ Transactions

Spring transaction management is:

- declarative
- proxy-based
- thread-bound

--- 

### @Transactional

🔸 **Self-invocation problem**

`@Transactional` method calling another transactional method in same class ➡️ second one ignored.

Solution:

- split into another bean
- use self-injection

🔸 **@TransactionalEventListener** 

`@TransactionalEventListener` runs:

- `AFTER_COMMIT`
- `BEFORE_COMMIT`
- `AFTER_ROLLBACK`

---

### Propagation

Defines:

> What happens if a transactional method calls another transactional method.

🔸 **Most important propagation types**

| Type                                                       | Behavior                                                                    | Important                                                                                                                                                  |
|------------------------------------------------------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| REQUIRED (<span style='color:darkseagreen'>default</span>) | Join existing or create new                                                 |                                                                                                                                                            |
| REQUIRES_NEW                                               | Suspend current, create completely new one                                  | If **outer** transaction **<span style='color:hotpink'>fails</span>**, **inner** committed one **<span style='color:darkseagreen'>stays</span>** committed |
| SUPPORTS                                                   | If transaction exists ➡️ join. If not ➡️ run non-transactionally            | Used for read-only operations                                                                                                                              |
| MANDATORY                                                  | **<span style='color:hotpink'>Must</span>** run inside existing transaction | If <span style='color:hotpink'>**none exists**</span> ➡️ throws `IllegalTransactionStateException`                                                         |
| NEVER                                                      | Must **<span style='colorhotpink'>NOT run</span>** inside transaction.      | If transaction **<span style='color:hotpink'>exists</span>** ➡️ exception thrown                                                                           |
| NESTED                                                     | Savepoint (DB-dependent)                                                    | If inner fails:<br> - rollback to savepoint<br> - outer can continue                                                                                       |

---

### Isolation

> Isolation controls visibility between transactions.

🔸 **Dirty Read**

1. Transaction **<span style='color:darkseagreen'>A</span>** writes but doesn’t commit.
2. Transaction **<span style='color:dodgerblue'>B</span>** reads it.

‼️ If **<span style='color:darkseagreen'>A</span>** rolls back → **<span style='color:dodgerblue'>B</span>** saw data that never existed.

**Prevented by:**

`READ_COMMITTED+`

---

🔸 **Non-repeatable Read**

1. Transaction **<span style='color:darkseagreen'>A</span>** reads row.
2. Transaction **<span style='color:dodgerblue'>B</span>** updates + commits.
3. Transaction **<span style='color:darkseagreen'>A</span>** reads again → sees different value.

**Prevented by:**

`REPEATABLE_READ+`

---

🔸 **Phantom Read**

Transaction **<span style='color:darkseagreen'>A</span>**:

```sql
SELECT * WHERE price > 100
```

1. Transaction **<span style='color:dodgerblue'>B</span>** inserts new matching row.
2. Transaction **<span style='color:darkseagreen'>A</span>** runs same query → sees extra row.

Prevented by:

`SERIALIZABLE`

---

🔸 **Lost Update**

Two transactions:

- read same value
- update independently
- last write wins

Prevented by:

- optimistic locking
- proper isolation
- SELECT FOR UPDATE

---

### Rollback

By default:

✅ RuntimeException ➡️ rollback  
❌ Checked Exception ➡️ NO rollback  

**When rollback** <span style='color:hotpink'>DOES NOT</span> **happen**

1️⃣ Exception caught and swallowed  
2️⃣ Exception not propagated  
3️⃣ Checked exception not configured  
4️⃣ Method not called through proxy  
5️⃣ Method not public  
6️⃣ Different thread (@Async)  

**Example trap**

```java
try {
   service.save();
} catch (Exception e) {
   log.error("oops");
}
```
⚠️ **Transaction commits.**

To fix

```java
@Transactional(rollbackFor = Exception.class)
```
---

### Thread boundaries

Transactions **<span style='color:darkseagreen'>are</span>**:

- bound to ThreadLocal

They **<span style='color:hotpink'>DO NOT</span>**:

- cross threads
- propagate to `@Async`
- propagate to new executors

---
<div style="break-after: page;"></div>

## ℹ️ Beans

| Scope                 | Important                                                                                                                                                                                                                 |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Singleton scope**   | One per container. NOT thread-safe by default (it’s one object **<span style='color:hotpink'>shared</span>** by many threads).<br> Injecting prototype into singleton ➡️ prototype created only once (at injection time). |
| **Protoype scope**    | New instance every time injected. ⚠️ Container does not manage lifecycle after creation. <br> How to correctly get a fresh prototype: <br>- ObjectProvider<T> / Provider<T> <br>- ObjectFactory<T> <br>- @Lookup <br>     |
| **Request scope**     | One per HTTP request. Only works in web context. It is request-scoped context holders (not recommended for business state)                                                                                                |
| **Session scope**     | One bean instance per HTTP session (per user session). session-specific state (legacy apps)                                                                                                                               |
| **Application scope** | One bean per ServletContext. <br> Difference vs singleton<br>- singleton = per Spring container<br>- application = per servlet context (practically often similar, but not always)<br>                                    |
| **Websocket scope**   | One bean per WebSocket session (per-WS-connection state)                                                                                                                                                                  |
