# ⚛️ React — Comprehensive Study Notes

<!-- TOC -->
* [⚛️ React — Comprehensive Study Notes](#-react--comprehensive-study-notes)
  * [TL;DR](#tldr)
  * [Why React Exists — The Problem It Solves](#why-react-exists--the-problem-it-solves)
  * [Analogy — The Whiteboard](#analogy--the-whiteboard)
  * [Setup — First Steps](#setup--first-steps)
  * [Core Concepts — Step by Step](#core-concepts--step-by-step)
    * [1. Components & JSX](#1-components--jsx)
    * [2. Props vs State](#2-props-vs-state)
    * [3. useState — remembering values](#3-usestate--remembering-values)
    * [4. useReducer — state with logic](#4-usereducer--state-with-logic)
    * [5. useEffect — synchronizing with the outside world](#5-useeffect--synchronizing-with-the-outside-world)
    * [6. Context API — global data without drilling](#6-context-api--global-data-without-drilling)
    * [7. useRef — a box that doesn't ring the bell](#7-useref--a-box-that-doesnt-ring-the-bell)
    * [8. Lists & Keys](#8-lists--keys)
    * [9. Forms — Controlled vs Uncontrolled](#9-forms--controlled-vs-uncontrolled)
    * [10. TypeScript with React](#10-typescript-with-react)
    * [11. Higher-Order Components & Render Props (Legacy)](#11-higher-order-components--render-props-legacy)
    * [12. Custom Hooks](#12-custom-hooks)
    * [13. Reconciliation & Fiber](#13-reconciliation--fiber)
    * [14. Performance Optimization](#14-performance-optimization)
    * [15. Code Splitting & Suspense](#15-code-splitting--suspense)
    * [16. Error Boundaries](#16-error-boundaries)
    * [17. React Server Components (RSC)](#17-react-server-components-rsc)
    * [18. Concurrent Features (React 18)](#18-concurrent-features-react-18)
    * [19. State Management Decision Guide](#19-state-management-decision-guide)
    * [20. Testing — React Testing Library](#20-testing--react-testing-library)
    * [21. useLayoutEffect vs useEffect](#21-uselayouteffect-vs-useeffect)
  * [Mental Model — React's Data Flow](#mental-model--reacts-data-flow)
  * [What to Build — Crash Course Path](#what-to-build--crash-course-path)
  * [Official Tutorials & Resources](#official-tutorials--resources)
  * [Glossary](#glossary)
<!-- TOC -->

---

## TL;DR

React is a JavaScript **library** for building user interfaces, created by Meta (2013). It handles the **view layer only** — you choose your own tools for routing, state, and data fetching. This is the opposite of Angular (a full framework that decides everything for you).

React's core bet: describe **what** the UI should look like for a given state, not **how** to update it step by step. You write a function that says "given this data, the screen looks like this" — and React figures out the minimum DOM changes needed when data changes.

Two ideas underpin everything:
- **Declarative UI** — describe the result, not the mutations
- **Unidirectional data flow** — data goes down (via props), events go up (via callbacks)

Since React 16.8 (2019), function components with hooks are the standard. Class components are legacy.

---

## Why React Exists — The Problem It Solves

Before React, updating the UI meant manually finding and changing DOM elements:

```javascript
// Old way — imperative, error-prone
document.getElementById('username').textContent = user.name;
document.getElementById('avatar').src = user.avatarUrl;
document.getElementById('cart-count').textContent = cart.items.length;
// ...and 50 more places that depend on this data
```

The problem: as your app grows, keeping the UI in sync with your data becomes a full-time job. You have to remember every DOM element that depends on a piece of data and update each one manually. You forget one → bug. You update them in the wrong order → bug.

React's insight: what if you just described the **whole screen** as a function of your data, and let the computer figure out what changed?

```jsx
// React way — declarative
function UserCard({ user, cart }) {
  return (
    <div>
      <span>{user.name}</span>
      <img src={user.avatarUrl} />
      <span>{cart.items.length} items</span>
    </div>
  );
}
// Change the data → React re-runs the function → compares to previous output → updates only what changed
```

This is why React exists. Everything else (hooks, virtual DOM, reconciliation) is implementation details of this one idea.

---

## Analogy — The Whiteboard

**Imperative DOM manipulation (vanilla JS)** is like drawing on a whiteboard by hand — when something changes, you walk up, erase the specific parts that changed, and redraw them. Fast, but you have to track exactly what changed and where.

**React** is like taking a photo of what the whiteboard *should* look like right now, comparing it to the previous photo, and only erasing/redrawing the pixels that differ. You don't think about mutations; you think about the complete picture.

The "photo" is the Virtual DOM — a cheap JavaScript object tree. Comparing two photos is fast; the real DOM updates are minimal and targeted.

**Component as a Lego brick:** each component is a self-contained brick with a fixed interface. Props are the color and size you specify when you place the brick. Bricks can contain other bricks. The app is a Lego castle built from reusable pieces.

---

## Setup — First Steps

**🧑‍💻 middle** — Create a new React + TypeScript project:

```bash
# Vite (recommended — fast, modern)
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev    # opens http://localhost:5173

# Or: Next.js (full-stack, SSR, file-based routing)
npx create-next-app@latest my-app --typescript
```

**Project structure (Vite):**
```
my-app/
├── src/
│   ├── main.tsx          # entry point — mounts <App /> into #root
│   ├── App.tsx           # root component
│   ├── components/       # reusable components
│   └── assets/
├── index.html            # shell — one <div id="root">
├── vite.config.ts
└── package.json
```

**Everything you do in React:**
1. Create a `.tsx` file with a function that returns JSX
2. Import and use it in another component or App.tsx
3. Pass data via props, manage local state with hooks

---

## Core Concepts — Step by Step

### 1. Components & JSX

**🧑‍💻 middle** — A **component** is just a function that returns a description of what the UI should look like. That description is written in **JSX** — a syntax that looks like HTML but lives inside JavaScript.

**Why JSX and not HTML?** Because the HTML template and the logic that drives it (data, events, conditions) need to be in the same place. Putting them together means the component is self-contained — you don't have to jump between a template file and a controller file.

```jsx
// A component is a function. Its name starts with uppercase.
function Greeting({ name, color = 'black' }) {
  return (
    <h1 style={{ color }}>         {/* JSX, not HTML */}
      Hello, {name}!                {/* {} = run JavaScript expression */}
    </h1>
  );
}

// Use it like an HTML element:
<Greeting name="Alice" color="navy" />
```

JSX compiles to plain JavaScript (no magic at runtime):
```js
// What the compiler actually produces:
React.createElement('h1', { style: { color } }, 'Hello, ', name, '!')
```

**JSX gotchas for people used to HTML:**

| HTML | JSX | Why |
|------|-----|-----|
| `class="btn"` | `className="btn"` | `class` is a reserved JS keyword |
| `for="email"` | `htmlFor="email"` | same reason |
| `<input>` | `<input />` | JSX requires self-closing |
| `onclick="fn()"` | `onClick={fn}` | camelCase events, pass function reference |
| comments `<!-- -->` | `{/* */}` | JS comment syntax inside `{}` |

**Rendering conditions and lists:**
```jsx
function ProductCard({ product, isOnSale }) {
  return (
    <div>
      <h2>{product.name}</h2>
      {isOnSale && <span className="badge">SALE</span>}   {/* conditional */}
      {product.price > 100
        ? <span>Free shipping!</span>
        : <span>+ shipping</span>}                          {/* ternary */}
    </div>
  );
}
```

---

### 2. Props vs State

**🧑‍💻 middle** — Think of a component like an employee.

**Props** are the job description and materials given by the manager (parent component). The employee can use them but can't change them — they're not theirs to own.

**State** is the employee's own notepad — their personal working memory that they control. When they erase and rewrite something on their notepad, their work output changes.

```jsx
// Props: data flows in from outside — read only
function ProductCard({ name, price, onAddToCart }) {
  return (
    <div>
      <h2>{name} — {price} zł</h2>
      <button onClick={() => onAddToCart(name)}>Add to cart</button>
    </div>
  );
}

// State: data owned by this component
function ShoppingCart() {
  const [items, setItems] = useState([]);  // own notepad

  const addItem = (name) => setItems(prev => [...prev, name]);

  return (
    <div>
      <p>Cart: {items.length} items</p>
      <ProductCard name="Laptop" price={3999} onAddToCart={addItem} />
    </div>
  );
}
```

**Data flows DOWN** (parent → child via props). **Events flow UP** (child → parent via callback props). Never the other way — this unidirectionality makes bugs traceable.

**Lift state up:** when two sibling components need the same data, move the state to their common ancestor and pass it down to both.

---

### 3. useState — remembering values

**🧑‍💻 middle** — **Why can't we just use a regular variable?**

```jsx
// ❌ This DOES NOT work — React doesn't know the variable changed
function Counter() {
  let count = 0;
  return <button onClick={() => count++}>{count}</button>;
  // count++ changes the variable but React never re-renders
  // Also: every render call resets count to 0
}
```

A regular variable has two problems: React doesn't know when it changes (so it won't re-render), and it gets reset to its initial value on every render call.

`useState` solves both: it stores the value **outside** the component (in React's internal memory), and calling the setter **notifies React** to re-render.

```jsx
// ✅ useState: value survives renders, setter triggers re-render
function Counter() {
  const [count, setCount] = useState(0); // [currentValue, setter]
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Think of useState as:** a special notepad stored in React's locker (not in the component function). The function reads from the locker on each render; calling the setter writes to the locker and rings a bell for React to call the function again.

```jsx
const [value, setValue] = useState(initialValue);

// Object state — ALWAYS create a new object (never mutate directly)
const [user, setUser] = useState({ name: 'Alice', age: 30 });
setUser(prev => ({ ...prev, age: 31 }));   // ✅ new object
user.age = 31; setUser(user);               // ❌ same reference, no re-render

// Lazy initializer — if computing initial value is expensive, pass a function
// (called only once, not on every render)
const [filters, setFilters] = useState(() =>
  JSON.parse(localStorage.getItem('filters') ?? '{}')
);

// Functional update — use when new state depends on previous
setCount(c => c + 1);   // ✅ safe, always uses latest value
setCount(count + 1);    // ⚠️ stale in batched/async updates
```

**React 18 batches state updates** — multiple `setState` calls inside one event handler result in ONE re-render, not multiple.

---

### 4. useReducer — state with logic

**🧑‍💻 middle** — `useReducer` is `useState`'s bigger sibling. Use it when your state has **multiple sub-values** or when **next state depends on previous state in complex ways**.

**Analogy:** instead of calling the manager (setter) directly every time, you send a labeled message (action) to a central dispatch office. The dispatch office (reducer) reads the message, looks at the current state, and decides what the new state is. All state transition logic lives in one place.

```jsx
// Define all possible state changes in one pure function
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'CLEAR':
      return { items: [], total: 0 };
    default:
      return state;
  }
}

function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', item: { id: 1, name: 'Book' } })}>
        Add Book
      </button>
      <button onClick={() => dispatch({ type: 'CLEAR' })}>
        Clear cart
      </button>
      <p>{cart.items.length} items</p>
    </div>
  );
}
```

**When useReducer vs useState:**

| Scenario | Use |
|----------|-----|
| Single simple value (counter, boolean, string) | `useState` |
| Multiple values that change together | `useReducer` |
| Next state depends on previous in multiple ways | `useReducer` |
| Want all state logic in one testable function | `useReducer` |
| Complex form with many fields + validation | `useReducer` (or React Hook Form) |

**🧙‍♂️ senior** — `useReducer` + Context is a lightweight Redux-like pattern for medium complexity:
```tsx
const CartContext = createContext<{ cart: CartState; dispatch: Dispatch<CartAction> } | null>(null);

function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });
  return <CartContext.Provider value={{ cart, dispatch }}>{children}</CartContext.Provider>;
}
```

---

### 5. useEffect — synchronizing with the outside world

**🧑‍💻 middle** — A "side effect" is anything your component does **besides returning JSX**. Fetching data, subscribing to events, setting a document title, reading from localStorage — these are side effects. They happen *outside* of React's control.

**The mental model:** `useEffect` is not "code that runs after render." It's a declaration that says: **"keep this external thing synchronized with my current state/props."**

Analogy: you've decorated your apartment (rendered the JSX). Now you need to set things up in the outside world — call the electricity company when you move in, cancel the subscription when you move out. `useEffect` is how you make those calls.

```jsx
// "Keep the document title in sync with the count"
useEffect(() => {
  document.title = `${count} notifications`;
}, [count]);  // re-run when count changes

// "Load user data when this component appears (and cleanup if it disappears)"
useEffect(() => {
  const controller = new AbortController();

  fetchUser(userId, { signal: controller.signal })
    .then(data => setUser(data))
    .catch(err => { if (err.name !== 'AbortError') setError(err); });

  return () => controller.abort();  // cleanup: cancel in-flight request
}, [userId]);  // re-run when userId changes

// "Run once when component mounts"
useEffect(() => {
  analytics.pageView('/home');
}, []);  // empty array = run only on mount, cleanup on unmount
```

**The dependency array is a contract:**
- `[a, b]` — re-run when `a` or `b` changes
- `[]` — run once on mount, cleanup on unmount
- *(omitted)* — run after every render (rarely what you want)

**Common traps:**
```jsx
// ❌ Infinite loop: effect sets state that's in dependencies
useEffect(() => {
  setCount(count + 1);  // count changes → effect re-runs → count changes → ...
}, [count]);

// ❌ Stale closure: missing dependency means reading old value
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000); // always logs initial count
  return () => clearInterval(id);
}, []); // count is missing from deps

// ✅ Use functional update to avoid needing count in deps
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000); // always uses latest
  return () => clearInterval(id);
}, []); // no stale closure
```

Install and use ESLint plugin `eslint-plugin-react-hooks` — it catches 90% of these mistakes automatically.

---

### 6. Context API — global data without drilling

**🧑‍💻 middle** — **Prop drilling** is the pain of passing the same prop through 5 layers of components just because a deeply nested component needs it. Context solves this by broadcasting a value to all descendants without passing it through each layer.

**Analogy:** prop drilling is like a relay race where each runner must hold the baton just to pass it to the next. Context is a public address system — you say something once at the top floor, and everyone in the building hears it.

```jsx
// 1. Create context (the "channel")
const ThemeContext = createContext<'light' | 'dark'>('light');
const AuthContext = createContext<User | null>(null);

// 2. Provide values at the top of the tree
function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={user}>
        <Router />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

// 3. Consume anywhere in the tree — no props needed
function UserMenu() {
  const user = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  if (!user) return <LoginButton />;
  return <div className={`menu menu--${theme}`}>{user.name}</div>;
}
```

**When to use:** rarely-changing global data — theme, locale, auth user, feature flags, router.

**🧙‍♂️ senior — When NOT to use:** frequently-changing state. Every context value change triggers a re-render in **all** consumers — even those that only use a different part of the value. This is a common performance trap.

```jsx
// ❌ Bad: cart changes on every add/remove → re-renders EVERYTHING consuming CartContext
<CartContext.Provider value={{ items, total, addItem, removeItem }}>

// ✅ Better: split into data context + dispatch context
<CartStateContext.Provider value={{ items, total }}>   {/* rarely subscribed together */}
  <CartDispatchContext.Provider value={{ addItem, removeItem }}>  {/* stable functions */}
```

For frequently-changing global state, use **Zustand** or **Jotai** — they support per-atom subscriptions so components only re-render when the specific slice they use changes.

---

### 7. useRef — a box that doesn't ring the bell

**🧑‍💻 middle** — `useRef` returns `{ current: value }` — a mutable container that:
1. **Persists across renders** (like useState)
2. **Does NOT trigger re-renders when changed** (unlike useState)

Analogy: useState is a notepad that rings a bell every time you erase and rewrite. useRef is a sticky note on your monitor — you can write and overwrite it anytime, but React doesn't care and doesn't re-render.

**Two uses:**

```jsx
// Use 1: Access a DOM element directly
function AutoFocus() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // programmatically focus on mount
  }, []);

  return <input ref={inputRef} placeholder="I get focused on load" />;
}

// Use 2: Store a mutable value that should NOT trigger re-renders
function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null); // store timer ID

  const start = () => {
    intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
  };

  return <div>{elapsed}s <button onClick={start}>Start</button> <button onClick={stop}>Stop</button></div>;
}
```

**Common mistake:** using useRef to store state that should trigger re-renders. If changing a value should update the UI → use `useState`. If changing a value should NOT update the UI → use `useRef`.

---

### 8. Lists & Keys

**🧑‍💻 middle** — When rendering a list, React needs to know which items changed, were added, or removed between renders. The `key` prop is how items identify themselves.

**Without keys, React diffs by position** — it reuses the first DOM node for the first item, second for the second, etc. If you insert an item at the beginning, React thinks ALL items shifted → destroys and recreates everything → slow, and breaks internal state.

**With stable keys, React matches by identity** — it can reuse the exact right DOM node for each item.

```jsx
// ❌ Index as key: breaks when the list is reordered, filtered, or prepended
todos.map((todo, index) => <TodoItem key={index} todo={todo} />)

// ✅ Stable unique ID from your data
todos.map(todo => <TodoItem key={todo.id} todo={todo} />)
```

**Why index as key is dangerous:**
```
Initial list:      key=0 Alice,  key=1 Bob,   key=2 Carol
After removing Bob: key=0 Alice, key=1 Carol
React sees key=1 changed from Bob to Carol → updates text ✅
But React thinks it's the SAME element → doesn't reset Carol's internal state ❌
(if Carol's input had focused state, Alice's focused state is now on Carol's element)
```

Use index only when the list is static (never reordered, filtered, or modified).

---

### 9. Forms — Controlled vs Uncontrolled

**🧑‍💻 middle:**

**Controlled** = React owns the value. Every keystroke updates state; the input's value is always in sync with state. Single source of truth.

```jsx
const [email, setEmail] = useState('');

<input
  type="email"
  value={email}                              // React controls the value
  onChange={e => setEmail(e.target.value)}   // React updates on every keystroke
/>

// Advantage: you have the value in JS at all times
// Validate, transform, or compute derived values instantly
```

**Uncontrolled** = DOM owns the value. You read it via ref only when needed (on submit).

```jsx
const emailRef = useRef<HTMLInputElement>(null);

<input type="email" defaultValue="" ref={emailRef} />

// On submit:
const handleSubmit = () => console.log(emailRef.current?.value);
```

Controlled is recommended for most cases. Use uncontrolled for file inputs (`<input type="file">`) and integrating with non-React libraries.

**React Hook Form** (community standard for complex forms) — uses uncontrolled inputs internally for performance, but gives you a controlled-like API:

```tsx
import { useForm } from 'react-hook-form';

type FormValues = { email: string; password: string };

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

### 10. TypeScript with React

**🧑‍💻 middle** — TypeScript is the industry standard for React projects. Core patterns:

**Typing props:**
```tsx
// Define an interface for your props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary'; // optional prop
  disabled?: boolean;
  children?: React.ReactNode;        // anything renderable (JSX, string, null)
}

function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button className={`btn btn--${variant}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

**Typing useState:**
```tsx
const [user, setUser] = useState<User | null>(null);   // explicit generic
const [items, setItems] = useState<string[]>([]);       // inferred from []
const [count, setCount] = useState(0);                  // inferred as number
```

**Typing event handlers:**
```tsx
// onChange on input
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

// onClick on button
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

// onSubmit on form
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

**Typing useRef:**
```tsx
const inputRef = useRef<HTMLInputElement>(null);       // DOM element ref
const timerRef = useRef<number | null>(null);          // mutable value ref
```

**Typing children:**
```tsx
interface CardProps {
  children: React.ReactNode;     // most flexible: JSX, string, array, null
  title: string;
}
// Alternative: React.FC<Props> is fine but slightly less explicit
```

**🧙‍♂️ senior — Generic components:**
```tsx
function List<T>({ items, renderItem }: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item, i)}</li>)}</ul>;
}

// Usage: fully type-safe
<List items={users} renderItem={user => <span>{user.name}</span>} />
```

---

### 11. Higher-Order Components & Render Props (Legacy)

**🧑‍💻 middle — HOC:** a function that takes a component and returns a new, enhanced component. Pattern from before hooks existed.

```jsx
function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <WrappedComponent {...props} /> : <Navigate to="/login" />;
  };
}
const ProtectedDashboard = withAuth(Dashboard);
```

**Render props:** share logic by passing a function as a child:
```jsx
<Mouse render={({ x, y }) => <Cursor x={x} y={y} />} />
```

**🧙‍♂️ senior** — Both patterns are largely superseded by custom hooks. HOCs still appear in library internals (React Router v5, legacy Redux `connect`). Know them for reading existing codebases; write custom hooks for new code.

---

### 12. Custom Hooks

**🧙‍♂️ senior** — Custom hooks extract reusable stateful logic (not UI). Rules: name starts with `use`, can call other hooks inside, each invocation creates isolated state.

**Analogy:** if you had the same 20 lines of useState + useEffect in 5 components, you'd extract it to a function. Custom hooks are that function, except it can use hooks.

```typescript
// Extract data-fetching logic into a reusable hook
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json(); })
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false); } });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage — completely clean component
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user!.name}</div>;
}
```

**Design principles:**
1. Single responsibility — do one thing well
2. Own cleanup inside the hook (not in the caller)
3. Return what callers need (data + actions), hide internals
4. Accept only what actually varies (URL, ID, options)

---

### 13. Reconciliation & Fiber

**🧙‍♂️ senior** — When state changes, React creates a new virtual DOM tree (plain JS objects). The **reconciliation algorithm** diffs old vs. new tree to find the minimal set of real DOM changes.

**Fiber** (React 16+) is the reconciliation engine:
- Breaks rendering into small units called **fibers** (a linked list of component work)
- Work can be **paused, aborted, or resumed** — enables Concurrent Mode
- Two phases:
  - **Render phase** (async, interruptible) — computes what changed
  - **Commit phase** (synchronous, non-interruptible) — applies DOM updates

**Diffing rules:**
1. Different element type → tear down entire subtree, rebuild from scratch
2. Same element type → update props, recurse into children
3. Lists → use keys to match items across renders

---

### 14. Performance Optimization

**🧑‍💻 middle:**
- `key` on list items — correct DOM reuse
- `async` pipe equivalent: avoid deriving expensive values in render body without memoization

**🧙‍♂️ senior — React.memo:** memoize a component — skip re-render if props are shallowly equal:
```jsx
const HeroCard = React.memo(function HeroCard({ hero, onDelete }: HeroCardProps) {
  return <div>{hero.name} <button onClick={() => onDelete(hero.id)}>Delete</button></div>;
});
// Now re-renders ONLY if hero or onDelete reference changes
```

**useMemo:** memoize an expensive computed value:
```jsx
const sortedHeroes = useMemo(() => [...heroes].sort(byName), [heroes]);
// Recomputes only when heroes changes, not on every parent re-render
```

**useCallback:** memoize a function reference:
```jsx
// Without useCallback: new function reference on every render → React.memo child re-renders anyway
const handleDelete = useCallback((id: number) => {
  setHeroes(h => h.filter(x => x.id !== id));
}, []); // stable reference — child wrapped in React.memo won't re-render
```

**Golden rule:** don't optimize prematurely. Measure first with React DevTools Profiler. `useMemo`/`useCallback` have their own cost — use only when computation is >1ms or value is a dep of another memo/effect.

**Common re-render causes & fixes:**

| Cause | Fix |
|-------|-----|
| `<Comp style={{ margin: 0 }} />` (new object each render) | Extract to constant or `useMemo` |
| `<Comp onClick={() => fn(id)} />` (new function each render) | `useCallback` |
| Context update re-renders all consumers | Split contexts or use Zustand atoms |
| Parent re-renders unchanged child | `React.memo(Child)` |

---

### 15. Code Splitting & Suspense

**🧙‍♂️ senior** — Code splitting creates separate JS chunks loaded on demand. `React.lazy` + `Suspense` handle the loading state:

```jsx
const Dashboard = React.lazy(() => import('./Dashboard'));
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<HeavyChart />} />
      </Routes>
    </Suspense>
  );
}
```

**How it works:** `import()` = dynamic import → bundler creates a separate chunk file. When React first renders the lazy component, it throws a Promise (Suspense catches it, shows fallback). When chunk loads → re-renders with the real component.

Split at route level first — biggest initial bundle impact. Preload on hover for perceived performance: call `import('./Dashboard')` in `onMouseEnter` before clicking.

---

### 16. Error Boundaries

**🧙‍♂️ senior** — Error Boundaries catch render-time errors in child components, preventing the whole app from crashing. They must be class components (no hook equivalent yet):

```jsx
class ErrorBoundary extends React.Component<
  { fallback: ReactNode; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    reportToSentry(error, info.componentStack);
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <ProductList />
</ErrorBoundary>
```

**Do NOT catch:** event handler errors (use `try/catch`), async code in `useEffect`, SSR errors.

Use `react-error-boundary` package for a hook-friendly wrapper.

---

### 17. React Server Components (RSC)

**🧙‍♂️ senior** — RSC run **on the server only** — zero JS shipped to the client. They can directly access databases and secret env variables:

```tsx
// app/products/page.tsx (Next.js App Router — Server Component by default)
async function ProductsPage() {
  const products = await db.select().from(productsTable); // direct DB — no API layer needed
  return <ProductList products={products} />;              // zero client bundle for this component
}
```

**Mental model — the split:**
```
Server tree (runs once per request, no bundle)
└── Client subtree → marked with 'use client'
    └── interactive widgets: search, cart, dropdowns (useState/useEffect live here)
```

Rules: no `useState`, `useEffect`, event handlers in server components. Client components cannot import server components.

---

### 18. Concurrent Features (React 18)

**🧙‍♂️ senior — `useTransition`:** mark a state update as non-urgent so React can interrupt it for higher-priority updates (like keystrokes):

```jsx
const [isPending, startTransition] = useTransition();

function handleSearchChange(query: string) {
  setInputValue(query);               // urgent — updates input immediately
  startTransition(() => {
    setSearchResults(filter(query));  // non-urgent — can be interrupted
  });
}
{isPending && <Spinner />}
```

**`useDeferredValue`:** defer processing of a value you don't control the setter of:

```jsx
const deferredQuery = useDeferredValue(query); // lags one render behind
const results = useMemo(() => expensiveFilter(deferredQuery), [deferredQuery]);
// UI stays responsive while results compute
```

---

### 19. State Management Decision Guide

**🧑‍💻 middle:**

```
Is it data from an API?
  └── YES → TanStack Query  (handles caching, refetch, loading/error states)

Is it local to one component?
  └── YES → useState / useReducer

Is it shared across components?
  ├── Rarely changes, simple → Context API
  ├── Changes often, medium complexity → Zustand
  ├── Atomic, fine-grained subscriptions → Jotai
  └── Complex, large team, time-travel debugging → Redux Toolkit
```

**Zustand — the minimal pattern:**
```typescript
import { create } from 'zustand';

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: number) => void;
}

