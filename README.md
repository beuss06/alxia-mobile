# Alxia Mobile - React Native App

Application mobile React Native (Expo) pour **Alxia Platform** (alxia.fr) — la plateforme OnlyFans française gratuite pour créatrices.

## Objectif

Transformer et étendre le projet original (PWA React + Node backend) en une app mobile native performante, avec des outils modernes de création de contenu pour les créatrices :
- Upload **multiple** photos et vidéos
- **Découpage (trim)** de vidéos avec preview
- **Filtres** basiques sur images/vidéos
- Expérience mobile fluide, caméra intégrée, etc.

Le backend et la base de données restent sur ton VPS (alxia.fr). L'app mobile consomme l'API existante.

## Stack Moderne

- **Expo SDK 51+** (facile, OTA updates, managed workflow ou dev client)
- **TypeScript**
- **React Navigation** (bottom tabs + stack)
- **TanStack Query** (data fetching, caching)
- **Zustand** (state management léger)
- **Zod** + React Hook Form (validation)
- **NativeWind** ou Tailwind via utility classes (style moderne comme web)
- **Expo Image Picker** (multi-sélection gallery + caméra)
- **Expo AV** (lecture vidéo/audio)
- **React Native Skia** (optionnel pour filtres GPU avancés et UI fluide)
- **Lucide Icons**, animations Reanimated
- i18n prêt pour français

## Fonctionnalités Clés Améliorées (Créatrice)

### Écran de Création de Post / Upload Média
- Sélection **multiple** photos + vidéos depuis la galerie ou caméra
- Preview en grille ou carousel
- Pour chaque vidéo :
  - **Trim / Découpage** : Sliders start/end time + preview en temps réel
  - Indicateur de durée
- Filtres applicables :
  - Images : Boutons presets (Normal, Vintage, B&W, Warm, Cool) + sliders (luminosité, contraste, saturation) — preview live
  - Vidéos : Filtres simples ou note pour processing backend
- Upload progressif avec pause/reprise (si implémenté)
- Ajout de légende, prix (paywall), tags, etc.
- Publication directe ou brouillon

Autres :
- Dashboard créatrice avec stats
- Feed, messages temps réel (Socket.io compatible)
- Profil optimisé mobile

## Installation & Lancement

```bash
# 1. Cloner
git clone https://github.com/beuss06/alxia-mobile.git
cd alxia-mobile

# 2. Installer dépendances
npm install
# ou yarn

# 3. Lancer en dev
npx expo start

# Scanner le QR avec Expo Go (iOS/Android) ou utiliser dev client pour modules natifs (recommandé pour ffmpeg/video editing avancé)
```

## Configuration API

Dans `src/config/api.ts` ou via variables :
- Base URL : `https://alxia.fr` ou `https://api.alxia.fr` (à adapter selon ton setup nginx/backend)
- Auth : JWT stocké securely (expo-secure-store)

Assure-toi que CORS autorise l'origine mobile ou utilise proxy.

## Pour les outils avancés de vidéo (trim + filtres réels)

1. Utiliser **Expo Dev Client** + custom native modules ou :
2. Backend : Ajouter ffmpeg sur le VPS pour processing serveur (trim, filters, thumbnails) — envoie les params (start, end, filter) avec l'upload.
3. Librairies recommandées supplémentaires :
   - `react-native-ffmpeg` ou `expo-ffmpeg-kit` (via dev client)
   - `@shopify/react-native-skia` pour filtres image/vidéo preview
   - `react-native-video` pour player avancé

## Structure du Projet

```
alxia-mobile/
├── app/                  # Expo Router (recommandé) ou src/screens
├── components/           # CreatorMediaUploader, VideoTrimmer, ImageFilterPreview, etc.
├── hooks/
├── lib/                  # api client, auth
├── store/                # zustand stores
├── types/
├── assets/
└── ...
```

## Prochaines Étapes Recommandées

1. Implémenter l'authentification (login avec JWT du backend existant)
2. Créer l'écran CreatorUpload avec les features multi-upload + trim + filtres (code de base fourni dans components/)
3. Connecter aux endpoints backend existants (/api/posts, /api/media/upload etc.)
4. Ajouter navigation créatrice
5. Tester sur device réel
6. Publier sur App Store / Play Store ou distribuer via EAS Build

Le projet original backend/frontend web reste intact sur alxia.fr. Cette app mobile est complémentaire pour une meilleure expérience créatrice sur mobile.

## Idée OnlyFans Français Gratuit

- Pas de frais élevés sur les abonnements/tips (ou 0% pour starters)
- Outils puissants gratuits pour créatrices (upload avancé, filtres, trim)
- Focus communauté française, modération, etc.
- Monétisation via dons, abonnements premium optionnels, ou partenariats

Bonne création ! 🚀

Si tu veux que j'ajoute plus de code (écran complet, intégration API, etc.), dis-le moi.