# Landing Page Report · adelelouis-toiture.fr

Audit `ads-landing` du 2026-09-08, page de production, angle « est-ce que tout
pousse le visiteur à l'action ? ». Mesures réelles (curl, poids, code livré).

## Landing Page Health : 90/100 (A)

```
Message Match:    █████████░  92/100
Page Speed:       ██████████  95/100
Mobile:           █████████░  90/100
Trust Signals:    ████████░░  80/100
Form Quality:     █████████░  90/100
```

## Message match (annonce → page), par groupe

| Groupe | Promesse de l'annonce | Ce que voit le visiteur | Verdict |
|--------|----------------------|--------------------------|---------|
| Démoussage | Démoussage, devis 24 h, sans haute pression, depuis 2008 | H1 « démoussée et protégée », mêmes promesses dans les puces | Exact |
| Nettoyage toiture | Nettoyage, toit vert/noirci | Même page, champ « nettoyage » partout | Fort |
| Hydrofuge | Hydrofuge, l'eau perle | Étape 4 + carte « Démoussage + hydrofuge » | Bon |
| Prix et devis | Prix, combien ça coûte | **Atterrit maintenant sur la section budget** (`?s=prix`, corrigé ce jour) | Exact |

## Vitesse (mesuré en prod)

TTFB 130 ms (Cloudflare edge), HTML 39 Ko + CSS 24 Ko + JS 7 Ko. Images
**recompressées ce jour : 1 444 → 859 Ko (−40 %)**, hero LCP à 162 Ko avec
`fetchpriority=high`, le reste en lazy, dimensions posées (CLS ≈ 0),
`font-display: swap`. LCP estimé < 1,5 s en 4G. Aucun script tiers hors gtag.

## Chemins vers l'action (le cœur de la question)

Le visiteur n'est jamais à plus d'un geste d'agir :
- **10 liens d'appel** `tel:` répartis sur toute la page + **barre fixe mobile**
  Appeler / Devis gratuit toujours visible
- **2 formulaires** (au-dessus du pli sur desktop, en fin de page), chaque section
  se termine par un CTA (« Faire diagnostiquer », « Obtenir mon prix exact »…)
- Réponse aux 3 freins majeurs AVANT qu'ils bloquent : le prix (section dédiée +
  « aucun acompte »), la confiance (décennale, depuis 2008, photos honnêtes),
  l'effort (« vous ne montez pas sur le toit », 4 champs, 1 minute)

## Formulaire : optimal pour du lead gen

4 champs visibles (nom, tél, commune, besoin) = la bande de CVR maximale du
benchmark (1-3 = max, 4-5 = modéré ; le champ « besoin » est un select pré-rempli,
friction quasi nulle, et il qualifie l'appel retour). Clavier téléphone sur mobile
(`inputmode=tel`), aucun format imposé, bouton spécifique « Recevoir mon devis
gratuit », message de succès avec suite claire + numéro de secours, repli
téléphone si l'envoi échoue, gclid/UTM capturés dans l'email du lead.
**Rien à retirer, rien à ajouter.**

## Ce qui manque encore (le vrai levier restant)

1. **Avis clients réels** (Trust 80/100 à cause de ça) : la section `#avis` est
   prête et masquée. 3 vrais avis Google avec prénom + commune = le plus gros
   gain de conversion restant (+5-15 % typique). → Demander à Adele Louis ses
   avis ou en faire laisser par d'anciens clients.
2. Tap targets à 44 px (standard Apple) là où Google recommande 48 px : écart
   mineur, assumé, la barre mobile est largement au-dessus.
3. Bandeau de consentement = friction légale incompressible ; il ne couvre pas
   le CTA (posé au-dessus de la barre d'appel) et se ferme en un geste.

## Corrigé pendant cet audit

- Images −40 % (Pillow q72 progressif), hero 162 Ko
- Groupe « Prix et devis » routé vers `/?s=prix` (message match exact)
