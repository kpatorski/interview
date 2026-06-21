---
render_with_liquid: false
---
{% raw %}
# 🅰️ Angular — Comprehensive Study Notes

<!-- TOC -->
* [🅰️ Angular — Comprehensive Study Notes](#🅰-angular--comprehensive-study-notes)
  * [TL;DR](#tldr)
  * [Why Angular Exists — The Problem It Solves](#why-angular-exists--the-problem-it-solves)
  * [Analogy — The Professional Kitchen](#analogy--the-professional-kitchen)
  * [Setup — Angular CLI First Steps](#setup--angular-cli-first-steps)
  * [Core Concepts — Step by Step](#core-concepts--step-by-step)
    * [1. Components & Lifecycle](#1-components--lifecycle)
    * [2. Dependency Injection (DI)](#2-dependency-injection-di)
    * [3. Data Binding](#3-data-binding)
    * [4. Directives & Pipes](#4-directives--pipes)
    * [5. Modules vs Standalone Components](#5-modules-vs-standalone-components)
    * [6. RxJS & Observables](#6-rxjs--observables)
    * [7. Change Detection](#7-change-detection)
    * [8. Routing & Lazy Loading](#8-routing--lazy-loading)
    * [9. Forms](#9-forms)
    * [10. HTTP Client](#10-http-client)
    * [11. State Management](#11-state-management)
    * [12. Testing](#12-testing)
    * [13. Performance Checklist](#13-performance-checklist)
    * [14. SSR — Angular Universal](#14-ssr--angular-universal)
  * [Mental Model — Angular's Architecture](#mental-model--angulars-architecture)
  * [Architecture & Best Practices](#architecture--best-practices)
    * [SOLID in Angular](#solid-in-angular)
    * [Smart / Dumb Component Split](#smart--dumb-component-split)
    * [Service Design Principles](#service-design-principles)
    * [When to Extract a Component](#when-to-extract-a-component)
    * [Folder Structure — Feature-Based](#folder-structure--feature-based)
    * [Naming Conventions](#naming-conventions)
  * [What to Build — Crash Course Path](#what-to-build--crash-course-path)
  * [Official Tutorials & Resources](#official-tutorials--resources)
  * [Glossary](#glossary)
<!-- TOC -->

---

## TL;DR

Angular is a full-featured, opinionated **TypeScript framework** for building single-page applications, maintained by
Google. Unlike React (a UI library where you pick your own tools), Angular is a **complete platform** — router, forms,
HTTP client, DI container, testing utilities all included and designed to work together.

You trade composition freedom for structure: Angular decides how things should be done, which scales well in large teams
where everyone needs to produce consistent, readable code.

Three concepts underpin everything:

- **TypeScript** — Angular is written in TS and expects you to use it
- **Dependency Injection** — the framework assembles objects for you; you declare what you need
- **RxJS Observables** — async data flows everywhere: HTTP responses, routing events, form value changes

---

## Why Angular Exists — The Problem It Solves

In 2010 Google built AngularJS (v1) to solve the same problem React later solved: UI getting out of sync with data. In
2016 they rewrote it from scratch as Angular (v2+) with TypeScript as a first-class citizen.

Angular's specific bets vs React:

| Decision           | Angular                                                 | React                                        |
|--------------------|---------------------------------------------------------|----------------------------------------------|
| Structure          | Opinionated — one way to do routing, forms, DI          | Flexible — you choose every tool             |
| Language           | TypeScript required                                     | JS or TS (your choice)                       |
| Team scale         | Better at large teams (conventions enforce consistency) | Better at small teams (freedom to move fast) |
| Learning curve     | Steeper (more concepts upfront)                         | Gentler (start with just components)         |
| Backend background | Familiar to Java/C# devs (DI, decorators, OOP)          | More "JavaScript-native" feel                |

**When you see Angular in job postings:** large enterprise, banking, insurance, government, consulting companies with
big codebases and many developers.

---

## Analogy — The Professional Kitchen

**React** is a chef's knife: sharp, versatile, excellent for skilled hands — but you still choose your own cutting
board, stove, seasoning, and plating.

**Angular** is a professional kitchen with fixed layout: grill station here, pastry station there, everything
standardized. You didn't choose the equipment. But ten cooks can work simultaneously without stepping on each other,
because everyone knows where everything is.

**Dependency Injection** is the kitchen's supply chain: cooks don't go to the market themselves. They put an order on
the board ("I need eggs, flour, butter"). The supply manager (injector) reads it, finds or prepares the ingredients, and
delivers them to the station. The cook just uses them.

**Observable / RxJS** is the kitchen's ticket printer: orders don't arrive all at once — they stream in one by one over
time. You don't wait for all orders before cooking; you react to each ticket as it arrives. And you can transform,
filter, and merge tickets before they hit the cook's station.

---

## Setup — Angular CLI First Steps

**🧑‍💻 middle** — Angular CLI is the tool for everything. Install it once globally:

```bash
npm install -g @angular/cli

# Verify:
ng version
```

**Create a new project:**

```bash
ng new my-app          # interactive: asks about routing, CSS preprocessor
# or:
ng new my-app --routing --style=scss --standalone

cd my-app
ng serve               # opens http://localhost:4200 with live reload
ng build               # production build → dist/my-app/
ng build --watch       # dev build, rebuild on change
```

**Generate code (don't create files by hand):**

```bash
ng generate component hero-card        # or: ng g c hero-card
ng generate service hero               # or: ng g s hero
ng generate module admin --routing     # feature module with its own router
ng generate pipe truncate              # ng g p truncate
ng generate directive highlight        # ng g d highlight
ng generate guard auth                 # route guard
```

**Generated component structure:**

```
src/app/hero-card/
├── hero-card.component.ts         # class with @Component decorator
├── hero-card.component.html       # template
├── hero-card.component.scss       # scoped styles
└── hero-card.component.spec.ts    # unit test file
```

**Project structure:**

```
src/
├── app/
│   ├── app.component.ts           # root component
│   ├── app.routes.ts              # routing config (standalone) or app.module.ts (legacy)
│   └── hero-card/                 # feature components
├── assets/                        # static files
├── environments/                  # environment configs (dev vs prod API URLs)
├── main.ts                        # entry point — bootstraps the Angular app
└── index.html                     # shell — one <app-root> tag
```

**Angular version in 2025:**

- Angular 17+ is the current generation: standalone by default, signals built-in, `@if`/`@for` syntax
- Many codebases are still on Angular 14-16 with NgModules — the concepts are the same, syntax slightly different

---

## Core Concepts — Step by Step

### 1. Components & Lifecycle

**🧑‍💻 middle** — A component is the fundamental UI unit: a TypeScript class with a `@Component` decorator, paired with
an HTML template and styles. Angular components render to custom HTML elements (`<app-hero-card>`).

```typescript

@Component({
    selector: 'app-hero-card',        // how you embed this: <app-hero-card>
    standalone: true,                  // Angular 17+: no NgModule needed
    imports: [CommonModule],           // declare template dependencies here (standalone)
    template: `
    <div class="card" [class.featured]="hero.isFeatured">
      <h2>{{ hero.name }}</h2>
      <p>Power: {{ hero.power }}</p>
      <button (click)="onDelete()">Delete</button>
    </div>
  `,
    styles: [`
    .card { border: 1px solid #ccc; padding: 16px; }
    .featured { border-color: gold; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush  // performance optimization (see section 7)
})
export class HeroCardComponent implements OnInit, OnDestroy {
    @Input() hero!: Hero;                         // data in from parent
    @Output() deleted = new EventEmitter<number>(); // events out to parent

    ngOnInit() {
        console.log('Component initialized with hero:', this.hero.name);
    }

    ngOnDestroy() {
        // Clean up subscriptions, timers here
    }

    onDelete() {
        this.deleted.emit(this.hero.id);  // notify parent
    }
}
```

**@Input() and @Output() — the component's API:**

- `@Input()` is like a function parameter — parent passes data in
- `@Output()` is like a callback — child notifies parent of events
- **Rule:** never modify an `@Input()` directly in the child — it's the parent's data

**Lifecycle hooks (full order):**

| Hook                   | Fires when                                                               | Typical use                                       |
|------------------------|--------------------------------------------------------------------------|---------------------------------------------------|
| `ngOnChanges(changes)` | Every time an `@Input()` reference changes, BEFORE ngOnInit on first run | React to input changes, detect old vs new value   |
| `ngOnInit()`           | Once, after first ngOnChanges                                            | Fetch initial data, setup subscriptions           |
| `ngDoCheck()`          | Every change detection cycle                                             | Custom change detection (rarely needed)           |
| `ngAfterContentInit()` | Once, after `<ng-content>` is projected                                  | Access `@ContentChild` references                 |
| `ngAfterViewInit()`    | Once, after component's view and child views are initialized             | Access `@ViewChild` references, DOM measurements  |
| `ngOnDestroy()`        | Before component is removed from DOM                                     | Unsubscribe, clear timers, detach event listeners |

**Analogy for lifecycle:** think of a component like a restaurant table. `ngOnInit` = table is set for the first
guests (setup). `ngOnChanges` = a dish arrives from the kitchen (new input). `ngAfterViewInit` = you can now see the
full arrangement on the table (DOM accessible). `ngOnDestroy` = guests leave, table is cleared.

**🧙‍♂️ senior** — The smart/dumb (container/presentational) split is the core architectural pattern:

- **Smart (container)** — knows about services, owns state, passes data down via `@Input()`, handles events via
  callbacks, talks to the backend
- **Dumb (presentational)** — receives `@Input()`, emits `@Output()`, no service injection, always `OnPush`, fully
  testable in isolation

---

### 2. Dependency Injection (DI)

**🧑‍💻 middle** — Dependency Injection is a pattern where a class **declares what it needs** in its constructor, and the
framework **provides it** automatically. You don't call `new HeroService()` — Angular does.

**Why does this matter?** Without DI you'd write:

```typescript
// ❌ Without DI — tightly coupled, untestable
class HeroComponent {
    private service = new HeroService(new HttpClient(...)); // creates its own dependencies
}
```

With DI:

```typescript
// ✅ With DI — Angular resolves and delivers the dependency
class HeroComponent {
    constructor(private heroService: HeroService) {} // "I need a HeroService please"
    // Angular reads the constructor type via TypeScript metadata and injects the right object
}
```

**Marking a class as injectable:**

```typescript

@Injectable({ providedIn: 'root' })   // register in the root injector (app-wide singleton)
export class HeroService {
    constructor(private http: HttpClient) {} // HttpClient itself is DI-injected too
    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>('/api/heroes');
    }
}
```

**Three scopes — where the service instance lives:**

| `providedIn` / `providers` location        | Effect                                      |
|--------------------------------------------|---------------------------------------------|
| `@Injectable({ providedIn: 'root' })`      | **One singleton** for the entire app        |
| `providers: [HeroService]` in `@NgModule`  | Singleton within that module                |
| `providers: [HeroService]` in `@Component` | **New instance** for each component subtree |

**Analogy:** DI is a hotel concierge. Guests don't go find a taxi themselves — they tell the concierge "I need a taxi to
the airport." The concierge finds one (or the same one from the fleet if already available) and delivers it. The
component is the guest; the injector is the concierge; `HeroService` is the taxi.

**🧙‍♂️ senior** — Common mistake: providing a service in a component thinking you get a singleton, but actually each
component tree gets its own instance. This is intentional for isolating state — useful for dialogs where each dialog
needs fresh form state. Also: `InjectionToken` lets you inject primitives (strings, config objects, factories):

```typescript
const API_URL = new InjectionToken<string>('apiUrl');

// Provide:
{
    provide: API_URL, useValue
:
    'https://api.example.com'
}

// Inject:
constructor(@Inject(API_URL)
private
apiUrl: string
)
{}
```

---

### 3. Data Binding

**🧑‍💻 middle** — Data binding is how the component class and the HTML template stay in sync. Angular has four types:

| Type                 | Syntax                      | Direction        | Example                      |
|----------------------|-----------------------------|------------------|------------------------------|
| **Interpolation**    | `{{ expr }}`                | Class → Template | `<h1>{{ title }}</h1>`       |
| **Property binding** | `[property]="expr"`         | Class → DOM      | `<img [src]="avatarUrl">`    |
| **Event binding**    | `(event)="handler($event)"` | DOM → Class      | `<button (click)="save()">`  |
| **Two-way binding**  | `[(ngModel)]="value"`       | Both             | `<input [(ngModel)]="name">` |

**Interpolation** is the simplest — puts a value from the class into the template as text:

```html
<h1>Hello, {{ user.name }}!</h1>
<p>You have {{ cart.items.length }} items</p>
<p>{{ 2 + 2 }}</p>  <!-- expressions work too -->
```

**Property binding** sets a DOM property (not HTML attribute):

```html
<img [src]="hero.imageUrl">                  <!-- sets DOM property -->
<button [disabled]="!form.valid">Submit</button>
<app-hero-card [hero]="selectedHero">        <!-- sets @Input() of child component -->
```

**Event binding** calls a method in the class when a DOM event fires:

```html

<button (click)="deleteHero(hero.id)">Delete</button>
<input (input)="onSearch($event)">           <!-- $event = native DOM Event -->
<app-hero-card (deleted)="onHeroDeleted($event)">  <!-- @Output() EventEmitter -->
```

**Two-way binding** = shortcut for `[value]` + `(valueChange)` together (requires `FormsModule`):

```html
<input [(ngModel)]="searchText">
<!-- is exactly the same as: -->
<input [ngModel]="searchText" (ngModelChange)="searchText = $event">
```

The `[()]` syntax is nicknamed "banana in a box" — brackets `[]` for property binding, parentheses `()` for event
binding, together `[()]`.

**🧙‍♂️ senior** — Distinguish **property binding** `[value]` (sets a DOM *property*) from **attribute binding**
`[attr.colspan]` (sets an HTML *attribute*). DOM properties and HTML attributes are not the same thing. SVG elements and
ARIA attributes have no matching DOM property → you must use `[attr.aria-label]`, `[attr.viewBox]`, etc. Using plain
property binding there causes a runtime error.

---

### 4. Directives & Pipes

**🧑‍💻 middle** — Directives are instructions attached to HTML elements that change how Angular renders them.

**Structural directives** add or remove elements from the DOM. They start with `*` (syntactic sugar for`<ng-template>`):

```html
<!-- *ngIf: show/hide element based on condition -->
<div *ngIf="heroes.length > 0; else noHeroes">
    Found {{ heroes.length }} heroes
</div>
<ng-template #noHeroes><p>No heroes found.</p></ng-template>

<!-- *ngFor: repeat element for each item in a list -->
<li *ngFor="let hero of heroes; trackBy: trackById; let i = index">
    {{ i + 1 }}. {{ hero.name }}
</li>

<!-- Angular 17+ built-in control flow (no NgModule import needed): -->
@if (heroes.length > 0) { <p>Found heroes</p> }
@for (hero of heroes; track hero.id) {
<li>{{ hero.name }}</li> }
```

**Attribute directives** change the appearance or behavior of existing elements:

```html

<div [ngClass]="{ 'active': isActive, 'disabled': !isEnabled }">...</div>
<div [ngStyle]="{ 'color': textColor, 'font-size': fontSize + 'px' }">...</div>
```

**Custom directive:**

```typescript

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
    @HostListener('mouseenter') onEnter() {
        this.el.nativeElement.style.backgroundColor = 'yellow';
    }

    @HostListener('mouseleave') onLeave() {
        this.el.nativeElement.style.backgroundColor = '';
    }

    constructor(private el: ElementRef) {}
}

// Usage: <p appHighlight>Hover me</p>
```

**Pipes** transform values in templates without modifying the source data. Think of them as display formatters:

```html
{{ createdAt | date:'dd.MM.yyyy' }}         <!-- "21.06.2026" -->
{{ price | currency:'PLN':'symbol':'1.2-2'}} <!-- "3 999,00 zł" -->
{{ name | uppercase }}                       <!-- "ALICE" -->
{{ description | slice:0:100 }}             <!-- first 100 chars -->
{{ heroes$ | async }}                        <!-- subscribes to Observable, auto-unsubscribes -->
```

**Custom pipe:**

```typescript

@Pipe({ name: 'truncate', pure: true, standalone: true })
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit = 50, ellipsis = '…'): string {
        return value.length > limit ? value.slice(0, limit) + ellipsis : value;
    }
}

// Usage: {{ longText | truncate:30 }}
```

**🧙‍♂️ senior — pure vs impure pipes:**

- `pure: true` (default) — Angular calls the pipe only when the **reference** of the input changes. Fast.
- `pure: false` — Angular calls the pipe on **every change detection cycle**, regardless. Use only when the input object
  mutates internally (mutable array/map contents). Expensive — can severely impact performance if the transform is slow.

`AsyncPipe` is impure by nature but handles subscriptions safely (auto-subscribes on first use, auto-unsubscribes on
destroy). Always prefer `| async` in templates over manual subscriptions.

---

### 5. Modules vs Standalone Components

**🧑‍💻 middle** — Angular originally used **NgModules** to group related components, directives, pipes, and services.
Angular 14+ introduced **standalone components** that declare their own dependencies directly.

**NgModule (traditional):**

```typescript

@NgModule({
    declarations: [HeroListComponent, HeroCardComponent],  // owned by this module
    imports: [BrowserModule, HttpClientModule, RouterModule],
    providers: [HeroService],
    exports: [HeroCardComponent],   // make available to other modules
    bootstrap: [AppComponent]       // only in root module
})
export class AppModule {}
```

**Standalone (Angular 14+, default in Angular 17+):**

```typescript

@Component({
    standalone: true,
    selector: 'app-hero-card',
    imports: [CommonModule, RouterModule],  // import directly what the template needs
    template: `...`
})
export class HeroCardComponent {}
```

**Bootstrapping a standalone app (`main.ts`):**

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
    ]
});
```

**🧙‍♂️ senior** — Standalone components improve tree-shaking (unused imports are eliminated from the bundle) and
simplify lazy loading — you can `loadComponent` directly instead of wrapping each feature in a module. Angular 17 makes
standalone the default for `ng generate`. Existing NgModule codebases work fine; migration is gradual.

---

### 6. RxJS & Observables

**🧑‍💻 middle** — **What is an Observable?** It's a stream of values that arrive over time. Unlike a Promise (which
resolves once), an Observable can emit many values, be cancelled, and be transformed before the consumer receives the
data.

**Analogy — newspaper subscription vs. buying one newspaper:**

- A **Promise** is like buying a single newspaper. You pay, wait, get it, done.
- An **Observable** is like a newspaper subscription. You subscribe, papers arrive every morning, and you can cancel at
  any time. The newspaper doesn't print itself until someone subscribes (lazy).

**Angular uses Observables everywhere:**

- `HttpClient.get()` returns `Observable<T>` (emits once, then completes)
- `Router.events` is an Observable stream of navigation events
- `FormControl.valueChanges` streams every keystroke in a form field
- `ActivatedRoute.params` streams URL parameter changes

```typescript
// Getting data — subscribe to start the HTTP request
this.heroService.getHeroes().subscribe({
    next: heroes => this.heroes = heroes,  // each value
    error: err => this.error = err,         // error
    complete: () => console.log('Done')    // stream ended
});

// Preferred: async pipe in template (auto-unsubscribes, no memory leaks)
@Component({
    template: `
    <li *ngFor="let hero of heroes$ | async">{{ hero.name }}</li>
  `
})
class HeroListComponent {
    heroes$ = this.heroService.getHeroes(); // Observable, not subscribed yet
}
```

**Key operators (the transformation toolkit):**

```typescript
import { debounceTime, distinctUntilChanged, switchMap, catchError, map, filter } from 'rxjs/operators';

// Search box: wait for pause in typing, then search
this.searchControl.valueChanges.pipe(
    debounceTime(300),            // wait 300ms after last keystroke
    distinctUntilChanged(),       // skip if value didn't change
    filter(q => q.length >= 2),   // ignore very short queries
    switchMap(q =>                // cancel previous HTTP request, start new one
        this.heroService.search(q).pipe(
            catchError(() => of([]))  // on error, emit empty array (don't break the stream)
        )
    )
).subscribe(results => this.results = results);
```

**Subject types — Observables you can push values into:**

| Type                    | Emits to late subscriber     | Needs initial value | Best for                              |
|-------------------------|------------------------------|---------------------|---------------------------------------|
| `Subject`               | Nothing (misses past values) | No                  | Events (button clicks, notifications) |
| `BehaviorSubject(init)` | Last value immediately       | Yes                 | State (current user, selected item)   |
| `ReplaySubject(n)`      | Last `n` values              | No                  | Cache recent events                   |

```typescript
// Service state pattern with BehaviorSubject
@Injectable({ providedIn: 'root' })
export class UserService {
    private _user$ = new BehaviorSubject<User | null>(null);
    readonly user$ = this._user$.asObservable();  // expose as read-only

    setUser(user: User) { this._user$.next(user); }

    clearUser() { this._user$.next(null); }
}

// Component
class NavComponent {
    user$ = this.userService.user$; // subscribe with async pipe in template
    constructor(private userService: UserService) {}
}
```

**🧙‍♂️ senior — Flattening operators** (when one Observable triggers another):

| Operator     | What it does                                                         | Use case                                 |
|--------------|----------------------------------------------------------------------|------------------------------------------|
| `switchMap`  | Cancels the previous inner Observable when a new outer value arrives | Autocomplete, search (latest query wins) |
| `mergeMap`   | Runs all inner Observables in parallel                               | Upload multiple files simultaneously     |
| `concatMap`  | Queues — completes one before starting next                          | Sequential writes, ordered operations    |
| `exhaustMap` | Ignores new outer values while inner is active                       | Login button (block duplicate submits)   |

**Memory leak prevention — always unsubscribe:**

```typescript
// ✅ Best: async pipe in template (Angular handles unsubscribe)
<div>{
{ data$ | async }
}
</div>

// ✅ Angular 16+: takeUntilDestroyed
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

private
destroyRef = inject(DestroyRef);
ngOnInit()
{
    this.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(...);
}

// ✅ Traditional: takeUntil with Subject
private
destroy$ = new Subject<void>();
ngOnInit()
{ this.data$.pipe(takeUntil(this.destroy$)).subscribe(...); }
ngOnDestroy()
{
    this.destroy$.next();
    this.destroy$.complete();
}
```

---

### 7. Change Detection

**🧑‍💻 middle** — Change Detection (CD) is Angular's mechanism for keeping the DOM in sync with component data. After
every browser event (click, input, keydown), HTTP response, or timer, Angular runs CD and checks: "has any data bound in
templates changed? If yes, update the DOM."

By default, Angular checks the **entire component tree** top-down. Zone.js is the invisible helper that patches browser
async APIs and notifies Angular: "something happened, time to check."

**Analogy:** imagine a factory where quality control (CD) checks every product (component) after every shift change (
event). By default, the QC team checks every single item on every line — safe, but potentially slow when the factory is
large.

**🧙‍♂️ senior — OnPush strategy:** tell Angular to check a component only under specific conditions — like telling QC: "
only inspect this line if a new batch of materials arrived or a worker pressed the alarm button."

```typescript
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Angular checks an OnPush component only when:**

1. An `@Input()` **reference** changes (a new object, not mutation of the same object)
2. An event originates from inside the component or its children
3. A bound `async` pipe receives a new value
4. `changeDetectorRef.markForCheck()` is called manually

**The mutation trap — the most common OnPush bug:**

```typescript
// ❌ Won't trigger OnPush re-render — same array reference
this.heroes.push(newHero);

// ✅ New reference — OnPush will detect it
this.heroes = [...this.heroes, newHero];
this.heroes = this.heroService.fetchedHeroes; // new array from service
```

**🧙‍♂️ senior — Signals (Angular 16+):** reactive primitives that bypass zone.js entirely. Angular knows exactly which
signals changed and updates only the templates that read those signals — fine-grained reactivity without full-tree CD:

```typescript
// Signal — a reactive value container
count = signal(0);
doubled = computed(() => this.count() * 2);  // auto-derived, lazy
name = input<string>();                        // Angular 17+: signal-based @Input()

increment()
{ this.count.update(v => v + 1); }
// or: this.count.set(5);

// Template reads signal by calling it:
// {{ count() }} — {{ doubled() }}
```

Signals are the future of Angular reactivity. They're synchronous, have no subscriptions, and no memory leaks. Use
signals for local/derived state; RxJS for async streams (HTTP, WebSockets, timers).

---

### 8. Routing & Lazy Loading

**🧑‍💻 middle** — Angular Router maps URL paths to components. The router reads the URL and renders the matching
component into `<router-outlet>`.

```typescript
// app.routes.ts
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'heroes', component: HeroListComponent },
    { path: 'heroes/:id', component: HeroDetailComponent },  // :id = URL parameter
    { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent) },
    { path: '**', redirectTo: '' }  // wildcard — catch all unknown paths
];

// app.component.html
// <nav>
//   <a routerLink="/">Home</a>
//   <a routerLink="/heroes">Heroes</a>
// </nav>
// <router-outlet></router-outlet>  ← matched component renders here
```

**Reading URL parameters:**

```typescript
class HeroDetailComponent implements OnInit {
    constructor(private route: ActivatedRoute, private heroService: HeroService) {}

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id')!;
            this.heroService.getHero(id).subscribe(hero => this.hero = hero);
        });
    }
}
```

**Navigating programmatically:**

```typescript
constructor(private
router: Router
)
{}
goToHero(id
:
string
)
{ this.router.navigate(['/heroes', id]); }
```

**🧙‍♂️ senior — Lazy loading** — load feature bundles only when the user navigates to that route. Reduces initial bundle
size:

```typescript
{
    path: 'admin', loadComponent
:
    () => import('./admin/admin.component').then(m => m.AdminComponent)
}
{
    path: 'heroes', loadChildren
:
    () => import('./heroes/heroes.routes').then(m => m.HEROES_ROUTES)
}
```

**Preloading strategies:**

- `NoPreloading` (default) — load only when user navigates to the route
- `PreloadAllModules` — load all lazy routes in background after initial load
- Custom strategy — e.g., load only routes the current user has access to

**Route guards** — control access before navigation:

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.isLoggedIn()
        ? true
        : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// In routes:
{
    path: 'admin', canActivate
:
    [authGuard], loadComponent
: ...
}
```

---

### 9. Forms

**🧑‍💻 middle — Two approaches:**

**Template-driven forms** — logic lives in the HTML template. Quick for simple forms.

```html
<!-- Requires FormsModule import -->
<form #heroForm="ngForm" (ngSubmit)="onSubmit(heroForm)">
    <input name="heroName" ngModel required minlength="3">
    <span *ngIf="heroForm.controls['heroName']?.invalid && heroForm.submitted">
    Name must be at least 3 characters
  </span>
    <button type="submit">Save</button>
</form>
```

**Reactive forms** — logic lives in TypeScript. Recommended for anything beyond a login form.

```typescript
// Component class
this.heroForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    power: [0, [Validators.required, Validators.min(1)]],
    email: ['', [Validators.required, Validators.email]],
});

// Custom validator
function noSpaces(control: AbstractControl): ValidationErrors | null {
    return control.value?.includes(' ') ? { hasSpaces: true } : null;
}

// Async validator (e.g., check if username is taken)
checkNameAvailable()
:
AsyncValidatorFn
{
    return control => this.userService.isNameTaken(control.value).pipe(
        map(taken => taken ? { nameTaken: true } : null),
        catchError(() => of(null))
    );
}
```

```html
<!-- Template -->
<form [formGroup]="heroForm" (ngSubmit)="onSubmit()">
    <input formControlName="name">
    <span *ngIf="heroForm.get('name')?.hasError('required') && heroForm.get('name')?.touched">
    Name is required
  </span>
    <button type="submit" [disabled]="heroForm.invalid">Save</button>
</form>
```

|                   | Template-driven       | Reactive            |
|-------------------|-----------------------|---------------------|
| Logic in          | HTML                  | TypeScript class    |
| Access to value   | Async (via `#ref`)    | Sync (`form.value`) |
| Testing           | Harder (requires DOM) | Easy (pure TS)      |
| Dynamic fields    | Complex               | `FormArray`         |
| Custom validators | Directives            | Functions           |
| Use when          | Simple contact form   | Everything else     |

---

### 10. HTTP Client

**🧑‍💻 middle** — Angular's `HttpClient` returns Observables and requires setup in bootstrap:

```typescript
// main.ts (standalone)
bootstrapApplication(AppComponent, { providers: [provideHttpClient()] });

// Service
@Injectable({ providedIn: 'root' })
export class HeroService {
    private apiUrl = 'https://api.example.com/heroes';

    constructor(private http: HttpClient) {}

    getAll(): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.apiUrl);
    }

    getById(id: number): Observable<Hero> {
        return this.http.get<Hero>(`${this.apiUrl}/${id}`);
    }

    create(hero: Partial<Hero>): Observable<Hero> {
        return this.http.post<Hero>(this.apiUrl, hero);
    }

    update(id: number, hero: Partial<Hero>): Observable<Hero> {
        return this.http.put<Hero>(`${this.apiUrl}/${id}`, hero);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
```

**Error handling:**

```typescript
getAll()
:
Observable < Hero[] > {
    return this.http.get<Hero[]>(this.apiUrl).pipe(
        catchError(err => {
            console.error('Error fetching heroes:', err);
            return throwError(() => new Error('Could not load heroes'));
        })
    );
}
```

**🧙‍♂️ senior — HTTP Interceptors** — middleware for all HTTP requests. Common uses: add auth token, handle 401, log
errors, show global loading:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(AuthService).getToken();
    const authReq = token
        ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
        : req;
    return next(authReq).pipe(
        catchError(err => {
            if (err.status === 401) inject(Router).navigate(['/login']);
            return throwError(() => err);
        })
    );
};

// Register: provideHttpClient(withInterceptors([authInterceptor]))
```

---

### 11. State Management

**🧑‍💻 middle** — For most features, a service with `BehaviorSubject` is sufficient:

```typescript

@Injectable({ providedIn: 'root' })
export class CartService {
    private _items$ = new BehaviorSubject<CartItem[]>([]);
    readonly items$ = this._items$.asObservable();   // expose as read-only Observable
    readonly count$ = this.items$.pipe(map(items => items.length));

    add(item: CartItem) {
        this._items$.next([...this._items$.value, item]); // immutable update
    }

    remove(id: number) {
        this._items$.next(this._items$.value.filter(i => i.id !== id));
    }
}
```

**🧙‍♂️ senior — NgRx** when you need Redux-level control:

**Core concepts:**

```
Action   → describes WHAT happened ("USER_LOGGED_IN", "ADD_TO_CART")
Reducer  → pure function: (currentState, action) → newState
Effect   → listens for actions, performs async work, dispatches new actions
Selector → memoized function that extracts a slice of state
Store    → single immutable state tree; inject and use in components
```

```typescript
// Action
export const loadHeroes = createAction('[Heroes] Load Heroes');
export const loadHeroesSuccess = createAction('[Heroes] Load Success', props<{ heroes: Hero[] }>());

// Reducer
const heroesReducer = createReducer(
    { heroes: [], loading: false },
    on(loadHeroes, state => ({ ...state, loading: true })),
    on(loadHeroesSuccess, (state, { heroes }) => ({ heroes, loading: false }))
);

// Effect
loadHeroes$ = createEffect(() =>
    this.actions$.pipe(
        ofType(loadHeroes),
        switchMap(() => this.heroService.getAll().pipe(
            map(heroes => loadHeroesSuccess({ heroes })),
            catchError(e => of(loadHeroesFailed({ error: e.message })))
        ))
    )
);

// Component
heroes$ = this.store.select(selectAllHeroes);
this.store.dispatch(loadHeroes());
```

**When to use NgRx vs services:**

| Scenario                         | Tool                                |
|----------------------------------|-------------------------------------|
| Local component state            | Signals / component fields          |
| Feature-level shared state       | Service + BehaviorSubject or Signal |
| Server data (caching, refetch)   | TanStack Query for Angular          |
| Complex global state, large team | NgRx Store                          |
| NgRx but less boilerplate        | NgRx Signals Store (Angular 17+)    |

---

### 12. Testing

**🧑‍💻 middle** — Angular ships with `TestBed` — a testing environment that creates a mini Angular module for your test:

```typescript
// Service test
describe('HeroService', () => {
    let service: HeroService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(HeroService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify()); // no unexpected HTTP requests

    it('should fetch heroes', () => {
        const mock = [{ id: 1, name: 'Superman' }];
        service.getAll().subscribe(heroes => expect(heroes).toEqual(mock));
        httpMock.expectOne('/api/heroes').flush(mock);
    });
});
```

```typescript
// Component test
describe('HeroCardComponent', () => {
    let fixture: ComponentFixture<HeroCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroCardComponent],  // standalone component
            providers: [{ provide: HeroService, useValue: { getAll: () => of([]) } }]
        }).compileComponents();

        fixture = TestBed.createComponent(HeroCardComponent);
        fixture.componentInstance.hero = { id: 1, name: 'Aquaman' };
        fixture.detectChanges(); // trigger ngOnInit + CD
    });

    it('should display hero name', () => {
        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Aquaman');
    });
});
```

**🧙‍♂️ senior** — Isolation decisions:

- **Shallow test** — stub child components with `NO_ERRORS_SCHEMA`: faster, tests template/logic of the target component
  only
- **Integration test** — include real child components: slower, catches cross-component bugs
- `ng-mocks` and `spectator` reduce TestBed boilerplate significantly

---

### 13. Performance Checklist

**🧑‍💻 middle:**

- `trackBy` in `*ngFor` — avoids destroying and recreating list items when data refreshes
- `async` pipe — auto-subscribes and auto-unsubscribes; no memory leaks
- Pure pipes instead of methods in templates — methods are called on every CD cycle; pipes only when input reference
  changes

```html
<!-- ❌ Method in template: recalculated every CD cycle -->
{{ getFormattedDate(order.createdAt) }}

<!-- ✅ Pure pipe: recalculated only when createdAt reference changes -->
{{ order.createdAt | date:'dd.MM.yyyy' }}
```

**🧙‍♂️ senior:**

- `OnPush` on all presentational components — the single highest-impact optimization
- Lazy-load routes — reduces initial bundle size
- `@defer` blocks (Angular 17+) — defer rendering non-critical content until idle or viewport entry:
  ```html
  @defer (on viewport) {
    <app-heavy-chart />
  } @placeholder {
    <div class="chart-placeholder">Loading chart...</div>
  }
  ```
- Bundle analysis: `ng build --stats-json && npx webpack-bundle-analyzer dist/stats.json`
- Angular DevTools (browser extension) — shows change detection time per component

---

### 14. SSR — Angular Universal

**🧙‍♂️ senior** — Server-Side Rendering renders the Angular app in Node.js, sends pre-rendered HTML to the browser (fast
First Contentful Paint), then Angular "hydrates" it (attaches event listeners and takes over).

**Angular 17+ has SSR built-in:**

```bash
ng new my-app --ssr   # new project with SSR
ng add @angular/ssr   # add SSR to existing project
```

**When to use:**

- SEO is critical (web crawlers need pre-rendered HTML)
- Fast FCP on slow devices/networks
- Social sharing previews (Open Graph needs real HTML)

**Trade-offs:**

- Requires Node.js infrastructure (not just a CDN)
- Browser APIs unavailable on server (`window`, `document`, `localStorage`) — guard with:
  ```typescript
  if (isPlatformBrowser(this.platformId)) { /* browser-only code */ }
  ```
- State transfer: server fetches data, serializes it into the HTML, client picks it up to avoid double-fetching (
  TransferState API)
- Hydration mismatch when server and client render different HTML → runtime error

---

## Mental Model — Angular's Architecture

```
Browser
│
├── Zone.js
│   └── Patches setTimeout, Promise, fetch, etc.
│       → Notifies Angular after any async operation to run CD
│
└── Angular Runtime
    │
    ├── Injector Hierarchy
    │   Root Injector (app-wide singletons: HttpClient, Router, AppService)
    │   └── Component Injectors (per-component instances when providers: [...] in @Component)
    │
    ├── Change Detection
    │   Default: checks every component on every event
    │   OnPush: checks only when inputs change / event in subtree / async pipe
    │   Signals (future): fine-grained, no Zone.js needed
    │
    ├── Router
    │   URL → route config → lazy-load bundle → render component into <router-outlet>
    │   Route guards run before navigation
    │
    └── Component Tree
        Smart (Container) Component
        ├── Injects services, owns Observables
        └── Passes data down via @Input(), receives events via @Output()
            └── Dumb (Presentational) Components (OnPush, pure)
```

---

## Architecture & Best Practices

### SOLID in Angular

Angular's architecture makes SOLID more explicit than React — decorators, DI, and NgModules provide natural enforcement points. But the principles are the same; Angular just gives you more tools to apply them.

---

**S — Single Responsibility: one class, one job**

Every component, service, directive, and pipe should have one reason to change.

```typescript
// ❌ Service doing too much
@Injectable({ providedIn: 'root' })
export class UserService {
  getUser(id: string) { /* HTTP */ }
  validateEmail(email: string) { /* validation logic */ }
  formatUserName(user: User) { /* formatting */ }
  sendWelcomeEmail(user: User) { /* email sending */ }
}

// ✅ Split by responsibility
@Injectable({ providedIn: 'root' })
export class UserApiService {         // data access only
  getUser(id: string): Observable<User> { return this.http.get<User>(...); }
}

@Injectable({ providedIn: 'root' })
export class UserValidationService {  // validation only
  isValidEmail(email: string): boolean { /* ... */ }
}

export const formatUserName = (user: User) => `${user.firstName} ${user.lastName}`;
// Pure function, no class needed for a formatter
```

**Apply to components:** a component that fetches data, sorts it, handles form state, and renders three different UI blocks needs to be split. Ask: "what is the *one thing* that would cause me to change this class?"

---

**O — Open/Closed: extend via composition and DI, not modification**

Angular components and services should be extended by providing new implementations, not by adding `if` branches to existing code.

```typescript
// ❌ Brittle — every new export format requires modifying ExportService
@Injectable({ providedIn: 'root' })
export class ExportService {
  export(data: any[], format: 'csv' | 'excel' | 'pdf') {
    if (format === 'csv') { /* ... */ }
    else if (format === 'excel') { /* ... */ }
    else if (format === 'pdf') { /* ... */ }
  }
}

// ✅ Open for extension via strategy pattern + DI
interface Exporter { export(data: any[]): void; }

@Injectable() export class CsvExporter implements Exporter { export(data) { /* csv */ } }
@Injectable() export class PdfExporter implements Exporter { export(data) { /* pdf */ } }

// Component receives whichever exporter is injected — no modification needed for new formats
@Component({ providers: [{ provide: Exporter, useClass: CsvExporter }] })
export class ReportComponent {
  constructor(private exporter: Exporter) {}
  export() { this.exporter.export(this.data); }
}
```

---

**L — Liskov Substitution: components and services should be interchangeable**

If a component accepts `@Input() items: Item[]`, two different implementations of that component should be usable wherever the first one is used. In Angular, this mostly applies to services: any class implementing an interface should be injectable in place of another.

```typescript
// Token-based injection — any class implementing HeroRepository is valid
export abstract class HeroRepository {
  abstract getAll(): Observable<Hero[]>;
  abstract getById(id: string): Observable<Hero>;
}

@Injectable()
export class ApiHeroRepository extends HeroRepository {
  constructor(private http: HttpClient) { super(); }
  getAll() { return this.http.get<Hero[]>('/api/heroes'); }
  getById(id) { return this.http.get<Hero>(`/api/heroes/${id}`); }
}

@Injectable()
export class MockHeroRepository extends HeroRepository {
  getAll() { return of([{ id: '1', name: 'Test Hero' }]); }
  getById(id) { return of({ id, name: 'Test Hero' }); }
}

// In production: { provide: HeroRepository, useClass: ApiHeroRepository }
// In tests:      { provide: HeroRepository, useClass: MockHeroRepository }
// Component never changes — it depends on the abstraction
```

---

**I — Interface Segregation: components should not depend on what they don't use**

Don't pass fat objects to components that only need a few fields. Create specific `@Input()` contracts.

```typescript
// ❌ UserCardComponent receives User (20 fields) but uses 3
@Component({ template: `<img [src]="user.avatarUrl"><span>{{ user.name }}</span>` })
export class UserCardComponent {
  @Input() user!: User;  // entire domain object — re-renders on any User field change
}

// ✅ Specific contract — only what the template uses
interface UserCardData {
  name: string;
  avatarUrl: string;
  isOnline: boolean;
}

@Component({
  template: `<img [src]="data.avatarUrl"><span [class.online]="data.isOnline">{{ data.name }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input() data!: UserCardData;  // minimal, OnPush-friendly
}
```

---

**D — Dependency Inversion: depend on abstractions, inject through DI**

Angular's DI container is designed specifically for this principle. Components and services should depend on interfaces/tokens, not concrete classes.

```typescript
// The injection token is the abstraction
const HERO_REPOSITORY = new InjectionToken<HeroRepository>('HeroRepository');

// Service depends on the token, not the implementation
@Injectable({ providedIn: 'root' })
export class HeroFacade {
  constructor(@Inject(HERO_REPOSITORY) private repo: HeroRepository) {}

  loadHeroes(): Observable<Hero[]> { return this.repo.getAll(); }
}

// Provide different implementations for different environments:
// main.ts (production):  { provide: HERO_REPOSITORY, useClass: ApiHeroRepository }
// test setup:            { provide: HERO_REPOSITORY, useClass: MockHeroRepository }
```

This is Angular's killer feature: the DI system enforces DIP at the framework level.

---

### Smart / Dumb Component Split

The most important architectural pattern in Angular. It directly enables `OnPush` on all presentational components, which is the #1 performance optimization.

```
Smart (Container) Component
├── Injects services via constructor DI
├── Owns state (via BehaviorSubject, Signal, or NgRx)
├── Makes HTTP calls (through services, not directly)
├── Passes data down via @Input() to dumb components
├── Handles @Output() events from dumb components
└── Generally uses default CD (or OnPush with markForCheck)

Dumb (Presentational) Component
├── Receives ALL data via @Input()
├── Emits events via @Output() — no direct service calls
├── Zero DI of domain services in constructor
├── changeDetection: ChangeDetectionStrategy.OnPush ← always
└── Easy to test, Storybook-friendly, reusable
```

```typescript
// ✅ Smart container — owns data, delegates rendering
@Component({
  template: `
    <app-hero-list
      [heroes]="heroes$ | async"
      [loading]="loading$ | async"
      (heroDeleted)="onDelete($event)">
    </app-hero-list>
  `
})
export class HeroListPageComponent {
  heroes$ = this.heroService.getAll();
  loading$ = this.heroService.loading$;
  constructor(private heroService: HeroService) {}
  onDelete(id: number) { this.heroService.delete(id).subscribe(); }
}

// ✅ Dumb component — pure rendering, OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-spinner *ngIf="loading"></app-spinner>
    <ul *ngIf="!loading">
      <li *ngFor="let hero of heroes; trackBy: trackById">
        {{ hero.name }}
        <button (click)="heroDeleted.emit(hero.id)">Delete</button>
      </li>
    </ul>
  `
})
export class HeroListComponent {
  @Input() heroes: Hero[] | null = [];
  @Input() loading: boolean | null = false;
  @Output() heroDeleted = new EventEmitter<number>();
  trackById = (_: number, hero: Hero) => hero.id;
}
```

---

### Service Design Principles

**One service per domain aggregate.** Group by domain concept (Hero, User, Cart), not by HTTP verb.

```typescript
// ❌ Technical grouping — meaningless split
class HeroGetService {}
class HeroPostService {}
class HeroDeleteService {}

// ✅ Domain grouping — cohesive boundary
class HeroService {
  getAll(): Observable<Hero[]> { ... }
  getById(id: string): Observable<Hero> { ... }
  create(hero: Partial<Hero>): Observable<Hero> { ... }
  update(id: string, patch: Partial<Hero>): Observable<Hero> { ... }
  delete(id: string): Observable<void> { ... }
}
```

**Layers in a service:**
1. **API/Repository** — raw HTTP calls, DTO mapping; knows about endpoints and HTTP
2. **Domain service / Facade** — orchestrates multiple repositories, owns business rules; knows about domain
3. **State service** — BehaviorSubject / Signal holding current UI state; knows about what components need

Don't mix layers. An HTTP repository should never know about `BehaviorSubject`.

```typescript
// Layer 1: API — only HTTP concerns
@Injectable({ providedIn: 'root' })
export class HeroApiService {
  constructor(private http: HttpClient) {}
  fetchAll(): Observable<HeroDto[]> { return this.http.get<HeroDto[]>('/api/heroes'); }
}

// Layer 2: Domain service — maps DTOs, owns rules
@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(private api: HeroApiService) {}
  getAll(): Observable<Hero[]> {
    return this.api.fetchAll().pipe(map(dtos => dtos.map(fromDto)));  // DTO → domain
  }
}

// Layer 3: State — what the component tree needs
@Injectable({ providedIn: 'root' })
export class HeroStateService {
  private _heroes$ = new BehaviorSubject<Hero[]>([]);
  readonly heroes$ = this._heroes$.asObservable();

  constructor(private heroService: HeroService) {}
  load() { this.heroService.getAll().subscribe(h => this._heroes$.next(h)); }
}
```

---

### When to Extract a Component

| Signal | Action |
|--------|--------|
| Reused in 2+ places | Extract immediately |
| Template > ~100 lines | Likely needs splitting |
| "and" in description | Split by responsibility |
| Has independent loading/error state | Extract to smart component |
| Can be independently `OnPush` | Extract to dumb component |
| Would benefit from isolated testing | Extract |

---

### Folder Structure — Feature-Based

Avoid organizing by layer (`components/`, `services/`, `pipes/`). Organize by **feature** — all code for a domain lives together.

```
src/app/
├── core/                           # Singleton services, interceptors, guards
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.interceptor.ts
│   │   └── auth.guard.ts
│   ├── error-handler.service.ts
│   └── core.providers.ts           # exported for bootstrapApplication
│
├── shared/                         # Reusable dumb components, pipes, directives
│   ├── components/
│   │   ├── spinner/
│   │   ├── button/
│   │   └── modal/
│   ├── pipes/
│   │   └── truncate.pipe.ts
│   └── shared.module.ts            # or index.ts for standalone
│
├── features/
│   ├── heroes/
│   │   ├── components/
│   │   │   ├── hero-list-page/     # smart
│   │   │   │   └── hero-list-page.component.ts
│   │   │   └── hero-list/          # dumb
│   │   │       └── hero-list.component.ts
│   │   ├── services/
│   │   │   ├── hero-api.service.ts
│   │   │   └── hero.service.ts
│   │   ├── models/
│   │   │   └── hero.model.ts
│   │   └── heroes.routes.ts        # lazy-loaded routes for this feature
│   │
│   └── admin/
│       └── ...
│
└── app.routes.ts                   # top-level: lazy loads feature routes
```

**The public API pattern** — each feature exports only what other features need:
```typescript
// features/heroes/index.ts
export { HeroListPageComponent } from './components/hero-list-page/hero-list-page.component';
export { HeroService } from './services/hero.service';
export type { Hero } from './models/hero.model';
// HeroApiService is internal — not exported
```

---

### Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| Component file | kebab-case + `.component.ts` | `hero-card.component.ts` |
| Component class | PascalCase + `Component` | `HeroCardComponent` |
| Service file | kebab-case + `.service.ts` | `hero.service.ts` |
| Service class | PascalCase + `Service` | `HeroService` |
| Pipe | kebab-case + `.pipe.ts` | `truncate.pipe.ts` |
| Directive | kebab-case + `.directive.ts` | `highlight.directive.ts` |
| Model / Interface | PascalCase | `Hero`, `HeroDto` |
| Route guard | kebab-case + `.guard.ts` | `auth.guard.ts` |
| Interceptor | kebab-case + `.interceptor.ts` | `auth.interceptor.ts` |
| Feature route file | feature-name + `.routes.ts` | `heroes.routes.ts` |
| Smart component suffix | `Page` or `Container` | `HeroListPageComponent` |
| Selector prefix | `app-` (or your team's prefix) | `app-hero-card` |
| Observable property | `$` suffix | `heroes$`, `loading$` |
| BehaviorSubject (private) | `_` prefix + `$` suffix | `_heroes$` |

---

## What to Build — Crash Course Path

Three projects that cover ~80% of Angular interview scenarios. Build in order.

**Project 1 — Hero CRUD (4-6h)**
Practice: Angular CLI, components, services, HTTP, routing, template binding

```bash
ng new hero-app --standalone --routing --style=scss
ng g c hero-list
ng g c hero-detail
ng g c hero-form
ng g s heroes/hero
```

```
Features:
  ✓ List all heroes (GET /api/heroes — use https://jsonplaceholder.typicode.com)
  ✓ View hero detail (route /heroes/:id)
  ✓ Create / edit hero (reactive form with validation)
  ✓ Delete hero with confirmation
  ✓ Loading spinner and error message
```

**Project 2 — Search with RxJS (2-3h)**
Practice: RxJS, switchMap, debounceTime, BehaviorSubject state, async pipe

```
Features:
  ✓ Search input with 400ms debounce
  ✓ Cancel previous HTTP request (switchMap)
  ✓ Loading indicator (distinctUntilChanged)
  ✓ Empty state when no results
  ✓ Error handling (catchError → empty array)
```

**Project 3 — Auth + Protected Routes (3-4h)**
Practice: DI, HTTP interceptors, route guards, NgRx or BehaviorSubject state, lazy loading

```
Features:
  ✓ Login form → POST to API → store JWT in memory
  ✓ HTTP interceptor: attach Bearer token to every request
  ✓ HTTP interceptor: redirect to /login on 401
  ✓ Route guard: canActivate checks if logged in
  ✓ Lazy-loaded admin route (only loads bundle when navigating to /admin)
  ✓ Logout clears token, redirects to /login
```

**After each project, ask yourself:**

- Which components should be dumb (presentational, OnPush)?
- What subscriptions exist and where do they unsubscribe?
- Could any service be replaced with a Signal?
- What would I test first?

---

## Official Tutorials & Resources

**Start here (hands-on, official):**

- 🎯 [angular.dev — Getting Started](https://angular.dev/tutorials/learn-angular) — interactive in-browser tutorial,
  Angular 17+, covers components through DI
- 🎯 [angular.dev — Build your first Angular app](https://angular.dev/tutorials/first-app) — step-by-step: components,
  routing, services, HTTP
- 🎯 [angular.dev — Essentials](https://angular.dev/essentials) — quick conceptual overview (components, templates,
  signals, DI)

**Deeper reference (official docs):**

- [angular.dev — Components](https://angular.dev/guide/components)
- [angular.dev — Dependency Injection in depth](https://angular.dev/guide/di)
- [angular.dev — RxJS in Angular](https://angular.dev/guide/http/making-requests) (HTTP section)
- [angular.dev — Signals](https://angular.dev/guide/signals)
- [angular.dev — Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [angular.dev — Router](https://angular.dev/guide/routing)
- [angular.dev — Testing](https://angular.dev/guide/testing)

**Community & advanced:**

- [RxJS official docs + interactive marble diagrams](https://rxjs.dev/guide/overview)
- [NgRx docs](https://ngrx.io/docs)
- [Angular University blog](https://blog.angular-university.io/) — deep-dives on CD, DI, RxJS
- [Manfred Steyer — Angular Architecture](https://www.angulararchitects.io/blog/) — micro-frontends, Module Federation
- [Angular CLI reference](https://angular.dev/tools/cli)

---

## Glossary

**🧑‍💻 middle:**

- **Angular CLI** — command-line tool (`ng new`, `ng generate`, `ng serve`, `ng build`)
- **Component** — `@Component` class + HTML template + styles; the fundamental UI unit
- **`@Input()`** — decorator marking a property as a settable input from the parent
- **`@Output()`** — decorator marking an `EventEmitter` property that the parent can listen to
- **Directive** — structural (`*ngIf`, `*ngFor`, changes DOM) or attribute (`ngClass`, changes element)
- **Pipe** — template value transformer; pure = ref-change only; impure = every CD cycle
- **DI / Injector** — Angular's dependency injection container; hierarchical (root → component)
- **NgModule** — legacy grouping of declarations/imports/providers/exports
- **Standalone component** — component with its own `imports` array; no NgModule needed (Angular 14+)
- **Observable** — lazy push-based stream from RxJS; does nothing until subscribed
- **Subject** — Observable you can push values into (`next(value)`)
- **BehaviorSubject** — Subject with a current value; new subscribers get it immediately
- **Template-driven forms** — form logic in HTML via `ngModel`; simple use cases
- **Reactive forms** — form logic in TypeScript via `FormGroup`/`FormControl`; recommended

**🧙‍♂️ senior:**

- **Change Detection (CD)** — Angular's mechanism that syncs data model with DOM after events
- **OnPush** — CD strategy: check component only on input reference change / subtree event / async value
- **Zone.js** — patches async browser APIs; notifies Angular when async work completes so CD runs
- **Signal** — synchronous reactive primitive (Angular 16+); Angular tracks reads and updates consumers automatically;
  no subscriptions needed
- **switchMap** — RxJS flattening: cancels previous inner Observable when outer emits (use for search/navigation)
- **exhaustMap** — RxJS flattening: ignores outer emissions while inner is active (use for login button)
- **Smart/dumb split** — container components manage state/services; presentational components are pure functions of
  inputs
- **NgRx** — Redux-pattern state management: Store, Actions, Reducers, Selectors, Effects
- **Lazy loading** — `loadComponent`/`loadChildren` defers bundling and loading until route is visited
- **Route guard** — `CanActivateFn` that runs before navigation; returns boolean/UrlTree
- **HTTP interceptor** — middleware for all HTTP requests/responses; add auth token, handle 401, log
- **SSR / Angular Universal** — server-side rendering for better FCP and SEO
- **Hydration** — process of Angular attaching event listeners to server-rendered HTML
- **Standalone bootstrap** — Angular 17+ app without root NgModule;
  `bootstrapApplication(AppComponent, { providers: [...] })`

{% endraw %}
