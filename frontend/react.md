# ⚛️ React — Comprehensive Study Notes

<!-- TOC -->
* [⚛️ React — Comprehensive Study Notes](#-react--comprehensive-study-notes)
  * [TL;DR](#tldr)
  * [Analogy — The Whiteboard](#analogy--the-whiteboard)
  * [Core Concepts — Step by Step](#core-concepts--step-by-step)
    * [1. Components & JSX](#1-components--jsx)
    * [2. Props vs State](#2-props-vs-state)
    * [3. useState](#3-usestate)
    * [4. useEffect](#4-useeffect)
    * [5. Context API](#5-context-api)
    * [6. useRef](#6-useref)
    * [7. Lists & Keys](#7-lists--keys)
    * [8. Forms — Controlled vs Uncontrolled](#8-forms--controlled-vs-uncontrolled)
    * [9. Higher-Order Components & Render Props (Legacy Patterns)](#9-higher-order-components--render-props-legacy-patterns)
    * [10. Custom Hooks](#10-custom-hooks)
    * [11. Reconciliation & Fiber](#11-reconciliation--fiber)
    * [12. Performance Optimization](#12-performance-optimization)
    * [13. Code Splitting & Suspense](#13-code-splitting--suspense)
    * [14. Error Boundaries](#14-error-boundaries)
    * [15. React Server Components (RSC)](#15-react-server-components-rsc)
    * [16. Concurrent Features (React 18)](#16-concurrent-features-react-18)
    * [17. State Management Decision Guide](#17-state-management-decision-guide)
    * [18. Testing — React Testing Library Philosophy](#18-testing--react-testing-library-philosophy)
    * [19. useLayoutEffect vs useEffect](#19-uselayouteffect-vs-useeffect)
  * [Mental Model — React's Data Flow](#mental-model--reacts-data-flow)
  * [Glossary](#glossary)
  * [Sources](#sources)
<!-- TOC -->

## TL;DR

React is a JavaScript **library** for building user interfaces, created by Meta (2013). It handles the view layer only — you compose your own stack for routing, state management, and data fetching. React's core bet: describe **what** the UI should look like for a given state, not **how** to update it. The framework (virtual DOM reconciliation) figures out the minimal real DOM changes.

Two ideas underpin everything: **declarative UI** (describe the output, not the mutations) and **unidirectional data flow** (data flows down via props, events flow up via callbacks). Since React 16.8, function components with hooks are the standard way to write React.

---

## Analogy — The Whiteboard

Imagine you're drawing on a whiteboard. Imperative DOM manipulation (vanilla JS) is like erasing and redrawing individual parts: "erase the old name, write the new one." React is like taking a photo of the board each time anything changes, comparing it to the previous photo, and erasing only the pixels that differ — then applying those minimal changes. You always describe the full picture; React handles the diff.

---

## Core Concepts — Step by Step

### 1. Components & JSX

**🧑‍💻 middle** — A component is a function that accepts props and returns JSX. JSX compiles to `React.createElement()` calls:

```jsx
// JSX
function Greeting({ name, color = 'black' }) {
  return <h1 style={{ color }}>Hello, {name}!</h1>;
}

// Compiled
function Greeting({ name, color = 'black' }) {
  return React.createElement('h1', { style: { color } }, 'Hello, ', name, '!');
}
```

JSX rules:
- `className` instead of `class`; `htmlFor` instead of `for`
- Self-close tags: `<img />` not `<img>`
- One root element per return (or `<>...</>` Fragment)
- Expressions in `{}` — no statements; use ternary `? :` or `&&` for conditionals
- Component names start with uppercase: `<MyComponent />` vs `<div />`

---

### 2. Props vs State

**🧑‍💻 middle** — Props are immutable inputs from the parent. State is mutable data owned by the component that triggers re-renders when changed.

```jsx
// Props (read-only in child)
function Card({ title, children }) {
  return <div className="card"><h2>{title}</h2>{children}</div>;
}

// State (owned by this component)
function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Lift state up** when two sibling components need the same state — move it to their common ancestor and pass it down as props.

---

### 3. useState

**🧑‍💻 middle:**

```jsx
const [value, setValue] = useState(initialValue);

// Object state — create new reference on update (never mutate directly)
const [user, setUser] = useState({ name: 'Alice', age: 30 });
setUser(prev => ({ ...prev, age: 31 }));

// Lazy initializer — function called only on first render
const [filters, setFilters] = useState(() => JSON.parse(localStorage.getItem('filters') ?? '{}'));
```

Key behaviors:
- React 18 batches all state updates (even in async code) — multiple `setState` calls in one event = one re-render
- React compares old and new state with `Object.is()` — identical reference = no re-render
- Use functional updates `prev => ...` when new state depends on previous

---

### 4. useEffect

**🧑‍💻 middle** — Side effects after render. The dependency array controls when the effect re-runs.

```jsx
// Run when userId changes (includes first render)
useEffect(() => {
  const controller = new AbortController();
  fetchUser(userId, { signal: controller.signal }).then(setUser);
  return () => controller.abort(); // cleanup before next run or unmount
}, [userId]);

// Run once on mount
useEffect(() => { analytics.pageView(); }, []);

// Run after every render (no array)
useEffect(() => { document.title = `${count} items`; });
```

**Common mistakes:**
- Missing dependency → stale closure (ESLint `exhaustive-deps` catches this)
- Infinite loop: effect updates state that's in the dependency array
- Missing cleanup → memory leaks, duplicate subscriptions

---

### 5. Context API

**🧑‍💻 middle** — Thread data through the component tree without passing props at every level:

```jsx
const AuthContext = createContext<User | null>(null);

// Provider wraps the subtree
function App() {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={user}>
      <Router />
    </AuthContext.Provider>
  );
}

// Consumer — any descendant
function UserMenu() {
  const user = useContext(AuthContext);
  if (!user) return <LoginButton />;
  return <span>{user.name}</span>;
}
```

**When to use:** rarely-changing global data — theme, locale, auth user, feature flags.

**🧙‍♂️ senior — When NOT to use:** frequently-changing state. Every context value change re-renders **all** consumers, even if they only read a part of the value. Solutions:
- Split into multiple contexts (theme vs auth vs cart)
- Use selector-based state (Zustand, Jotai) — consumers subscribe only to the slice they need

---

### 6. useRef

**🧑‍💻 middle** — A mutable container `{ current: T }` that persists across renders without causing re-renders. Two uses:

```jsx
// 1. DOM access
const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => { inputRef.current?.focus(); }, []);
<input ref={inputRef} />

// 2. Mutable value that should not trigger re-render
const intervalId = useRef<number>();
useEffect(() => {
  intervalId.current = setInterval(tick, 1000);
  return () => clearInterval(intervalId.current);
}, []);
```

---

### 7. Lists & Keys

**🧑‍💻 middle** — React uses keys to identity-match elements across renders for efficient DOM reuse:

```jsx
// ❌ Index as key — breaks when list reorders/filters
todos.map((todo, i) => <Todo key={i} {...todo} />)

// ✅ Stable unique ID
todos.map(todo => <Todo key={todo.id} {...todo} />)
```

Wrong keys cause React to reuse the wrong DOM nodes → visual glitches and wrong state in child components (e.g., input values not updating after filter).

---

### 8. Forms — Controlled vs Uncontrolled

**🧑‍💻 middle:**

```jsx
// Controlled — React owns the value (recommended)
const [email, setEmail] = useState('');
<input type="email" value={email} onChange={e => setEmail(e.target.value)} />

// Uncontrolled — DOM owns the value
const fileRef = useRef<HTMLInputElement>(null);
<input type="file" ref={fileRef} />
// Read on submit: fileRef.current?.files[0]
```

Controlled inputs give you instant access to value for validation, transformation, and conditional rendering. Uncontrolled is simpler for file inputs and integrating non-React code.

**🧑‍💻 middle — React Hook Form** is the community standard for form management: it minimizes re-renders by using refs under the hood for unregistered fields:

```jsx
const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
<input {...register('email', { required: true, pattern: /\S+@\S+/ })} />
```

---

### 9. Higher-Order Components & Render Props (Legacy Patterns)

**🧑‍💻 middle — HOC:** a function that takes a component and returns a new, enhanced component:

```jsx
function withAuth<P>(WrappedComponent: ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <WrappedComponent {...props} /> : <Navigate to="/login" />;
  };
}
```

**Render props:** pass a function as a child to share stateful logic:

```jsx
<Mouse render={({ x, y }) => <Cursor x={x} y={y} />} />
```

**🧙‍♂️ senior** — Both patterns are largely superseded by custom hooks, which are simpler to compose and test. HOCs still appear in library internals (React Router v5, legacy Redux `connect`). Know them for reading existing codebases; write custom hooks for new code.

---

### 10. Custom Hooks

**🧙‍♂️ senior** — Custom hooks extract reusable stateful logic (not UI). They start with `use`, can call other hooks, and each invocation creates isolated state:

```typescript
function useFetch<T>(url: string): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
```

Design rules:
1. Single responsibility
2. Return what callers need (data + actions), not internals
3. Accept only what varies
4. Own cleanup inside the hook

---

### 11. Reconciliation & Fiber

**🧙‍♂️ senior** — When state changes, React creates a new virtual DOM tree (plain JS objects). The **reconciliation algorithm** diffs old vs new tree to find the minimal set of real DOM changes.

**Fiber** (React 16+) is the reconciliation engine:
- Breaks rendering into small units called **fibers** (a linked list of component work)
- Work can be **paused, aborted, or resumed** — this enables Concurrent Mode
- Two phases:
  - **Render phase** (async, interruptible) — computes what changed
  - **Commit phase** (synchronous, non-interruptible) — applies DOM updates

**Diffing rules:**
1. Different element type → tear down entire subtree, rebuild from scratch
2. Same element type → update props, recurse into children
3. Lists → use keys to match items; unkeyed lists diff positionally

---

### 12. Performance Optimization

**🧑‍💻 middle:**
- `key` on list items — correct DOM reuse
- Avoid deriving expensive state in render body without memoization

**🧙‍♂️ senior:**

**React.memo** — memoize component; skip re-render if props unchanged (shallow comparison):
```jsx
const HeroCard = React.memo(function HeroCard({ hero, onDelete }) {
  return <div>{hero.name} <button onClick={() => onDelete(hero.id)}>Delete</button></div>;
});
```

**useMemo** — memoize expensive computed value:
```jsx
const sortedHeroes = useMemo(() => [...heroes].sort(byName), [heroes]);
```

**useCallback** — memoize function reference (prevent child from re-rendering when parent re-renders):
```jsx
const handleDelete = useCallback((id: number) => {
  setHeroes(h => h.filter(x => x.id !== id));
}, []);
```

**When NOT to optimize:** every memoization has a cost. Profile first (React DevTools Profiler). `useMemo`/`useCallback` are only beneficial when:
- The computation is genuinely expensive (>1ms), OR
- The value/function is a dependency of another memo/effect

**🧙‍♂️ senior — Common re-render causes & fixes:**

| Cause | Fix |
|-------|-----|
| Inline object `<Comp style={{ margin: 0 }} />` | Extract to constant or `useMemo` |
| Inline function `<Comp onClick={() => fn(id)} />` | `useCallback` |
| Context value change re-renders all consumers | Split contexts or use Zustand atoms |
| `useSelector` re-runs for unrelated state changes | Use more specific selectors |

---

### 13. Code Splitting & Suspense

**🧙‍♂️ senior** — Code splitting creates separate JS chunks loaded on demand:

```jsx
const HeavyChart = React.lazy(() => import('./HeavyChart'));
const AdminPanel = React.lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/chart" element={<HeavyChart />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}
```

**How it works:** `import()` is a dynamic import — bundler creates a separate chunk. When React renders the lazy component, it throws a Promise (Suspense boundary catches it, shows fallback). When the chunk loads, the component re-renders.

**Best practices:**
- Split at route boundaries first (biggest initial bundle impact)
- Lazy-load heavy components (chart libraries, WYSIWYG editors, video players)
- Preload chunks on hover: `import('./HeavyChart')` on `onMouseEnter`

---

### 14. Error Boundaries

**🧙‍♂️ senior** — Error Boundaries catch render-time errors in child components and show a fallback UI instead of crashing the entire app:

```jsx
class ErrorBoundary extends React.Component<
  { fallback: ReactNode; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    reportError(error, info.componentStack);
  }

  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}
```

**Do NOT catch:**
- Event handler errors (use `try/catch` inside the handler)
- Async errors in `useEffect` bodies
- SSR errors

Use the `react-error-boundary` package for a hook-friendly wrapper with reset capabilities.

---

### 15. React Server Components (RSC)

**🧙‍♂️ senior** — RSC run **on the server only** — no JavaScript bundle shipped to the client. They can directly access databases, file systems, or secret environment variables:

```tsx
// app/products/page.tsx (Next.js App Router — Server Component by default)
async function ProductsPage() {
  const products = await db.select().from(productsTable); // direct DB access, no API needed
  return <ProductList products={products} />;
}
```

**Mental model — the split:**
```
Server tree (runs once, no bundle shipped)
├── Layout, page shell, data fetching
└── Client subtree (runs in browser, has useState/useEffect)
    ├── marked with 'use client'
    └── interactive widgets (search, cart, dropdowns)
```

**Rules:**
- `'use client'` marks the **boundary** between server and client trees
- Client components **cannot** import server components (but server components can render client components as children)
- No `useState`, `useEffect`, browser APIs in server components

---

### 16. Concurrent Features (React 18)

**🧙‍♂️ senior** — Concurrent React can render multiple UI versions simultaneously and interrupt/abandon renders that are no longer needed.

**`useTransition`** — mark a state update as non-urgent. UI stays responsive while slow renders compute in background:

```jsx
const [isPending, startTransition] = useTransition();

function handleSearchChange(query: string) {
  setInputValue(query);             // urgent — updates input immediately
  startTransition(() => {
    setSearchResults(filter(query)); // non-urgent — can be interrupted
  });
}
```

**`useDeferredValue`** — defer processing of a prop/value you can't control the setter of:

```jsx
function SearchResults({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => expensiveFilter(deferredQuery), [deferredQuery]);
  // While deferredQuery lags behind query, React can show stale results during recomputation
  return <ResultList results={results} />;
}
```

**`Suspense` for data** (with React Query, Relay, or RSC): wrap async data-fetching in Suspense boundaries for streaming and progressive rendering.

---

### 17. State Management Decision Guide

**🧑‍💻 middle** — Context API for global config:

```jsx
// Good: auth user (changes rarely)
<AuthContext.Provider value={user}><App /></AuthContext.Provider>

// Bad: shopping cart items (changes frequently) — causes mass re-renders
<CartContext.Provider value={cart}><App /></CartContext.Provider>
```

**🧙‍♂️ senior — Decision tree:**

```
Is it server data (from an API)?
  └── Yes → TanStack Query (handles caching, refetch, optimistic updates)

Is it local to one component?
  └── Yes → useState / useReducer

Is it shared across multiple components?
  ├── Simple, rarely changes → Context API
  ├── Moderate complexity → Zustand (minimal boilerplate, great DX)
  ├── Atomic, fine-grained subscriptions → Jotai
  └── Complex, large team, audit trail needed → Redux Toolkit
```

**Zustand example (the minimal pattern):**
```typescript
const useCartStore = create<CartState>()(set => ({
  items: [],
  add: (item) => set(s => ({ items: [...s.items, item] })),
  remove: (id)  => set(s => ({ items: s.items.filter(x => x.id !== id) })),
}));

// In component:
const { items, add } = useCartStore();
```

---

### 18. Testing — React Testing Library Philosophy

**🧑‍💻 middle** — RTL tests behavior (what users see and do), not implementation:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('adds item to cart', async () => {
  render(<ProductCard product={mockProduct} />);

  await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

  expect(screen.getByText('1 item in cart')).toBeInTheDocument();
});
```

**Query priority (most to least preferred):**
1. `getByRole` — matches by ARIA role (best for accessibility)
2. `getByLabelText` — form labels
3. `getByText` — visible text
4. `getByTestId` — last resort (`data-testid` attribute)

**🧙‍♂️ senior — What NOT to test:**
- Internal state variable names
- Component names in the tree
- CSS class names
- How data flows between components (test the final rendered output)

**Test levels:**
- Component integration tests with RTL — primary unit of React testing
- E2E with Playwright — critical user journeys only (login, checkout, key flows)
- Skip snapshot tests — they break constantly and test nothing meaningful

---

### 19. useLayoutEffect vs useEffect

**🧙‍♂️ senior:**

| | `useEffect` | `useLayoutEffect` |
|--|-------------|-------------------|
| Timing | After browser paint (async) | After DOM mutation, before paint (sync) |
| Use case | Data fetching, subscriptions, analytics | DOM measurements, layout-dependent state |
| SSR | Safe | Warning (no DOM on server) |
| Performance | Non-blocking | Blocks paint until done |

```jsx
// useLayoutEffect — measure DOM before user sees the element
useLayoutEffect(() => {
  const { width } = ref.current!.getBoundingClientRect();
  setTooltipOffset(width / 2); // set before paint → no flicker
}, []);
```

Order of operations: render → DOM mutations → `useLayoutEffect` runs → browser paints → `useEffect` runs.

Rule of thumb: start with `useEffect`. Switch to `useLayoutEffect` only when you see visual flickering caused by layout measurement.

---

## Mental Model — React's Data Flow

```
State (source of truth)
    │
    ▼ triggers
Re-render (function call)
    │
    ▼ produces
Virtual DOM (JS object tree)
    │
    ▼ diffed with previous
Fiber Reconciler
    │
    ▼ applies minimal changes
Real DOM (browser)

─────────────────────────────────
Data flows DOWN:  Parent → Child via props
Events flow UP:   Child → Parent via callback props
Global data:      Context / Zustand / Redux store
Async side effects: useEffect / React Query / RSC
```

---

## Glossary

**🧑‍💻 middle terms:**
- **JSX** — syntax extension that compiles to `React.createElement()` calls
- **Props** — immutable inputs from parent to child
- **State** — mutable data owned by a component; changes trigger re-renders
- **useState** — hook for component state with setter
- **useEffect** — hook to perform side effects after render
- **useRef** — mutable container that persists across renders without re-renders
- **Context** — mechanism to share data through the component tree without prop drilling
- **Controlled component** — form element whose value is driven by React state
- **Key** — unique identifier for list items; enables efficient DOM reuse
- **HOC** — Higher-Order Component; function that enhances a component

**🧙‍♂️ senior terms:**
- **Virtual DOM** — lightweight JS object representation of the real DOM
- **Reconciliation** — process of diffing old and new virtual DOM to find minimal changes
- **Fiber** — React's internal incremental rendering engine (React 16+)
- **Concurrent Mode** — ability to interrupt, pause, and resume rendering
- **useTransition** — hook to mark state updates as non-urgent (interruptible)
- **useDeferredValue** — hook to delay processing of a value by one render
- **React.memo** — HOC that skips re-render if props haven't changed (shallow)
- **useMemo** — memoizes computed value across renders
- **useCallback** — memoizes function reference across renders
- **Code splitting** — loading JS chunks on demand via `React.lazy` + `import()`
- **Suspense** — boundary that shows fallback while async content loads
- **Error Boundary** — class component that catches render errors in its subtree
- **RSC — React Server Components** — components that run only on server, zero client bundle
- **Hydration** — attaching React event listeners to server-rendered HTML
- **TanStack Query** — server state management library (fetching, caching, sync)
- **Zustand** — minimal global state library; no context, no provider, no boilerplate

---

## Sources

- [React Official Docs](https://react.dev) — `react.dev` (new docs site with hooks-first examples)
- [React Fiber Architecture — Sebastian Markbåge](https://github.com/acdlite/react-fiber-architecture)
- [Kent C. Dodds — Epic React](https://epicreact.dev) — patterns and advanced hooks
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Josh W. Comeau — The Joy of React](https://www.joyofreact.com/) — deep-dive on mental models
