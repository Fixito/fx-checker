# Architecture — FX Checker

> Décisions validées lors de la session de grilling · voir aussi `docs/adr/`

---

## 1. Stack technique

| Couche          | Choix                                             | Justification                                             |
| --------------- | ------------------------------------------------- | --------------------------------------------------------- |
| Framework       | Vite + React 19.x SPA                             | Pas de SSR nécessaire, déploiement statique simple        |
| Langage         | TypeScript strict                                 | Sécurité des types, `CurrencyCode` brand                  |
| Style           | Tailwind CSS v4.x                                 | Utility-first, tokens custom via `fx-*`                   |
| Composants      | @base-ui/react (base structurelle) + restyling complet | A11y et comportements keyboard gratuits                   |
| State serveur   | TanStack Query v5                                 | Cache partagé, stale-time par query, refetch background   |
| State client    | Zustand v5 + `persist`                            | Favoris + log persistés localStorage, zéro boilerplate    |
| URL state       | nuqs v2                                           | 5 params URL type-safe, vue partageable par lien          |
| Charts          | Recharts v2                                       | React-natif, area chart avec gradient, suffisant pour EOD |
| Package manager | pnpm                                              | Config existante de Thomas                                |
| Font            | JetBrains Mono                                    | Design Figma, déjà configuré dans VSCode                  |
| Tests           | Vitest + Testing Library + MSW                    | Unit + intégration, mock des appels API                   |

---

## 2. Structure des dossiers

```
fx-checker/
├── docs/
│   └── adr/                          ← décisions architecturales
│       ├── 0001-url-state-nuqs.md
│       └── 0002-dual-api-bdt.md
├── src/
│   ├── api/                          ← clients HTTP purs (pas de React)
│   │   ├── frankfurter.ts            ← fetchRate, fetchHistory, fetchAllRates, fetchPrevRate
│   │
│   ├── hooks/                        ← TanStack Query hooks
│   │   ├── useRate.ts                ← useRate, usePrevRate
│   │   ├── useHistory.ts             ← useHistory(base, quote, range)
│   │   ├── useCompareRates.ts        ← useCompareRates(base)
│   │   └── useTicker.ts              ← useTicker() — toutes les paires ticker
│   │
│   ├── store/
│   │   └── index.ts                  ← Zustand store (favorites + conversionLog)
│   │
│   ├── types/
│   │   └── index.ts                  ← CurrencyCode, Pair, Rate, ConversionEntry…
│   │
│   ├── lib/
│   │   ├── utils.ts                  ← cn(), fmt.rate(), fmt.amount(), fmt.pct()
│   │   └── constants.ts              ← TICKER_PAIRS, COMPARE_TARGETS, RANGES
│   │
│   ├── components/
│   │   ├── ui/                       ← primitives shadcn (Tabs, Popover, Tooltip…)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Ticker.tsx
│   │   ├── converter/
│   │   │   ├── Converter.tsx         ← SEND/RECEIVE + swap
│   │   │   ├── CurrencyPicker.tsx    ← dropdown searchable
│   │   │   └── RateBar.tsx           ← taux unitaire + boutons FAVORITE / LOG
│   │   └── tabs/
│   │       ├── HistoryTab.tsx        ← stats + range selector + chart
│   │       ├── CompareTab.tsx        ← 8 devises fixes
│   │       ├── FavoritesTab.tsx
│   │       └── LogTab.tsx
│   │
│   ├── App.tsx                       ← URL state (nuqs) + composition des sections
│   ├── main.tsx                      ← NuqsAdapter + QueryClientProvider
│   └── index.css                     ← Tailwind directives + CSS vars shadcn
│
├── __tests__/                        ← tests unitaires et d'intégration
│   ├── api/
│   │   └── frankfurter.test.ts
│   ├── hooks/
│   │   ├── useRate.test.ts
│   │   └── useHistory.test.ts
│   ├── store/
│   │   └── index.test.ts
│   └── components/
│       ├── CurrencyPicker.test.tsx
│       └── Converter.test.tsx
│
├── CONTEXT.md                        ← glossaire domaine
├── PRD.md
├── ARCHITECTURE.md
├── .env.example
├── index.html
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── vitest.config.ts
```

---

## 3. Flux de données

```
URL (?base=USD&quote=EUR&amount=1000&tab=history&range=1m)
  │
  │  nuqs (parseAsString, parseAsFloat, parseAsStringLiteral)
  ▼
App.tsx
  ├── base, quote, amount, tab, range  ← URL state
  ├── useRate(base, quote)             ← TanStack Query → Frankfurter API
  ├── usePrevRate(base, quote)         ← TanStack Query → Frankfurter API
  └── useFXStore()                     ← Zustand (favorites, conversionLog)
        │
        ├── Converter.tsx              ← affiche rate, computed result
        ├── Ticker.tsx                 ← useTicker() → 10 paires en parallèle
        └── Tabs/
            ├── HistoryTab             ← useHistory(base, quote, range)
            ├── CompareTab             ← useCompareRates(base) → ECB + BDT
            ├── FavoritesTab           ← lecture Zustand store
            └── LogTab                 ← lecture Zustand store
```

