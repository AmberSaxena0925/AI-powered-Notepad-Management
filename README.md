# NotaAI

AI notepad with Summary, Roadmap and Chat. Notes sync with the public RESTful API demo service; browser storage is used as an offline fallback. AI features remain optional and require the existing `/api/ai` configuration.

## Notes API

The frontend uses `https://api.restful-api.dev/objects`:

- `GET /objects` loads notes when the app starts.
- `POST /objects` creates a note.
- `PUT /objects/:id` updates a note after edits.
- `DELETE /objects/:id` deletes a note.

The API is a public demo service, so do not store private or sensitive notes there.

## Run
1. Install Node 18+
2. `npm install`
3. `cp .env.example .env` (optional; without an AI provider the app uses built-in educational mode)
4. `npm start` then open http://localhost:3000

## Optional external AI

To use an external OpenAI-compatible model, fill in `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL` in `.env`. If these are empty, Summary, Roadmap, and Chat use deterministic educational guidance locally.

## Switching models
Change AI_MODEL (and AI_BASE_URL/AI_API_KEY for another gateway). Any OpenAI-compatible
`/chat/completions` endpoint works: OpenRouter, OpenAI, LiteLLM, Vercel AI Gateway, Cloudflare AI Gateway.

## Before going public
Add real authentication to `/api/ai` and keep `.env` out of git.
