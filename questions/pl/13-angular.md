[💡 Questions](questions.md)

# 📘 Angular

<!-- TOC -->
* [📘 Angular](#-angular)
  * [1️⃣ Fundamentals](#1-fundamentals)
  * [2️⃣ Components & Templates](#2-components--templates)
  * [3️⃣ Data & Forms](#3-data--forms)
  * [4️⃣ Advanced / Senior](#4-advanced--senior)
<!-- TOC -->

---

## 1️⃣ Fundamentals

#### 🔹 1. 🧑‍💻 ⭐⭐⭐ Co to jest Angular i czym różni się od React i Vue?

✅ <span style="color:transparent">Odpowiedź</span>

Angular to pełny, opinionated framework TypeScript stworzony przez Google do budowania SPA. Dostarcza wszystko out of the box: router, formularze, klient HTTP, kontener DI, narzędzia testowe.

| Cecha | Angular | React | Vue |
|---|---|---|---|
| Typ | Full framework | UI library | Progressive framework |
| Język | TypeScript | JS/TS | JS/TS |
| Data binding | Two-way (ngModel) | One-way + callbacks | Two-way (v-model) |
| State mgmt | Services + NgRx | Redux/Zustand/etc. | Pinia/Vuex |
| Krzywa uczenia | Stroma | Umiarkowana | Łagodna |

Kiedy Angular: duże zespoły enterprise, Java/C# background (podobny DI model), mocne konwencje są pożądane.

---

#### 🔹 2. 🧑‍💻 ⭐⭐⭐ Czym jest komponent w Angularze i jaki jest jego cykl życia?

✅ <span style="color:transparent">Odpowiedź</span>

Komponent = klasa z dekoratorem `@Component` + szablon HTML + style. Podstawowy blok UI.

```typescript
@Component({
  selector: 'app-hero',
  template: `<h1>{{ hero.name }}</h1>`,
  styles: [`h1 { color: navy; }`]
})
export class HeroComponent implements OnInit, OnDestroy {
  @Input() hero!: Hero;
}
```

**Cykl życia (kolejność):**

1. `ngOnChanges(changes)` — przy każdej zmianie `@Input()`, przed ngOnInit
2. `ngOnInit()` — raz po pierwszym ngOnChanges; tu inicjalizuj dane
3. `ngDoCheck()` — każdy cykl CD (używaj rzadko)
4. `ngAfterContentInit()` — po projekcji `<ng-content>`
5. `ngAfterContentChecked()` — po sprawdzeniu projected content
6. `ngAfterViewInit()` — po załadowaniu widoku i widoków dzieci
7. `ngAfterViewChecked()` — po sprawdzeniu widoku
8. `ngOnDestroy()` — cleanup: anuluj subskrypcje, wyczyść timery

---

#### 🔹 3. 🧑‍💻 ⭐⭐⭐ Co to jest Dependency Injection (DI) i jak Angular go implementuje?

✅ <span style="color:transparent">Odpowiedź</span>

DI = wzorzec, w którym klasa otrzymuje zależności z zewnątrz zamiast tworzyć je samodzielnie. Angular ma wbudowany hierarchiczny kontener DI.

**Jak działa:**
1. Dekorujesz klasę `@Injectable()`
2. Angular odczytuje typy parametrów konstruktora via TypeScript metadata (`reflect-metadata`)
3. Injector tworzy lub odnajduje instancję i wstrzykuje ją

**Hierarchia injectorów:**
- Root injector (singleton app-wide) — `providedIn: 'root'`
- Module injector — `providers: [SomeService]` w `@NgModule`
- Component injector — `providers: [SomeService]` w `@Component` (nowa instancja per drzewo komponentu)

```typescript
@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(private http: HttpClient) {}
}
```

Podanie serwisu w `@Component` tworzy nową instancję (nie singleton) — ważne dla izolacji stanu.

---

#### 🔹 4. 🧑‍💻 ⭐⭐⭐ Jakie typy data bindingu oferuje Angular?

✅ <span style="color:transparent">Odpowiedź</span>

Angular ma 4 rodzaje wiązań:

| Typ | Składnia | Kierunek |
|---|---|---|
| Interpolacja | `{{ value }}` | komponent → szablon |
| Property binding | `[property]="expr"` | komponent → DOM |
| Event binding | `(event)="handler($event)"` | DOM → komponent |
| Two-way binding | `[(ngModel)]="value"` | oba kierunki |

`[(ngModel)]` to syntactic sugar dla `[ngModel]="value" (ngModelChange)="value=$event"` — tzw. "banana in a box".

```html
<input [value]="name" (input)="name = $event.target.value">
<!-- równoważne: -->
<input [(ngModel)]="name">
```

---

#### 🔹 5. 🧑‍💻 ⭐⭐ Czym jest NgModule i do czego służy?

✅ <span style="color:transparent">Odpowiedź</span>

NgModule grupuje powiązane komponenty, dyrektywy, pipe'y i serwisy. Definiuje granicę kompilacji szablonów.

```typescript
@NgModule({
  declarations: [HeroComponent, HeroListComponent],  // komponenty/dyrektywy/pipe'y w tym module
  imports:      [BrowserModule, HttpClientModule],    // importowane moduły
  providers:    [HeroService],                        // serwisy dostępne w module
  exports:      [HeroComponent],                      // co udostępniamy innym modułom
  bootstrap:    [AppComponent]                        // tylko w root module
})
export class AppModule {}
```

**Uwaga:** Standalone components (Angular 14+) w dużej mierze eliminują potrzebę NgModule w nowych projektach.

---

#### 🔹 6. 🧑‍💻 ⭐⭐ Czym różnią się dyrektywy strukturalne od atrybutowych?

✅ <span style="color:transparent">Odpowiedź</span>

**Strukturalne** — zmieniają strukturę DOM (dodają / usuwają elementy):
- `*ngIf`, `*ngFor`, `*ngSwitch`
- `*` to syntactic sugar dla `<ng-template [ngIf]="condition">`

**Atrybutowe** — zmieniają wygląd lub zachowanie istniejącego elementu:
- Wbudowane: `ngClass`, `ngStyle`
- Custom: `@Directive({ selector: '[appHighlight]' })`

```typescript
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  @HostListener('mouseenter') onEnter() {
    this.el.nativeElement.style.background = 'yellow';
  }
  constructor(private el: ElementRef) {}
}
```

---

#### 🔹 7. 🧑‍💻 ⭐⭐ Czym są Pipe'y i jak stworzyć własny?

✅ <span style="color:transparent">Odpowiedź</span>

Pipe transformuje dane w szablonie bez modyfikowania źródła. Wbudowane: `date`, `currency`, `uppercase`, `async`, `json`.

```typescript
@Pipe({ name: 'truncate', pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}
// Użycie: {{ longText | truncate:30 }}
```

`pure: true` (domyślnie) — wywoływany tylko gdy zmieni się referencja wejściowa (szybszy).
`pure: false` — wywoływany przy każdym cyklu CD; używaj tylko gdy konieczne (np. `AsyncPipe`).

---

#### 🔹 8. 🧑‍💻 ⭐⭐ Jak działa routing w Angularze?

✅ <span style="color:transparent">Odpowiedź</span>

Angular Router mapuje ścieżki URL na komponenty. Używa HTML5 History API (brak `#` domyślnie).

```typescript
const routes: Routes = [
  { path: '',           component: HomeComponent },
  { path: 'heroes',    component: HeroListComponent },
  { path: 'hero/:id',  component: HeroDetailComponent },
  { path: '**',        redirectTo: '' }  // wildcard
];
```

W szablonie: `<router-outlet>` wyznacza miejsce renderowania komponentu.
Nawigacja: `this.router.navigate(['/hero', id])` lub `<a routerLink="/hero/1">`.

**Child routes:**
```typescript
{ path: 'admin', component: AdminComponent, children: [
    { path: 'users', component: UserListComponent }
]}
```

---

#### 🔹 9. 🧑‍💻 ⭐⭐ Czym różnią się formularze template-driven od reactive?

✅ <span style="color:transparent">Odpowiedź</span>

| Cecha | Template-driven | Reactive |
|---|---|---|
| Logika | W szablonie (ngModel) | W klasie (TypeScript) |
| Synchroniczność | Asynchroniczne | Synchroniczne |
| Testowalność | Trudniejsza | Łatwa |
| Skalowalność | Proste formy | Złożone formy |
| Import | `FormsModule` | `ReactiveFormsModule` |

```typescript
// Reactive forms
this.form = this.fb.group({
  name:  ['', [Validators.required, Validators.minLength(3)]],
  email: ['', Validators.email]
});
// Walidacja: this.form.get('name')?.errors
```

Zasada: reactive forms dla wszystkiego poza najprostszymi formularzami.

---

#### 🔹 10. 🧑‍💻 ⭐⭐ Jak wykonywać żądania HTTP w Angularze?

✅ <span style="color:transparent">Odpowiedź</span>

Angular dostarcza `HttpClient` (z `HttpClientModule`) zwracający Observable.

```typescript
@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>('/api/heroes').pipe(
      catchError(err => { console.error(err); return EMPTY; })
    );
  }

  createHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>('/api/heroes', hero);
  }
}
```

Zawsze anuluj subskrypcje lub używaj `async` pipe w szablonach (auto-unsubscribe).

---

#### 🔹 11. 🧑‍💻 ⭐⭐ Co to jest Observable (RxJS) i jak Angular go używa?

✅ <span style="color:transparent">Odpowiedź</span>

Observable = strumień wartości w czasie, z biblioteki RxJS. Jest lazy — nic się nie dzieje bez subskrypcji.

**Angular używa RxJS wszędzie:**
- `HttpClient` zwraca Observable
- `Router.events` to Observable
- `FormControl.valueChanges` to Observable
- `EventEmitter` rozszerza Subject

```typescript
// Typowe operatory:
this.searchTerm$.pipe(
  debounceTime(300),         // czekaj 300ms od ostatniego keystroke
  distinctUntilChanged(),    // ignoruj te same wartości
  switchMap(term =>          // anuluj poprzednie żądanie
    this.heroService.search(term)
  )
).subscribe(results => this.results = results);
```

---

#### 🔹 12. 🧑‍💻 ⭐⭐ Co to jest @ViewChild i @ContentChild?

✅ <span style="color:transparent">Odpowiedź</span>

Oba dają dostęp programatyczny do elementów dzieci.

`@ViewChild` — dostęp do elementów we własnym szablonie komponentu:
```typescript
@ViewChild('myInput') inputRef!: ElementRef;
ngAfterViewInit() { this.inputRef.nativeElement.focus(); }
```

`@ContentChild` — dostęp do elementów wprojektowanych przez `<ng-content>`:
```typescript
// Szablon rodzica: <app-card><span #label>Tytuł</span></app-card>
// W app-card:
@ContentChild('label') label!: ElementRef;
ngAfterContentInit() { console.log(this.label.nativeElement.textContent); }
```

Dostępne odpowiednio po `ngAfterViewInit` / `ngAfterContentInit`.

---

#### 🔹 13. 🧑‍💻 ⭐⭐ Czym jest standalone component (Angular 14+)?

✅ <span style="color:transparent">Odpowiedź</span>

Standalone component nie należy do żadnego NgModule — deklaruje własne importy.

```typescript
@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [CommonModule, RouterModule],  // importowane bezpośrednio
  template: `<h1>{{ hero.name }}</h1>`
})
export class HeroComponent {}
```

**Korzyści:**
- Prostszy model mentalny
- Lepsza tree-shaking
- Lazy loading bez modułów: `loadComponent: () => import('./hero.component').then(m => m.HeroComponent)`
- Angular zaleca standalone dla nowych projektów (Angular 17+: domyślny)

---

## 2️⃣ Components & Templates (Senior)

#### 🔹 14. 🧙‍♂️ ⭐⭐⭐ Jak działa Change Detection? Kiedy stosować strategię OnPush?

✅ <span style="color:transparent">Odpowiedź</span>

Change Detection (CD) uruchamia się po każdym zdarzeniu (click, HTTP response, timer) i sprawdza, czy powiązania w szablonie się zmieniły. Domyślnie Angular sprawdza całe drzewo komponentów.

**Strategia OnPush** — Angular sprawdza komponent tylko gdy:
1. Zmieni się **referencja** `@Input()`
2. Pipe `async` otrzyma nową wartość
3. Zdarzenie pochodzi z komponentu lub jego dzieci
4. Wywołano `changeDetectorRef.markForCheck()`

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Kiedy stosować OnPush:**
- Komponenty prezentacyjne (dumb components) przyjmujące dane przez `@Input()`
- Duże listy z wieloma elementami potomnymi
- Jako domyślna strategia w nowych projektach

**Pułapka:** mutacja obiektu (push do array, zmiana property) nie wyzwoli OnPush — musisz stworzyć nową referencję. Użyj immutable updates lub Signals.

---

#### 🔹 15. 🧙‍♂️ ⭐⭐ Czym różnią się Subject, BehaviorSubject i ReplaySubject?

✅ <span style="color:transparent">Odpowiedź</span>

Wszystkie są hot Observable (multicast) — dzielą emisje między wielu subskrybentów.

| Typ | Buforuje | Wymaga wartości init | Kiedy używać |
|---|---|---|---|
| `Subject` | nie | nie | zdarzenia (button click, notification) |
| `BehaviorSubject` | ostatnią wartość | tak | stan (currentUser$, selectedItem$) |
| `ReplaySubject(n)` | ostatnie n wartości | nie | cache ostatnich N zdarzeń |

```typescript
// Wzorzec zarządzania stanem:
private _user$ = new BehaviorSubject<User | null>(null);
readonly user$ = this._user$.asObservable(); // udostępnij jako read-only

setUser(user: User) { this._user$.next(user); }
```

`asObservable()` ukrywa `next()` przed konsumentami — enkapsulacja.

---

#### 🔹 16. 🧙‍♂️ ⭐⭐ Kiedy używać switchMap, mergeMap, concatMap i exhaustMap?

✅ <span style="color:transparent">Odpowiedź</span>

Wszystkie flattenują zagnieżdżone Observable, ale różnią się obsługą konkurentnych emisji:

| Operator | Zachowanie | Kiedy używać |
|---|---|---|
| `switchMap` | Anuluje poprzedni inner Observable | Autocomplete, nawigacja (ostatnie żądanie wygrywa) |
| `mergeMap` | Uruchamia wszystkie równolegle | Równoległe, niezależne żądania (upload wielu plików) |
| `concatMap` | Kolejkuje, jedno na raz | Sekwencyjne operacje (chained writes) |
| `exhaustMap` | Ignoruje nowe emisje gdy aktywny inner | Przycisk logowania (blokuj duplikaty) |

**Mnemotechnika:**
- Switch = anuluj stary, zacznij nowy
- Merge = wszystkie na raz
- Concat = czekaj w kolejce
- Exhaust = ignoruj aż skończę

---

#### 🔹 17. 🧙‍♂️ ⭐⭐ Jak Angular obsługuje wycieki pamięci z subskrypcji?

✅ <span style="color:transparent">Odpowiedź</span>

Każda subskrypcja trzyma Observable żywym w pamięci do czasu anulowania. Typowy wyciek: subskrypcja w `ngOnInit` bez anulowania.

**Rozwiązania (w kolejności preferencji):**

1. **`async` pipe** — auto-unsubscribes gdy komponent zniszczony (najlepsze dla szablonów)
2. **`takeUntilDestroyed()`** (Angular 16+) — operator kończący przy destroy
3. **`takeUntil(this.destroy$)`** — manualne z Subject i ngOnDestroy

```typescript
// Angular 16+ (zalecane):
private destroyRef = inject(DestroyRef);

ngOnInit() {
  this.service.data$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => this.data = data);
}
```

```typescript
// Wzorzec takeUntil (starsze wersje):
private destroy$ = new Subject<void>();

ngOnInit() { this.data$.pipe(takeUntil(this.destroy$)).subscribe(...); }
ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
```

---

#### 🔹 18. 🧙‍♂️ ⭐⭐ Czym jest NgRx i kiedy warto go użyć zamiast serwisów?

✅ <span style="color:transparent">Odpowiedź</span>

NgRx to zarządzanie stanem na wzorcu Redux, zbudowane na RxJS. Kluczowe elementy:
- **Store** — jedno niezmienne drzewo stanu
- **Actions** — opisują zdarzenia (`createAction`)
- **Reducers** — czyste funkcje: `(state, action) → newState`
- **Selectors** — memoizowane projekcje stanu
- **Effects** — side effects (HTTP) wyzwalane przez akcje

**Kiedy używać NgRx:**
- Stan dzielony między wieloma niezwiązanymi komponentami
- Złożone przejścia stanu (optimistic updates, undo/redo)
- Duży zespół wymagający audit trail
- Debugowanie z time-travel (Redux DevTools)

**Kiedy NIE używać:**
- Małe/średnie aplikacje → services + BehaviorSubject
- Stan lokalny feature → smart/dumb pattern
- NgRx Signals Store (nowszy) ma mniejszy boilerplate

---

#### 🔹 19. 🧙‍♂️ ⭐ Jak działa lazy loading z PreloadingStrategy?

✅ <span style="color:transparent">Odpowiedź</span>

Lazy loading ładuje feature modules dopiero gdy użytkownik nawiguje do danej trasy — zmniejsza rozmiar initial bundle.

```typescript
const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  // Standalone (zalecane):
  { path: 'heroes', loadComponent: () => import('./heroes/heroes.component').then(m => m.HeroesComponent) }
];
```

**Strategie preloadowania:**
- `NoPreloading` (domyślnie) — ładuj tylko gdy potrzebne
- `PreloadAllModules` — załaduj wszystkie lazy moduły w tle po initial load
- Custom strategy: zaimplementuj `PreloadingStrategy` (np. na podstawie uprawnień lub warunków sieciowych)

```typescript
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })]
})
```

---

#### 🔹 20. 🧙‍♂️ ⭐⭐ Jak zoptymalizować wydajność aplikacji Angular?

✅ <span style="color:transparent">Odpowiedź</span>

1. **OnPush** na wszystkich komponentach prezentacyjnych
2. **Lazy loading** tras i modułów feature
3. **`trackBy`** w `*ngFor` — zapobiega pełnemu re-renderowi listy

```html
<li *ngFor="let hero of heroes; trackBy: trackById">{{ hero.name }}</li>
```

4. **Pure pipes** zamiast metod w szablonach (metody wywoływane co cykl CD)
5. **`async` pipe** zamiast manualnych subskrypcji
6. **`@defer`** (Angular 17+) — odrocz renderowanie niekrytycznych bloków
7. Unikaj ciężkich obliczeń w szablonach
8. Production build (`ng build --configuration production`) — AoT, tree-shaking, minification

**Profilowanie:** Chrome DevTools + Angular DevTools (czas CD per komponent).

---

#### 🔹 21. 🧙‍♂️ ⭐⭐ Czym są Angular Signals (Angular 16+)?

✅ <span style="color:transparent">Odpowiedź</span>

Signal to reaktywna primitwa — wrapper na wartości powiadamiający Angular o zmianach. Alternatywa dla RxJS do synchronicznego stanu.

```typescript
count = signal(0);
doubled = computed(() => this.count() * 2);  // automatycznie aktualizowany

increment() { this.count.update(v => v + 1); }
// lub: this.count.set(this.count() + 1);
```

**Różnice od RxJS:**
- Sygnały są synchroniczne; Observable mogą być asynchroniczne
- Odczyt przez wywołanie `count()` (pull), nie subskrypcję (push)
- Brak zarządzania subskrypcjami — zero wycieków pamięci
- Sygnały umożliwiają fine-grained CD (przyszłość: zoneless Angular)

**Kiedy używać:**
- Sygnały: lokalny stan komponentu, wartości pochodne
- RxJS: operacje asynchroniczne (HTTP, WebSocket, złożone strumienie zdarzeń)

---

#### 🔹 22. 🧙‍♂️ ⭐ Co to jest Angular Universal (SSR) i kiedy stosować?

✅ <span style="color:transparent">Odpowiedź</span>

Angular Universal renderuje aplikację na serwerze Node.js — wysyła gotowy HTML do przeglądarki (szybki FCP), a następnie Angular hydratuje go (podpina event listenery).

**Kiedy stosować:**
- SEO jest kluczowe (crawlery potrzebują pre-rendered HTML)
- FCP musi być szybki (wolne urządzenia, social sharing)
- Angular 17+ ma SSR wbudowany: `ng new --ssr`

**Trade-offs:**
- Wymaga infrastruktury serwerowej
- Niektóre API przeglądarki niedostępne na serwerze (`document`, `window`) — użyj `isPlatformBrowser()`
- Błędy hydration mismatch (różnica między renderem server i client)
- Złożoność w zarządzaniu stanem (state transfer między server i client)

---

#### 🔹 23. 🧙‍♂️ ⭐⭐ Jak testować komponenty i serwisy w Angularze?

✅ <span style="color:transparent">Odpowiedź</span>

Angular dostarcza `TestBed` do konfiguracji modułu testowego.

```typescript
// Testowanie serwisu:
beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule] }));
const service = TestBed.inject(HeroService);
const httpMock = TestBed.inject(HttpTestingController);

it('should fetch heroes', () => {
  service.getHeroes().subscribe(heroes => expect(heroes.length).toBe(2));
  httpMock.expectOne('/api/heroes').flush([{ id: 1 }, { id: 2 }]);
});
```

```typescript
// Testowanie komponentu:
TestBed.configureTestingModule({
  declarations: [HeroComponent],
  providers: [{ provide: HeroService, useValue: { getHeroes: () => of([]) } }]
});
const fixture = TestBed.createComponent(HeroComponent);
fixture.detectChanges(); // wyzwól ngOnInit
expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Heroes');
```

**Poziomy:**
- Unit: logika w izolacji (spy na zależnościach)
- Integration: TestBed z prawdziwymi komponentami dzieci
- E2E: Cypress lub Playwright

---

#### 🔹 24. 🧙‍♂️ ⭐ Czym jest Module Federation i kiedy stosować mikrofrontendy?

✅ <span style="color:transparent">Odpowiedź</span>

Module Federation to funkcja Webpack 5 umożliwiająca wielu niezależnym aplikacjom Angular (mikrofrontendom) współdzielenie kodu w runtime. Shell app ładuje komponenty/moduły ze zdalnych, oddzielnie wdrożonych aplikacji.

**Kiedy stosować:**
- Wiele zespołów deployuje niezależnie do wspólnego shella
- Różne części aplikacji mają różne cykle wydań
- Skala wymaga niezależnych pipeline'ów CD

**Trade-offs:**
- Znacząca złożoność DevOps (wersjonowanie, kompatybilność remote'ów)
- Konflikty wersji shared libraries
- Trudniejsze debugowanie przez granice remote'ów
- Angular Native Federation (Manfred Steyer) upraszcza dla Angular 17+ z esbuild

---

#### 🔹 25. 🧙‍♂️ ⭐⭐ Jak zaprojektować strategię zarządzania stanem w dużej aplikacji Angular?

✅ <span style="color:transparent">Odpowiedź</span>

**Rodzaje stanu i odpowiednie narzędzia:**

| Rodzaj stanu | Rozwiązanie |
|---|---|
| Lokalny stan komponentu | Pola klasy, Signals |
| Współdzielony stan feature | Service + BehaviorSubject/Signal |
| Stan serwera (cache API) | Angular Query (TanStack Query port) |
| Globalny stan app | NgRx Store / NgRx Signals Store |

**Zasady:**
1. Zacznij prosto (serwisy + BehaviorSubject), dodawaj złożoność tylko gdy potrzebujesz
2. Trzymaj stan jak najniżej (na najniższym komponencie, który go potrzebuje)
3. Wyprowadzaj stan z selectors/computed(), nie przechowuj wartości pochodnych
4. Oddziel stan serwera od stanu UI
5. Dokumentuj, która warstwa jest właścicielem jakiego stanu

---

#### 🔹 26. 🧙‍♂️ ⭐ What is ControlValueAccessor and how does `[(ngModel)]` work under the hood?

✅ <span style="color:transparent">Odpowiedź</span>

`[(ngModel)]` doesn't magically talk to DOM elements — Angular uses the **ControlValueAccessor (CVA)** interface as a bridge. Every built-in form element has a matching CVA class registered via `NG_VALUE_ACCESSOR`.

**Three actors:**
```
NgModel directive     ControlValueAccessor      Native DOM element
(coordinator)         (bridge / adapter)         (<input>, <select>…)
      │                       │                         │
      │── writeValue(val) ───►│── element.value = val ──►│
      │◄── onChange(newVal) ──│◄── (input event) ────────│
```

**Built-in CVA cheat sheet:**

| CVA class | HTML element | Value type |
|-----------|-------------|-----------|
| `DefaultValueAccessor` | `<input>` text/email/…, `<textarea>` | `string` |
| `CheckboxControlValueAccessor` | `<input type="checkbox">` | `boolean` |
| `NumberValueAccessor` | `<input type="number">` | `number` |
| `SelectControlValueAccessor` | `<select>` | `string` |

**`formControlName` uses the same CVA mechanism** — `ngModel` and reactive forms are just different coordinators; the CVA bridge is identical.

**When to write a custom CVA:** when building a custom input widget (date picker, star rating, phone field) that must work with `ngModel` / `formControlName`. Implement `writeValue`, `registerOnChange`, `registerOnTouched`, and register via `NG_VALUE_ACCESSOR`.

---

#### 🔹 27. 🧑‍💻 ⭐ What is `<ng-template>` and what is a template reference variable (`#name`)?

✅ <span style="color:transparent">Odpowiedź</span>

**`<ng-template>`** is an invisible container — a recipe for a chunk of HTML that does *not render by default*. The browser never sees the tag in the DOM. Angular stamps it into the DOM only when instructed (by a structural directive or `NgTemplateOutlet`).

Every `*` structural directive (`*ngIf`, `*ngFor`) expands into a `<ng-template>` behind the scenes:
```html
<!-- What you write: -->
<div *ngIf="isLoggedIn">Welcome!</div>

<!-- What Angular sees: -->
<ng-template [ngIf]="isLoggedIn">
  <div>Welcome!</div>
</ng-template>
```

**Template reference variable (`#name`)** is a local label attached to an element. It makes that element accessible anywhere within the same template:

```html
<input #searchInput type="text">
<button (click)="search(searchInput.value)">Search</button>
```

**`*ngIf` with `else` — how it uses both:**
```html
<div *ngIf="heroes.length > 0; else noHeroes">
  Found {{ heroes.length }} heroes
</div>
<ng-template #noHeroes>
  <p>No heroes found.</p>
</ng-template>
```
`#noHeroes` labels the template; `else noHeroes` tells `*ngIf` which template to stamp when the condition is false.

---

#### 🔹 28. 🧑‍💻 ⭐ What is the difference between HTML Attribute and DOM Property? When to use `[attr.*]`?

✅ <span style="color:transparent">Odpowiedź</span>

They look similar but are completely different things:

| | HTML Attribute | DOM Property |
|--|---------------|-------------|
| Where | `.html` source file | Browser memory (JS object) |
| Role | *Initial* value | *Current* value |
| Type | Always `string` | `boolean`, `number`, `object`… |
| Changes after user input? | No | Yes |

**The classic example:**
```html
<input id="my-input" type="text" value="Start">
```
```javascript
// User types "Hello":
el.getAttribute('value')  // → "Start"  ← HTML didn't change
el.value                  // → "Hello"  ← current DOM state
```

**Why Angular binds to DOM Properties by default:** it allows passing any JS type (array, object, boolean) — not just strings.

**When to use `[attr.*]`:** when a DOM property doesn't exist for that attribute:
```html
<!-- ARIA attributes have no DOM property: -->
<button [attr.aria-label]="label">×</button>

<!-- SVG attributes: -->
<rect [attr.width]="w" [attr.viewBox]="vb">
```

Using `[aria-label]` (property binding) instead of `[attr.aria-label]` throws a runtime error: "Can't bind to 'aria-label' since it isn't a known property".

---

#### 🔹 29. 🧑‍💻 ⭐⭐ What is the Angular 17+ `@if`/`@for` syntax and how does it differ from `*ngIf`/`*ngFor`?

✅ <span style="color:transparent">Odpowiedź</span>

Angular 17 introduced **built-in control flow** — `@if`, `@for`, `@switch` are native template constructs that replace structural directives. No import required.

```html
<!-- @if — no ng-template or #label needed for else: -->
@if (heroes.length > 0) {
  <p>Found {{ heroes.length }} heroes</p>
} @else {
  <p>No heroes.</p>
}

<!-- @for — track is mandatory (like trackBy, but enforced): -->
@for (hero of heroes; track hero.id) {
  <li>{{ hero.name }}</li>
} @empty {
  <li>No items</li>
}

<!-- @switch: -->
@switch (status) {
  @case ('active') { <span class="green">Active</span> }
  @default { <span>Unknown</span> }
}
```

**Key differences from `*ngIf` / `*ngFor`:**
- No `CommonModule` or `NgIf`/`NgFor` import needed
- `@else` is a plain block — no `<ng-template #ref>` required
- `@for` requires `track` (Angular enforces good practice by default)
- `@for` has built-in `@empty` block for empty collections
- Better type narrowing inside `@if` blocks

**When to use which:** use `@if`/`@for` in all new Angular 17+ code. Use `*ngIf`/`*ngFor` only when maintaining older codebases.

---
