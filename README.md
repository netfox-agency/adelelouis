# Landing démoussage de toiture · Eure (27)

Page d'atterrissage unique, pensée pour du trafic payant (Google Ads / Meta), pas pour du SEO.
Statique : aucun build, aucune dépendance. Se dépose telle quelle sur Cloudflare Pages, Netlify,
Vercel ou n'importe quel hébergement.

Client : **Adele Louis** (Eure, 27). Copie adaptée de la landing Top Service
(`demoussage-bayonne-landing/`), la référence conversion de l'agence.

```
index.html         la landing
assets/styles.css
assets/script.js   tracking + envoi du formulaire
assets/img/        visuels
```

## Aperçu local

Config `adele-louis` ajoutée dans `.claude/launch.json` (port 4204) :

```bash
python3 -m http.server 4204 --directory "adele-louis-landing"
```

Pas encore déployée. Pour Vercel :

```bash
cd "adele-louis-landing" && vercel deploy --prod --yes
```

La page est en **`noindex, nofollow`** tant qu'elle n'a ni mentions légales, ni SIRET, ni domaine
définitif. **Ça ne bloque pas Google Ads** : une landing en noindex se diffuse normalement.

---

## 1. À remplacer avant la première annonce

Réels et en place : le nom **Adele Louis** et le téléphone **06 67 33 68 97**
(11 affichages, liens `tel:+33667336897`, plus le `telephone` du schema.org). Restent :

Câblé aussi : **les conversions Google Ads** (compte 154-409-0091, gtag chargé,
étiquettes `AW-18401220120/…` devis + appel, voir section 2). Restent :

| # | Quoi | Où |
|---|------|-----|
| 1 | Domaine (proposition : `https://adelelouis-toiture.fr`) | balises canonical, og, schema |
| 2 | Clé Web3Forms (`REMPLACER_PAR_VOTRE_CLE_WEB3FORMS`) | `index.html`, champ caché des 2 formulaires |
| 3 | Mentions légales + bloc légal du footer (retirés, voir ci-dessous) | `index.html`, page à recréer |
| 4 | Prix (affichés « Sur devis ») | section `#prix` de `index.html` |

Le point le plus urgent est le **2** : sans clé Web3Forms, le formulaire n'envoie rien et
affiche le repli téléphone. C'est gratuit et ça prend trente secondes sur web3forms.com.
Si le numéro venait à changer :

```bash
cd "adele-louis-landing" && grep -rl "06 67 33 68 97" . | xargs sed -i '' 's/06 67 33 68 97/NOUVEAU NUMÉRO/g; s/+33667336897/+33NOUVEAUNUM/g'
```

