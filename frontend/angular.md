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
      * [Structural directives: `*ngIf`, `*ngFor`, `*ngSwitch`](#structural-directives-ngif-ngfor-ngswitch)
      * [Attribute directives: `ngClass`, `ngStyle` and custom](#attribute-directives-ngclass-ngstyle-and-custom)
      * [Pipes — display formatting without polluting the component](#pipes--display-formatting-without-polluting-the-component)
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

**🧙‍♂️ senior — Under the hood: ControlValueAccessor (CVA)**

`[(ngModel)]` doesn't magically know how to read/write to any DOM element. Angular uses the
**ControlValueAccessor** interface as a bridge between the form model and the native element. Every
form element (`<input>`, `<select>`, `<textarea>`) has a matching CVA class that Angular attaches
automatically via the element's CSS selector.

**Three actors:**

```
NgModel directive        ControlValueAccessor        Native DOM element
(the coordinator)        (the bridge / adapter)      (<input>, <select>…)
       │                         │                          │
       │── writeValue(val) ─────►│── element.value = val ──►│
       │                         │                          │
       │◄── onChange(newVal) ────│◄── (input/change event)──│
```

**When Angular compiles `<input [(ngModel)]="name">`:**
1. Angular creates an `NgModel` directive instance
2. `NgModel` looks up the `NG_VALUE_ACCESSOR` injection token — Angular finds `DefaultValueAccessor` (it's decorated with `{ provide: NG_VALUE_ACCESSOR, useExisting: DefaultValueAccessor, multi: true }`)
3. `NgModel` calls `cva.registerOnChange(fn)` — CVA will call `fn(newVal)` whenever the `input` event fires
4. `NgModel` calls `cva.registerOnTouched(fn)` — CVA calls `fn()` on `blur`
5. **DOM → model:** user types → `input` fires → CVA calls `fn(newVal)` → `NgModel` updates form model → `ngModelChange` fires → `name` in your component is updated
6. **Model → DOM:** `name` changes programmatically → `NgModel` calls `cva.writeValue(name)` → CVA sets `element.value = name`

**The ControlValueAccessor interface:**

```typescript
interface ControlValueAccessor {
  // Angular → DOM: called when the form model value changes; update the DOM display
  writeValue(value: any): void;

  // Register Angular's callback; call it with new value whenever DOM changes
  registerOnChange(fn: (value: any) => void): void;

  // Register Angular's callback; call it when the element loses focus
  registerOnTouched(fn: () => void): void;

  // Optional: called when control is programmatically enabled/disabled
  setDisabledState?(isDisabled: boolean): void;
}
```

> **Key insight:** `formControlName` (reactive forms) uses the *same* CVA mechanism.
> Both `ngModel` and `formControlName` are just different directive-level coordinators;
> the CVA bridge to the DOM is identical.

---

**Ściągawka: Który element ma jaki ControlValueAccessor?**

| Klasa CVA | Selektor HTML | Zdarzenie DOM | Zwracany typ |
|-----------|--------------|---------------|--------------|
| `DefaultValueAccessor` | `<input>` (text, email, password, search, tel, url…), `<textarea>` | `input`, `blur` | `string` |
| `CheckboxControlValueAccessor` | `<input type="checkbox">` | `change` | `boolean` |
| `RadioControlValueAccessor` | `<input type="radio">` | `change` | wartość `value` atrybutu (string) |
| `SelectControlValueAccessor` | `<select>` (jednokrotny wybór) | `change`, `blur` | `string` |
| `SelectMultipleControlValueAccessor` | `<select multiple>` | `change`, `blur` | `string[]` |
| `NumberValueAccessor` | `<input type="number">` | `input`, `blur` | `number` (lub `null` dla pustego) |
| `RangeValueAccessor` | `<input type="range">` | `input`, `change`, `blur` | `number` |

Źródła: [Angular docs — ControlValueAccessor](https://angular.dev/api/forms/ControlValueAccessor),
[Built-in CVA source](https://github.com/angular/angular/tree/main/packages/forms/src/directives)

---

**Implementacja własnego CVA — custom form control:**

Gdy tworzysz własny komponent wejściowy (np. date picker, phone field, rating widget), musisz
zaimplementować CVA żeby działało z `ngModel` i `formControlName`.

```typescript
@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <span *ngFor="let i of [1,2,3,4,5]"
          (click)="setValue(i)"
          [class.filled]="i <= value">★</span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true   // ← multi: true jest obowiązkowe dla NG_VALUE_ACCESSOR
    }
  ]
})
export class StarRatingComponent implements ControlValueAccessor {
  value = 0;
  private onChange: (v: number) => void = () => {};
  private onTouched: () => void = () => {};

  // Angular → komponent: ustaw wartość
  writeValue(value: number): void {
    this.value = value ?? 0;
  }

  // Zarejestruj callback Angular → wywołuj go gdy wartość się zmieni
  registerOnChange(fn: (v: number) => void): void {
    this.onChange = fn;
  }

  // Zarejestruj callback Angular → wywołuj go przy blur
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Opcjonalne: obsługa disabled state
  setDisabledState(disabled: boolean): void {
    // np. this.disabled = disabled;
  }

  setValue(rating: number): void {
    this.value = rating;
    this.onChange(rating);   // ← powiadom Angular o zmianie
    this.onTouched();        // ← oznacz jako touched
  }
}

// Użycie — działa identycznie jak <input>:
// Template-driven:  <app-star-rating [(ngModel)]="product.rating">
// Reactive:         <app-star-rating formControlName="rating">
```

**Pułapka — `forwardRef`:** potrzebne gdy klasa jest zarejestrowana w `providers` zanim
JavaScript zdąży ją w pełni zdefiniować (circular reference w tym samym pliku). Bez niego
`useExisting: StarRatingComponent` zwróci `undefined`.

---

**🧙‍♂️ senior — HTML Attribute vs DOM Property — dwa różne światy**

To jedna z najczęściej mylonych rzeczy w webdevie. W języku polskim oba słowa tłumaczymy jako "atrybut", ale w kodzie to zupełnie odrębne byty.

**Prosta zasada:**
- **HTML Attribute** = stan *początkowy*, żyje w pliku `.html`, zawsze `string`
- **DOM Property** = stan *aktualny*, żyje w pamięci przeglądarki jako obiekt JS, może być `boolean`, `number`, `object`

**Analogia:** wyobraź sobie formularz papierowy (HTML Attribute) i bazę danych (DOM Property). Formularz wypełniasz raz na początku — to wartość inicjalna. Baza danych jest aktualizowana na żywo gdy coś się zmienia. Formularz papierowy się nie zmienia nawet gdy rekord w bazie już wygląda inaczej.

---

**Przykład który wszystko wyjaśnia — `<input value="Start">`:**

```html
<input id="moj-input" type="text" value="Start">
```

Gdy strona się ładuje — obie wartości są równe `"Start"`:
```javascript
const el = document.getElementById('moj-input');
el.getAttribute('value')  // → "Start"  (HTML attribute)
el.value                  // → "Start"  (DOM property)
```

Teraz użytkownik wpisuje w pole słowo `"Cześć"`:
```javascript
el.getAttribute('value')  // → "Start"  ← NADAL! HTML się nie zmienił.
el.value                  // → "Cześć"  ← aktualny stan w pamięci

el.defaultValue           // → "Start"  ← alias do getAttribute('value')
```

HTML attribute `value` reprezentuje wartość *domyślną* (`defaultValue`). DOM property `value` to to, co widzisz teraz w polu.

---

**Tabela: attribute vs property — kluczowe różnice**

| Cecha | HTML Attribute | DOM Property |
|-------|---------------|-------------|
| Gdzie istnieje | Kod źródłowy HTML / `.html` | Pamięć przeglądarki (obiekt JS) |
| Rola | Wartość *inicjalna* | Wartość *aktualna* |
| Typ | Zawsze `string` | `boolean`, `number`, `object`, `string`… |
| Zmienia się po interakcji? | Nie | Tak |
| API JavaScript | `element.getAttribute('name')` | `element.name` |
| Jak ustawić w Angularze | `[attr.name]="expr"` | `[name]="expr"` |

---

**Dlaczego Angular binduje do DOM Properties, nie HTML Attributes:**

```html
<!-- ✅ Property binding — Angular ustawia element.disabled = true/false -->
<button [disabled]="isFormInvalid">Submit</button>

<!-- ✅ Property binding — przekazuje tablicę (nie string!) -->
<app-chart [data]="chartData"></app-chart>

<!-- ✅ Property binding — przekazuje obiekt -->
<app-user-card [user]="currentUser"></app-user-card>
```

Gdyby Angular bindował do HTML attributes, mógłby przekazywać tylko stringi. Bindowanie do DOM properties pozwala przekazywać **dowolne typy JS** — tablice, obiekty, booleany — bez żadnej serializacji. To dlatego Angular domyślnie używa `[property]="expr"`, a nie `attr.property="expr"`.

---

**Kiedy musisz użyć attribute binding `[attr.*]`:**

Niektóre atrybuty HTML *nie mają* odpowiadającej im DOM property. Najczęstsze przypadki:

```html
<!-- ARIA — dostępność: nie ma DOM property "aria-label" -->
<button [attr.aria-label]="buttonLabel">×</button>

<!-- SVG — większość atrybutów SVG nie ma DOM property -->
<svg><rect [attr.width]="rectWidth" [attr.viewBox]="viewBox"></svg>

<!-- colspan / rowspan w tabelach -->
<td [attr.colspan]="columnSpan">...</td>

<!-- Niestandardowe atrybuty data-* (choć zwykle lepiej użyć [attr.data-id]) -->
<div [attr.data-testid]="testId">...</div>
```

**Błąd gdy używasz property binding na nieistniejącej property:**
```html
<!-- ❌ Runtime error: "Can't bind to 'aria-label' since it isn't a known property of 'button'" -->
<button [aria-label]="label">×</button>

<!-- ✅ Poprawnie: użyj attr. prefiksu -->
<button [attr.aria-label]="label">×</button>
```

**Mnemotechnika:** jeśli nie jesteś pewien czy element ma daną DOM property — sprawdź w DevTools konsoli: `document.querySelector('twój-element').` i tab-complete. Jeśli nie widzisz property → użyj `[attr.*]`.

---

### 4. Directives & Pipes

**🧑‍💻 middle** — A directive is an instruction you attach to an HTML element: "when you see this CSS selector in a template, do something with that element." Directives are invisible in the DOM — they are pure behavior attached to elements.

Angular has two types of directives with completely different roles:
- **Structural** — decide *whether* an element exists in the DOM at all
- **Attribute** — decide *how* an existing element looks or behaves

**When to use which:**
- Use a **structural directive** (`*ngIf`, `@if`, `*ngFor`, `@for`) when you want to show/hide or repeat elements
- Use an **attribute directive** (`[ngClass]`, `[ngStyle]`, custom) when the element stays in the DOM but you want to change its appearance or add behavior
- Use a **pipe** (`| date`, `| currency`, custom) when you want to format/transform a value purely for display, without touching the underlying data

---

#### Structural directives: `*ngIf`, `*ngFor`, `*ngSwitch`

**Why the asterisk `*`?**

The asterisk is syntactic sugar. When Angular compiles `*ngIf="condition"` it expands it to:

```html
<!-- What you write: -->
<div *ngIf="isLoggedIn">Welcome!</div>

<!-- What Angular actually sees after expanding *: -->
<ng-template [ngIf]="isLoggedIn">
  <div>Welcome!</div>
</ng-template>
```

Every structural directive does the same thing: it wraps the element in a `<ng-template>` and controls whether that template gets stamped into the DOM.

---

**What is `<ng-template>`?**

`<ng-template>` is an **invisible container** — a recipe for a chunk of HTML that by default *does not render*. The browser never sees the `<ng-template>` tag in the DOM. Angular treats its content as a template to be stamped out conditionally or repeatedly.

Think of it as a rubber stamp: the stamp itself does nothing — you have to press it onto paper (stamp it) before anything appears.

---

**What is `#noHeroes`? — Template Reference Variable**

`#variableName` is a **local variable in the template**. It works like a sticky label — it gives an element a name you can reference *anywhere in the same template*.

```html
<input #searchInput type="text">
<button (click)="search(searchInput.value)">Search</button>
```

`#searchInput` creates a variable `searchInput` pointing to the `<input>` DOM element. You can use it anywhere in the same template.

---

**`*ngIf` with `else` — step by step:**

```html
<div *ngIf="heroes.length > 0; else noHeroes">
  Found {{ heroes.length }} heroes
</div>
<ng-template #noHeroes>
  <p>No heroes found.</p>
</ng-template>
```

Read this as:
1. `*ngIf="heroes.length > 0"` — if condition is true → render `<div>` into the DOM
2. `; else noHeroes` — if false → find the `<ng-template>` labelled `#noHeroes` and stamp *its* content instead
3. `<ng-template #noHeroes>` — the "no results" recipe; `#noHeroes` is the label you attach to it

**Why not a plain `else`?** Because HTML has no conditional mechanism. Angular needs the alternative DOM *defined somewhere* — that's exactly what `<ng-template>` with a template reference variable provides.

> **Angular 17+ simplification:** `@if`/`@else` blocks work like real language constructs with no `<ng-template>` needed (see below).

---

**`*ngFor` — iterating over a list:**

```html
<ul>
  <li *ngFor="let hero of heroes; let i = index; trackBy: trackById">
    {{ i + 1 }}. {{ hero.name }}
  </li>
</ul>
```

Broken down:
- `let hero of heroes` — for each item in `heroes`, create a local variable `hero`
- `let i = index` — optional: `i` = the current element's index (0, 1, 2…)
- `trackBy: trackById` — **why this matters:** see below

**What is `trackBy` and why do we need it?**

By default, when a list changes (e.g. new data arrives from an API), Angular compares items *by object reference*. Even if the data is identical, new JS objects mean Angular destroys and recreates the entire DOM list.

`trackBy` tells Angular: "don't compare by reference — compare by this value (e.g. `id`)."

```typescript
// In the component:
trackById(index: number, hero: Hero): number {
  return hero.id; // Angular uses hero.id as identity, not the object reference
}
```

```html
<!-- Angular now knows that a hero with id=5 is "the same" hero
     even if it arrived as a new JS object from the API -->
<li *ngFor="let hero of heroes; trackBy: trackById">{{ hero.name }}</li>
```

Without `trackBy`: API refresh → entire DOM list destroyed and recreated → focus lost, animations broken, slow.
With `trackBy`: API refresh → Angular only updates changed items → fast.

---

**Angular 17+ — new `@if` / `@for` syntax (built-in, no imports needed):**

```html
<!-- No need to import CommonModule / NgIf -->
@if (heroes.length > 0) {
  <p>Found {{ heroes.length }} heroes</p>
} @else {
  <p>No heroes.</p>
}

@for (hero of heroes; track hero.id) {
  <li>{{ hero.name }}</li>
} @empty {
  <li>No items</li>
}

@switch (status) {
  @case ('active') { <span class="green">Active</span> }
  @case ('inactive') { <span class="gray">Inactive</span> }
  @default { <span>Unknown</span> }
}
```

`@for` requires `track` (equivalent of `trackBy`) — Angular 17 enforced good practice from the start.

**When to use `*ngIf` vs `@if`:** Use `@if` in all new code (Angular 17+). Use `*ngIf` only in existing codebases that haven't migrated yet.

---

#### Attribute directives: `ngClass`, `ngStyle` and custom

**Attribute directives do not change the DOM structure** — they change *how* an existing element looks or behaves.

```html
<!-- ngClass: add/remove CSS classes based on an expression -->
<div [ngClass]="{
  'btn--active':   isActive,
  'btn--disabled': !isEnabled,
  'btn--large':    size === 'lg'
}">Button</div>

<!-- Simpler when toggling a single class: -->
<div [class.active]="isActive">Button</div>

<!-- ngStyle: set inline styles dynamically -->
<div [ngStyle]="{ 'color': textColor, 'font-size': fontSize + 'px' }">Text</div>

<!-- Simpler: -->
<div [style.color]="textColor">Text</div>
```

**When to write a custom attribute directive:**

When you want to attach reusable *behavior* to any element without creating a new component. Examples: hover highlight, auto-focus on modal open, number formatting inside an input, tooltip, drag-and-drop handle.

If you need **structure** (wrapping, conditional rendering) → structural directive.
If you need **reusable UI with its own template** → component.
If you need **behavior attached to any existing element** → attribute directive.

```typescript
@Directive({
  selector: '[appHighlight]', // attaches to any element with this attribute
  standalone: true
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow'; // pass a color: <p appHighlight="pink">

  @HostListener('mouseenter') onEnter() {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }
  @HostListener('mouseleave') onLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }

  constructor(private el: ElementRef) {}
}

// Usage:
// <p appHighlight>Hover me (yellow)</p>
// <p appHighlight="lightblue">Hover me (blue)</p>
```

`@HostListener` registers an event listener on the *host* element (the one the directive is attached to). Angular automatically removes it when the directive is destroyed — zero memory leaks.

---

#### Pipes — display formatting without polluting the component

**Why pipes at all?** Imagine you have a date `2026-06-21T14:30:00Z` and want to show it as `21.06.2026`. You could:

```typescript
// ❌ In the component: display logic mixed with business logic
get formattedDate() {
  return this.order.createdAt.toLocaleDateString('pl-PL', { ... });
}
```

```html
<!-- ✅ Pipe: formatting logic lives in one reusable place -->
{{ order.createdAt | date:'dd.MM.yyyy' }}
```

A pipe is a pure transform function `(value, ...params) → formatted value` that lives in the template after the `|` symbol. It never mutates the source data.

**When to use a pipe vs a method:**
- Use a **pipe** when you're only changing *how a value is displayed* (dates, currencies, truncation, capitalization)
- Use a **component method or getter** when the transformation involves business logic, state, or side effects
- Use **`| async`** whenever you display data from an Observable — it auto-subscribes and auto-unsubscribes

**Built-in pipes:**

```html
{{ createdAt | date:'dd.MM.yyyy' }}           <!-- "21.06.2026" -->
{{ createdAt | date:'dd.MM.yyyy HH:mm' }}     <!-- "21.06.2026 14:30" -->
{{ price | currency:'PLN':'symbol':'1.2-2' }} <!-- "3 999,00 zł" -->
{{ name | uppercase }}                        <!-- "ALICE" -->
{{ name | lowercase }}                        <!-- "alice" -->
{{ longText | slice:0:100 }}                  <!-- first 100 chars -->
{{ bigObject | json }}                        <!-- debug: dump as JSON -->
{{ heroes$ | async }}                         <!-- subscribe to Observable, auto-unsubscribe -->
```

Pipes chain left to right:
```html
{{ name | lowercase | titlecase }}  <!-- "alice kowalski" → "Alice Kowalski" -->
```

**Custom pipe — step by step:**

```typescript
@Pipe({
  name: 'truncate',  // the name used in templates: {{ text | truncate }}
  pure: true,        // default; see senior section below for what this means
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  // Angular calls transform() with the value and any colon-separated params
  transform(value: string, limit = 50, ellipsis = '…'): string {
    if (!value) return '';
    return value.length > limit
      ? value.slice(0, limit) + ellipsis
      : value;
  }
}

// Usage:
// {{ longText | truncate }}           → limit=50 (default)
// {{ longText | truncate:30 }}        → limit=30
// {{ longText | truncate:30:'...' }}  → limit=30, custom ellipsis
```

---

**🧙‍♂️ senior — `pure: true` vs `pure: false` — the performance trap**

Angular does not call a pipe on every single change — that would be catastrophically slow. Instead:

**`pure: true` (default):** Angular calls `transform()` only when the *reference* of the input value changes. If you pass an array `heroes` and add an element via `push()` — the array reference doesn't change → the pipe *does not re-run* → you see the old value.

```typescript
// ❌ pure pipe won't see this change:
this.heroes.push(newHero);  // same array, same reference

// ✅ pure pipe will see this:
this.heroes = [...this.heroes, newHero];  // new array = new reference
```

**`pure: false`:** Angular calls `transform()` on *every change detection cycle* — even when you click anywhere on the page. Use only when absolutely necessary (mutable collections you cannot replace with immutable updates).

**`AsyncPipe`** is impure internally (it must react to every Observable emission), but Angular handles subscriptions safely. Always prefer `| async` over manual subscriptions in templates.

```html
<!-- ✅ async pipe: auto-subscribe, auto-unsubscribe, no memory leaks -->
<li *ngFor="let hero of heroes$ | async">{{ hero.name }}</li>

<!-- vs ❌ manual subscription: remember to unsubscribe in ngOnDestroy! -->
```

---

### 5. Modules vs Standalone Components

**🧑‍💻 middle** — To understand NgModule, you first need to understand the problem it solves.

**The problem: Angular needs to know what each template "sees"**

When Angular compiles an HTML template, it encounters tags like `<app-hero-card>`, `*ngIf`, `| date`. It needs to know: what is `app-hero-card`? Which component class? Where does `*ngIf` come from?

Without any registration system, Angular would have to load *the entire application* to answer these questions. NgModule was the solution: declare what exists and what is visible during template compilation.

---

**NgModule — four arrays and what each one does:**

```typescript
@NgModule({
  // 1. declarations: "these classes BELONG to this module"
  //    Register components, directives and pipes whose
  //    TEMPLATES should be compiled in the context of this module.
  //    Each class can only be declared in ONE module.
  declarations: [HeroListComponent, HeroCardComponent, TruncatePipe],

  // 2. imports: "these modules share their exports with us"
  //    Allows templates in declarations to use directives,
  //    components and pipes from the imported modules.
  imports: [BrowserModule, HttpClientModule, RouterModule, SharedModule],

  // 3. providers: "these services are available via DI in this module"
  //    (rarely needed — prefer providedIn: 'root' in services)
  providers: [HeroService],

  // 4. exports: "these classes are available to modules that import us"
  //    Without exports, other modules cannot use HeroCardComponent
  //    even if they import HeroModule.
  exports: [HeroCardComponent, TruncatePipe],

  // bootstrap: root module only — which component starts the app
  bootstrap: [AppComponent]
})
export class HeroModule {}
```

**Analogy:** NgModule is like an npm package — you declare what's in it (`declarations`), what it needs from outside (`imports`), and what it exposes to others (`exports`).

---

**Problems with NgModule (that led Angular to create standalone):**

1. **Verbose boilerplate** — every new component must be added to a module's `declarations`
2. **Cryptic "not found" errors** — forgetting to declare a component gives you an unhelpful "unknown element" error
3. **Painful lazy loading** — you need a dedicated module for each lazy-loaded route
4. **Circular imports** — modules importing each other cause mysterious runtime errors

---

**Standalone Component (Angular 14+, default since Angular 17)**

A standalone component declares its own dependencies — it doesn't need a module.

```typescript
@Component({
  standalone: true,          // ← this one line changes everything
  selector: 'app-hero-card',
  imports: [                 // ← instead of being in a module, imports go here
    NgIf,                    //   import just what you need (better tree-shaking)
    RouterModule,
    TruncatePipe,            // import standalone pipes/components directly
  ],
  template: `
    <h2>{{ hero.name | truncate:30 }}</h2>
    <a [routerLink]="['/hero', hero.id]">Details</a>
  `
})
export class HeroCardComponent {
  @Input() hero!: Hero;
}
```

**When to use NgModule vs standalone:**
- **New project** → always use standalone (it's the Angular default)
- **Existing NgModule codebase** → migrate gradually; they coexist without issues
- **Library publishing** → standalone components are easier to consume without forcing module imports
- **Lazy loading a feature** → with standalone, `loadComponent` replaces `loadChildren` + a dedicated module

**NgModule vs Standalone — comparison:**

| Aspect | NgModule | Standalone |
|--------|----------|-----------|
| Where you declare template dependencies | In the module (`imports`) | In the component itself (`imports`) |
| Do you need a module? | Yes | No |
| Lazy loading | `loadChildren` → module | `loadComponent` → component directly |
| Tree-shaking | Weaker (entire module loaded) | Better (only used imports) |
| Boilerplate | High | Low |

**Bootstrapping a standalone app (`main.ts`):**

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),      // replaces RouterModule.forRoot(routes)
    provideHttpClient(),        // replaces HttpClientModule
    provideAnimations(),        // replaces BrowserAnimationsModule
  ]
});
```

The `provide*` functions replace modules — they are tree-shakeable and have no module overhead.

**🧙‍♂️ senior** — Standalone components change the loading tree: instead of `loadChildren: () => import('./hero/hero.module').then(m => m.HeroModule)` you write `loadComponent: () => import('./hero/hero.component').then(m => m.HeroComponent)`. Each standalone component has its own injector scope — you can provide services in a `loadComponent` route's `providers` array so they only live as long as that route is active, giving you scoped service instances without any module setup.

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