const useCartStore = create<CartState>()(set => ({
  items: [],
  add: item => set(s => ({ items: [...s.items, item] })),
  remove: id => set(s => ({ items: s.items.filter(x => x.id !== id) })),
}));

// In any component — no Provider needed, no boilerplate
function Cart() {
  const { items, remove } = useCartStore();
  return <ul>{items.map(i => <li key={i.id}>{i.name} <button onClick={() => remove(i.id)}>×</button></li>)}</ul>;
}
```

---

### 20. Testing — React Testing Library

**🧑‍💻 middle** — RTL philosophy: test behavior (what users see and do), not implementation details.

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('adds item to cart on button click', async () => {
  render(<ProductCard product={{ id: 1, name: 'Book', price: 29 }} />);

  await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

  expect(screen.getByText(/1 item in cart/i)).toBeInTheDocument();
});
```

**Query priority (most → least preferred):**
1. `getByRole` — by ARIA role (best accessibility-first)
2. `getByLabelText` — form labels
3. `getByText` — visible text
4. `getByTestId` — last resort

**🧙‍♂️ senior — What NOT to test:** state variable names, component names, CSS classes, how data flows between components (test the final rendered output instead).

---

### 21. useLayoutEffect vs useEffect

**🧙‍♂️ senior:**

| | `useEffect` | `useLayoutEffect` |
|--|-------------|-------------------|
| Timing | After browser paints (async) | After DOM mutations, before paint (sync) |
| Use case | Data fetching, subscriptions | DOM measurements, prevent visual flicker |
| SSR | Safe | Warning (no DOM on server) |

