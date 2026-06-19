# PRD — FX Checker

> Hackathon solo · 30 jours · Portfolio project

## 1. Vue d'ensemble

FX Checker est une SPA de conversion de devises en temps réel (EOD), conçue pour permettre aux utilisateurs de suivre des taux de change, de comparer des devises et de logger leurs conversions. Les données proviennent de l'API Frankfurter (ECB), gratuite et sans clé.

**Pourquoi ça existe :** projet hackathon personnel, conçu pour démontrer la maîtrise d'une stack React moderne (TanStack Query, Zustand, nuqs, Recharts) et d'une démarche produit structurée.

---

## 2. Utilisateurs cibles

**Persona principal : l'utilisateur curieux informel**

- Quelqu'un qui veut rapidement convertir un montant (voyage, achat en ligne, freelance international)
- N'a pas besoin de données intraday — EOD lui suffit
- Utilise desktop, parfois mobile

---

## 3. Périmètre fonctionnel

### ✅ In scope (MVP)

#### F-01 · Convertisseur

- Saisir un montant et deux devises (base / quote)
- Résultat calculé en temps réel à partir du taux EOD live
- Swapper base ↔ quote en un clic
- Afficher le taux unitaire (`1 USD = 0.8530 EUR`)

#### F-02 · Marchés live (ticker)

- Barre défilante de 10 paires prédéfinies
- Affiche le taux EOD et le `dailyChange` (variation vs veille, sans label)
- Animation CSS, pause au survol

#### F-03 · Historique & graphe

- Graphe area chart de l'évolution du taux sur la paire active
- Ranges sélectionnables : `1W | 1M | 3M | 1Y | 5Y`
- `1D` désactivé avec tooltip "EOD only"
- Stats au-dessus du graphe : OPEN, LAST, CHANGE, % CHANGE

#### F-04 · Comparaison multi-devises

- Convertir le montant actif dans 8 devises fixes simultanément :
  GBP, JPY, CHF, CAD, AUD, INR, CNY, BDT
- BDT via FreeCurrencyAPI (API key requise) ; affiche "N/A" si absente

#### F-05 · Favoris

- Épingler / désépingler la paire active
- Lister les paires épinglées avec leur taux live
- Cliquer "LOAD" recharge la paire dans le convertisseur

#### F-06 · Journal de conversions

- Logger manuellement une conversion (paire, montant, taux, résultat, timestamp)
- Supprimer une entrée individuelle
- Vider tout le journal

#### F-07 · URL partageable

- Les 5 paramètres actifs vivent dans l'URL : `?base=USD&quote=EUR&amount=1000&tab=history&range=1m`
- Partager un lien ouvre exactement la même vue chez le destinataire

#### F-08 · UI & accessibilité

- Responsive (mobile + desktop)
- Navigation clavier complète
- Focus visible sur tous les éléments interactifs
- États hover/focus/disabled visibles

### ❌ Out of scope (MVP)

- Authentification / comptes utilisateurs
- Données intraday (tick-by-tick, 1H, 4H)
- Alertes de taux
- Export CSV / PDF
- PWA / mode hors-ligne
- Internationalisation (i18n)

---

## 4. Contraintes techniques & design

| Contrainte                | Valeur                                                   |
| ------------------------- | -------------------------------------------------------- |
| Source données principale | Frankfurter API (ECB, EOD, 32 devises)                   |
| Source BDT                | FreeCurrencyAPI (clé optionnelle)                        |
| Terminologie taux         | `dailyChange` en interne, affiché sans label             |
| Range minimum             | `1W` (1D désactivé, données insuffisantes)               |
| Persistance               | localStorage uniquement (favoris + log)                  |
| Font                      | JetBrains Mono (Google Fonts)                            |
| Palette                   | Dark : `#0B0B0B` bg · `#CAFF00` accent · `#FF4040` rouge |

---

## 5. User stories

```
US-01  En tant qu'utilisateur, je veux saisir un montant et voir immédiatement
       le résultat converti, afin de savoir combien je vais recevoir.

US-02  En tant qu'utilisateur, je veux swapper les devises en un clic,
       afin de ne pas ressaisir les deux champs.

US-03  En tant qu'utilisateur, je veux voir une sélection de paires défiler
       en haut de page, afin d'avoir un aperçu rapide du marché.

US-04  En tant qu'utilisateur, je veux voir l'évolution d'une paire sur
       plusieurs mois, afin de contextualiser le taux actuel.

US-05  En tant qu'utilisateur, je veux comparer mon montant dans 8 devises
       simultanément, afin de choisir la plus avantageuse.

US-06  En tant qu'utilisateur, je veux épingler mes paires préférées,
       afin de les retrouver rapidement sans les rechercher.

US-07  En tant qu'utilisateur, je veux logger une conversion pour en garder
       une trace, afin de référencer mes opérations passées.

US-08  En tant qu'utilisateur, je veux partager un lien vers une conversion
       précise, afin que mon interlocuteur voie exactement la même chose.
```

---

## 6. Critères d'acceptation (DoD)

Une feature est **done** quand :

- [ ] Le comportement correspond à la user story
- [ ] Le composant est typé TypeScript strict (pas de `any`)
- [ ] Les états de chargement et d'erreur sont gérés
- [ ] La feature est navigable au clavier
- [ ] Les tests unitaires couvrent la logique métier (hooks, utils)
- [ ] Le code est formaté avec Oxfmt et ne casse pas le build

---

## 7. Métriques de succès (hackathon)

- Build TypeScript propre (`tsc --noEmit` zéro erreurs)
- Lighthouse Performance ≥ 80 sur mobile
- Lighthouse Accessibility ≥ 90
- Déployé et accessible via URL publique
- README avec screenshots et lien démo
