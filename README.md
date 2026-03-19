# LinkedIn Translator 💼✨

Turn brutally honest statements into peak LinkedIn cringe.

## Deploy to Vercel (Free)

### Prerequisites
- An [Anthropic API key](https://console.anthropic.com)
- A [Vercel](https://vercel.com) account (sign up free with GitHub)

### Steps
1. Go to https://vercel.com/new
2. Import this repo
3. Add environment variable: `ANTHROPIC_API_KEY` = your key
4. Click Deploy
5. Done!

## Project Structure
- `api/translate.js` — Serverless function (keeps API key secret)
- `src/App.jsx` — Main React component
- `src/main.jsx` — Entry point