```jsx
// useLayoutEffect — measure DOM and update before user sees the element
useLayoutEffect(() => {
  const { width } = ref.current!.getBoundingClientRect();
  setTooltipOffset(width / 2); // set before paint → no flicker
}, []);
```

Order: render → DOM mutations → `useLayoutEffect` → browser paints → `useEffect`.

Rule: start with `useEffect`. Switch to `useLayoutEffect` only when you see visual flickering.

---

## Mental Model — React's Data Flow

```
State (owned by components or stores)
    │
    ▼ calling setter triggers
Re-render (React calls your function again)
    │
    ▼ function returns
New Virtual DOM (plain JS objects)
    │
    ▼ React diffs with previous Virtual DOM
Fiber Reconciler finds minimal changes
    │
    ▼ Commit phase applies
Real DOM updates (browser)

──────────────────────────────────────────
Data flows  DOWN:  Parent → Child via props
Events flow UP:    Child → Parent via callback props
Global data:       Context / Zustand / Redux
Server data:       TanStack Query / RSC
Async side effects: useEffect
```

---

## What to Build — Crash Course Path

These three projects cover ~80% of interview scenarios. Build them in order — each builds on the previous.

**Project 1 — Todo List with TypeScript (2-4h)**
Practice: component composition, useState, useReducer, props/state split, lists with keys, controlled inputs, TypeScript prop types

