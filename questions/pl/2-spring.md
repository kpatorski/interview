# 🌱 SPRING ECOSYSTEM

---

# 1️⃣ IoC i Dependency Injection

## 🔹 1. Czym jest IoC (Inversion of Control)?

### ✅ Odpowiedź

Inversion of Control oznacza odwrócenie kontroli nad tworzeniem i zarządzaniem zależnościami.

Zamiast:
- Klasa sama tworzy swoje zależności (new Service()),

To:
- Kontener (Spring) tworzy obiekty i wstrzykuje je do klas.

Korzyści:
- Luźne powiązania (loose coupling),
- Łatwiejsze testowanie,
- Możliwość podmiany implementacji.

---

## 🔹 2. Czym jest Dependency Injection?

### ✅ Odpowiedź

Dependency Injection to mechanizm dostarczania zależności do klasy z zewnątrz.

Rodzaje:
- Constructor injection (zalecane),
- Setter injection,
- Field injection (niezalecane).

Constructor injection:
- Zapewnia immutability zależności,
- Ułatwia testowanie,
- Wymusza kompletność obiektu.

---

## 🔹 3. Jak działa kontener Springa krok po kroku?

### ✅ Odpowiedź

1. Odczyt konfiguracji (@Configuration, @ComponentScan).
2. Rejestracja definicji beanów (BeanDefinition).
3. Tworzenie instancji beanów.
4. Wstrzykiwanie zależności.
5. Wywołanie callbacków (np. @PostConstruct).
6. Bean gotowy do użycia.

Spring używa refleksji do tworzenia i łączenia obiektów.

---

## 🔹 4. Jakie są scope beanów?

### ✅ Odpowiedź

- singleton (domyślny) — jedna instancja na kontekst.
- prototype — nowa instancja przy każdym pobraniu.
- request — jedna instancja na request HTTP.
- session — jedna instancja na sesję.
- application — jedna instancja na aplikację webową.

Singleton w Springu ≠ Singleton w sensie wzorca projektowego (jest per ApplicationContext).

---

## 🔹 5. Czym jest lifecycle beana?

### ✅ Odpowiedź

Etapy:
1. Instancja.
2. Wstrzyknięcie zależności.
3. BeanPostProcessor (before).
4. @PostConstruct.
5. Bean gotowy.
6. Przy zamknięciu kontekstu — @PreDestroy.

BeanPostProcessor umożliwia modyfikację beanów (np. tworzenie proxy).

---

## 🔹 6. Czym jest @Primary i @Qualifier?

### ✅ Odpowiedź

Jeśli istnieje wiele implementacji interfejsu:

@Primary — wskazuje domyślny bean.
@Qualifier — pozwala wybrać konkretną implementację.

Zapobiega NoUniqueBeanDefinitionException.


---

# 2️⃣ @Transactional (Mechanizm Transakcji)

## 🔹 7. Jak działa @Transactional pod spodem?

### ✅ Odpowiedź

@Transactional działa poprzez AOP.

Spring:
1. Tworzy proxy dla beana (JDK dynamic proxy lub CGLIB).
2. Proxy przechwytuje wywołanie metody.
3. Otwiera transakcję (PlatformTransactionManager).
4. Wywołuje metodę.
5. Commit lub rollback w zależności od wyniku.

Jeśli metoda jest wywołana bezpośrednio (self-invocation) — proxy nie jest używane i transakcja nie zadziała.

---

## 🔹 8. Kiedy @Transactional NIE działa?

### ✅ Odpowiedź

- Metoda private.
- Metoda final (przy CGLIB ograniczenia proxy).
- Wywołanie self-invocation.
- Bean niezarządzany przez Spring.
- Brak skonfigurowanego TransactionManager.

---

## 🔹 9. Jak działają propagacje transakcji?

### ✅ Odpowiedź

Propagation określa zachowanie przy wywołaniu metody wewnątrz istniejącej transakcji.

REQUIRED (domyślne):
- Dołącza do istniejącej lub tworzy nową.

REQUIRES_NEW:
- Zawsze tworzy nową transakcję.
- Zawiesza obecną.

MANDATORY:
- Wymaga istniejącej transakcji.
- Jeśli brak → wyjątek.

SUPPORTS:
- Działa w transakcji jeśli istnieje.
- Jeśli nie → bez transakcji.

NOT_SUPPORTED:
- Zawiesza istniejącą transakcję.

NEVER:
- Jeśli istnieje transakcja → wyjątek.

NESTED:
- Tworzy savepoint (jeśli wspierane przez DB).

---

## 🔹 10. Jakie są poziomy izolacji?

### ✅ Odpowiedź

READ_UNCOMMITTED:
- Możliwe dirty reads.

READ_COMMITTED:
- Brak dirty reads.
- Możliwe non-repeatable reads.

REPEATABLE_READ:
- Brak dirty i non-repeatable reads.
- Możliwe phantom reads.

