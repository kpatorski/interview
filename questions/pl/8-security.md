[💡 Questions](questions.md)

# 🛡 BEZPIECZEŃSTWO

<!-- TOC -->
* [🛡 BEZPIECZEŃSTWO](#-bezpieczeństwo)
  * [1️⃣ Podstawy Kryptografii](#1-podstawy-kryptografii)
      * [🔹 1. Czym różni się szyfrowanie od haszowania?](#-1-czym-różni-się-szyfrowanie-od-haszowania)
      * [🔹 2. Czym jest salt i dlaczego jest ważny?](#-2-czym-jest-salt-i-dlaczego-jest-ważny)
  * [2️⃣ TLS i Transport](#2-tls-i-transport)
      * [🔹 3. Jak działa TLS w skrócie?](#-3-jak-działa-tls-w-skrócie)
  * [3️⃣ OWASP i Najczęstsze Ataki](#3-owasp-i-najczęstsze-ataki)
      * [🔹 4. Czym jest SQL Injection?](#-4-czym-jest-sql-injection)
      * [🔹 5. Czym jest XSS?](#-5-czym-jest-xss)
      * [🔹 6. Czym jest CSRF?](#-6-czym-jest-csrf)
  * [4️⃣ Autoryzacja i Dostęp](#4-autoryzacja-i-dostęp)
      * [🔹 7. Czym jest RBAC vs ABAC?](#-7-czym-jest-rbac-vs-abac)
      * [🔹 8. Jak zabezpieczać sekrety w systemie?](#-8-jak-zabezpieczać-sekrety-w-systemie)
<!-- TOC -->

---

## 1️⃣ Podstawy Kryptografii

#### 🔹 1. Czym różni się szyfrowanie od haszowania?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Szyfrowanie:
- Proces odwracalny.
- Używa klucza do zaszyfrowania i odszyfrowania danych.
- Stosowane do ochrony poufności (np. TLS).

Haszowanie:
- Proces nieodwracalny.
- Generuje skrót o stałej długości.
- Stosowane do przechowywania haseł.

Hasło nie powinno być szyfrowane — powinno być haszowane.

---

#### 🔹 2. Czym jest salt i dlaczego jest ważny?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Salt to losowa wartość dodawana do hasła przed haszowaniem.

Zapobiega:
- atakom rainbow table,
- identycznym hashom dla tych samych haseł.

Każde hasło powinno mieć unikalny salt.

---

## 2️⃣ TLS i Transport

#### 🔹 3. Jak działa TLS w skrócie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

TLS zapewnia poufność i integralność komunikacji.

Proces:
1. Handshake.
2. Wymiana kluczy (asymetryczna kryptografia).
3. Ustalenie klucza symetrycznego.
4. Szyfrowana komunikacja.

Chroni przed:
- podsłuchem,
- modyfikacją danych.

---

## 3️⃣ OWASP i Najczęstsze Ataki

#### 🔹 4. Czym jest SQL Injection?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

SQL Injection to wstrzyknięcie złośliwego kodu SQL do zapytania.

Przyczyna:
- Konkatenacja stringów zamiast parametrów.

Zapobieganie:
- PreparedStatement,
- ORM,
- walidacja danych.

---

#### 🔹 5. Czym jest XSS?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

XSS (Cross-Site Scripting):
- Wstrzyknięcie złośliwego skryptu do strony.

Rodzaje:
- Stored
- Reflected
- DOM-based

Zapobieganie:
- Escaping danych,
- CSP (Content Security Policy).

---

#### 🔹 6. Czym jest CSRF?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

CSRF (Cross-Site Request Forgery):
- Wysłanie żądania w imieniu zalogowanego użytkownika bez jego wiedzy.

Ochrona:
- CSRF token,
- SameSite cookies.

---

## 4️⃣ Autoryzacja i Dostęp

#### 🔹 7. Czym jest RBAC vs ABAC?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

RBAC (Role-Based Access Control):
- Uprawnienia przypisane do ról.

ABAC (Attribute-Based Access Control):
- Decyzja na podstawie atrybutów (rola, czas, lokalizacja).

ABAC daje większą elastyczność kosztem złożoności.

---

#### 🔹 8. Jak zabezpieczać sekrety w systemie?

✅ <span style='color:##a9b8c6;font-weight:bold;font-size:medium;list-style-type:none'>Odpowiedź</span>

Nie powinny być:
- w kodzie,
- w repozytorium,
- w obrazach Docker.

Powinny być:
- w Secret Manager (Vault, AWS Secrets Manager),
- w zmiennych środowiskowych,
- rotowane cyklicznie.

Zasada: najmniejsze możliwe uprawnienia (least privilege).

