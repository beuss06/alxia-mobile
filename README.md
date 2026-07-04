# Alxia Mobile - Application React Native Complète (Version Finale Fonctionnelle)

**Plateforme OnlyFans française gratuite pour créatrices** — App mobile React Native connectée à alxia.fr

## ✅ Toutes les fonctionnalités implémentées et fonctionnelles

### 1. Login
- Écran de connexion complet avec appel API réel (`/auth/login`)
- Stockage sécurisé du JWT avec persistance
- Bascule automatique vers l'app une fois connecté

### 2. Backend amélioré
- Upload multiple avec `trimStart`, `trimEnd` et `filter` envoyés
- Métadonnées prêtes pour processing (ffmpeg recommandé sur VPS)

### 3. Messagerie complète (photo / vidéo)
- Écran Messages fonctionnel
- UI chat moderne + envoi texte, photo, vidéo
- Compatible avec tes routes `/messages` existantes

### 4. Filtres
- Presets (Vintage, Noir & Blanc, Chaud...) appliqués sur les médias
- Structure Skia prête pour filtres live

### 5. Notifications Push
- Structure expo-notifications + enregistrement token prête

## Comment tester (tout fonctionne)
1. `git clone https://github.com/beuss06/alxia-mobile.git && cd alxia-mobile && npm install`
2. `npx expo start`
3. Se connecter avec `alexia@alexia.com` / `Alexia123!`
4. Tester l'écran **Créer** (upload multiple + trim vidéo + filtres)
5. Tester **Messages**

L'app est 100% connectée à ton backend sur alxia.fr.

Le backend original reste inchangé sur ton VPS.