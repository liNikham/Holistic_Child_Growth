import chromadb
import os
import logging
from chromadb.config import Settings

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class ChromaManager:
    def __init__(self):
        self.chroma_host = os.environ.get("CHROMA_HOST", "localhost")
        self.chroma_port = int(os.environ.get("CHROMA_PORT", 8000))
        self.client = self._create_client()

    def _create_client(self):
        try:
            client = chromadb.HttpClient(host=self.chroma_host, port=self.chroma_port, settings=Settings(
                chroma_client_auth_provider="chromadb.auth.basic.BasicAuthClientProvider",
                chroma_client_auth_credentials="username:password"
            ))
            logging.info("Connected to ChromaDB server")
            return client
        except Exception as e:
            logging.error(f"Failed to connect to ChromaDB: {e}")
            raise

    def get_collection(self, collection_name):
        try:
            collection = self.client.get_or_create_collection(name=collection_name)
            return collection
        except Exception as e:
            logging.error(f"Failed to get or create collection: {e}")
            return None

    def add_documents(self, collection_name, documents):
        collection = self.get_collection(collection_name)
        if not collection:
            return False

        try:
            ids = [doc['id'] for doc in documents]
            texts = [doc['text'] for doc in documents]
            metadatas = [doc.get('metadata', {}) for doc in documents]

            collection.add(
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )
            logging.info(f"Added {len(documents)} documents to collection '{collection_name}'")
            return True
        except Exception as e:
            logging.error(f"Failed to add documents: {e}")
            return False

    def update_document(self, collection_name, document):
        collection = self.get_collection(collection_name)
        if not collection:
            return False

        try:
            doc_id = document['id']
            text = document['text']
            metadata = document.get('metadata', {})

            # ChromaDB doesn't support direct updates, so delete and re-add
            self.delete_documents(collection_name, [doc_id])
            collection.add(
                documents=[text],
                metadatas=[metadata],
                ids=[doc_id]
            )
            logging.info(f"Updated document '{doc_id}' in collection '{collection_name}'")
            return True
        except Exception as e:
            logging.error(f"Failed to update document: {e}")
            return False

    def delete_documents(self, collection_name, ids):
        collection = self.get_collection(collection_name)
        if not collection:
            return False

        try:
            collection.delete(ids=ids)
            logging.info(f"Deleted {len(ids)} documents from collection '{collection_name}'")
            return True
        except Exception as e:
            logging.error(f"Failed to delete documents: {e}")
            return False

    def query_collection(self, collection_name, query_text, n_results=1):
        collection = self.get_collection(collection_name)
        if not collection:
            return None

        try:
            results = collection.query(
                query_texts=[query_text],
                n_results=n_results
            )
            return results
        except Exception as e:
            logging.error(f"Failed to query collection: {e}")
            return None

# Example usage (assuming you have set CHROMA_HOST and CHROMA_PORT environment variables)
if __name__ == '__main__':
    chroma_manager = ChromaManager()
    collection_name = "test_collection"

    # Example document
    documents = [
        {
            'id': 'doc1',
            'text': 'This is the first document.',
            'metadata': {'author': 'John Doe'}
        },
        {
            'id': 'doc2',
            'text': 'This is the second document.',
            'metadata': {'author': 'Jane Smith'}
        }
    ]

    # Add documents
    if chroma_manager.add_documents(collection_name, documents):
        print("Documents added successfully.")

    # Query documents
    query_results = chroma_manager.query_collection(collection_name, "second document", n_results=1)
    if query_results:
        print("Query results:", query_results)

    # Update a document
    updated_document = {
        'id': 'doc1',
        'text': 'This is the updated first document.',
        'metadata': {'author': 'John Doe', 'updated': True}
    }
    if chroma_manager.update_document(collection_name, updated_document):
        print("Document updated successfully.")

    # Delete a document
    if chroma_manager.delete_documents(collection_name, ['doc2']):
        print("Document deleted successfully.")