```
Features:
  ✓ Add a todo
  ✓ Mark as complete (toggle)
  ✓ Delete a todo
  ✓ Filter: All / Active / Completed
  ✓ Count of remaining items
```

**Project 2 — GitHub User Search (3-5h)**
Practice: useEffect, async data fetching, loading/error states, custom useFetch hook, Context for theme

```
Features:
  ✓ Search input with 500ms debounce
  ✓ Fetch from https://api.github.com/users/{username}
  ✓ Show avatar, name, bio, followers
  ✓ Loading spinner, error message
  ✓ Dark/light theme toggle (Context)
```

**Project 3 — Shopping Cart (4-6h)**
Practice: useReducer, Zustand, React Router, code splitting, TypeScript interfaces, React Hook Form

```
Features:
  ✓ Product list page (route /products)
  ✓ Product detail page (route /products/:id)
  ✓ Add to cart, remove, change quantity
  ✓ Cart total calculation
  ✓ Checkout form with validation (React Hook Form)
```

**After each project, ask yourself:**
- Where would I split this into more components?
- What state could be lifted up/pushed down?
- What logic could become a custom hook?
- What would I test first?

---

## Official Tutorials & Resources

**Start here (hands-on, official):**
- 🎯 [react.dev — Quick Start](https://react.dev/learn) — 30 min overview, official and hooks-first
- 🎯 [react.dev — Tic-Tac-Toe Tutorial](https://react.dev/learn/tutorial-tic-tac-toe) — best beginner project, teaches state + lifting state up
- 🎯 [react.dev — Thinking in React](https://react.dev/learn/thinking-in-react) — mental model for decomposing UI (read before writing any component)

**Deeper concepts (official):**
- [react.dev — Describing the UI](https://react.dev/learn/describing-the-ui) — components, JSX, props
- [react.dev — Adding Interactivity](https://react.dev/learn/adding-interactivity) — state, event handlers
- [react.dev — Managing State](https://react.dev/learn/managing-state) — lifting state, reducers, context
- [react.dev — Escape Hatches](https://react.dev/learn/escape-hatches) — refs, effects, custom hooks
- [react.dev — API Reference](https://react.dev/reference/react) — full hook reference

**Ecosystem:**
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) — server state
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) — global state
- [React Hook Form](https://react-hook-form.com/get-started) — forms
- [React Router](https://reactrouter.com/start/library/installation) — routing
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) — testing
- [Next.js Docs](https://nextjs.org/docs) — full-stack React (SSR, RSC, App Router)

---

## Glossary

**🧑‍💻 middle:**
- **JSX** — HTML-like syntax in JS files; compiles to `React.createElement()`
- **Component** — function that accepts props and returns JSX; name starts uppercase
- **Props** — read-only data from parent to child
- **State** — mutable data owned by a component; changes trigger re-render
- **useState** — hook returning `[value, setter]`; setter triggers re-render
- **useReducer** — like useState but state transitions defined in a pure reducer function
- **useEffect** — hook to synchronize component with external system; runs after render
- **useRef** — mutable `{ current }` container; persists across renders, no re-renders
- **Context** — broadcast data to all descendants without prop drilling
- **Controlled input** — input whose value is driven by React state
- **Key** — unique identifier for list items; enables efficient DOM reuse
- **HOC** — function that takes and returns a component (adds behavior)
- **Custom hook** — function starting with `use` that encapsulates reusable hook logic

**🧙‍♂️ senior:**
- **Virtual DOM** — lightweight JS object tree; React diffs it to find minimal DOM changes
- **Reconciliation** — process of diffing old vs new virtual DOM
- **Fiber** — React's incremental rendering engine (React 16+); enables Concurrent Mode
- **Concurrent Mode** — ability to interrupt, pause, resume renders for responsiveness
- **useTransition** — marks state updates as non-urgent; keeps UI responsive during slow renders
- **useDeferredValue** — defers processing a value by one render cycle
- **React.memo** — HOC that skips re-render if props shallowly equal
- **useMemo** — memoizes computed value; recalculates only when deps change
- **useCallback** — memoizes function reference; new reference only when deps change
- **Code splitting** — lazy-loading JS chunks via `React.lazy` + dynamic `import()`
- **Suspense** — boundary showing fallback while async content or lazy chunk loads
- **Error Boundary** — class component catching render errors in its subtree
- **RSC** — React Server Components; run only on server, zero client bundle
- **Hydration** — attaching React event listeners to server-rendered HTML
- **TanStack Query** — library for server state: fetching, caching, background sync
- **Zustand** — minimal global state; no Provider, no boilerplate
- **useLayoutEffect** — like useEffect but synchronous before browser paint; for DOM measurements
