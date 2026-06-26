import chromadb

client = chromadb.PersistentClient(
    path = "./chroma_db"
)

collection = client.get_or_create_collection(
    name = "research_papers"
)

def store_chunks(chunks):

    ids = []
    documents = []
    embeddings = []
    metadatas = []

    for chunk in chunks:

        ids.append(
            f"{chunk['userId']}_{chunk['documentName']}_{chunk['pageNumber']}_{chunk['chunkIndex']}"
        )

        documents.append(
            chunk["text"]
        )

        embeddings.append(
            chunk["embedding"]
        )

        metadatas.append({
            "userId": chunk["userId"],
            "pageNumber": chunk["pageNumber"],
            "chunkIndex": chunk["chunkIndex"],
            "documentName": chunk["documentName"]
        })

    print(chunks[0])

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas
    )

    print("TOTAL VECTORS:", collection.count())
    print("\n===== STORED METADATA =====")
    peek = collection.get(limit=3)
    print(peek["metadatas"])
    print("===========================\n")



def delete_document_chunks(user_id, document_name):

    collection.delete(
        where= {
            "$and": [
                {
                    "userId": user_id
                },
                {
                    "documentName": document_name
                }
            ]
        }
    )