---

## 4. Couche API

### Règle fondamentale

Les fonctions dans `src/api/` sont des **fonctions pures** : elles prennent des paramètres, font un `fetch`, retournent une donnée typée. Pas d'état React, pas de hooks, pas d'effets de bord.

### Frankfurter (`src/api/frankfurter.ts`)

```
fetchRate(base, quote)         → Promise<number>
fetchPrevRate(base, quote)     → Promise<number | null>   // walk-back 5 jours
fetchAllRates(base)            → Promise<Record<string, number>>
fetchHistory(base, quote, days) → Promise<Array<{date: string; rate: number}>>
```

---

## 5. State management

### Deux types de state, deux outils

| State                | Outil             | Exemple                              |
| -------------------- | ----------------- | ------------------------------------ |
| Données serveur      | TanStack Query    | Taux live, historique, compare rates |
| État client persisté | Zustand + persist | Favoris, journal de conversions      |
| État URL             | nuqs              | Paire active, montant, tab, range    |
| État UI local        | useState          | Ouverture dropdown, animation        |

### Stale times TanStack Query

| Query      | `staleTime` | `refetchInterval` |
| ---------- | ----------- | ----------------- |
| `rate`     | 60s         | 60s               |
| `prevRate` | 1h          | —                 |
| `history`  | 1h          | —                 |
| `compare`  | 60s         | —                 |
| `ticker`   | 60s         | 60s               |

### Zustand store shape

```typescript
interface FXStore {
  favorites: Pair[];
  conversionLog: ConversionEntry[];

  toggleFavorite: (pair: Pair) => void;
  isFavorite: (pair: Pair) => boolean;
  logConversion: (entry: Omit<ConversionEntry, 'id' | 'timestamp'>) => void;
  deleteLog: (id: string) => void;
  clearLog: () => void;
}
```

---

## 6. Types domaine clés

```typescript
// Branded primitive — évite de passer n'importe quelle string
type CurrencyCode = string & { readonly _brand: 'CurrencyCode' };

interface Pair {
  base: CurrencyCode;
  quote: CurrencyCode;
}

interface ConversionEntry {
  id: string;
  pair: Pair;
  amount: number;
  rate: number;
  result: number;
  timestamp: number;
}

// dailyChange = variation EOD vs veille (affiché sans label dans l'UI)
interface DailyChange {
  abs: number;
  pct: number;
}

type RangeValue = '1w' | '1m' | '3m' | '1y' | '5y';
// '1d' est volontairement absent — données ECB insuffisantes pour un graphe
```

---

## 7. URL state (nuqs)

```typescript
// App.tsx
const [base, setBase] = useQueryState('base', parseAsString.withDefault('USD'));
const [quote, setQuote] = useQueryState('quote', parseAsString.withDefault('EUR'));
const [amount, setAmount] = useQueryState(
  'amount',
  parseAsFloat.withDefault(1000).withOptions({ shallow: true, throttleMs: 400 }),
);
const [tab, setTab] = useQueryState(
  'tab',
  parseAsStringLiteral(['history', 'compare', 'favorites', 'log']).withDefault('history'),
);
const [range, setRange] = useQueryState(
  'range',
  parseAsStringLiteral(['1w', '1m', '3m', '1y', '5y']).withDefault('1m'),
);
```

> **Piège amount :** `shallow: true` + `throttleMs: 400` évite de polluer
> l'historique browser à chaque frappe. Sans ça, le bouton Retour devient inutilisable.

---

## 8. Stratégie de tests

### Philosophie

Tester la **logique**, pas l'implémentation. Un test qui casse quand tu renommes une classe CSS est inutile. Un test qui casse quand la logique de `dailyChange` est fausse est précieux.

### Couverture cible

| Niveau      | Quoi                                       | Outil              |
| ----------- | ------------------------------------------ | ------------------ |
| Unit        | Fonctions `api/` (avec mock fetch)         | Vitest + MSW       |
| Unit        | Fonctions `lib/utils.ts`                   | Vitest             |
| Unit        | Zustand store (actions + state)            | Vitest             |
| Intégration | Hooks TanStack Query                       | Vitest + RTL + MSW |
| Composant   | `CurrencyPicker` (keyboard nav, sélection) | RTL                |
| Composant   | `Converter` (swap, calcul, log)            | RTL                |

### Ce qu'on ne teste pas (MVP)

- Le rendu visuel exact (pas de snapshot tests)
- Les composants purement d'affichage sans logique
- L'API Frankfurter réelle (toujours mockée)

---

## 9. Convention de commits

```
feat: add currency swap button
fix: prevent history stack pollution on amount input
chore: configure vitest with MSW
test: add useRate hook integration test
docs: update CONTEXT.md with RangeValue term
```

Format : `type(scope?): description courte` — Conventional Commits.

---

## 10. Déploiement

- **Cible :** Vercel (déploiement statique, zéro config avec Vite)
- **Variables d'env :** `VITE_FREECURRENCY_API_KEY` (optionnelle, pour BDT)
- **Preview deployments :** chaque push sur une branche crée une preview URL
