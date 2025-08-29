# AI Customer Support Agent

This repository contains a prototype for an AI-powered customer support agent. It includes a Next.js 14 frontend using Tailwind CSS and Framer Motion and an Express backend with Sequelize and PostgreSQL.

## Structure

- `frontend/` – Next.js application with chat interface and a dummy analytics dashboard.
- `backend/` – Express server with placeholder routes for chat and analytics.

## Development

Install dependencies for each package and run their respective development servers.

```
cd frontend && npm install && npm run dev
```
```
cd backend && npm install && npm start
```

### Environment

The backend integrates with the OpenAI API for generating answers, sentiment, and voice output. Provide an API key before starting the server:

```
export OPENAI_API_KEY=your_key_here
```

The project currently provides only a minimal skeleton and does not implement full AI functionality. The frontend ships with dummy chat history and analytics so the UI can be previewed without the backend.
