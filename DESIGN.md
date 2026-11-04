# MA-ORIENTATION — Systeme de design « Le tableau et le cahier »

Refonte UI/UX du MVP2. Le backend, les routes et la base de donnees n'ont pas ete modifies.
La refonte est une **couche** posee par-dessus `style.css` : pour revenir en arriere, il suffit de
retirer `css/ui.css` et `js/ui.js` des pages.

---

## 1. La direction

Deux objets que chaque eleve ivoirien manipule tous les jours donnent la direction visuelle :

- **le tableau** — surface sombre vert-noir, pour les moments de decision (hero, ecrans
  d'authentification, messages) ;
- **le cahier** — papier creme legerement regle, pour tout ce qui se lit (cartes, listes, formulaires) ;
- **la craie orange** — l'accent de la marque, utilise comme un professeur souligne : une fois,
  au bon endroit.

Le bleu marine des aplats de la v3 a ete remplace par le vert-tableau : plus proche du contexte
scolaire, meilleur contraste avec le blanc craie, et il libere le bleu pour les etats d'information.

## 2. Jetons

Tous les jetons sont definis dans `public/css/ui.css` et redefinissent ceux de `style.css`.

| Role | Valeur |
| --- | --- |
| Papier (fond) | `#FAF7EF` |
| Surface | `#FFFFFF` |
| Tableau | `#14261F` / `#1C3A2C` |
| Craie | `#F2EFE4` |
| Mandarine (accent) | `#E8871E`, fonce `#B4600C` |
| Vert savane | `#1B5E4B` |
| Terre rouge | `#C4432B` |
| Encre | `#132118`, adouci `#33443A`, discret `#5F6B63` |

Typographie : **Bricolage Grotesque** (600–800) pour les titres, **Instrument Sans** (400–700)
pour le texte courant. Echelle fluide `--step--1` a `--step-4`.

Rayons : `10 / 16 / 24 px` et pilule. Trois niveaux d'ombre seulement.

**Mode nuit** : `html[data-theme="nuit"]`. Le choix est retenu dans `localStorage` (`mo-theme`),
et la preference systeme sert de valeur par defaut. Le bouton est ajoute automatiquement dans
`.header-actions` par `ui.js`.

## 3. Les portraits d'eleves

Six portraits vectoriels ont ete crees pour le projet dans `public/img/students/` :
`eleve-aminata`, `eleve-kouadio`, `etudiante-fatou`, `etudiant-yao`, `eleve-mariam`,
`etudiant-bakary`. Environ 2 Ko chacun, sans dependance reseau, lisibles a 26 px comme a 200 px.

Ils apparaissent dans le hero du tableau de bord, les temoignages, les pages de connexion et
d'inscription, le badge de compte, les cartes mentor et les messages du forum.

```js
UI.portrait('Awa Kone');              // <span class="portrait">…</span>
UI.portrait('Awa Kone', 'portrait--lg');
UI.avatar('Awa Kone');                // pastille d'initiales coloree
```

Le portrait attribue est **stable pour un meme nom** : un mentor garde le meme visage d'une page
a l'autre. La couleur des pastilles d'initiales suit la meme regle.

### Utiliser de vraies photos

Les portraits illustres evitent deux problemes : les droits a l'image de mineurs et le poids des
fichiers. Pour passer a de vraies photos :

1. deposer les images dans `public/img/students/` (format carre, 400 x 400 px, `.webp` ou `.jpg`
   compresse a moins de 60 Ko) ;
2. remplacer les chemins dans le tableau `PORTRAITS` de `public/js/ui.js` ;
3. mettre a jour les `<img>` de `index.html`, `login.html` et `registration.html`.

Le cadrage est deja gere : `object-fit: cover` dans `.portrait` et `.portrait-arche`.
Une autorisation ecrite est necessaire pour toute photo d'eleve mineur.

## 4. Composants ajoutes

| Classe | Role |
| --- | --- |
| `.tableau-hero` | Bandeau sombre, trame de pagne, rebord de tableau |
| `.trait-craie` | Soulignement a la craie sous un groupe de mots (une seule fois par page) |
| `.portrait`, `.portrait-arche`, `.portrait-stack` | Portraits ronds, en arche, en pile |
| `.parcours`, `.etape` | Parcours d'orientation en quatre etapes, avec jauge |
| `.temoignages`, `.temoignage` | Paroles d'eleves |
| `.squelette` | Chargement |
| `.empty-state` | Ecran vide illustre, avec une action |
| `.toast-zone`, `.toast` | Messages courts non bloquants |
| `.tabbar` | Barre d'onglets mobile |

Fonctions disponibles apres le chargement de `js/ui.js` :

```js
UI.squelettes('jobsContainer', 4);       // pendant l'attente
UI.fini('jobsContainer');
UI.vide(titre, texte, boutonHTML);       // renvoie le HTML d'un ecran vide
UI.message('Bilan calcule.', 'ok');      // 'ok' | 'erreur' | rien
```

## 5. Navigation

- **Ordinateur** : en-tete fixe, ombre a partir de 8 px de defilement, lien actif en pastille orange.
- **Telephone (≤ 720 px)** : barre d'onglets fixe en bas (Accueil, Metiers, Test, Mentorat, Mon
  espace) generee par `ui.js`, plus un tiroir lateral pour les liens restants. Le tiroir se ferme
  au clic exterieur, a la touche Echap et apres un clic sur un lien ; `aria-expanded` est tenu a jour.

## 6. Accessibilite

