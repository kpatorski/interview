# Interview Notes

Notatki do przygotowania na rozmowy techniczne (Java / Spring / Architektura / DevOps / ...).

## 🎯 Fiszki (Spaced Repetition)

Interaktywny system fiszek oparty na algorytmie SM-2 (identyczny z Anki).

**Link:** `https://kpatorski.github.io/interview/flashcards/`

### Jak to działa

- Wybierz kategorię lub ucz się wszystkich zaległych naraz
- Przeczytaj pytanie → spróbuj odpowiedzieć → odwróć fiszkę
- Oceń swoją odpowiedź: **Znowu / Trudne / Dobrze / Łatwe**
- System planuje kolejną powtórkę automatycznie (SM-2)
- Postęp zapisywany lokalnie w przeglądarce (localStorage)
- Export/Import postępu do pliku JSON (do synchronizacji między urządzeniami)

### Kategorie

| Kategoria | Kart |
|---|---|
| Java / JVM | 64 |
| Spring Boot | 33 |
| Bazy Danych / JPA | 22 |
| Architektura | 11 |
| Mikroserwisy | 10 |
| Komunikacja | 9 |
| DevOps / Kubernetes | 9 |
| Testowanie | 9 |
| System Design | 9 |
| Bezpieczeństwo | 8 |
| Performance | 7 |

### Aktualizacja kart po zmianie notatek

```bash
node flashcards/build.mjs
git add flashcards/data.json && git commit -m "Update flashcards" && git push
```

### Pierwsze uruchomienie (GitHub Pages)

1. `git push` (jeśli jeszcze nie pushowane)
2. GitHub repo → **Settings → Pages → Source: main / root → Save**
3. Po ~2 minutach dostępne pod `https://kpatorski.github.io/interview/flashcards/`

## Struktura notatek

```
java/           kubernetes/      spring-boot/
architecture/   microservices/   patterns/
communication/  observability/   databases/
jpa/            security/
questions/pl/   ← źródło fiszek (markdown Q&A)
```
