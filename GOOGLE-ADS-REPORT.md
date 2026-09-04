# Audit Google Ads · Adele Louis (154-409-0091)

Audit du 2026-09-02, skill `ads-google` (80 checks), données live via l'API.
**Contexte : compte PRÉ-LANCEMENT** (campagne PAUSED, facturation PENDING, domaine
non acheté). Les checks de performance (Quality Score, CTR, termes de recherche,
gaspillage) sont **N/A faute de trafic** : ils sont exclus du score conformément
à la méthode, et re-rentreront à l'audit J+21 post-lancement.

## Score de santé (checks applicables uniquement)

```
Google Ads Health Score : 88/100 (Grade B, borne haute)

Conversion Tracking : 90/100  █████████░  (25 %)
Wasted Spend :        95/100  ██████████  (20 %, structurel seulement)
Account Structure :   92/100  █████████░  (15 %)
Keywords :            90/100  █████████░  (15 %, structurel seulement)
Ads & Assets :        85/100  ████████░░  (15 %)
Settings :            80/100  ████████░░  (10 %)
```

Un compte pré-lancement à 88 est très au-dessus de la norme (la plupart des
comptes AUDITÉS EN ACTIVITÉ sortent à 50-70). Le score est plafonné par 4
points listés en bas, dont 2 hors de portée de l'API.

## PASS confirmés sur données live (extraits)

| Check | Constat |
|-------|---------|
| G42 Conversions | 2 actions primaires (devis 200 €, appel 100 €), ONE_PER_CLICK, fenêtre 30 j ✓ |
| G48 Attribution | **Data-driven** (DDA) sur les 2 actions ✓ |
| G47 Macro only | Aucune micro-conversion en primaire ✓ |
| G-CT1 Doublons | 2 actions distinctes, pas de double comptage ✓ |
| G-CT3 gtag | Vérifié dans le navigateur : gtag chargé, 2 étiquettes actives ✓ |
| G45 **Consent Mode v2** | **Implémenté ce jour** : défaut denied, bandeau CNIL 2 boutons, update granted, `url_passthrough` (gclid préservé sans cookies), `ads_data_redaction`. Testé de bout en bout ✓ |
| G43 **Enhanced Conversions** | **Câblé ce jour côté page** : téléphone E.164 + nom envoyés via `user_data` à la conversion devis, `allow_enhanced_conversions` actif. ⚠️ Reste le bouton « Activer les conversions avancées » dans l'UI (voir todo) |
| Auto-tagging | `auto_tagging_enabled = true` ✓ (gclid) |
| G14/G15 Négatifs | 4 listes partagées thématiques (61 mots), rattachées à la campagne ✓ |
| G17 Broad match | Zéro requête large : exact + expression uniquement ✓ |
| G03 Thèmes | 4 groupes serrés (11-15 mots-clés, un seul thème chacun) ✓ |
| G05 Marque | Pas de mots-clés marque mélangés (pas de campagne marque : personne ne cherche encore le nom) ✓ |
| G10/G11 | Calendrier lun-sam 8-19 ✓ · Géo **PRESENCE** uniquement ✓ |
| G12 Réseaux | Display OFF ✓ · Partenaires OFF (choix délibéré, voir bas) |
| G26-G28 RSA | 1 RSA/groupe, 10-12 titres, 4 descriptions, zéro épinglage ✓ |
| G35/G-KW2 | Mots-clés présents dans les titres de chaque groupe ✓ |
| G50-G52 | 4 liens annexes (avec descriptions + ancres `?s=` testées), 4 accroches, extrait structuré « Services » ✓ |
| G54 Appel | Extension d'appel 06 67 33 68 97 ✓ (sans numéro de transfert Google : choix assumé, le suivi des clics tel: est fait côté page) |
| G36/G40 Enchères | Max clics plafonné 3 € : correct pré-données ; bascule Max conversions planifiée ✓ |
| G59-G61 Landing | Statique ultra-légère, H1 aligné, schema RoofingContractor + FAQPage ✓ |
| Mobile | Ajustement d'enchère mobile +15 % ✓ |

## Les 4 points qui plafonnent le score

1. **Extensions image (G53, WARNING)** : les 3 visuels (2 carrés + 1 paysage,
   recadrés depuis les photos libres de droits de la landing) sont **uploadés
   dans la bibliothèque d'assets du compte**, mais l'API v25 interdit de lier
   des images à une campagne Search : à faire dans l'UI (2 min) →
   Campagne > Assets > Images > sélectionner les 3 « Toiture nette / Artisan lavage ».
2. **Enhanced Conversions, moitié UI (G43, WARNING)** : le `user_data` part de
   la page, mais il faut cocher « Conversions avancées » sur les 2 actions dans
   Outils > Conversions (2 min, voir Quick Wins).
3. **Annonces DISAPPROVED « destination inaccessible » (bloquant connu)** :
   normal, le domaine `adelelouis-toiture.fr` n'est pas acheté. Se résout seul
   au re-examen une fois le domaine en ligne.
4. **GA4 non lié (G-CT2, WARNING assumé)** : mesure Ads-only suffisante à cette
   échelle ; GTM/GA4 ajoutables plus tard sans toucher au reste.

## Choix assumés (ne pas « corriger »)

- **Partenaires de recherche OFF** : sur un artisan local FR, le réseau
  partenaires apporte surtout des clics de mauvaise qualité. On pourra tester
  à J+30 avec données.
- **Pas de numéro de transfert Google** sur l'extension d'appel : le client
  garde SON numéro affiché partout (cohérence NAP + confiance locale).
- **1 seule RSA par groupe au lancement** : on ajoutera une 2e variante par
  groupe à J+21 avec les premières données de termes de recherche.
- **Audiences en observation** (G56) : à poser post-lancement (in-market
  « Home improvement », propriétaires) ; zéro impact avant qu'il y ait du trafic.

## Quick Wins restants (tous < 5 min, dans l'UI)

| # | Action | Où | Temps |
|---|--------|-----|-------|
| 1 | Activer « Conversions avancées » sur les 2 actions | Outils > Mesures > Conversions | 2 min |
| 2 | Lier les 3 images à la campagne | Campagne > Assets > Images | 2 min |
| 3 | Valider la facturation (PENDING) | Facturation | selon banque |

## Calendrier post-lancement (déjà convenu)

- **J+7** : premier ménage des termes de recherche, ajustement négatifs
- **J+21** : 2e RSA par groupe, audiences en observation, re-audit complet
  (les ~25 checks de performance N/A rentrent dans le score)
- **~15-20 conversions** : bascule Max clics → Max conversions, puis tCPA
