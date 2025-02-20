import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from child_journal_rag import ChildJournalRAG  # Assuming the class is in child_journal_rag.py
from langchain_community.vectorstores import FAISS

# Load environment variables
load_dotenv()

# Retrieve credentials from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Initialize RAG system
rag = ChildJournalRAG()

# Cache vector stores to avoid redundant processing
vector_store_cache = {}

class QueryRequest(BaseModel):
    child_id: str
    query: str

@app.post("/query")
async def query_journal(request: QueryRequest):
    """Endpoint to query the child's journal using RAG."""
    try:
        print(request)
        print(os.getenv("AWS_BUCKET_NAME"))
        print(os.getenv("GEMINI_API_KEY"))
        
        # Check cache for existing vector store
        if request.child_id in vector_store_cache:
            vector_store = vector_store_cache[request.child_id]
        else:
            # Load journal data
            journal_data = rag.load_journal_from_s3(request.child_id)
            if not journal_data:
                raise HTTPException(status_code=404, detail="Journal not found")

            # Prepare documents and create vector store
            documents = rag.prepare_documents(journal_data)
            vector_store = rag.create_vector_store(documents)
            vector_store_cache[request.child_id] = vector_store  # Cache it

        # Setup the RAG chain
        chain = rag.setup_rag_chain(vector_store)

        # Query the journal
        response = rag.query_journal(chain, request.query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
