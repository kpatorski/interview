# 🅰️ Angular — Comprehensive Study Notes

<!-- TOC -->
* [🅰️ Angular — Comprehensive Study Notes](#🅰-angular--comprehensive-study-notes)
  * [TL;DR](#tldr)
  * [Analogy — The Professional Kitchen](#analogy--the-professional-kitchen)
  * [Core Concepts — Step by Step](#core-concepts--step-by-step)
    * [1. Components](#1-components)
    * [2. Dependency Injection (DI)](#2-dependency-injection-di)
    * [3. Data Binding](#3-data-binding)
    * [4. Directives & Pipes](#4-directives--pipes)
    * [5. Modules vs Standalone Components](#5-modules-vs-standalone-components)
    * [6. RxJS & Async Patterns](#6-rxjs--async-patterns)
    * [7. Change Detection](#7-change-detection)
    * [8. Routing & Lazy Loading](#8-routing--lazy-loading)
    * [9. Forms](#9-forms)
    * [10. State Management](#10-state-management)
    * [11. Testing](#11-testing)
    * [12. Performance Checklist](#12-performance-checklist)
    * [13. SSR — Angular Universal](#13-ssr--angular-universal)
  * [Mental Model — Angular's Architecture](#mental-model--angulars-architecture)
  * [Glossary](#glossary)
  * [Sources](#sources)
<!-- TOC -->

## TL;DR

Angular is a full-featured, opinionated TypeScript framework for building single-page applications, maintained by Google. Unlike React (a UI library) or Vue (a progressive framework), Angular is a **complete kitchen** — router, forms, HTTP client, DI container, testing utilities all included. You trade composition freedom for structure and strong conventions that scale well in large teams.

Two concepts underpin everything else: **Dependency Injection** (the framework assembles objects for you, you declare what you need) and **RxJS Observables** (asynchronous data flows everywhere — HTTP, events, forms).

---

## Analogy — The Professional Kitchen

React is a chef's knife: versatile, sharp, but you choose the cutting board, the stove, and the plating.

Angular is a professional kitchen with a fixed layout: every station has its place, equipment is standardized, and ten cooks can work without stepping on each other. You sacrifice some personal preference, but the coordination is effortless.

---

## Core Concepts — Step by Step

### 1. Components

**🧑‍💻 middle** — A component is the fundamental UI building block: a TypeScript class decorated with `@Component`, paired with an HTML template and optional styles.

```typescript
@Component({
  selector: 'app-hero',         // CSS selector to embed the component
  templateUrl: './hero.html',   // or inline: template: `<h1>{{ hero.name }}</h1>`
  styleUrls: ['./hero.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  // performance optimization
})
export class HeroComponent implements OnInit, OnDestroy {
  @Input()  hero!: Hero;            // data in
  @Output() deleted = new EventEmitter<number>(); // events out
}
```

**Lifecycle hooks (in order):**

| Hook | When | Typical use |
|------|------|-------------|
| `ngOnChanges(changes)` | On every `@Input()` change (before ngOnInit) | React to input changes |
| `ngOnInit()` | Once after first ngOnChanges | Fetch initial data |
| `ngDoCheck()` | Every CD cycle | Rarely — custom detection |
| `ngAfterContentInit()` | After `<ng-content>` projected | Access `@ContentChild` |
| `ngAfterViewInit()` | After view + child views init | Access `@ViewChild`, DOM measurements |
| `ngOnDestroy()` | Before component destroyed | Unsubscribe, clear timers |

**🧙‍♂️ senior** — Understanding component architecture means designing a clear **smart / dumb** (container / presentational) split: smart components own state and services; dumb components receive `@Input()` and emit `@Output()` only. Dumb components should use `OnPush` change detection by default.

---

### 2. Dependency Injection (DI)

**🧑‍💻 middle** — DI is a design pattern where a class declares what it needs; the framework (injector) resolves and delivers dependencies. Angular has a hierarchical DI container.

```typescript
@Injectable({ providedIn: 'root' })  // singleton, tree-shakable
export class HeroService {
  constructor(private http: HttpClient) {}
  // Angular reads constructor type metadata and injects HttpClient automatically
}
```

Three scopes:
- `providedIn: 'root'` — one singleton for the whole app
- Module-level `providers: [SomeService]` — shared within the module
- Component-level `providers: [SomeService]` — **new instance per component subtree** (not singleton)

**🧙‍♂️ senior** — A common mistake: providing a service in a component thinking it's a singleton, but each component tree gets its own instance. This is intentional for isolated state (e.g., form state per dialog). Also: `useFactory` and `InjectionToken` enable injecting primitives and config objects.

---

### 3. Data Binding

**🧑‍💻 middle** — Angular has four binding types:

| Type | Syntax | Direction |
|------|--------|-----------|
| Interpolation | `{{ expr }}` | Class → template |
| Property binding | `[property]="expr"` | Class → DOM property |
| Event binding | `(event)="handler($event)"` | DOM → class |
| Two-way | `[(ngModel)]="value"` | Both (banana in a box) |

`[(ngModel)]` is syntactic sugar for `[ngModel]="value" (ngModelChange)="value = $event"` — requires `FormsModule`.

**🧙‍♂️ senior** — Know the difference between **property binding** `[value]="expr"` (sets a DOM property) and **attribute binding** `[attr.aria-label]="expr"` (sets an HTML attribute, needed for ARIA and SVG). Using property binding on an attribute that doesn't have a DOM property equivalent causes a runtime error.

---

### 4. Directives & Pipes

**🧑‍💻 middle — Structural directives** change DOM structure:
- `*ngIf="condition"` → `<ng-template [ngIf]="condition">`
- `*ngFor="let item of items; trackBy: trackById"`
- `*ngSwitch`

**🧑‍💻 middle — Attribute directives** change element behavior/appearance: `ngClass`, `ngStyle`, custom `@Directive`.

**🧑‍💻 middle — Pipes** transform template values:
```html
{{ createdAt | date:'yyyy-MM-dd' }}
{{ amount | currency:'PLN' }}
{{ heroes$ | async }}
```

Custom pipes implement `PipeTransform`:
```typescript
@Pipe({ name: 'truncate', pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50) {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}
```

**🧙‍♂️ senior** — `pure: false` pipes run on every change detection cycle — they can become a performance bottleneck. Use them only when the input object mutates internally (arrays, maps) and you need live updates. For async data, `AsyncPipe` is the idiomatic choice because it auto-unsubscribes.

---

### 5. Modules vs Standalone Components

**🧑‍💻 middle** — NgModule was the original organization unit: bundles declarations, imports, providers, and exports. From Angular 14+, standalone components declare their imports directly:

```typescript
// NgModule approach (traditional)
@NgModule({ declarations: [HeroComponent], imports: [BrowserModule] })
export class HeroModule {}

// Standalone (Angular 14+, recommended for new projects)
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `...`
})
export class HeroComponent {}
```

**🧙‍♂️ senior** — Standalone components change the lazy loading story: instead of `loadChildren` (module), you can use `loadComponent` directly. This reduces the boilerplate of a module-per-feature and improves tree-shaking. Angular 17 makes standalone the default when generating new projects.

---

### 6. RxJS & Async Patterns

**🧑‍💻 middle** — Observable is a lazy push-based stream from RxJS. Angular uses it for HttpClient responses, Router events, and form value changes. Key operators:

```typescript
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => this.heroService.search(query)),
  catchError(() => EMPTY)
).subscribe(results => this.results = results);
```

**🧑‍💻 middle — Subject types:**
- `Subject` — multicast, no initial value, no history (use for events)
- `BehaviorSubject(init)` — holds current value, emits to late subscribers (use for state)
- `ReplaySubject(n)` — replays last n values to late subscribers

**🧙‍♂️ senior — Flattening operators:**

| Operator | Concurrency | Use case |
|----------|-------------|----------|
| `switchMap` | Cancel previous | Autocomplete, navigation |
| `mergeMap` | Run all parallel | Upload multiple files |
| `concatMap` | Queue, one at a time | Sequential DB writes |
| `exhaustMap` | Ignore while active | Login button (prevent duplicates) |

**🧙‍♂️ senior — Memory leak prevention:**
```typescript
// Best: async pipe (auto-unsubscribes)
<li *ngFor="let hero of heroes$ | async">...</li>

// Angular 16+: takeUntilDestroyed
private destroyRef = inject(DestroyRef);
ngOnInit() {
  this.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(...);
}
```

---

### 7. Change Detection

**🧑‍💻 middle** — Angular's CD runs after every browser event, HTTP response, or timer. Default: checks the entire component tree top-down (zone.js notifies Angular of async events).

**🧙‍♂️ senior — OnPush strategy:** Angular only checks the component when:
1. An `@Input()` reference changes (not mutation — a new object)
2. `async` pipe receives a new value
3. An event originates from the component or descendants
4. `ChangeDetectorRef.markForCheck()` is called

```typescript
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
```

**The mutation trap:** pushing to an array doesn't change its reference → OnPush component won't update. Always create new references: `this.items = [...this.items, newItem]`.

**🧙‍♂️ senior — Signals (Angular 16+):** reactive primitives that bypass zone.js entirely. They enable fine-grained, zoneless change detection in future Angular:

```typescript
count = signal(0);
doubled = computed(() => this.count() * 2);  // auto-derived
increment() { this.count.update(v => v + 1); }
```

Signals vs RxJS: signals are synchronous, pull-based, no subscription management. Use signals for local/derived state; RxJS for async streams (HTTP, WebSockets).

---

### 8. Routing & Lazy Loading

**🧑‍💻 middle:**
```typescript
const routes: Routes = [
  { path: 'heroes', component: HeroListComponent },
  { path: 'hero/:id', component: HeroDetailComponent },
  { path: '**', redirectTo: '/heroes' }
];
// <router-outlet> marks where the routed component renders
```

**🧙‍♂️ senior — Lazy loading:**
```typescript
// Module-based (traditional)
{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }

// Standalone (Angular 14+)
{ path: 'heroes', loadComponent: () => import('./heroes.component').then(m => m.HeroesComponent) }
```

Preloading strategies:
- `NoPreloading` (default) — load only when navigated to
- `PreloadAllModules` — background-load all lazy chunks after initial boot
- Custom: implement `PreloadingStrategy` (network-aware, role-based)

---

### 9. Forms

**🧑‍💻 middle:**

| Feature | Template-driven | Reactive |
|---------|----------------|---------|
| Logic location | Template | Class |
| Access timing | Async (parsed) | Sync |
| Testing | Harder | Easy |
| Dynamic fields | Complex | FormArray |
| Module | FormsModule | ReactiveFormsModule |

```typescript
// Reactive — full TypeScript control
this.form = this.fb.nonNullable.group({
  name:  ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
});

// Custom async validator:
nameExists(): AsyncValidatorFn {
  return control => this.userService.checkName(control.value).pipe(
    map(exists => exists ? { nameTaken: true } : null)
  );
}
```

---

### 10. State Management

**🧑‍💻 middle** — For simple shared state, a service with `BehaviorSubject` is enough:

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private _items$ = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this._items$.asObservable();

  add(item: CartItem) { this._items$.next([...this._items$.value, item]); }
}
```

**🧙‍♂️ senior — NgRx** (Redux pattern with RxJS):
- **Actions** describe events
- **Reducers** are pure functions: `(state, action) → newState`
- **Selectors** are memoized projections
- **Effects** handle async side effects (HTTP → action pipeline)

Use NgRx when: multiple unrelated components share complex state, optimistic updates, time-travel debugging, or you need an audit trail of state transitions.

**NgRx Signals Store** (Angular 17+) is the modern alternative with less boilerplate.

**Decision guide:**

| Scenario | Tool |
|----------|------|
| Local component state | Signals / component fields |
| Feature-shared state | Service + BehaviorSubject/Signal |
| Server cache | TanStack Query (Angular port) |
| Complex global state | NgRx Store / Signals Store |

---

### 11. Testing

**🧑‍💻 middle** — Angular ships with `TestBed` for creating a lightweight testing NgModule:

```typescript
// Service test with HttpClientTestingModule
beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule] }));
const service = TestBed.inject(HeroService);
const httpMock = TestBed.inject(HttpTestingController);

it('fetches heroes', () => {
  service.getHeroes().subscribe(h => expect(h.length).toBe(2));
  httpMock.expectOne('/api/heroes').flush([{id:1},{id:2}]);
  httpMock.verify();
});
```

**🧙‍♂️ senior** — Component tests need to decide isolation level:
- **Shallow** (stub child components) — fast, tests template logic in isolation
- **Deep** (real child components) — tests integration, slower
- Use `spectator` or `ng-mocks` to reduce TestBed boilerplate

---

### 12. Performance Checklist

**🧑‍💻 middle:**
- `trackBy` in `*ngFor` — avoids full list re-render
- `async` pipe — avoids manual subscription + unsubscription
- Pure pipes instead of methods in templates (methods called every CD cycle)

**🧙‍♂️ senior:**
- OnPush on all presentational components
- Lazy-load routes and heavy dependencies
- `@defer` blocks (Angular 17+) — render non-critical content on interaction/viewport entry
- Bundle analysis: `ng build --stats-json && webpack-bundle-analyzer dist/stats.json`
- Angular DevTools browser extension — shows CD time per component

---

### 13. SSR — Angular Universal

**🧙‍♂️ senior** — Server-side rendering renders the Angular app in Node.js, sends pre-rendered HTML to the browser (fast FCP), then Angular hydrates it (attaches listeners).

Angular 17+ has SSR built-in: `ng new myapp --ssr`.

**Trade-offs to know:**
- Browser APIs unavailable on server (`document`, `window`) — guard with `isPlatformBrowser()`
- Hydration mismatch when server and client render differently
- State transfer: server fetches data, embeds it in HTML, client picks it up (no double-fetch)
- Adds Node.js infrastructure dependency

---

## Mental Model — Angular's Architecture

```
Browser
│
├── Zone.js — patches async APIs, notifies Angular of events
│
└── Angular Runtime
    ├── Injector hierarchy (Root → Module → Component)
    ├── Change Detection (Default or OnPush per component)
    ├── Router (URL → component tree)
    └── Component tree
        ├── Smart Component (talks to services, owns state)
        │   └── Dumb Components (OnPush, @Input/@Output only)
        └── Services (DI singletons — HTTP, state, business logic)
```

---

## Glossary

**🧑‍💻 middle terms:**
- **Component** — class + template + styles; the UI unit
- **Directive** — structural (changes DOM) or attribute (changes element behavior)
- **Pipe** — transforms template values; pure (ref-based) or impure (every CD)
- **DI / Injector** — dependency injection container; hierarchical (root → module → component)
- **NgModule** — groups declarations/imports/providers (legacy); standalone components replace it
- **Observable** — lazy push-based stream; must be subscribed to execute
- **Subject** — multicast Observable that you push values into
- **BehaviorSubject** — Subject with a current value; emits immediately to new subscribers
- **Template-driven forms** — form logic in HTML via `ngModel`
- **Reactive forms** — form logic in class via `FormGroup` / `FormControl`

**🧙‍♂️ senior terms:**
- **Change Detection** — Angular's mechanism to sync data model with DOM
- **OnPush** — CD strategy that checks only on input reference change / event / async
- **Zone.js** — monkey-patches async APIs to notify Angular when to run CD
- **switchMap** — flattening operator that cancels the previous inner Observable
- **exhaustMap** — flattening operator that ignores emissions while inner Observable is active
- **Signal** — synchronous reactive primitive (Angular 16+); no subscription needed
- **NgRx** — Redux-pattern state management for Angular (Store, Actions, Reducers, Effects)
- **SSR / Angular Universal** — server-side rendering for better FCP and SEO
- **Module Federation** — Webpack 5 feature enabling independent deployment of micro-frontends
- **Hydration** — process of attaching Angular event listeners to server-rendered HTML

---

## Sources

- [Angular Official Docs](https://angular.dev) — `angular.dev` (new docs site, updated for Angular 17+)
- [RxJS Official Docs](https://rxjs.dev)
- [NgRx Docs](https://ngrx.io/docs)
- [Angular DevTools](https://angular.io/guide/devtools) — browser extension for profiling
- [Manfred Steyer — Angular Architecture](https://www.angulararchitects.io/) — micro-frontends and Module Federation
- [Angular University](https://blog.angular-university.io/) — deep-dive articles