(Les deux champs « Téléphone » des formulaires gardent le placeholder générique
`06 00 00 00 00` : c'est un exemple de saisie pour le visiteur, pas le numéro du client.)

### Ce qui a été volontairement retiré, tant que c'est une maquette

- **Les prix.** Les deux cartes de la section `#prix` affichent « Sur devis » (classe
  `.pc-val-txt`). Un prix affiché puis dénoncé au téléphone détruit la conversion. Le jour où
  l'artisan donne ses tarifs, remplacer « Sur devis » par la fourchette
  (`10 à 15 €<span>/m²</span>` par exemple) et retirer la classe `pc-val-txt`.
- **Les mentions légales.** À recréer avant la première annonce : Google Ads refuse les
  landings sans identification vérifiable de l'annonceur, et l'article 6 de la LCEN l'impose.
  Contenu minimum : raison sociale, forme juridique, adresse, SIRET, TVA, téléphone, e-mail,
  directeur de la publication, assureur décennale et n° de contrat, hébergeur, politique de
  données (le formulaire collecte nom, téléphone, commune) et cookies (GA4 / Google Ads).
- **Les avis.** La section `#avis` est présente mais masquée (`hidden`). Y coller les vrais avis
  Google, mot pour mot, puis retirer l'attribut `hidden` et ajouter `aggregateRating` au schema.
  Aucun avis inventé.

### Direction artistique propre au client

Même structure de conversion que Top Service, mais **identité distincte** pour ne pas
livrer deux fois la même page : accent **bleu ardoise** (`--accent:#2F5B72`, favicon
assorti) contre le rouge basque de Top Service, et **cinq photos entièrement
différentes** (aucun visuel partagé avec une autre landing de l'agence).

### Photos et licences

Sourcées sur banques libres de droits (Openverse/Flickr + Pexels), jamais utilisées
sur nos autres sites.

| Fichier | Source | Licence | Attribution |
|---------|--------|---------|-------------|
| `artisan-lavage-toiture.jpg` (hero) | GeorgeTan#5, [Flickr](https://www.flickr.com/photos/198109102@N06/53799805590) | CC0 1.0 | non requise |
| `toiture-tuiles-mousse.jpg` (problème) | cosmicwindblown, [Flickr](https://www.flickr.com/photos/187467050@N08/50694313042) | marque du domaine public | non requise |
| `avant-lichens-tuiles.jpg` (avant) | zsolt.palatinus, [Flickr](https://www.flickr.com/photos/137424368@N06/40759344195) | marque du domaine public | non requise |
| `apres-toiture-nette.jpg` (après) | [Pexels #29114658](https://www.pexels.com/photo/29114658/) | Licence Pexels | non requise |
| `toit-mousse-soleil.jpg` (bande CTA) | athrasher, [Flickr](https://www.flickr.com/photos/56544547@N00/47343272852) | CC0 1.0 | non requise |

Ces visuels illustrent le métier, ils ne montrent pas un chantier de l'entreprise, et les légendes
le disent explicitement. Dès que le client fournit ses propres avant / après, les remplacer dans
`assets/img/` et supprimer la mention.

---

## 2. Suivi des conversions

Le formulaire et les clics téléphone poussent dans le `dataLayer` :

| Événement | Déclencheur |
|-----------|-------------|
| `form_start` | première saisie dans le formulaire |
| `generate_lead` | formulaire envoyé avec succès |
| `phone_call` | clic sur un lien `tel:` |

**Le branchement Google Ads est FAIT, sans GTM** : `gtag.js` est chargé avec
`AW-18401220120` et `script.js` envoie deux actions distinctes du compte
154-409-0091 (créées le 2026-08-21 via `~/ads-write/creer-conversions-adele.py`) :

| Action | Étiquette | Valeur |
|--------|-----------|--------|
| Demande de devis (site) · `ADS_CONVERSION` | `AW-18401220120/ARwzCM62vuUcEJisscZE` | 200 € |
| Appel depuis le site · `ADS_CONVERSION_APPEL` | `AW-18401220120/Rq2CCKC4vuUcEJisscZE` | 100 € |

Le bloc GTM reste en placeholder (`GTM-XXXXXXX`, non chargé) si on veut ajouter
GA4 plus tard.

**Attribution des leads** : `script.js` capture `gclid`, `wbraid`, `gbraid`, `utm_source`,
`utm_campaign`, `utm_term` et les envoie dans l'e-mail de devis (mémorisé en `sessionStorage`).

---

## 3. Départ Google Ads

**La campagne est CRÉÉE (2026-08-21), tout en PAUSED**, via
`~/ads-write/creer-campagnes-adele.py` sur le compte 154-409-0091 :
`Recherche_Demoussage_Eure`, 15 €/j, Maximiser les clics plafonné à 3,00 €,
rayon **60 km autour de Criquebeuf-sur-Seine** (siège du client, 20 km de Rouen) en présence uniquement, langue FR, lun-sam 8-19,
4 groupes (Demoussage · Nettoyage toiture · Hydrofuge et traitement · Prix et devis),
52 mots-clés exact/expression (≥10 par groupe, Rouen/Elbeuf inclus), 61 négatifs en 4 listes partagées, 1 RSA par groupe,
extension d'appel 06 67 33 68 97, 4 accroches, 4 liens annexes (?s=devis/prix/zones/faq, scroll instantané géré par script.js), extrait structuré « Services », enchère mobile +15 %.

**À activer seulement quand** : facturation validée (statut `PENDING` au 2026-08-21),
domaine en ligne, Web3Forms branché, mentions légales posées. Les URLs finales
pointent vers `https://adelelouis-toiture.fr/` : re-sauvegarder les annonces une fois
le domaine actif pour déclencher l'examen.

La logique de la structure, pour mémoire :

| Groupe | Mots-clés |
|--------|-----------|
| Démoussage | `"démoussage toiture évreux"`, `[démoussage toiture évreux]`, `"démoussage toiture vernon"`, `"démoussage toiture louviers"`, `"nettoyage toiture évreux"`, `"entreprise démoussage eure"`, `"démoussage toiture 27"` |
| Hydrofuge | `"hydrofuge toiture évreux"`, `"traitement toiture eure"`, `"anti mousse toiture évreux"` |
| Prix / devis | `"prix démoussage toiture"`, `"devis démoussage toiture"`, `"tarif nettoyage toiture m2"` |

**Mots-clés négatifs à poser dès le jour 1** : `emploi`, `formation`, `salaire`, `leroy merlin`,
`brico`, `produit`, `karcher`, `pas cher`, `gratuit`, `soi meme`, `tuto`, `location nacelle`,
`mairie`, `subvention`, `crédit d'impôt`.

**Ciblage géographique** : rayon 60 km autour de Criquebeuf-sur-Seine (couvre Rouen, Louviers,
Évreux, Vernon), en *présence* (« personnes se trouvant régulièrement dans la zone »), pas en intérêt.

**Titres d'annonce** (30 caractères max) : `Démoussage toiture Évreux` · `Devis gratuit sous 24 h` ·
`Artisan local, décennale` · `Sans haute pression` · `Toit traité et protégé` · `Rappel sous 24 h`.
(« Prix au m² annoncé » est à garder pour plus tard : tant que la page dit « Sur devis », une
annonce qui promet un prix crée une rupture de promesse.)

**Descriptions** (90 caractères max) : `Mousses, lichens, tuiles noircies : on nettoie, on traite,
on protège. Devis gratuit.` · `Artisan de l'Eure, assurance décennale, photos avant/après. Rappel
sous 24 h ouvrées.`

**Extensions** : liens vers `#prix`, `#faq`, `#zones`, `#devis` ; extension d'appel sur le mobile ;
accroches `Devis gratuit`, `Assurance décennale`, `Paiement après chantier`.

**Saisonnalité** : le démoussage se vend au printemps et à l'automne. Monter le budget de mars à
juin et de septembre à novembre, le réduire en plein été et en janvier.

---

## 4. Choix de conception, et pourquoi

- **Formulaire au-dessus de la ligne de flottaison**, à droite du discours, collant au scroll
  sur desktop. Quatre champs visibles seulement : chaque champ supplémentaire coûte des leads.
- **Aucun lien sortant** dans l'en-tête : les seules sorties possibles sont l'appel et le formulaire.
- **Preuve visuelle immédiate** : la photo mi-moussue / mi-propre dit le service en une seconde.
- **Section budget sans prix inventé** : on explique ce qui fait varier le prix, on promet un
  devis gratuit détaillé. Aucun chiffre tant que l'artisan n'a pas validé ses tarifs.
- **Barre d'appel fixe en bas sur mobile** : la majorité du trafic Ads sur ce secteur est mobile et
  convertit au téléphone, pas au formulaire.
