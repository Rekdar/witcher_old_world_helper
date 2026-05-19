# Plan deploy — Witcher Old World Helper

Repozytorium docelowe: https://github.com/Rekdar/witcher_old_world_helper

---

## 1. Zainstaluj zależności (jeśli jeszcze nie zrobione)

```bash
npm install
```

---

## 2. Podepnij swoje repozytorium GitHub

```bash
git remote add origin https://github.com/Rekdar/witcher_old_world_helper.git
git branch -M main
git push -u origin main
```

> Jeśli pojawi się błąd "remote already exists", najpierw usuń stary:
> ```bash
> git remote remove origin
> ```
> A potem powtórz polecenia z punktu 2.

---

## 3. Wdróż aplikację na GitHub Pages

**Na Linux/Mac:**
```bash
npm run deploy
```

**Na Windows** (`npm run deploy` nie działa z powodu Unix-owej składni):
```bash
npx webpack --mode production && npx gh-pages -d dist
```

---

## 4. Włącz GitHub Pages w ustawieniach repo

1. Wejdź na: https://github.com/Rekdar/witcher_old_world_helper/settings/pages
2. **Source** → `Deploy from a branch`
3. **Branch** → `gh-pages` | folder: `/ (root)`
4. Kliknij **Save**

---

## 5. Gotowe

Po kilku minutach aplikacja będzie dostępna pod adresem:

```
https://rekdar.github.io/witcher_old_world_helper/
```

---

## Aktualizacja w przyszłości

Gdy wprowadzisz zmiany w kodzie:

```bash
# Zapisz zmiany w repo
git add .
git commit -m "opis zmian"
git push

# Zaktualizuj GitHub Pages
npx webpack --mode production && npx gh-pages -d dist
```
