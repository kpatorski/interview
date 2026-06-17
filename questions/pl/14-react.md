[💡 Questions](questions.md)

# 📘 React

<!-- TOC -->
* [📘 React](#-react)
  * [1️⃣ Fundamentals](#1-fundamentals)
  * [2️⃣ Hooks](#2-hooks)
  * [3️⃣ Advanced / Senior](#3-advanced--senior)
<!-- TOC -->

---

## 1️⃣ Fundamentals

#### 🔹 1. 🧑‍💻 Co to jest React i jaki problem rozwiązuje?

✅ <span style="color:transparent">Odpowiedź</span>

React to biblioteka JavaScript (nie framework) do budowania interfejsów użytkownika, stworzona przez Facebooka (2013). Rozwiązuje problem efektywnego aktualizowania DOM gdy zmienia się stan aplikacji.

**Kluczowa idea:** opisz JAK wygląda UI dla danego stanu, nie JAK go aktualizować. React sam znajdzie minimalne zmiany DOM (virtual DOM diffing / reconciliation).

**React jako biblioteka** — obsługuje tylko warstwę widoku:
- Routing: React Router / TanStack Router
- State: Redux / Zustand / Jotai
- Forms: React Hook Form
- Data fetching: TanStack Query

---

#### 🔹 2. 🧑‍💻 Co to jest JSX?

✅ <span style="color:transparent">Odpowiedź</span>

JSX to rozszerzenie składni JavaScript wyglądające jak HTML, kompilujące się do wywołań `React.createElement()`.

```jsx
// JSX
const el = <h1 className="title">Hello, {name}!</h1>;

// Kompiluje się do:
const el = React.createElement('h1', { className: 'title' }, 'Hello, ', name, '!');
```

**Kluczowe zasady:**
- `className` zamiast `class`, `htmlFor` zamiast `for`
- Self-closing tags: `<img />` nie `<img>`
- Jeden root element (lub `<>...</>` Fragment)
- Wyrażenia w `{}` — nie można używać stwierdzeń (ternary lub `&&` dla warunków)
- Nazwy komponentów z dużej litery: `<MyComponent />` vs `<div />`

---

#### 🔹 3. 🧑‍💻 Czym różni się props od state?

✅ <span style="color:transparent">Odpowiedź</span>

**Props:** dane przekazywane z rodzica do dziecka — read-only w dziecku, własnością rodzica.
**State:** dane zarządzane przez sam komponent — wyzwala re-render gdy zmieniane przez setter.

```jsx
// Props (read-only)
function Greeting({ name, color = 'black' }) {
  return <h1 style={{ color }}>Hello, {name}!</h1>;
}

// State (mutable via setter)
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Zasada lift state up:** gdy wiele komponentów potrzebuje tego samego stanu, przenieś go do wspólnego przodka.

---

#### 🔹 4. 🧑‍💻 Jak działa useState?

✅ <span style="color:transparent">Odpowiedź</span>

`useState` zwraca `[wartość, setter]`. Wywołanie settera scheduluje re-render z nową wartością.

```jsx
const [count, setCount] = useState(0);           // wartość początkowa
const [user, setUser] = useState(() => getUser()); // lazy init (funkcja wywołana raz)

// Obiektowy stan — musisz tworzyć nowy obiekt (nie mutować):
setUser(prev => ({ ...prev, name: 'Alice' }));

// Aktualizacja bazująca na poprzedniej wartości:
setCount(c => c + 1);  // bezpieczne
setCount(count + 1);   // niebezpieczne w batched updates
```

**Ważne:**
- Aktualizacje stanu są batchowane (React 18: zawsze, nawet w kodzie async)
- React porównuje stary/nowy stan przez `Object.is()` — brak zmiany referencji = brak re-renderu
- Nie mutuj stanu bezpośrednio

---

#### 🔹 5. 🧑‍💻 Jak działa useEffect i czym są zależności?

✅ <span style="color:transparent">Odpowiedź</span>

`useEffect` uruchamia side effects po renderze. Tablica zależności kontroluje częstotliwość.

```jsx
useEffect(() => {
  const sub = subscribe(userId);
  return () => sub.unsubscribe(); // cleanup: uruchamiany przed następnym effectem lub unmount
}, [userId]); // re-uruchamiaj gdy zmieni się userId

useEffect(() => { /* uruchom raz po mount */ }, []);
useEffect(() => { /* uruchom po każdym renderze */ }); // brak tablicy
```

**Typowe błędy:**
- Brakujące zależności → stale closures (linter `exhaustive-deps` to wyłapie)
- Pętla nieskończona: effect aktualizuje stan który jest w zależnościach

---

#### 🔹 6. 🧑‍💻 Co to jest Context API i kiedy go używać?

✅ <span style="color:transparent">Odpowiedź</span>

Context umożliwia przekazywanie danych przez drzewo komponentów bez prop drilling.

```jsx
const ThemeContext = createContext('light');

// Provider:
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// Consumer:
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

**Kiedy używać:** dane globalne rzadko się zmieniające — theme, locale, auth user, feature flags.

**Kiedy NIE używać:** często zmieniający się stan (każda zmiana contextu re-renderuje wszystkich konsumentów) → użyj Zustand, Jotai lub podziel na mniejsze contexty.

---

#### 🔹 7. 🧑‍💻 Dlaczego klucze (keys) są ważne w listach?

✅ <span style="color:transparent">Odpowiedź</span>

React używa kluczy do identyfikacji, które elementy listy się zmieniły, zostały dodane lub usunięte — to umożliwia efektywne ponowne użycie węzłów DOM.

```jsx
// ❌ Zły: index jako klucz (psuje się przy zmianie kolejności)
items.map((item, i) => <Item key={i} {...item} />)

// ✅ Dobry: stabilne unikalne ID
items.map(item => <Item key={item.id} {...item} />)
```

Używanie indeksu jako klucza powoduje błędy gdy lista jest sortowana lub filtrowana: React reużywa złe węzły DOM, co prowadzi do nieprawidłowego stanu i wizualnych glitchy.

---

#### 🔹 8. 🧑‍💻 Czym różni się komponent kontrolowany od niekontrolowanego?

✅ <span style="color:transparent">Odpowiedź</span>

**Kontrolowany:** React posiada wartość formularza. Wartość inputu zawsze jest zsynchronizowana ze stanem.

```jsx
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />
```

**Niekontrolowany:** DOM posiada wartość. Dostęp przez `ref` tylko gdy potrzebny.

```jsx
const inputRef = useRef<HTMLInputElement>(null);
<input defaultValue="Alice" ref={inputRef} />
// Odczyt: inputRef.current?.value
```

Kontrolowany = single source of truth (zalecany). Niekontrolowany = prostszy dla file inputs i integracji z kodem spoza React.

---

#### 🔹 9. 🧑‍💻 Do czego służy useRef?

✅ <span style="color:transparent">Odpowiedź</span>

`useRef` zwraca mutowalny obiekt `{ current: value }` który przetrwa między renderami bez wywołania re-renderu.

**Dwa przypadki użycia:**

1. **Dostęp do DOM** — programowe focus, pomiar, animacje
2. **Kontener mutowalny** — wartości nie wyzwalające re-renderu (poprzednia wartość, ID timera, flaga)

```jsx
// Dostęp do DOM
const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => { inputRef.current?.focus(); }, []);
<input ref={inputRef} />

// Kontener mutowalny (bez re-renderu)
const timerId = useRef<ReturnType<typeof setTimeout>>();
useEffect(() => {
  timerId.current = setTimeout(() => doSomething(), 1000);
  return () => clearTimeout(timerId.current);
}, []);
```

---

#### 🔹 10. 🧑‍💻 Co to są Higher-Order Components (HOC)?

✅ <span style="color:transparent">Odpowiedź</span>

HOC to funkcja przyjmująca komponent i zwracająca nowy komponent z dodatkowym zachowaniem — odpowiednik wzorca dekorator w React.

```jsx
function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" />;
    return <WrappedComponent {...props} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);
```

HOC'i są w dużej mierze zastąpione przez hooki w nowoczesnym React, ale wciąż pojawiają się w bibliotekach (stary react-redux `connect`). Preferuj custom hooks dla nowego kodu.

---

#### 🔹 11. 🧑‍💻 Czym różnią się komponenty klasowe od funkcyjnych?

✅ <span style="color:transparent">Odpowiedź</span>

| Cecha | Klasy | Funkcyjne |
|---|---|---|
| Składnia | `extends React.Component` | funkcja zwracająca JSX |
| Stan | `this.state` / `setState()` | `useState()` |
| Lifecycle | `componentDidMount` itp. | `useEffect()` |
| Error handling | `componentDidCatch` | Error Boundary (nadal klasa) |
| Rozmiar | Większy | Mniejszy, czytelniejszy |
| Testowalność | Trudniejsza | Łatwiejsza |

Zalecenie: używaj komponentów funkcyjnych dla całego nowego kodu. Komponenty klasowe są potrzebne tylko dla Error Boundaries (brak hookowego odpowiednika).

---

#### 🔹 12. 🧑‍💻 Jak działa propagacja eventów w React?

✅ <span style="color:transparent">Odpowiedź</span>

React używa delegacji zdarzeń — wszystkie zdarzenia są podpinane do korzenia React (nie do pojedynczych elementów DOM) i bubblują w górę.

```jsx
<div onClick={() => console.log('div')}>   // odpala jako drugi
  <button onClick={e => {
    e.stopPropagation(); // zatrzymaj bubblowanie
    console.log('button');
  }}>Click</button>
</div>
```

Syntetyczne zdarzenia React są znormalizowane między przeglądarkami. Od React 17: zdarzenia podpięte do korzenia React (nie `document`) — ważne przy mikrofrontendach.

---

#### 🔹 13. 🧑‍💻 Co to jest lazy initializer w useState?

✅ <span style="color:transparent">Odpowiedź</span>

Jeśli wartość inicjalna wymaga kosztownych obliczeń, przekaż funkcję (nie wartość) do `useState`. React wywoła ją tylko przy pierwszym renderze.

```jsx
// ❌ Źle: getExpensiveValue() wywoływane przy każdym renderze
const [state, setState] = useState(getExpensiveValue());

// ✅ Dobrze: funkcja wywołana tylko raz (lazy initializer)
const [state, setState] = useState(() => getExpensiveValue());

// Praktyczny przykład:
const [filters, setFilters] = useState(() =>
  JSON.parse(localStorage.getItem('filters') ?? '{}')
);
```

---

## 2️⃣ Advanced / Senior

#### 🔹 14. 🧙‍♂️ Jak działa algorytm reconciliation (Fiber) w React?

✅ <span style="color:transparent">Odpowiedź</span>

Przy zmianie state/props React tworzy nowy virtual DOM (plain JS objects). Algorytm reconciliation diff'uje stary vs nowy virtual DOM by znaleźć minimalne zmiany prawdziwego DOM.

**Fiber** (React 16+) — wewnętrzny silnik reconciliation:
- Dzieli pracę renderowania na małe jednostki (fibers = linked list pracy komponentu)
- Praca może być pauzowana, przerywana lub wznawiana → umożliwia Concurrent Features
- Dwie fazy: **Render phase** (async, przerywalna) → **Commit phase** (synchroniczna, aktualizacje DOM)

**Reguły diffingu:**
1. Różny typ elementu → usuń całe poddrzewo i zbuduj od nowa
2. Ten sam typ → zaktualizuj props, rekurencja na dzieciach
3. Listy → użyj keys do dopasowania elementów między renderami

---

#### 🔹 15. 🧙‍♂️ Kiedy i jak używać useMemo i useCallback?

✅ <span style="color:transparent">Odpowiedź</span>

Oba memoizują wartości by uniknąć ponownych obliczeń przy każdym renderze.

`useMemo` — memoizuje wynik obliczenia:
```jsx
const sortedList = useMemo(() => [...list].sort(compareFn), [list]);
// Przelicza tylko gdy zmieni się `list`
```

`useCallback` — memoizuje referencję funkcji:
```jsx
const handleClick = useCallback(() => doSomething(id), [id]);
// Nowa referencja tylko gdy zmieni się `id`
```

**Kiedy używać:**
- `useMemo`: kosztowne obliczenia (>1ms) lub gdy wartość jest zależnością `useEffect`/`useCallback`
- `useCallback`: gdy przekazujesz callback do zmemoizowanego dziecka lub jako dep `useEffect`

**Kiedy NIE używać:**
- Dla tanich obliczeń — memoizacja ma swój overhead
- Nie używaj wszędzie na ślepo — zmierz najpierw

---

#### 🔹 16. 🧙‍♂️ Jak wykrywać i naprawiać zbędne re-rendery?

✅ <span style="color:transparent">Odpowiedź</span>

**Narzędzia:**
- React DevTools Profiler — nagrywa rendery, pokazuje dlaczego każdy komponent się rerenderował
- `<React.StrictMode>` — podwójne wywołanie render w dev (wykrywa efekty uboczne)
- Biblioteka `why-did-you-render` — loguje nieoczekiwane re-rendery

**Typowe przyczyny i naprawy:**

| Przyczyna | Naprawienie |
|---|---|
| Inline object/array literal w JSX | `useMemo` |
| Inline function prop | `useCallback` |
| Context update re-renderuje wszystkich | Podziel contexty, użyj Zustand atoms |
| Rodzic re-renderuje niezmienione dziecko | `React.memo(Child)` |
| Stan zbyt wysoko wyniesiony | Push state down |

---

#### 🔹 17. 🧙‍♂️ Jak projektować dobre custom hooks?

✅ <span style="color:transparent">Odpowiedź</span>

Custom hooks wyodrębniają reużywalną logikę stanową (nie UI). Reguły:
- Nazwa zaczyna się od `use`
- Mogą używać innych hooków wewnątrz
- Każde wywołanie tworzy izolowaną instancję stanu

**Zasady projektowania:**
1. Single responsibility — jedna odpowiedzialność
2. Zwracaj to czego potrzebuje caller (stan + akcje)
3. Przyjmuj tylko to co się zmienia (parametry)
4. Cleanup wewnątrz hooka, nie w callerze

```typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
```

---

#### 🔹 18. 🧙‍♂️ Jak działa code splitting z React.lazy i Suspense?

✅ <span style="color:transparent">Odpowiedź</span>

Code splitting opóźnia ładowanie niekrytycznych bundle'ów do momentu gdy są potrzebne.

```jsx
const Dashboard = React.lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

**Jak to działa:**
1. `import()` = dynamic import → Webpack/Vite tworzy oddzielny chunk
2. Gdy React renderuje `<Dashboard>`, rzuca Promise (mechanizm Suspense)
3. `<Suspense>` łapie rzut, pokazuje fallback
4. Gdy chunk załadowany, re-renderuje z prawdziwym komponentem

**Best practices:**
- Lazy-load na poziomie tras (największy wpływ)
- `React.lazy` dla ciężkich komponentów (wykresy, edytory, modale)
- Preload na hover/mouse enter dla perceived performance

---

#### 🔹 19. 🧙‍♂️ Co to są Error Boundaries i kiedy je stosować?

✅ <span style="color:transparent">Odpowiedź</span>

Error Boundaries łapią błędy JavaScript w drzewie komponentów dzieci podczas renderowania, metod lifecycle i konstruktora — zapobiegają crashowi całej aplikacji.

Error boundaries muszą być komponentami klasowymi (brak hookowego odpowiednika):

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo); // Sentry itp.
  }

  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}
```

**NIE łapią błędów w:**
- Event handlers (użyj try/catch)
- Kod asynchroniczny (ciała useEffect)
- Server-side rendering

Biblioteka `react-error-boundary` dostarcza przyjazny wrapper z hookami.

---

#### 🔹 20. 🧙‍♂️ Co to są React Server Components (RSC)?

✅ <span style="color:transparent">Odpowiedź</span>

React Server Components (RSC) uruchamiają się wyłącznie na serwerze — nie mają bundle po stronie klienta, mogą bezpośrednio dostęp do zasobów serwera (DB, filesystem) i nigdy się nie re-renderują.

```tsx
// app/page.tsx (Next.js App Router) — Server Component domyślnie
async function ProductPage({ id }: { id: string }) {
  const product = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  return <ProductCard product={product} />; // zero JS bundle dla tego komponentu
}
```

**Kluczowe zasady:**
- Brak `useState`, `useEffect`, event handlerów (brak interaktywności)
- Interaktywne komponenty oznacz `'use client'`
- Komponenty klienta nie mogą importować server components (odwrotnie OK)

**Korzyści:** zero JS bundle dla server components, dostęp do danych bez warstwy API, streaming.

---

#### 🔹 21. 🧙‍♂️ Czym są Concurrent Features w React 18?

✅ <span style="color:transparent">Odpowiedź</span>

`useTransition` — oznacza aktualizacje stanu jako niekrytyczne. React może je przerwać by obsłużyć pilniejsze (jak input użytkownika):

```jsx
const [isPending, startTransition] = useTransition();
startTransition(() => setQuery(input)); // wyniki wyszukiwania mogą się opóźnić; input pozostaje responsywny
{isPending && <Spinner />}
```

`useDeferredValue` — odracza przetwarzanie wartości (podobnie jak debounce, ale koordynowane przez React):

```jsx
const deferredQuery = useDeferredValue(query);
// deferredQuery "zostaje z tyłu" o jeden render — użyj do kosztownych obliczeń
const filteredList = useMemo(() => filter(list, deferredQuery), [list, deferredQuery]);
```

**Kiedy używać:**
- `useTransition`: wolne rendery (filtrowanie dużych list, routing)
- `useDeferredValue`: gdy nie możesz kontrolować setter'a stanu (pochodzi z prop)

---

#### 🔹 22. 🧙‍♂️ Jak wybrać bibliotekę do zarządzania stanem?

✅ <span style="color:transparent">Odpowiedź</span>

| Biblioteka | Kiedy wybrać |
|---|---|
| `useState` / `useReducer` | Stan lokalny komponentu |
| Context API | Rzadko zmieniające się dane globalne (theme, locale) |
| **Zustand** | Prosty globalny stan, minimalny boilerplate — domyślny wybór |
| **Jotai** | Atomowy stan, fine-grained subscriptions, dobre z RSC |
| **Redux Toolkit** | Złożone maszyny stanu, duże zespoły, time-travel debugging |
| **TanStack Query** | Stan serwera (fetching, caching, synchronizacja) |

**Drzewo decyzyjne:**
1. Dane z API? → **TanStack Query**
2. Stan tylko lokalny? → **useState**
3. Shared i prosty? → **Zustand**
4. Złożony z wieloma przejściami? → **Redux Toolkit**
5. Potrzebujesz subskrypcji per-atom? → **Jotai**

---

#### 🔹 23. 🧙‍♂️ Czym są wzorce render props i compound components?

✅ <span style="color:transparent">Odpowiedź</span>

**Render props** — komponent przyjmuje funkcję jako child lub prop, dając callerowi kontrolę nad renderowaniem:

```jsx
<DataProvider render={data => <Chart data={data} />} />
// lub children as function:
<Toggle>
  {({ on, toggle }) => <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>}
</Toggle>
```

**Compound components** — wiele komponentów współdziała jako całość, dzieląc stan przez Context:

```jsx
<Select value={value} onChange={setValue}>
  <Select.Trigger>{value}</Select.Trigger>
  <Select.Options>
    <Select.Option value="a">Apple</Select.Option>
    <Select.Option value="b">Banana</Select.Option>
  </Select.Options>
</Select>
```

Używaj compound components dla złożonych widgetów UI (Select, Tabs, Accordion). Oba wzorce są w dużej mierze zastąpione przez hooki, ale silnie obecne w bibliotekach UI (Radix UI, Headless UI).

---

#### 🔹 24. 🧙‍♂️ Jak testować komponenty React? (React Testing Library)

✅ <span style="color:transparent">Odpowiedź</span>

RTL filozofia: testuj zachowanie, nie implementację. Query przez to co widzą użytkownicy.

```jsx
// Queries (w kolejności preferencji):
getByRole('button', { name: /submit/i })  // role dostępności
getByLabelText(/email/i)                   // etykiety formularzy
getByText(/hello/i)                        // widoczny tekst
getByTestId('submit-btn')                  // ostateczność

// Interakcja:
await userEvent.type(input, 'alice@example.com');
await userEvent.click(button);

// Asercje:
expect(screen.getByText('Success!')).toBeInTheDocument();
await waitFor(() => expect(screen.getByRole('alert')).toBeVisible());
```

**Poziomy:**
- Unit: izolowane komponenty (mockuj child components i API)
- Integration: pełny flow feature z RTL (preferowany dla UI)
- E2E: Playwright/Cypress dla krytycznych ścieżek użytkownika

**Nigdy nie testuj:** nazwy zmiennych state, nazwy komponentów, klasy CSS.

---

#### 🔹 25. 🧙‍♂️ Czym różni się useLayoutEffect od useEffect?

✅ <span style="color:transparent">Odpowiedź</span>

`useEffect` — uruchamia się **asynchronicznie** po tym jak przeglądarka namaluje ekran. Bezpieczny dla większości side effects (data fetching, subskrypcje, logowanie).

`useLayoutEffect` — uruchamia się **synchronicznie** po mutacjach DOM, ale **przed** malowaniem przez przeglądarkę. Używaj gdy musisz zmierzyć DOM lub synchronicznie zaktualizować layout by uniknąć visual flicker.

```jsx
// useLayoutEffect — pomiar przed malowaniem:
useLayoutEffect(() => {
  const width = ref.current?.getBoundingClientRect().width ?? 0;
  setWidth(width); // aktualizuje stan przed malowaniem → bez flickera
}, []);
```

**Kolejność:** render → mutacje DOM → `useLayoutEffect` → malowanie przeglądarki → `useEffect`

**Uwaga:** `useLayoutEffect` w SSR generuje warning (serwer nie ma DOM) — użyj `useEffect` dla kodu kompatybilnego z SSR lub sprawdź `typeof window !== 'undefined'`.

---