SERIALIZABLE:
- Najwyższa izolacja.
- Zachowuje się jak wykonanie sekwencyjne.
- Najmniej wydajny.

Dirty read — odczyt niezatwierdzonych danych.
Non-repeatable read — ten sam rekord zwraca różne wartości.
Phantom read — nowe rekordy pojawiają się w wyniku tego samego zapytania.

---

## 🔹 11. Kiedy rollback NIE nastąpi?

### ✅ Odpowiedź

Domyślnie rollback następuje tylko dla RuntimeException i Error.

Nie nastąpi dla:
- Checked exception (chyba że rollbackFor ustawione).
- Jeśli wyjątek został złapany i nie rzucony dalej.

Można wymusić rollback:
@Transactional(rollbackFor = Exception.class)

---

## 🔹 12. Czym jest TransactionManager?

### ✅ Odpowiedź

PlatformTransactionManager zarządza cyklem życia transakcji.

Implementacje:
- DataSourceTransactionManager (JDBC).
- JpaTransactionManager (JPA).
- JtaTransactionManager (rozproszone transakcje).

Odpowiada za:
- begin,
- commit,
- rollback,
- zarządzanie zasobami (Connection).


---

# 3️⃣ Spring AOP

## 🔹 13. Czym jest AOP (Aspect-Oriented Programming)?

### ✅ Odpowiedź

AOP pozwala wydzielić logikę przekrojową (cross-cutting concerns), taką jak:
- transakcje,
- logowanie,
- bezpieczeństwo,
- cache.

Zamiast umieszczać ją w każdej metodzie — definiuje się aspekt.

---

## 🔹 14. Jak działa AOP w Springu?

### ✅ Odpowiedź

Spring AOP działa w oparciu o proxy.

1. Tworzony jest proxy beana.
2. Proxy przechwytuje wywołanie metody.
3. Wykonywana jest logika aspektu (np. @Around).
4. Wywoływana jest metoda docelowa.

Spring AOP działa tylko na metodach publicznych beanów zarządzanych przez Spring.

---

## 🔹 15. Czym różni się JDK Dynamic Proxy od CGLIB?

### ✅ Odpowiedź

JDK Dynamic Proxy:
- Tworzy proxy na podstawie interfejsu.
- Wymaga, aby bean implementował interfejs.

CGLIB:
- Tworzy klasę dziedziczącą po klasie docelowej.
- Może działać bez interfejsu.
- Nie może proxy'ować metod final.

Spring domyślnie używa:
- JDK proxy, jeśli istnieje interfejs,
- CGLIB w przeciwnym razie.

---

## 🔹 16. Czym jest weaving?

### ✅ Odpowiedź

Weaving to proces wstrzykiwania aspektów do kodu.

Rodzaje:
- Compile-time weaving (AspectJ).
- Load-time weaving.
- Runtime weaving (Spring proxy).

Spring używa runtime weaving przez proxy.

---

## 🔹 17. Jakie są typy advice?

### ✅ Odpowiedź

- @Before — przed metodą.
- @After — po metodzie (zawsze).
- @AfterReturning — po sukcesie.
- @AfterThrowing — po wyjątku.
- @Around — otacza metodę (najbardziej elastyczne).

@Around pozwala kontrolować wywołanie proceed().

---

## 🔹 18. Czym jest pointcut?

### ✅ Odpowiedź

Pointcut definiuje, które metody mają być objęte aspektem.

Przykład:
execution(* com.example.service.*.*(..))

Może bazować na:
- pakiecie,
- nazwie metody,
- adnotacji.

Pointcut + Advice = Aspect.


---

# 🚀 4️⃣ Spring Boot

## 🔹 19. Czym jest auto-configuration w Spring Boot?

### ✅ Odpowiedź

Auto-configuration to mechanizm automatycznego konfigurowania beanów na podstawie:
- obecności klas w classpath,
- właściwości konfiguracyjnych,
- istniejących beanów.

Spring Boot:
1. Skanuje plik META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports.
2. Rejestruje klasy konfiguracyjne.
3. Warunkowo tworzy beany.

Pozwala to uruchomić aplikację bez ręcznej konfiguracji infrastruktury.

---

## 🔹 20. Czym są adnotacje @Conditional?

### ✅ Odpowiedź

@Conditional pozwala tworzyć bean tylko jeśli spełniony jest warunek.

Najczęstsze warianty:
- @ConditionalOnClass
- @ConditionalOnMissingBean
- @ConditionalOnProperty
- @ConditionalOnWebApplication

Mechanizm ten jest fundamentem auto-config.

---

## 🔹 21. Czym jest starter w Spring Boot?

### ✅ Odpowiedź

Starter to zestaw zależności (dependency descriptor), który:
- agreguje biblioteki,
- dodaje odpowiednie auto-config.

Przykład:
- spring-boot-starter-web
- spring-boot-starter-data-jpa

Ułatwia konfigurację poprzez konwencję zamiast konfiguracji.

---

