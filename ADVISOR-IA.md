# Conseiller IA — MA-ORIENTATION (hackathon)

## LLM configuré

| Priorité | Fournisseur | Modèle |
|---|---|---|
| 1 | **Groq** | `openai/gpt-oss-20b` |
| 2 | Groq fallback | `qwen/qwen3.8-27b` |
| 3 | NVIDIA NIM (optionnel) | si `NVIDIA_API_KEY` renseignée |
| 4 | Local | bilan statique (toujours disponible) |

Clés déjà dans `.env` (Groq). Les modèles Llama classiques n'étaient plus exposés sur ce compte ; les modèles OSS/Qwen disponibles ont été branchés et **testés avec succès**.

## Lancer

```bash
npm install
# MySQL (XAMPP) + schéma importé si besoin
npm start
# → http://localhost:3000
```

## Démo 90 s

1. Login → **Test d'orientation** ou **Analyse de notes**
2. Résultats (moteur de règles existant)
3. Panneau **« Demande à ton conseiller »**
4. Chip « Et si je n'aime pas les maths ? » ou question libre
5. Réponse Groq ancrée dans le profil + knowledge-base

## Fichiers clés

- `services/advisorService.js` — prompt + retrieval + Groq/NVIDIA/fallback
- `routes/advisorRoutes.js` — `POST /api/advisor/ask`
- `public/js/advisor.js` — UI du panneau
- `data/knowledge-base.json` — extraits RAG
- `scripts/generate-embeddings.js` — one-shot Brev (optionnel)

## Sécurité

- Aucun nom / email / téléphone envoyé au modèle
- Disclaimer sous le panneau
- Fallback automatique si l'API échoue


## Reconnaissance vocale

Bouton **micro** dans le panneau conseiller (`public/js/advisor.js`).

- API : **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`)
- Langue : `fr-FR`
- Flux : clic micro → écoute → transcription dans le champ → envoi auto si phrase finale ≥ 4 caractères
- Aucun audio n’est envoyé à ton serveur (reste dans le navigateur)
- Navigateurs : Chrome, Edge, Safari récent (Firefox limité)
- Si non supporté : bouton grisé, saisie texte toujours disponible

Pour un STT Whisper côté serveur (plus robuste hors Chrome), brancher plus tard le service `WHISPER_*` du module Membre B sur une route `POST /api/advisor/stt`.
