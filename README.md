# AI Router - Personalized AI Tools Dashboard

Production-style full-stack project with login/signup, intent classification, AI routing, feedback learning, and a personalized dashboard.

## Step 1: System Design

### High-level architecture

- Frontend (React + Tailwind): auth flow, dashboard, query composer, response panel, history sidebar.
- API Gateway (Express app): entrypoint for authentication, query processing, history retrieval, and feedback.
- Intent Classifier: classifies request into coding, writing, research, image_generation, or general.
- AI Router: chooses best model using intent + confidence + user preference boost.
- Model Manager: maps intents to primary and fallback model/provider.
- Provider Clients: connects to free providers (Hugging Face Inference API and local Ollama).
- User Profiling System: stores intent preferences and persona data in MongoDB.
- Feedback Loop: likes/dislikes update preference scores and improve future routing.
- Session Memory: lightweight context memory per user session for context-aware responses.

### Data flow

1. User signs in and sends query from dashboard.
2. API Gateway validates JWT and payload.
3. Intent Classifier predicts intent + confidence.
4. Personalization boost is computed from user preference profile.
5. AI Router asks Model Manager for primary/fallback routes.
6. Router calls provider client; fallback triggers on failure.
7. Query and response are persisted.
8. Session memory stores user and assistant turns.
9. Response + confidence + selected model is returned to UI.
10. User feedback updates preference scores and improves next routing decisions.

## Step 2: Database Design (MongoDB)

### users

- name, email, passwordHash
- role (student/professional)
- persona (primaryUseCase, preferredTone, experienceLevel)
- intentPreferences [{ intent, score }]
- timestamps

### queries

- userId, sessionId
- text
- detectedIntent
- confidence
- modelChosen
- contextSummary
- timestamps

### airesponses

- queryId, userId
- provider, model
- responseText
- latencyMs, tokenEstimate
- fallbackUsed
- timestamps

### feedback

- userId, queryId
- rating (like/dislike)
- note
- timestamps

### sessionmemories

- userId, sessionId
- turns [{ role, message, intent }]
- timestamps

## Step 3: Backend Implementation

Backend code is under backend/src with modular layering:

- config: environment and DB connection
- middleware: auth, errors, not-found
- models: MongoDB entities
- services: intent classifier, router, model manager, provider integrations, personalization, context memory
- controllers: auth/query/history/feedback orchestration
- routes: route modules mounted under /api

### APIs

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/query
- GET /api/history
- POST /api/feedback

## Step 4: AI Router Logic

- Intents supported: coding, writing, research, image_generation, general
- Router computes adjusted confidence:
  - adjustedConfidence = baseConfidence + personalizationBoost
- Primary/fallback strategy per intent via modelManager
- Free-provider strategy:
  - Hugging Face API (when HF_API_KEY exists)
  - Ollama local models (free/local)
  - Heuristic prompt helper fallback for image mode

## Step 5: Frontend Implementation

React app includes:

- Login and signup onboarding pages
- Protected dashboard route
- Search/query input with loading states
- AI response cards with intent/model/confidence badges
- Feedback controls (helpful / needs improvement)
- History sidebar and activity timeline
- Goal/progress panel matching your Figma style direction

## Step 6: Personalization

- Each query increments intent preference score
- Explicit feedback modifies score strongly:
  - like: +2
  - dislike: -2
- Preference score contributes boost to routing confidence
- Top intents returned as recommendedIntents for tool suggestion UX

## Step 7: Advanced Features

- Context awareness: session memory from recent turns is prepended to prompts
- Session memory: capped window for stable token usage
- Tool suggestions: intent-based recommendation returned per response
- Cold start onboarding: signup captures role and primary use case

## Step 8: Deployment (Free-tier friendly)

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas free tier

Environment variables:

- NODE_ENV
- PORT
- MONGO_URI
- JWT_SECRET
- HF_API_KEY
- OLLAMA_BASE_URL
- ALLOWED_ORIGINS
- VITE_API_BASE_URL (frontend)

## Step 9: Code Structure

- frontend: React + Tailwind UI and API integration
- backend: Express + MongoDB with modular services
- clean boundaries between routing, controller orchestration, and service logic

## Step 10: FAANG-level Engineering Additions

- Scalability:
  - stateless API, route-level modularization, provider abstraction
  - DB indexes on user/timestamp access patterns
- Error handling:
  - centralized error middleware
  - fallback routing for model/provider failures
- Logging:
  - structured JSON logs for API startup and error paths
- Security:
  - helmet, cors allowlist, rate limiting, JWT auth, input validation
- Clean architecture:
  - separation of concerns and dependency direction from controllers to services

## Run Locally

### 1. Backend

1. cd backend
2. copy .env.example to .env
3. npm install
4. npm run dev

### 2. Frontend

1. cd frontend
2. create .env with VITE_API_BASE_URL=http://localhost:8080/api
3. npm install
4. npm run dev

## Notes on Free AI APIs

- Hugging Face Inference API has generous free usage with account limits.
- Ollama is free and local (recommended for development and privacy).
- If HF_API_KEY is absent, intent classification and image helper fallback to heuristic mode.
