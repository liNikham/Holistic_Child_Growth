import asyncio
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict
import os
from contextlib import asynccontextmanager
import logging

from child_journal_rag import ChildJournalRAG  # Import the previous RAG class

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for request/response validation
class QueryRequest(BaseModel):
    child_id: str
    query: str

class QueryResponse(BaseModel):
    answer: str
    sources: list
    error: Optional[str] = None

# Global variables for storing initialized components
rag_system: Optional[ChildJournalRAG] = None
rag_chains: Dict = {}

# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize RAG system on startup
    global rag_system
    try:
        rag_system = ChildJournalRAG()
        logger.info("RAG system initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize RAG system: {e}")
        raise e
    
    yield
    
    # Cleanup on shutdown
    rag_chains.clear()
    logger.info("Cleaned up RAG chains")

app = FastAPI(lifespan=lifespan)

# Helper function to initialize or get RAG chain for a child
async def get_child_rag_chain(child_id: str) -> tuple:
    """Initialize or retrieve RAG chain for a specific child."""
    if child_id not in rag_chains:
        try:
            # Load journal data
            journal_data = rag_system.load_journal_from_s3(child_id)
            if not journal_data:
                raise HTTPException(status_code=404, detail="Child journal not found")
            
            # Prepare documents and create vector store
            print("\n\n\n")
            documents = rag_system.prepare_documents(journal_data)
            vector_store = rag_system.create_vector_store(documents)
            # Setup RAG chain
            chain = rag_system.setup_rag_chain(vector_store)
            print("\n\n\n")

            print("\nchain", chain)

            rag_chains[child_id] = chain
            logger.info(f"Initialized RAG chain for child {child_id}")
            
        except Exception as e:
            logger.error(f"Error initializing RAG chain for child {child_id}: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    return rag_chains[child_id]

# Background task to clean up old RAG chains
async def cleanup_old_chains(child_id: str):
    """Remove RAG chain after some time to free up memory."""
    await asyncio.sleep(3600)  # Keep chain for 1 hour
    if child_id in rag_chains:
        del rag_chains[child_id]
        logger.info(f"Cleaned up RAG chain for child {child_id}")

@app.post("/query", response_model=QueryResponse)
async def query_journal(
    request: QueryRequest,
    background_tasks: BackgroundTasks
):
    """
    Query a child's journal with a specific question.
    
    Args:
        request: QueryRequest containing child_id and query
        background_tasks: FastAPI BackgroundTasks for cleanup
    
    Returns:
        QueryResponse containing the answer and sources
    """
    try:
        # Get or initialize RAG chain
        chain = await get_child_rag_chain(request.child_id)
        
        # Schedule cleanup
        background_tasks.add_task(cleanup_old_chains, request.child_id)
        
        # Process query
        result = rag_system.query_journal(chain, request.query)
        
        return QueryResponse(
            answer=result["answer"],
            sources=result["sources"],
            error=result.get("error")
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "rag_system": rag_system is not None}