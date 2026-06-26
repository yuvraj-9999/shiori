from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from chroma_services import collection, store_chunks, delete_document_chunks

app = FastAPI()

model = SentenceTransformer(
    "BAAI/bge-small-en-v1.5"
)

class EmbeddingRequest(BaseModel):
    text: str

class Chunk(BaseModel):
    userId: str
    documentName: str
    pageNumber: int
    chunkIndex: int
    text: str
    embedding: list[float]

class StoreChunksRequest(BaseModel):
    chunks: list[Chunk]

class SearchRequest(BaseModel):
    query: str
    userId: str

class DeleteDocumentRequest(BaseModel):
    userId: str
    documentName: str

@app.post("/embeddings")
def create_embedding(
    request: EmbeddingRequest
):
    embedding = model.encode(
        request.text
    ).tolist()

    return {
        "embedding": embedding
    }

@app.post("/store-chunks")
def store_document_chunks(
    request: StoreChunksRequest
):
    print("Received chunks:", len(request.chunks))
    print("First chunk user:", request.chunks[0].userId)

    store_chunks([chunk.model_dump() for chunk in request.chunks])

    print("TOTAL VECTORS AFTER STORE:", collection.count())


    return {
        "success": True,
        "chunksStored": len(request.chunks)
    }

@app.post("/search")
def search_documents(request: SearchRequest):

    query_embedding = model.encode(
        request.query
    ).tolist()

    print("\n========== SEARCH ==========")
    print("SEARCH USER:", request.userId)
    print("TOTAL VECTORS:", collection.count())

    # Get all stored metadata
    all_data = collection.get()

    matches = [
        metadata
        for metadata in all_data["metadatas"]
        if metadata["userId"] == request.userId
    ]

    print("MATCHING METADATA:", len(matches))

    if matches:
        print("FIRST 5 MATCHES:")
        print(matches[:5])

    print("============================\n")

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=10,
        where={
            "userId": request.userId
        }
    )

    print("===== QUERY RESULTS =====")
    print(results)
    print("=========================\n")

    return results

@app.post("/delete-document")
def delete_document(
    request: DeleteDocumentRequest
):

    delete_document_chunks(
        request.userId,
        request.documentName
    )

    return {
        "Success": True
    }


@app.get("/debug")
def debug():

    print(collection.peek(limit=1))

    return collection.peek(limit=1)