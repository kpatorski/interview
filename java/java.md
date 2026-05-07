[Back to index](../interview.md)

# ♨️ Java

<!-- TOC -->
* [♨️ Java](#-java)
  * [🚰 Streams](#-streams)
    * [Intermediate vs Terminal Operations](#intermediate-vs-terminal-operations)
    * [Evaluation](#evaluation)
    * [Parallel Streams](#parallel-streams)
    * [Stateless vs Stateful Operations](#stateless-vs-stateful-operations)
    * [Collectors](#collectors)
    * [Questions](#questions)
      * [1️⃣ What is lazy evaluation?](#1-what-is-lazy-evaluation-)
      * [2️⃣ Why streams are single-use?](#2-why-streams-are-single-use-)
      * [3️⃣ Difference between `map` and `flatMap`?](#3-difference-between-map-and-flatmap)
      * [4️⃣ Why reduce must be associative?](#4-why-reduce-must-be-associative)
      * [5️⃣ When parallel stream is dangerous?](#5-when-parallel-stream-is-dangerous)
      * [6️⃣ What is Spliterator?](#6-what-is-spliterator)
      * [7️⃣ Why side effects break parallel streams?](#7-why-side-effects-break-parallel-streams)
      * [8️⃣ What’s difference between `forEach` and `forEachOrdered`?](#8-whats-difference-between-foreach-and-foreachordered)
      * [9️⃣ Why `stream().sorted()` is stateful?](#9-why-streamsorted-is-stateful)
  * [🧱 Collections](#-collections)
    * [Core Interfaces Hierarchy](#core-interfaces-hierarchy)
    * [📋 List Implementations](#-list-implementations)
      * [ArrayList](#arraylist)
      * [LinkedList](#linkedlist)
    * [Set Implementations](#set-implementations)
      * [HashSet](#hashset)
      * [TreeSet](#treeset)
    * [Map Implementations](#map-implementations)
      * [HashMap](#hashmap)
      * [LinkedHashMap](#linkedhashmap)
      * [TreeMap](#treemap)
    * [What is a Red-Black Tree?](#what-is-a-red-black-tree)
    * [equals() & hashCode()](#equals--hashcode)
    * [Concurrency Collections](#concurrency-collections)
      * [ConcurrentHashMap](#concurrenthashmap)
      * [CopyOnWriteArrayList](#copyonwritearraylist)
      * [Collections.synchronizedList()](#collectionssynchronizedlist)
    * [Big-O Table Summary](#big-o-table-summary)
    * [Questions](#questions-1)
      * [1️⃣ Why HashMap is not thread-safe?](#1-why-hashmap-is-not-thread-safe)
      * [2️⃣ Why equals/hashCode critical?](#2-why-equalshashcode-critical)
      * [3️⃣ Why ArrayList faster than LinkedList?](#3-why-arraylist-faster-than-linkedlist)
      * [4️⃣ Why HashMap worst-case O(n)?](#4-why-hashmap-worst-case-on)
  * [Record](#record)
    * [Questions](#questions-2)
      * [1️⃣ Can you override equals/hashCode?](#1-can-you-override-equalshashcode)
      * [2️⃣ Are records truly immutable?](#2-are-records-truly-immutable)
  * [Immutability](#immutability)
    * [Why Immutability matters?](#why-immutability-matters)
    * [How to Implement Immutable Class](#how-to-implement-immutable-class)
  * [🧠 Heap vs Stack](#-heap-vs-stack)
    * [📚 Stack — What Is It?](#-stack--what-is-it)
      * [Stack Frames](#stack-frames)
      * [Stack Overflow](#stack-overflow)
    * [🏔️ Heap — What Is It?](#-heap--what-is-it)
      * [Heap OutOfMemoryError](#heap-outofmemoryerror)
    * [Lifetime Differences](#lifetime-differences)
    * [Are Objects Ever on Stack?](#are-objects-ever-on-stack)
    * [Questions](#questions-3)
      * [1️⃣ Where are objects stored?](#1-where-are-objects-stored)
      * [2️⃣ Are primitives always on stack?](#2-are-primitives-always-on-stack)
      * [3️⃣ What causes StackOverflowError?](#3-what-causes-stackoverflowerror)
      * [4️⃣ What causes OutOfMemoryError?](#4-what-causes-outofmemoryerror)
      * [5️⃣ Why is stack thread-safe?](#5-why-is-stack-thread-safe)
  * [♻️ Garbage collector](#-garbage-collector)
    * [What Makes an Object Eligible for GC?](#what-makes-an-object-eligible-for-gc)
    * [GC Roots](#gc-roots)
    * [Generational Hypothesis](#generational-hypothesis)
      * [Minor GC (Young GC)](#minor-gc-young-gc)
      * [Major / Full GC](#major--full-gc)
    * [✋🌍 Stop-The-World (STW)](#-stop-the-world-stw)
    * [GC Algorithms](#gc-algorithms)
    * [G1 GC (Default in modern JVM)](#g1-gc-default-in-modern-jvm)
    * [ZGC & Shenandoah](#zgc--shenandoah)
    * [Memory Leak in Java](#memory-leak-in-java)
    * [🔄 Reference cycle?](#-reference-cycle)
      * [Why cycles are NOT a problem in Java](#why-cycles-are-not-a-problem-in-java)
    * [What Actually Prevents GC?](#what-actually-prevents-gc)
  * [Threading](#threading)
    * [Thread Lifecycle](#thread-lifecycle)
    * [Creating Threads](#creating-threads)
    * [Concurrency vs Parallelism](#concurrency-vs-parallelism)
    * [Synchronization](#synchronization)
    * [Intrinsic Locks (Monitors)](#intrinsic-locks-monitors)
    * [Volatile](#volatile)
    * [Atomic Classes](#atomic-classes)
    * [Executors](#executors)
      * [Thread Pools Types](#thread-pools-types)
    * [Callable](#callable)
    * [Thread vs Core](#thread-vs-core)
    * [Virtual Threads](#virtual-threads)
    * [Questions](#questions-4)
      * [1️⃣ What is happens-before?](#1-what-is-happens-before)
      * [2️⃣ Difference between synchronized and volatile](#2-difference-between-synchronized-and-volatile)
      * [3️⃣ Why use ExecutorService?](#3-why-use-executorservice)
      * [4️⃣ What is safe publication?](#4-what-is-safe-publication)
  * [JDK vs JRE vs JVM](#jdk-vs-jre-vs-jvm)
    * [JVM — Java Virtual Machine](#jvm--java-virtual-machine)
    * [JRE — Java Runtime Environment](#jre--java-runtime-environment)
    * [JDK — Java Development Kit](#jdk--java-development-kit)
  * [JIT](#jit)
    * [Why JIT Exists](#why-jit-exists)
    * [How JIT Works](#how-jit-works)
    * [JIT Optimizations](#jit-optimizations)
    * [Warmup Phase](#warmup-phase)
    * [Questions](#questions-5)
      * [1️⃣ Is Java interpreted or compiled?](#1-is-java-interpreted-or-compiled)
      * [2️⃣ Why Java sometimes faster than C++?](#2-why-java-sometimes-faster-than-c)
      * [3️⃣ Where does JIT store compiled code?](#3-where-does-jit-store-compiled-code)
<!-- TOC -->

## 🚰 Streams

> A declarative pipeline for processing data.

🔸 **Key properties of Streams**

☑️ Lazy  
☑️ Single-use  
☑️ Functional-style  
☑️ Potentially parallel  
☑️ Non-mutating (by design)   

---

### Intermediate vs Terminal Operations

🔸 ⚙️ **Intermediate Operations**

- return a Stream
- are lazy
- build pipeline

Examples:

- filter
- map
- flatMap
- distinct
- sorted
- peek

🔸 ▶️ **Terminal Operations**

- trigger execution
- produce result or side-effect

Examples:

- collect
- forEach
- reduce
- count
- anyMatch
- findFirst

---

### Evaluation

> Nothing happens until a terminal operation runs.

```java
Stream.of(1,2,3)
    .filter(x -> {
        System.out.println(x);
        return x > 1;
    });
``` 

📌 **No output.**

Because:

- no terminal operation
- pipeline not executed

🔸 **How evaluation actually works**

Streams use:

> Vertical processing (per element)

<span style='color:hotpink'>Instead</span> of:
```java
filter all
map all
collect all
```

It <span style='color:darkseagreen'>does</span>:
```java
element1 → filter → map → ...
element2 → filter → map → ...
```

📌 This improves performance and **short-circuiting**.

Operations like:

- `findFirst()`
- `anyMatch()`
- `limit()`

📌 **Can stop early.**

---

### Parallel Streams

```java
list.parallelStream()
```

Streams split data across threads.

**Works well for:**  
☑️ CPU-bound operations  
☑️ Large datasets  
☑️ Stateless operations  

**When NOT to use parallel streams**

❌ IO operations  
❌ Blocking calls  
❌ Shared mutable state  
❌ Small datasets  

---

### Stateless vs Stateful Operations

🔸 **Stateless**

- filter
- map

> Each element processed independently.

🔸 **Stateful**

- sorted
- distinct
- limit (in parallel)

> Require buffering.

---

### Collectors

🔸 **Common collectors**

```java
Collectors.toList()
Collectors.toSet()
Collectors.toMap()
Collectors.groupingBy()
Collectors.partitioningBy()
```

🔸 **Collector components**

A collector consists of:

- supplier
- accumulator
- combiner
- finisher

```java
Collector.of(
    ArrayList::new,
    List::add,
    (left, right) -> { left.addAll(right); return left; }
)
```

```java
stream.reduce(0, Integer::sum);
```

---

### Questions

#### 1️⃣ What is lazy evaluation?  

>Intermediate stream operations are not executed until a terminal operation is invoked.
---

#### 2️⃣ Why streams are single-use?  

Because a stream represents:

> A one-time traversal of a data source.

Once a terminal operation runs:

- the pipeline is consumed
- the stream is closed
- internal state is exhausted
---

#### 3️⃣ Difference between `map` and `flatMap`?
`map`

> Transforms one element into one element.
 
```java
List.of("John", "Jane")
.stream()
.map(String::length)
```

Result:
```java
[4, 4]
```
 
`flatmap`

> Transforms one element into multiple elements, then flattens.

```java
List<List<Integer>> numbers = List.of(
    List.of(1,2),
    List.of(3,4)
);

numbers.stream()
    .flatMap(Collection::stream)
```

Result:
```java
[1,2,3,4]
```

---

#### 4️⃣ Why reduce must be associative?

> Reduce must be associative because parallel execution rearranges grouping of operations ( split data into chunks)

```java
[a, b, c, d]
```

May be processed as:
```java
(a + b) + (c + d)
```

But also:
```java
((a + b) + c) + d
```

📌 **If operation is <span style='color:hotpink'>NOT associative</span> ➡️ results <span style='color:hotpink'>differ</span>.**

| Operator       | Is safe? |
|----------------|----------|
| sum            | ✅        |
| multiplication | ✅        |
| min/max        | ✅        |
| subtraction    | ❌        |
| division       | ❌        |

---

#### 5️⃣ When parallel stream is dangerous?

Parallel streams are dangerous when:

❌ Shared mutable state

```java
List<Integer> result = new ArrayList<>();
list.parallelStream().forEach(result::add);
```

❌ Blocking I/O

```java
ForkJoinPool.commonPool()
```

Blocking calls:

- exhaust pool
- degrade entire app

❌ Small datasets

Overhead > benefit.

❌ Stateful lambdas

```java
int sum = 0;
parallelStream.forEach(x -> sum += x);
```
---

#### 6️⃣ What is Spliterator?

> Spliterator is the internal abstraction that enables efficient traversal and parallel splitting of stream sources.

**It supports:**

- `tryAdvance()` → process one element
- `trySplit()` → divide data into chunks 

**Characteristics**:

- SIZED
- ORDERED
- DISTINCT
- SORTED
- IMMUTABLE

These help optimize stream execution.

---

#### 7️⃣ Why side effects break parallel streams?

> Side effects violate functional assumptions required for safe parallel execution.

🔸 **Parallel execution means:**

- multiple threads
- unpredictable ordering
- no synchronization

```java
parallelStream().forEach(list::add);
```

🔸 **Issues:**

- race conditions
- corrupted state
- inconsistent results

---

#### 8️⃣ What’s difference between `forEach` and `forEachOrdered`?

`forEach`

- does NOT guarantee encounter order
- faster in parallel

`forEachOrdered`

- preserves original stream order
- may reduce parallel performance

---

#### 9️⃣ Why `stream().sorted()` is stateful?

Because sorting requires:

> Seeing ALL elements before producing any output.

📌 `sorted()` is stateful because it requires full buffering of the stream before emitting elements, unlike stateless intermediate operations.

Unlike `filter/map` (stateless per element), sorted must:

- Buffer all elements
- Sort them
- Then emit

🔸 **Why this matters?**

- Requires memory
- Prevents streaming
- Slows parallel pipelines
- Changes performance characteristics

---
<div style="break-after: page;"></div>

## 🧱 Collections

### Core Interfaces Hierarchy

```text
Collection
 ├── List
 ├── Set
 └── Queue
      └── Deque

Map (separate hierarchy)
```

📌 Map is **<span style='color:hotpink'>NOT</span>** a Collection.

---

### 📋 List Implementations

#### ArrayList

🔸 **Structure**

Backed by:

```css
Object[] array
```

🔸 **Complexity**

| Operation     | Complexity     |
|---------------|----------------|
| get(index)    | O(1)           |
| add(end)      | O(1) amortized |
| insert middle | O(n)           |
| remove        | O(n)           |

🔸 **Internal Behavior**

When capacity exceeded:

- array resized
- new larger array created
- elements copied

Growth factor ≈ 1.5x

✅ Great for reads  
✅ Cache-friendly  
❌ Bad for frequent middle inserts  

---

#### LinkedList

🔸 **Structure**

Doubly linked list:

```text
prev ← node → next
```

🔸 **Complexity**

| Operation       | Complexity |
|-----------------|------------|
| get(index)      | O(n)       |
| add/remove head | O(1)       |
| insert middle   | O(n)       |

---

### Set Implementations

#### HashSet

> HashSet is a thin wrapper over HashMap

🔸 **Structure**

Backed by:

```java
HashMap
```

Internally:

- HashSet<E> stores elements as keys in a `HashMap<E, Object>`
- value is a constant dummy object (PRESENT)

📌 So “HashSet buckets” = HashMap buckets.

🔸 **Complexity**

| Operation | Avg  | Worst |
|-----------|------|-------|
| add       | O(1) | O(n)  |
| contains  | O(1) | O(n)  |

🔸 **Important: equals() and hashCode()**

[Contract](#equals--hashcode):

- equal objects → same hashCode
- hashCode must be consistent
- equals must be symmetric, transitive, consistent

If broken:

- lost elements
- impossible retrieval
- duplicates in Set

🔸 **Since Java 8**

Buckets may become:

- linked list → if collisions small
- red-black tree → if many collisions

📌 Improves worst-case to `O(log n)`

---

#### TreeSet

> Always sorted.

🔸 **Structure**

Backed by:

```java
TreeMap (Red-Black Tree)
```

🔸 **Complexity**

`O(log n)`

📌 Requires `Comparable` or `Comparator`  
⚠️ Comparator inconsistent with equals ➡️ strange behavior.

---

### Map Implementations

#### HashMap

🔸 **Structure**

```java
array of buckets
each bucket = linked list or tree
```

🔸 **What is a bucket?**

HashMap stores an array of bins/buckets:

```java
table[0..n-1]
```

Each index points to:

- nothing (`null`)
- a linked list of entries
- a tree of entries (`TreeNode`, `red-black tree`)

🔸 **Why a linked list initially?**

When <span style='color:hotpink'>collisions</span> happen (multiple keys map to same bucket index), `HashMap` chains them.

Before Java 8, collisions always became a linked list:
- worst-case `get()`/`put()` could degrade to `O(n)`

🔸 **Flow:**

The core pipeline for both `get` and `put`

1. Compute #️⃣ hash
2. Convert hash to bucket 💡 index
3. 🚶Traverse bucket (**<span style='color:darkseagreen'>list</span>** or **<span style='color:dodgerblue'>tree</span>**)
4. Compare keys using equals
5. Return or insert/update
6. Resize if needed

🔹 #️⃣ hashing

`HashMap` <span style='color:hotpink'>does not</span> use [hashCode()](#equals--hashcode) directly.  
It mixes bits to reduce poor distribution:

- `h = key.hashCode()`
- `hash = h ^ (h >>> 16)`

Reason: bucket index uses low bits; <span style='color:darkseagreen'>mixing helps spread</span> entropy(randomness).

🔹 💡 index calculation

Index is computed with bitmask (fast) because capacity is power-of-two:
```ini
index = (n - 1) & hash
```

This is why capacity is always a power of 2.

🔹🚶 traverse bin

- If bin is `null` ➡️ insert directly
- If first node matches 🗝️ **key** ➡️ `update/return`
- Else traverse linked <span style='color:darkseagreen'>list</span>:
  - if found key ➡️ update
  - else append new node
- If bin is <span style='color:dodgerblue'>tree</span> ➡️ tree `lookup/insert`

🔹 resize logic

When size exceeds threshold:
```java
threshold = capacity * loadFactor (default 0.75)
```

Resize doubles capacity, and redistributes entries.

🔸 **Important details**

- Initial capacity = 16
- Load factor = 0.75
- Resize doubles capacity
- Rehash occurs

🔸 **Since Java 8**

- Treeify threshold = **8**
- If bucket size > **8** → tree structure

---

#### LinkedHashMap

> Maintains insertion order.

🔸 **Structure**

```java
HashMap
Doubly-linked list across entries
```

🔸 **Used for:**

LRU cache (override removeEldestEntry)

---

#### TreeMap

🔸 **Structure**

```java
Red-black tree.
```


Sorted by key.

🔸 **Complexity**
`O(log n)`

---
<div style="break-after: page;"></div>

### What is a Red-Black Tree?

> A red-black tree is a self-balancing binary search tree that guarantees O(log n).

It maintains balance using color rules:

- Every node is red or black
- Root is black
- No two red nodes adjacent
- Every path from node to leaf has same number of black nodes (black-height)

📌 This prevents the tree from becoming a long chain.

📌 Search is the same as in binary tree but nodes distribution is better.

---
<div style="break-after: page;"></div>

### equals() & hashCode()

🔸 **The contract**

If `a.equals(b)` is **<span style='color:darkseagreen'>true</span>** ➡️ `a.hashCode() == b.hashCode()` must be **<span style='color:darkseagreen'>
true</span>**.

⚠️ But same `hashCode()` <span style='color:hotpink'>**does NOT**</span> imply equals.

🔸 **Why it matters**

[HashMap](#hashmap) uses:

- `hashCode()` → choose bucket
- `equals()` → find exact key in bucket

**⚠️‼️If `hashCode()` changes after insertion ➡️ key becomes “lost”.‼️⚠️**

🔸 **What makes a good `hashCode()`?**

✅ uses immutable fields  
✅ distributes values evenly  
✅ stable over lifetime  

🔸 **Common mistakes**

❌ using random / time in `hashCode()`  
❌ mutable fields  
❌ inconsistent `equals()`  
❌ `equals()` without `hashCode()` override  

---

🔸 **`equals()` rules**

- reflexive
- symmetric
- transitive
- consistent
- `x.equals(null)` is false

🔸 👍 **Best practice for keys**

✅ make key objects immutable  
✅ use record where possible  
✅ base `equals/hashCode` on identity fields only

---
<div style="break-after: page;"></div>

### Concurrency Collections

#### ConcurrentHashMap

> Not synchronized map.

Before Java 8:

❌ segment-based locking

After Java 8:

✅ CAS - Compare-And-Set (atomic primitive)  
✅ synchronized blocks at bucket level  

🔸 **Important**

- `Null` keys **<span style='color:hotpink'>NOT</span>** allowed.
- Thread-safe without full locking.

🔸 **What is CAS?**

CAS = Compare-And-Set (atomic primitive)

Think:

> “Set variable to X only if it is currently Y”

Used for lock-free algorithms.

Example mental model:

- attempt update
- if conflict, retry

🔸 **Example scenario**

- Initial State: The shared variable `V=10`
- **<span style='color:darkseagreen'>Thread A’s</span>** Goal: Increment `V=10` by `10` to `20`
- <span style='color:dodgerblue'>**Thread B’s**</span> Interference: Successfully updates `V=10` to `15` while **<span style='color:darkseagreen'>Thread A</span>** is still calculating.

🔸 **Step-by-Step Execution Table**

| Step              | **<span style='color:darkseagreen'>Thread A</span> (The "Worker")** | **<span style='color:dodgerblue'>Thread B</span> (The "Interrupter")** | Memory Value (`V` | Result for **<span style='color:darkseagreen'>Thread A</span>** |
|-------------------|---------------------------------------------------------------------|------------------------------------------------------------------------|-------------------|-----------------------------------------------------------------|
| 1.   Read         | Reads `10`. Stores it as "Expected Value".                          | -                                                                      | 10                | Success                                                         |
| 2.   Local Work   | Prepares the new value (`20`).                                      | -                                                                      | 10                | Success                                                         |
| 3.   Interference | Busy calculating...                                                 | Performs `CAS(10, 15)`.                                                | 15                | Thread B succeed                                                |
| 4.   The Attempt  | Tries `CAS(10, 20)`.                                                | Done.                                                                  | 15                | FAIL                                                            |
| 5.   Outcome      | Sees that.                                                          | -                                                                      | 15                | No change made                                                  |

🔸 **Behavior Analysis**

1. **Why did it fail?**
   The hardware execution of CAS(Expected, New) is: "Only write New if the current value in memory is exactly Expected."  
   Since <span style='color:dodgerblue'>**Thread B**</span> changed the value to 15, **<span style='color:darkseagreen'>Thread A’s</span>** expected value (10) is now stale. The CPU rejects the write to prevent **<span style='color:darkseagreen'>Thread A</span>** from accidentally deleting the work <span style='color:dodgerblue'>**Thread B**</span> just did.  

2. **Does Thread A repeat the step?**
   Not automatically. CAS is a low-level instruction, not a high-level loop.  
   - If you just call compareAndSet once, it returns false, and the program moves to the next line of code.  
   - To make it "repeat," you must wrap it in a Retry Loop (also called a spin-lock pattern).  

3. **What is the final value?**
   - Without a loop: The value stays `15`. **<span style='color:darkseagreen'>Thread A</span>** fails and gives up.  
   - With a loop (Constant target): **<span style='color:darkseagreen'>Thread A</span>** retries, sees the 15, and finally sets it to `20`.  
   - With a loop (Relative target, e.g. `X+10`): **<span style='color:darkseagreen'>Thread A</span>** retries, sees the `15`, calculates , and sets the final value to `25`.

📌 This avoids global locks for many operations.

🔸 **“Synchronized blocks at bucket level”**

When writing and there is 🤼 contention:

- it synchronizes on the first node of the bin (bucket)
- only that bucket is locked
- other buckets can be updated in parallel

So:

- thread **🤼** locks bucket `5`
- thread B can still modify bucket `9`

This is drastically more scalable than global locking.

---

#### CopyOnWriteArrayList

> Creates a new copy of array on write.

Good for:

✅ many reads  
✅ few writes  

Terrible for:

❌ frequent modifications

---

#### Collections.synchronizedList()

> That approach uses one global lock.

So every operation blocks every other operation ➡️ **<span style='color:hotpink'>poor scalability</span>**.

- Wraps collection.
- Entire collection synchronized.
- Coarse-grained lock.

---

### Big-O Table Summary

| Collection | get  | add      | remove   | contains |
|------------|------|----------|----------|----------|
| ArrayList  | O(1) | O(1)*    | O(n)     | O(n)     |
| LinkedList | O(n) | O(1)     | O(1)*    | O(n)     |
| HashSet    | -    | O(1)     | O(1)     | O(1)     |
| TreeSet    | -    | O(log n) | O(log n) | O(log n) |
| HashMap    | -    | O(1)     | O(1)     | O(1)     |
| TreeMap    | -    | O(log n) | O(log n) | O(log n) |

### Questions

#### 1️⃣ Why HashMap is not thread-safe?

- resize is not atomic
- may cause infinite loops (old versions)
- race conditions

#### 2️⃣ Why equals/hashCode critical?

- HashMap depends on them
- wrong implementation breaks collections

#### 3️⃣ Why ArrayList faster than LinkedList?

- contiguous memory
- CPU cache locality
- fewer object allocations

#### 4️⃣ Why HashMap worst-case O(n)?

If:

- many collisions
- poor hash function

---
<div style="break-after: page;"></div>

## Record

> A special kind of class designed to model immutable data carriers.

🔸 **Are records immutable?**

Mostly — but not fully guaranteed.

🔸 **What <span style='color:darkseagreen'>is guaranteed</span>**:

- fields are private final
- no setters
- no subclassing

🔸 **What is <span style='color:hotpink'>NOT guaranteed</span>:**

If a field is mutable:

```java
record User(List<String> roles) {}
```

```java
user.roles().add("ADMIN");
``` 

### Questions

#### 1️⃣ Can you override equals/hashCode?

> Yes — but rarely needed.

#### 2️⃣ Are records truly immutable?

> No — only shallowly immutable.

---
<div style="break-after: page;"></div>


## Immutability

> Its state cannot change after construction.

Once created:

no field can change

no observable state mutation possible

Example:
```java
String text = "hello";
```

### Why Immutability matters?

🔸 **Thread Safety**

Immutable objects:

- require no synchronization
- are inherently thread-safe

No race conditions.

---

🔸 **Simpler reasoning**

If object cannot change:

- no unexpected side effects
- no hidden mutations
- easier debugging

---

🔸 **Safe sharing**

Immutable objects can be:

- cached
- reused
- safely shared across threads

---

🔸 **Functional programming compatibility**

Streams, lambdas, parallel processing ➡️ require immutability or stateless behavior.

---

### How to Implement Immutable Class

Checklist:

✅ Class is final  
✅ Fields are private and final  
✅ No setters  
✅ Defensive copies for mutable fields  
✅ No method exposes mutable internals  

---
<div style="break-after: page;"></div>

## 🧠 Heap vs Stack

### 📚 Stack — What Is It?

> Each thread has its own stack.

The stack stores:

- method calls
- local variables
- primitive values
- references to objects

🔸 **Example**

```java
public void foo() {
    int x = 10;
    User user = new User("John");
}
```

Stack contains:

- `x = 10`
- reference to `User`

Heap contains:

- `User` object

🔸 **Characteristics**

☑️ Thread-local ➡️ no synchronization needed  
☑️ Fast allocation  
☑️ Automatic cleanup (LIFO)  
☑️ No GC involved  

---

#### Stack Frames

Each method call creates a stack frame:

Frame contains:

- local variables
- operand stack
- reference to previous frame
- return address

```text
main()
 └── foo()
      └── bar()
```
Each call adds frame on top.

---

#### Stack Overflow

Occurs when:

❌ recursion too deep  
❌ stack size exceeded    

---

### 🏔️ Heap — What Is It?

The heap stores:

- all objects
- arrays
- class instances

📌 **Shared** across **all** threads.  
📌 Managed by `Garbage Collector`

Characteristics

☑️ Shared memory ➡️ needs synchronization   
☑️ Larger  
☑️ GC-managed  
☑️ Slower allocation than stack  

---

#### Heap OutOfMemoryError

Occurs when:

❌ too many objects  
❌ memory leak  
❌ large allocations  

---

### Lifetime Differences

📚 Stack:

- lives until method returns
- frame destroyed automatically

🏔️Heap:

- lives until GC collects
- lifetime independent of method

---

### Are Objects Ever on Stack?

> Normally objects are allocated on heap.

But:

> JIT may allocate object on stack if object does not escape method

Example:

```java
public int sum() {
  Point p = new Point(1, 2);
  return p.x + p.y;
}
```

If `p` does not escape:

- JVM may allocate it on stack
- no GC needed

📌 This is optimization.

---

### Questions

#### 1️⃣ Where are objects stored?

> Heap (unless optimized by escape analysis).

#### 2️⃣ Are primitives always on stack?

> Not necessarily. Instance primitives are inside object on heap.

#### 3️⃣ What causes StackOverflowError?

> Deep recursion or large local variables.

#### 4️⃣ What causes OutOfMemoryError?

> Heap exhaustion or memory leak.

#### 5️⃣ Why is stack thread-safe?

> Because each thread has its own stack.

---
<div style="break-after: page;"></div>


## ♻️ Garbage collector

Garbage Collection (GC) is:

> Automatic memory management that reclaims unreachable heap objects.

Important:

- GC manages heap
- GC does NOT manage stack
- GC does NOT free memory immediately

---

### What Makes an Object Eligible for GC?

> An object is collectible when it is no longer reachable from GC Roots.

---

### GC Roots

GC roots include:

- Stack references
- Static fields
- JNI references
- Active threads

If no path exists from a root → object is garbage.

🔸 **Example**
```java
Stack → A → B → C
```

If reference to A disappears:

- A, B, C become eligible

---

### Generational Hypothesis

JVM is based on:

> Most objects die young.

So heap is divided into generations.

```text
+-------------------+
|     Young Gen     |
|  Eden | S0 | S1   |
+-------------------+
|      Old Gen      |
+-------------------+
```

🔸 👶🏻 **Eden**

New objects created here.

🔸 💪 **Survivor Spaces (S0, S1)**

Objects that survive [minor GC](#minor-gc-young-gc) move here.

🔸 👵🏻 **Old Generation**

Long-lived objects promoted here.

---

#### Minor GC (Young GC)

Triggered when:

> 👶🏻 Eden fills up.

Process:

1. [Stop the world](#-stop-the-world-stw)
2. Copy surviving objects to Survivor space
3. Increase age
4. Possibly promote to Old Gen

Minor GC is:  
✅ Fast  
✅ Frequent  

---

#### Major / Full GC

Triggered when:

- 👵🏻 Old Gen fills
- 💾 Memory pressure

Process:

1. Collect entire heap

This is:  
❌ Expensive  
❌ Long pause. 

---

### ✋🌍 Stop-The-World (STW)

Most GC phases:

- pause application threads
- perform collection
- resume threads

Short pauses ➡️ acceptable  
Long pauses ➡️ latency spikes  

--- 

### GC Algorithms

🔸 **Mark-Sweep**

1. Mark reachable objects
2. Sweep unreachable

**Problem:**

- fragmentation

🔸 **Mark-Compact**

1. Mark
2. Compact memory

👍 Prevents fragmentation.

🔸 **Copying Collector**

Used in 👶🏻 Young Gen.

1. Copy live objects
2. Discard rest

👍 **Fast because:**

- 👶🏻 young objects mostly dead

---

### G1 GC (Default in modern JVM)

**G1 = Garbage First**

Divides heap into regions:

```java
[region][region][region][region]
```

Instead of fixed Young/Old separation.

Features:  
✅ Predictable pauses  
✅ Region-based  
✅ Concurrent marking  

Goal:

> Meet pause-time goals

---

### ZGC & Shenandoah

Low-latency collectors.

Characteristics:

- Mostly concurrent
- Pause times < 10ms
- Colored pointers (ZGC)

Used in:

- large heaps
- latency-critical systems

---

### Memory Leak in Java

Java can leak memory if:

- references retained unintentionally
- static collections grow forever
- listeners not removed

📌 GC collects only unreachable objects.

⚠️ Reachable ≠ useful.

---

### 🔄 Reference cycle?

A cycle happens when objects reference each other:
```java
class A { B b; }
class B { A a; }
```

Even if nothing else references A or B, they reference each other.

---

#### Why cycles are NOT a problem in Java

> Java does not use reference counting.

Java uses:

>Reachability analysis from GC roots.

GC algorithm:

1. Start from [GC roots](#gc-roots)
2. Traverse object graph
3. Mark reachable objects
4. Everything else is garbage

If A and B are NOT reachable from any root:
```java
(no roots)
A ↔ B
```
They are collected — even though they reference each other.

🔸 **Example**

```java
public void example() {
    A a = new A();
    B b = new B();
    a.b = b;
    b.a = a;
}
```

When method ends:

- stack reference to a disappears
- no root references
- both A and B eligible
- GC removes both

📌 **Cycle doesn’t matter.**

---

### What Actually Prevents GC?

Only one thing:

> Being reachable from a GC root.

**Cycles** alone do **<span style='color:darkseagreen'>NOT</span>** prevent GC.

But these **<span style='color:hotpink'>do</span>**:

- static references
- ThreadLocals
- active threads
- classloader references
- caches

---
<div style="break-after: page;"></div>


## Threading

> A lightweight unit of execution inside a process.

Each thread has:

- its own stack
- program counter
- registers

But shares:

- heap memory
- static fields
- class metadata

--- 

### Thread Lifecycle

States:

- NEW
- RUNNABLE
- BLOCKED
- WAITING
- TIMED_WAITING
- TERMINATED

🔸 **Typical Flow**

```text
NEW → RUNNABLE → (RUNNING) → TERMINATED
```

Or may enter:

- BLOCKED (waiting for monitor)
- WAITING (`wait()`, `join()`)
- TIMED_WAITING (`sleep()`)

---

### Creating Threads

🔸 **Old way**

```java
new Thread(() -> {
    // work
}).start();
```

🔸 **Runnable**

```java
class MyTask implements Runnable {
    public void run() { }
}
```

🔸 **Callable**

```java
Callable<String> task = () -> "result";
```
Returns value, can throw checked exception.

---

### Concurrency vs Parallelism

Concurrency:

- multiple tasks in progress
- may not run simultaneously

Parallelism:

- tasks running simultaneously on multiple cores

Java threads enable both.

---

### Synchronization

Java provides:
```java
synchronized (lock) {
   // critical section
}
```

Ensures:

- mutual exclusion
- visibility

🔸 **What synchronized really does**

1. Acquires monitor
2. Establishes happens-before relationship
3. Flushes memory
4. Executes block
5. Releases monitor

---

### Intrinsic Locks (Monitors)

Every object has **monitor lock**

`synchronized(this)` uses object’s monitor.

---

### Volatile

Volatile <span style='color:darkseagreen'>**ensures**</span>:

- visibility
- no reordering

But <span style='color:hotpink'>**NOT**</span>:

- atomicity

Example:
```java
volatile boolean running = true;
```

Good for flags.  
Bad for counters.

---

### Atomic Classes

From `java.util.concurrent.atomic`

Examples:

- AtomicInteger
- AtomicLong

Use CAS internally.

---

### Executors

> Do NOT create raw threads in production.
 
Use:
```java
ExecutorService executor =
    Executors.newFixedThreadPool(4);
```

Benefits:

- thread reuse
- lifecycle management
- task abstraction

#### Thread Pools Types

🔸 **FixedThreadPool**

> It creates a set number of threads and keeps them active. If all threads are busy, new tasks wait in a queue.

```java
Executors.newFixedThreadPool(n);
```
- Fixed number of threads
- Unbounded queue

✅ **Good for:**  
- CPU-bound tasks  

❌ **Risk:**  
- queue grows unbounded → OOM  

---

🔸 **CachedThreadPool**

> It creates new threads as needed. It uses a SynchronousQueue, which means it doesn't "hold" tasks—it immediately hands them to a thread. If no thread is available, it spawns a new one.

```java
Executors.newCachedThreadPool();
```

- Unlimited threads
- No queue
- Reuses idle threads

✅ **Good for:**
- CPU-bound tasks

❌ **Risk:**
- thread explosion

---

🔸 **SingleThreadExecutor**

One thread only.
Tasks executed sequentially.

✅ **Good for:**

- ordering
- event processing

---

🔸 **ScheduledThreadPool**

A `ScheduledThreadPool` runs tasks:

- after a delay (schedule)
- periodically (scheduleAtFixedRate, scheduleWithFixedDelay)

It’s built on `ScheduledExecutorService`.

```java
scheduleAtFixedRate(...);
scheduleWithFixedDelay(...);
```

✅ **Good for:**

- Periodic housekeeping: refresh caches, cleanup temp files, rotate tokens
- Polling / health checks / “pull” integrations
- Time-based workflows (simple)
- Debounced / delayed actions (one-shot scheduling)

👍 **Rule of thumb: “run something later” or “run something every X”.**

🔸 **Use it when:**

- tasks are short
- scheduling frequency is predictable
- you don’t need distributed guarantees (single JVM is enough)

🔸 **Examples:**

- every minute: refresh exchange rates
- every 10 seconds: drain a buffer to DB
- at startup + periodic: warm up caches

---

🔸 **ForkJoinPool**

ForkJoinPool is a thread pool optimized for:

> many small tasks that can be recursively split (divide-and-conquer)

It uses work-stealing:

- each worker has a deque
- idle workers steal tasks from others

✅ **Good for:**

- CPU-bound parallel computations
- Divide-and-conquer problems (recursive splitting)
- Bulk array processing
- Stream-style parallelism (it’s behind parallelStream())

🔸 **Examples:**

- parallel sum, histogram, map-reduce on arrays
- recursive file indexing (CPU-heavy parsing)
- splitting large tasks into smaller chunks

🔸 **When to use**

Use ForkJoinPool when:

- work is CPU-bound
- tasks can be broken into independent chunks
- each chunk is small enough to benefit from stealing
- minimal blocking / IO

---

### Callable

🔸 **Runnable vs Callable**

| Feature                  | Runnable | Callable |
|--------------------------|----------|----------|
| Returns value            | ❌        | ✅        |
| Throws checked exception | ❌        | ✅        |

🔸 **Callable**

```java
Callable<String> task = () -> {
    return "result";
};
```

Used with:

- ExecutorService
- Future

🔸 **Future**

```java
Future<String> future = executor.submit(task);
future.get();
```

Future:

- blocks
- can cancel
- can check status

---

### Thread vs Core

`Thread`:

- logical execution unit
- managed by OS/JVM

`Core`:

- physical CPU execution unit

🔸 **You can have:**

- more threads than cores
- OS schedules threads onto cores

🔸 **Example:**
- 8 cores
- 100 threads

Threads are time-sliced.

---

### Virtual Threads

Virtual threads are:

> Lightweight threads managed by the JVM instead of OS.

📌 Introduced in Java **21** (stable).

🔸 **Traditional threads**

- 1:1 mapping to OS threads
- heavy (MB stack)
- expensive context switching

🔸 **Virtual threads**

- thousands/millions possible
- tiny memory footprint
- scheduled by JVM
- block without blocking OS thread

🔸 **Example**
```java
Thread.startVirtualThread(() -> {
    // code
});
```

🔸 **Why important?**

✅ Enables simple blocking code  
✅ Scales like async frameworks  
✅ No thread explosion  

---

### Questions

#### 1️⃣ What is happens-before?

**Happens-before** is a rule in the Java Memory Model that guarantees:

> If A happens-before B, then all memory writes by A are visible to B.

It defines visibility and ordering guarantees between threads.

---

#### 2️⃣ Difference between synchronized and volatile

| Feature               | synchronized | volatile |
|-----------------------|--------------|----------|
| Mutual exclusion      | ✅            | ❌        |
| Visibility            | ✅            | ✅        |
| Atomicity             | ✅            | ❌        |
| Blocks threads        | ✅            | ❌        |
| Reordering prevention | ✅            | ✅        |

🔸 **synchronized**

- Provides mutual exclusion (one thread at a time)
- Provides visibility guarantees
- Establishes happens-before

🔸 **volatile**

- Guarantees visibility
- Prevents reordering
- Does NOT guarantee atomic operations

---

#### 3️⃣ Why use ExecutorService?

`ExecutorService` provides:

✅ Thread reuse  
✅ Controlled concurrency  
✅ Task abstraction  
✅ Graceful shutdown  
✅ Resource management  

Without it:

❌ too many threads  
❌ memory exhaustion  
❌ poor performance  

---

#### 4️⃣ What is safe publication?

Safe publication ensures:

> An object is made visible to other threads with fully constructed state.

---
<div style="break-after: page;"></div>


## JDK vs JRE vs JVM

🔸 **Hierarchy**
```java
JDK
 └── JRE
      └── JVM
```

---

### JVM — Java Virtual Machine

The JVM is:

> The runtime engine that executes Java bytecode.

🔸 **Responsibilities:**

✅ Load classes  
✅ Verify bytecode  
✅ Manage memory  
✅ Execute bytecode  
✅ Garbage collection  
✅ JIT compilation  

It does **<span style='color:hotpink'>NOT</span>**:

❌ compile Java source code  
❌ include developer tools  

---

### JRE — Java Runtime Environment

The JRE is:

> JVM + standard libraries.

🔸 **Contains:**

- JVM
- Java class libraries
- Supporting files

It **<span style='color:darkseagreen'>is used</span>** to:

✅ run Java applications. 

It does **<span style='color:hotpink'>NOT</span>** include:

❌ javac  
❌ javadoc  
❌ debugging tools  

🔸 📌 **Note:**  
Since Java **11**, Oracle no longer ships standalone JRE separately — JDK contains everything.

---

### JDK — Java Development Kit

The JDK is:

> JRE + development tools.

🔸 **Includes:**

- javac (compiler)
- javadoc
- jar
- jlink
- jdb
- JVM
- standard libraries

🔸 **Used to:**

✅ compile  
✅ build  
✅ debug  
✅ package  

---
<div style="break-after: page;"></div>

## JIT

> JIT = Just-In-Time Compiler.

JIT is part of [JVM](#jdk-vs-jre-vs-jvm)

```java
.java → (javac) → .class (bytecode)
.bytecode → (JVM) → interpreted
frequently used code → JIT → native machine code
```

---

### Why JIT Exists

Java is platform-independent:

- source compiled to bytecode
- bytecode executed by JVM

⚠️ But interpretation is slow.  
**JIT** compiles **hot** methods to <span style='color:dodgerblue'>native</span> code at <span style='color:darkseagreen'>
runtime</span>.

---

### How JIT Works

JVM initially:

- interprets bytecode

It 👀 monitors :

- method call frequency
- loop execution count

If method becomes 🔥 "<span style='color:hotpink'>**hot**</span>":

- JIT compiles to native machine code
- **future** calls use **<span style='color:darkseagreen'>optimized</span>** version

---

### JIT Optimizations

JIT performs:

✅ Method inlining  
✅ Dead code elimination  
✅ Loop unrolling  
✅ Escape analysis  
✅ Scalar replacement  
✅ Lock elision  
✅ Constant folding  

---

### Warmup Phase

Java apps often:

- start slower
- speed up after warmup

Because JIT needs:

- profiling data
- execution count

This is important in:

- benchmarks
- microservices cold starts

---

### Questions

#### 1️⃣ Is Java interpreted or compiled?

> Both.

- Source → compiled to bytecode
- Bytecode → interpreted + JIT compiled

#### 2️⃣ Why Java sometimes faster than C++?

Because:

- runtime profiling
- dynamic optimization
- speculative inlining

#### 3️⃣ Where does JIT store compiled code?

> In Code Cache (separate memory region)

---
<div style="break-after: page;"></div>
