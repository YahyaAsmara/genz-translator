# Gen Z → Human Translator

A web app that translates Gen Z slang into standard English. Built with React, Spring Boot, PostgreSQL, and Docker.

![Gen Z App](frontend/images/genz_app.png "Gen Z App")

## Quick Start

```bash
git clone https://github.com/yourusername/genz-translator.git
cd genz-translator
docker-compose up -d
```

Access at http://localhost:3000

## What it does

Translates text like `"no cap bestie, this app is bussin fr fr"` 
→ `"No lie best friend, this app is really good for real for real"`

## Architecture

- **Frontend**: React (port 3000)
- **Backend**: Spring Boot API (port 8080) 
- **Database**: PostgreSQL (port 5432)
- **120+ Gen Z terms** with real-time translation

## Key API Endpoints

- `POST /api/translate` - Translate text
- `GET /api/terms` - Get all terms
- `GET /api/health` - Health check

## Development

```bash
# View logs
docker-compose logs -f

# Add new term
curl -X POST http://localhost:8080/api/terms \
  -H "Content-Type: application/json" \
  -d '{"genzText": "slaps", "translation": "is really good", "category": "slang"}'
```

Built for developers who want to understand Gen Z communication patterns.