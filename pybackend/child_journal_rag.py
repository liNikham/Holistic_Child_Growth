import json
from typing import List, Dict
import os
from dotenv import load_dotenv
from pathlib import Path
import boto3
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.embeddings import Embeddings

from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.7
)

class ChildJournalRAG:
    def __init__(self, embeddings_model: str = "all-MiniLM-L6-v2"):
        """Initialize the RAG system for child journal analysis.
        
        Args:
            bucket_name: Name of the S3 bucket containing journal data
            embeddings_model: Name of the HuggingFace embeddings model to use
        """
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION')
        )
        self.bucket_name = os.getenv("AWS_BUCKET_NAME")
        self.embeddings = HuggingFaceEmbeddings(model_name=embeddings_model)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
    def load_journal_from_s3(self, child_id: str) -> Dict:
        """Load a child's journal from S3.
        
        Args:
            child_id: Unique identifier for the child
            
        Returns:
            Dict containing the journal data
        """
        try:
            print(self.bucket_name)
            response = self.s3.get_object(
                Bucket=self.bucket_name,
                Key=f"summaries/{child_id}.json"
            )
            journal_data = json.loads(response['Body'].read().decode('utf-8'))
            return journal_data
        except Exception as e:
            print(f"Error loading journal: {e}")
            return {}

    def prepare_documents(self, journal_data: List[Dict]) -> List[Document]:
        """Convert journal data into documents for the vector store.
        
        Args:
            journal_data: List of dictionaries containing journal entries
            
        Returns:
            List of Document objects
        """
        documents = []
        
        for entry in journal_data:
            # Create a document with the monthly summary
            doc = Document(
                page_content=entry['summary'],
                metadata={
                    "month": entry['month'],
                    "year": entry['year'],
                    "type": "monthly_summary"
                }
            )
            documents.append(doc)
            
        # Split documents into smaller chunks
        split_docs = self.text_splitter.split_documents(documents)
        return split_docs

    def create_vector_store(self, documents: List[Document]) -> FAISS:
        """Create a FAISS vector store from the documents.
        
        Args:
            documents: List of Document objects
            
        Returns:
            FAISS vector store
        """
        vector_store = FAISS.from_documents(documents, self.embeddings)
        return vector_store

    def setup_rag_chain(self, vector_store: FAISS):
        """Set up the RAG chain with Gemini LLM."""
        
        # Create a prompt template compatible with Gemini
        prompt = ChatPromptTemplate.from_messages([
            ("human", """Here is some context to help answer the question:
            {context}
            
            Question: {question}
            
            Please answer based on the context provided. If you can't find the answer in the context, just say you don't know.""")
        ])
        
        chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vector_store.as_retriever(
                search_type="mmr",
                search_kwargs={"k": 3}
            ),
            memory=self.memory,
            return_source_documents=True,
            combine_docs_chain_kwargs={"prompt": prompt},
            memory_key="chat_history",
            output_key="answer"
        )
        
        return chain

    def query_journal(self, chain, query: str) -> Dict:
        """Query the journal using the RAG chain."""
        try:
            result = chain.invoke({"question": query})
            if isinstance(result, dict) and "answer" in result:
                return {
                    "answer": result["answer"],
                    "sources": [doc.metadata for doc in result.get("source_documents", [])]
                }
            return {"error": "Unexpected response format"}
        except Exception as e:
            print(f"Error during query: {e}")
            return {"error": str(e)}