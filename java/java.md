[Back to index](../interview.md)

# Java

<!-- TOC -->
* [Java](#java)
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
    * [Executor](#executor)
    * [CallableFuture](#callablefuture)
  * [JIT](#jit)
  * [JRE](#jre)
  * [JDK](#jdk)
  * [Cache implementation](#cache-implementation)
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
2. Convert hash to bucket ℹ️ index
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

🔹 ℹ️ index calculation

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

1. Start from GC roots
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

---

### Executor

---

### CallableFuture

---
<div style="break-after: page;"></div>


## JIT

---
<div style="break-after: page;"></div>

## JRE

---
<div style="break-after: page;"></div>

## JDK

---
<div style="break-after: page;"></div>

## Cache implementation

---
<div style="break-after: page;"></div>