## 🔹 22. Czym różni się ApplicationContext od WebApplicationContext?

### ✅ Odpowiedź

ApplicationContext:
- Ogólny kontener beanów.

WebApplicationContext:
- Rozszerza ApplicationContext.
- Dodaje wsparcie dla środowiska web (ServletContext).

W aplikacjach web tworzony jest kontekst webowy.

---

## 🔹 23. Jak działa binding właściwości (@ConfigurationProperties)?

### ✅ Odpowiedź

@ConfigurationProperties pozwala mapować właściwości z application.yml na obiekt.

Mechanizm:
- Spring odczytuje konfigurację.
- Tworzy bean.
- Wstrzykuje wartości przez setter lub konstruktor.

Zalety:
- Typowanie.
- Walidacja.
- Lepsza organizacja konfiguracji.

---

## 🔹 24. Czym są profile w Spring?

### ✅ Odpowiedź

Profile pozwalają aktywować różne konfiguracje zależnie od środowiska.

Aktywacja:
- spring.profiles.active
- @Profile("dev")

Umożliwiają separację konfiguracji dev/test/prod.

---

## 🔹 25. Czym jest Spring Boot Actuator?

### ✅ Odpowiedź

Actuator dostarcza endpointy monitorujące aplikację.

Przykłady:
- /actuator/health
- /actuator/metrics
- /actuator/env
- /actuator/info

Pozwala monitorować:
- stan aplikacji,
- metryki,
- konfigurację.

Często używany z Prometheus.


---

# 🔐 5️⃣ Spring Security

## 🔹 26. Jak działa Spring Security wewnętrznie?

### ✅ Odpowiedź

Spring Security działa jako łańcuch filtrów (Security Filter Chain).

1. Żądanie HTTP trafia do serwera.
2. Przechodzi przez kolejne filtry (np. authentication, authorization).
3. Jeśli uwierzytelnienie się powiedzie — tworzony jest Authentication.
4. Obiekt Authentication trafia do SecurityContext.

SecurityContext przechowywany jest w ThreadLocal (SecurityContextHolder).

---

## 🔹 27. Czym różni się Authentication od Authorization?

### ✅ Odpowiedź

Authentication (uwierzytelnienie):
- Kim jesteś?
- Weryfikacja tożsamości (login/hasło, token).

Authorization (autoryzacja):
- Co możesz zrobić?
- Sprawdzenie uprawnień (role, authorities).

Authentication poprzedza Authorization.

---

## 🔹 28. Czym jest SecurityContext?

### ✅ Odpowiedź

SecurityContext przechowuje informacje o aktualnie uwierzytelnionym użytkowniku.

Zawiera:
- principal (użytkownik),
- credentials,
- authorities.

Domyślnie przechowywany w ThreadLocal.

---

## 🔹 29. Jak działa JWT w Spring Security?

### ✅ Odpowiedź

JWT (JSON Web Token):
- Token zawiera zakodowane dane użytkownika.
- Składa się z header.payload.signature.

Proces:
1. Użytkownik się loguje.
2. Serwer generuje podpisany token.
3. Klient wysyła token w nagłówku Authorization.
4. Serwer weryfikuje podpis i tworzy Authentication.

JWT jest stateless — serwer nie przechowuje sesji.

---

## 🔹 30. Czym jest OAuth2?

### ✅ Odpowiedź

OAuth2 to protokół autoryzacji.

Role:
- Resource Owner
- Client
- Authorization Server
- Resource Server

Flow (np. Authorization Code):
1. Przekierowanie do Authorization Server.
2. Użytkownik się loguje.
3. Client otrzymuje authorization code.
4. Wymienia go na access token.

Spring Security może działać jako Resource Server lub OAuth2 Client.

---

## 🔹 31. Czym jest CSRF i jak Spring go chroni?

### ✅ Odpowiedź

CSRF (Cross-Site Request Forgery):
- Atak polegający na wysłaniu żądania w imieniu użytkownika bez jego wiedzy.

Spring generuje CSRF token:
- Musi być dołączony do żądań modyfikujących (POST/PUT/DELETE).
- Weryfikowany po stronie serwera.

W aplikacjach stateless (JWT) często wyłączany.

---

## 🔹 32. Czym jest CORS?

### ✅ Odpowiedź

CORS (Cross-Origin Resource Sharing):
- Mechanizm przeglądarki kontrolujący dostęp między domenami.

Serwer musi zwrócić odpowiednie nagłówki:
- Access-Control-Allow-Origin
- Access-Control-Allow-Methods

Spring pozwala konfigurować CORS globalnie lub per endpoint.

---

## 🔹 33. Jak bezpiecznie przechowywać hasła?

### ✅ Odpowiedź

Hasła nie powinny być szyfrowane, lecz haszowane.

Algorytmy:
- bcrypt
- argon2
- scrypt

Cechy:
- Salt (losowa wartość).
- Koszt obliczeniowy (work factor).

Spring Security dostarcza PasswordEncoder.

