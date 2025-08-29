# AI Customer Support Agent

This repository contains a prototype for an AI-powered customer support agent. It includes a Next.js 14 frontend using Tailwind CSS and Framer Motion and an Express backend with Sequelize and PostgreSQL. Users can optionally upload a PDF which is parsed and used as context when answering questions.

## Architecture

- **frontend/** – Next.js application with a chat interface and analytics dashboard.
- **backend/** – Express server exposing REST endpoints and persisting queries via Sequelize.

### OpenAI integration

The backend uses the official OpenAI Node.js SDK. `backend/services/openai.js` creates a client when the `OPENAI_API_KEY` environment variable is present. The chat route sends the user's question to the `gpt-4o-mini` model with a JSON schema that extracts an answer and sentiment label. The answer is also converted to speech with the `gpt-4o-mini-tts` model so the frontend can play audio responses.

On each request the backend stores the question and sentiment in Postgres. The analytics route aggregates these records to report total questions, sentiment breakdown, and most common queries.

## Running the project

Install dependencies and start both servers. The frontend uses `NEXT_PUBLIC_API_BASE` to locate the backend and defaults to `http://localhost:3001`.

```
cd backend && npm install && npm start
```

```
cd frontend && npm install && npm run dev
```

Before starting the backend provide the OpenAI API key (and a `DATABASE_URL` if you want to persist data):

```
export OPENAI_API_KEY=your_key_here
export DATABASE_URL=postgres://user:pass@localhost:5432/aicsa   # optional
```

### Database setup

The backend uses PostgreSQL via Sequelize to persist query data. To create a new
database and attach it to the backend:

1. Ensure PostgreSQL is running and set `DATABASE_URL` to your connection
   string. For example:
   ```bash
   export DATABASE_URL=postgres://user:pass@localhost:5432/aicsa
   ```
2. From the `backend` directory, create the database and run the migrations:
   ```bash
   cd backend
   npx sequelize-cli db:create    # creates the database in DATABASE_URL
   npm run migrate                # applies table migrations
   ```
   You can adjust the default connection in `backend/config/config.js` or by
   changing `DATABASE_URL`.

## API overview

- `POST /api/upload` – multipart form-data with field `file` (PDF) → `{ text }`
- `POST /api/chat` – body `{ question: string, pdfText?: string }` → `{ answer, sentiment, audio }`
- `GET /api/analytics` – returns counts of total, happy, angry, neutral, and the top queried questions

## How it works

1. The user types a question in the frontend chat component.
2. The user may upload a PDF which the frontend sends to `/api/upload`; the backend extracts its text.
3. The frontend POSTs the question (and extracted text if available) to `/api/chat` on the backend.
4. The backend asks OpenAI for an answer and sentiment using the document text as context and stores the record in Postgres.
5. The backend returns the answer, sentiment, and optional speech audio to the frontend.
6. The frontend displays the conversation and plays the audio. The dashboard fetches `/api/analytics` to show usage statistics.

## Testing

Run the tests from the repository root:

```
npm test
cd backend && npm test
cd frontend && npm test
```