- Lien « Aller au contenu » ajoute automatiquement sur chaque page.
- Cibles tactiles d'au moins 44 px ; champs de formulaire a 48 px.
- Contour de focus visible de 3 px, decale de 3 px.
- `prefers-reduced-motion` respecte ; `prefers-color-scheme` sert de defaut au mode nuit.
- Les messages courts sont annonces (`role="status"`, `aria-live="polite"`), les zones en
  chargement portent `aria-busy`.
- Les portraits decoratifs ont un `alt` vide ; les noms sont toujours ecrits en texte a cote.

## 7. Ecriture

Phrases courtes, tutoiement, voix active. Un bouton annonce ce qu'il fait et garde le meme nom
dans tout le flux. Un ecran vide explique la situation et propose une sortie. Une erreur dit ce
qui s'est passe et comment continuer — elle ne s'excuse pas.

## 8. Mise en page pleine largeur

`.container` n'a plus de largeur maximale : le contenu occupe tout l'ecran, avec une gouttiere
fluide (`clamp(18px, 3.4vw, 64px)`). Les grilles passent en `auto-fill`, donc le nombre de colonnes
suit la largeur disponible au lieu d'etre fige.

Deux garde-fous, parce qu'une ligne de texte de 200 caracteres ne se lit pas : les paragraphes
restent limites a 68 caracteres (`p { max-width: 68ch }`), la classe `.mesure` limite un bloc de
prose a 74 caracteres, et la FAQ passe en deux colonnes au-dela de 1100 px plutot que d'etirer
ses lignes.

## 9. Bibliotheque d'images

- `public/img/students/` — **12 portraits** d'eleves et d'etudiants (coiffures, foulard, blouse de
  stage, casque de chantier, casque audio, lunettes).
- `public/img/secteurs/` — **13 scenes illustrees** au format 16/9, une par secteur d'activite plus
  une scene generique. Elles servent de couverture aux tuiles de secteur, de vignette sur les cartes
  metier, de couverture sur la fiche metier et d'illustration sur les cartes d'etablissement.
- `public/img/craie-*.svg`, `illu-vide-cahier.svg` — annotations et ecran vide.

### Photographies integrees

`public/img/photos/` contient quatre photographies fournies par le client (lyceen a Cocody,
lyceenne a Treichville, etudiante en cours, etudiant en salle informatique), declinees en trois
formats : `<nom>.jpg` (16/9, 1280 px), `<nom>-portrait.jpg` (3/4, 600 px) et `<nom>-carre.jpg`
(1:1, 400 px). Elles sont utilisees sur le hero du tableau de bord, le hero d'Explorer, les pages
de connexion et d'inscription, et les bandeaux de mentorat, communaute, FAQ et analyse de moyennes.

Ces images ont ete generees par IA : elles ne representent aucune personne reelle. Avant une mise
en ligne publique, soit les mentionner comme telles, soit les remplacer par des photographies
sous licence. Les illustrations vectorielles restent utilisees pour les avatars et les temoignages,
pour ne pas preter un visage photographique a une parole fictive.

### Remplacer les visuels de secteur par des photographies

Le systeme est prevu pour : `UI.visuelSecteur(slug)` demande d'abord
`img/photos/<slug>.jpg` et ne retombe sur l'illustration vectorielle que si le fichier n'existe pas.

1. creer `public/img/photos/` ;
2. y deposer `numerique-tech.jpg`, `sante.jpg`, etc. (memes noms que les fichiers de
   `img/secteurs/`), en 1600 x 900 px, compressees sous 200 Ko ;
3. rien d'autre a modifier : les photos remplacent les illustrations partout ou elles sont utilisees.

Pour les portraits, remplacer les chemins du tableau `PORTRAITS` dans `js/ui.js`.
Rappel : toute photo d'un eleve mineur exige une autorisation ecrite du responsable legal.
Les banques d'images gratuites utilisables commercialement (Unsplash, Pexels, Nappy, CreateHER
Stock) proposent des photos d'etudiants africains ; verifier la licence de chaque cliche.

## 10. Catalogue (base de donnees v4)

`database/schema-v4-catalogue-elargi.sql`, a executer en dernier, ajoute :

- 7 secteurs (droit, education, transport-logistique, arts et medias, tourisme-hotellerie,
  energie-mines, administration) — **12 secteurs au total** ;
- 72 metiers supplementaires — **85 metiers** ;
- pour chacun, les chances d'insertion par serie (A, C, D) et une roadmap en 4 etapes ;
- une table `schools` de 74 etablissements, servie par `GET /api/schools`
  (filtres `type`, `city`, `search`) et `GET /api/schools/stats`.

Le script est rejouable : index uniques sur `jobs.title` et `job_roadmap_steps(job_id, step_order)`,
`INSERT IGNORE` partout. Les salaires et pourcentages sont indicatifs.

## 11. Page Explorer, reorganisee

Avant : deux listes empilees, deux barres de recherche, aucune hierarchie.
Maintenant : un bandeau avec les chiffres du catalogue, deux onglets (**Metiers** / **Ou etudier**),
une barre d'outils collante (recherche, niveau requis, tri), des pastilles de secteur defilantes,
une grille de douze tuiles illustrees qui s'efface des qu'un filtre est actif, un compteur de
resultats avec bouton de reinitialisation, et des cartes metier portant la vignette de leur secteur.
Cote etablissements : filtres par type et par ville, recherche par filiere, illustration deduite des
filieres de l'ecole.

## 12. Ce qui reste a faire

- Les pages `job-detail`, `student-space`, `faq` et `grade-analysis` heritent de la nouvelle
  charte mais n'ont pas ete rescenarisees ; la roadmap metier gagnerait a etre une vraie frise.
- Remplacer les chiffres de preuve sociale du hero par des donnees reelles quand elles existeront.
- Ajouter une image de partage (`og:image`) et un manifeste pour l'installation sur telephone.
