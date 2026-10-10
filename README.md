# Portfolio — Miranto Nantenaina RANDRY

Portfolio professionnel de Miranto Nantenaina RANDRY, développeuse Full Stack spécialisée dans les applications métiers, les API REST, les bases de données SQL et l’automatisation des processus.

L’interface est développée avec React et adopte une direction artistique minimaliste. Une scène Three.js composée de 4 200 particules évolue selon la section consultée, avec des alternatives accessibles pour les appareils mobiles et les utilisateurs préférant réduire les animations.

## Fonctionnalités

- Présentation professionnelle et coordonnées publiques.
- Parcours, formations et certifications.
- Compétences techniques organisées par domaine.
- Cinq projets métier anonymisés avec filtrage par catégorie.
- Téléchargement du CV au format PDF.
- Navigation responsive et menu mobile accessible.
- Morphing de particules lié au défilement.
- Micro-interactions : halo, inclinaison du portrait et attraction légère des CTA.
- Compatibilité avec `prefers-reduced-motion`.
- Métadonnées SEO et contenu entièrement sélectionnable.

## Technologies

- React 19
- Vite 8
- Tailwind CSS 4
- Three.js
- Lucide React
- Vitest
- React Testing Library
- Oxlint

## Prérequis

- Node.js `^20.19.0` ou `>=22.12.0`
- npm compatible avec la version de Node.js utilisée
- Un navigateur moderne prenant en charge les modules ES

## Installation

```bash
git clone <url-du-depot>
cd mii_portfolio
npm install
npm run dev
```

Vite affiche ensuite l’adresse locale de développement dans le terminal.

## Commandes

| Commande | Description |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement Vite. |
| `npm run lint` | Analyse le code avec Oxlint. |
| `npm run test` | Lance Vitest en mode interactif. |
| `npm run test -- --run` | Exécute une seule fois toute la suite de tests. |
| `npm run build` | Génère la version de production dans `dist/`. |
| `npm run preview` | Prévisualise localement le build de production. |

## Architecture

```text
src/
├── animations/       # Three.js, shaders et micro-interactions
├── assets/images/    # Portrait source et version WebP optimisée
├── components/       # Sections et composants de l’interface
├── data/             # Profil, compétences, parcours, projets et animations
├── hooks/            # Media queries et préférences utilisateur
├── test/             # Tests Vitest et Testing Library
├── utils/            # Utilitaires génériques
├── App.jsx            # Composition de la page
├── index.css          # Tailwind, thème et styles globaux
└── main.jsx           # Point d’entrée React

public/
├── images/projects/  # Illustrations abstraites des projets
├── cv-miranto-nantenaina-randry.pdf
├── favicon.svg
└── robots.txt
```

## Personnalisation du contenu

Les contenus publics sont centralisés afin d’éviter les textes métier dispersés dans les composants :

- `src/data/profile.js` : identité, résumé, coordonnées, portrait et CV.
- `src/data/skills.js` : catégories de compétences.
- `src/data/experiences.js` : expériences, formations et certifications.
- `src/data/projects.js` : projets anonymisés, technologies et illustrations.
- `src/data/animations.js` : forme, position, taille et opacité des particules par section.

Les liens de démonstration ou de code source ne sont rendus que lorsqu’une URL réelle est renseignée.

## Animations et performances

La scène décorative est chargée dynamiquement pour ne pas alourdir le bundle principal. Elle est activée uniquement lorsque les conditions suivantes sont réunies :

- largeur d’écran d’au moins 992 px ;
- WebGL2 disponible ;
- périphérique disposant d’un pointeur précis ;
- préférence de mouvement réduit désactivée.

Sur mobile, sans WebGL2 ou avec `prefers-reduced-motion: reduce`, un motif statique léger remplace l’animation. Le rendu Three.js limite le pixel ratio à `1.5`, suspend l’animation lorsque l’onglet est masqué et libère ses ressources au démontage.

## Accessibilité

- Navigation utilisable au clavier.
- Focus visible sur les éléments interactifs.
- Menu mobile fermé avec `Escape`, avec restitution du focus.
- Animations décoratives exclues de l’arbre d’accessibilité.
- Curseur système toujours conservé.
- Liens et boutons identifiables autrement que par la couleur.
- Effets non essentiels désactivés avec `prefers-reduced-motion`.

## Validation

Avant une livraison :

```bash
npm run lint
npm run test -- --run
npm run build
```

La recette visuelle doit couvrir au minimum les largeurs 320, 768 et 1440 px dans Firefox, Chrome et Edge. Il faut également vérifier le clavier, le focus, le menu mobile, les filtres des projets, le téléchargement du CV et la dégradation sans WebGL2.

## Confidentialité

Les projets présentés sont volontairement anonymisés. Le dépôt ne doit contenir aucune donnée interne, capture d’écran métier, URL privée, clé d’API ou métrique non vérifiée.

## Déploiement

Après `npm run build`, le dossier `dist/` peut être publié sur un hébergeur de sites statiques. La configuration du serveur doit rediriger les routes inconnues vers `index.html` si de futures routes côté client sont ajoutées.

L’URL de production, le domaine canonique et le sitemap devront être ajoutés lorsqu’un hébergement définitif sera choisi.
