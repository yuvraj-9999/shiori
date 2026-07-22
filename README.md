# Shiori – AI Research Paper Assistant

Shiori is a full-stack AI-powered research assistant that enables users to upload research papers, build a private knowledge base, and interact with their documents using Retrieval-Augmented Generation (RAG).

The application combines semantic search, vector embeddings, and Google's Gemini API to generate context-aware answers strictly from the uploaded documents while maintaining complete user-level document isolation.

---

## Features

- User authentication using JWT
- Secure multi-user document isolation
- Upload and manage PDF research papers
- Automatic document chunking and embedding generation
- Semantic search using ChromaDB
- Retrieval-Augmented Generation (RAG)
- AI-powered question answering with Gemini
- Document deletion with automatic vector cleanup
- Dockerized microservice architecture
- Responsive modern UI

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Multer

### AI Service
- FastAPI
- Sentence Transformers
- ChromaDB
- Google Gemini API

### DevOps
- Docker
- Docker Compose
- Nginx

---

## Architecture

```
                 ┌────────────────────┐
                 │      React UI      │
                 │      (Vite)        │
                 └─────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Express Backend   │
                │ Authentication/API  │
                └─────────┬───────────┘
                          │
          ┌───────────────┼────────────────┐
          ▼                                ▼
 MongoDB Atlas                   FastAPI AI Service
(User Data)                (Embeddings + ChromaDB)
                                           │
                                           ▼
                                  Google Gemini API
```

---

## Project Structure

```
shiori/
│
├── client/            # React frontend
├── server/            # Express backend
├── python-service/    # FastAPI embedding service
├── docker-compose.yml
└── README.md
```

---

## Running with Docker

### Prerequisites

- Docker Desktop
- MongoDB Atlas Database
- Google Gemini API Key

### Clone the repository

```bash
git clone https://github.com/yuvraj-9999/shiori.git
cd shiori
```

### Configure environment variables

Create the following files:

```
client/.env
server/.env
server/.env.docker
```

Use the provided `.env.example` files as templates.

### Start the application

```bash
docker compose up --build
```

The application will be available at:

| Service | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| AI Service | http://localhost:8000 |

---

## Running Without Docker

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
npm run dev
```

### Python Service

```bash
cd python-service

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn app:app --reload
```

---

## Environment Variables

### Client

```
VITE_API_URL=
```

### Server

```
PORT=
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
PYTHON_API_URL=
```

---

## RAG Pipeline

1. User uploads a PDF.
2. PDF is parsed and split into chunks.
3. Sentence Transformers generate embeddings.
4. Chunks are stored in ChromaDB.
5. User submits a question.
6. Semantic search retrieves the most relevant chunks.
7. Retrieved context is sent to Gemini.
8. Gemini generates an answer strictly based on the retrieved document context.

---

## Security

- JWT-based authentication
- Protected API routes
- User-specific vector database filtering
- Secure password hashing
- PDF-only uploads
- File size validation

---

## Future Improvements

- Streaming AI responses
- Chat history
- Citation highlighting
- OCR support
- Multiple embedding model support
- Research paper summarization
- Cloud object storage
- CI/CD pipeline

---

## License

This project is licensed under the MIT License.