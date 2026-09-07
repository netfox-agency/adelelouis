# Revue design · Landing Adele Louis

Audit /design-review du 2026-09-07 sur http://localhost:4204 (desktop 1280 + mobile 375 + tablette 768).
Référentiel : famille visuelle artisan de l'agence (papier crème, cartes blanches,
hero photo chaude) + règles landing page (classifieur : MARKETING/LANDING).

## Scores

```
Design Score : A-        AI Slop Score : B+ (template éprouvé, pas slop)

Hiérarchie visuelle   A   focal unique, 1 CTA primaire par vue, squint test OK
Typographie           A-  Instrument Sans + Serif (2 typos réelles), corps 16px, lh 1.6
Couleur & contraste   A   encre/papier ~13:1, palette cohérente, accent ardoise AA
Espacement & layout   A   échelle cohérente, radius hiérarchisés, pas d'overflow
États d'interaction   A-  hover/focus-visible/loading/erreur OK · touch targets corrigés
Responsive            A   vraie mise en page mobile, callbar, formulaire au-dessus du pli
Motion                A   transitions ciblées (pas de transition:all), reduced-motion géré
Contenu & microcopy   A   boutons spécifiques, zéro happy talk, ellipse « … » correcte
Performance ressentie A   statique, lazy, fetchpriority hero, dimensions images posées
```

## Première impression (narration)

La page communique « artisan sérieux et chaleureux ». L'œil va : H1 (« Votre toiture
démoussée… ») → carte formulaire blanche → photo de l'artisan harnaché. C'est
exactement l'ordre voulu : promesse, action, preuve. Test des zones : chaque bloc se
nomme en 2 secondes (le problème, l'intervention, avant/après, le budget, la zone,
la FAQ). En un mot : « fiable ».

## Trunk test : PASS

Quel site (logo + marque en haut à gauche) · quelle page (landing unique) · sections
identifiables · options claires (appeler ou demander un devis) · pas de recherche
(voulu : une landing Ads n'a pas de navigation sortante).

## Corrigé pendant la revue

| # | Constat | Fix | Statut |
|---|---------|-----|--------|
| FINDING-001 | Cibles tactiles sous 44px : boutons topbar 42px, boutons du bandeau de consentement 38px. Le bandeau est le premier élément que chaque visiteur mobile touche. | `min-height:44px` sur `.btn-sm` (desktop + mobile), CSS pur, versions bumpées | **vérifié** (re-mesuré : 44px partout, zéro erreur console) |

## Notes AI-slop (verdict : hérité du modèle, pas généré)

Motifs présents mais assumés car issus du template Top Service qui convertit :
sections à titres centrés, étapes numérotées dans des pastilles, rythme de sections
classique problème → solution → preuve → prix → FAQ. AUCUN marqueur dur : pas de
dégradé violet, pas de grille « 3 icônes en cercles », 2 vraies typos (pas de
system-ui), copy spécifique métier, pas d'emoji décoratif, pas de blobs.

## Reporté (polish, à traiter plus tard)

1. **Apostrophes typographiques** (' → ') dans la copy : améliorerait la finition,
   mais le remplacement global est risqué (apostrophes = délimiteurs des scripts
   inline). À faire chirurgicalement, hors chemin critique du lancement.
2. **Bandeau consentement au premier chargement desktop** : recouvre brièvement
   les puces du hero en bas de viewport. Standard, dismissible en un tap, non bloquant.
3. **H3 des étapes/risques à 16-17px** : petits mais hiérarchisés par la graisse (700)
   et les pastilles numérotées. Acceptable.

## Réserve de bienveillance (parcours devis)

70 → 85. Gains : action principale évidente (+10), zéro information cachée (+5),
formulaire 4 champs sans punition de format (le tél accepte tous les formats).
Aucune perte : pas d'interstitiel, pas de champ inutile, repli téléphone si l'envoi
échoue.
