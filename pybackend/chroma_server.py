import chromadb
from flask import Flask, request, jsonify

app = Flask(__name__)
chroma_client = chromadb.PersistentClient(path="./chroma_data")

@app.route('/', methods=['GET'])
def get_collections():
    return jsonify({"status": "Chroma server is running"})

@app.route('/create_collection', methods=['POST'])
def create_collection():

    collection_name = request.json['name']
    if not collection_name:
        return jsonify({"error": "Collection name is required"}), 400
    collection = chroma_client.create_collection(name=collection_name)
    return jsonify({"status": "Collection created"})



@app.route('/add_documents', methods=['POST'])
def add_documents():
    try:
        collection_name = request.json['collection']
        documents = request.json['documents']
        
        # print("Received documents:", documents)  # Debug log
        
        collection = chroma_client.get_or_create_collection(name=collection_name)
        
        # Format documents for ChromaDB
        docs = []
        ids = []
        metadatas = []
        
        for i, doc in enumerate(documents):
            # Extract the summary as the main document text
            doc_text = doc.get('summary', '')
            
            # Create metadata from month and year
            metadata = {
                'month': doc.get('month', ''),
                'year': doc.get('year', ''),
            }
            
            docs.append(doc_text)
            ids.append(f"doc_{doc.get('month')}_{doc.get('year')}_{i}")
            metadatas.append(metadata)
        
        # Add to collection
        collection.add(
            documents=docs,
            metadatas=metadatas,
            ids=ids
        )
        
        return jsonify({
            "status": "Documents added successfully",
            "count": len(docs)
        })
        
    except KeyError as e:
        print(f"KeyError: Missing key {str(e)} in document")
        return jsonify({
            "error": f"Invalid document format. Missing key: {str(e)}",
            "received": documents
        }), 400
    except Exception as e:
        print(f"Error adding documents: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/query', methods=['POST'])
def query_collection():
    print("Querying collection")
    print(request.json)
    collection_name = request.json['collection']
    query_text = request.json['query']
    
    if not collection_name:
        return jsonify({"error": "Collection name is required"}), 400
    if not query_text:
        return jsonify({"error": "Query text is required"}), 400
    
    try:
        collection = chroma_client.get_or_create_collection(name=collection_name)
        
        if collection.count() == 0:
            return jsonify({
                "found": False,
                "message": "Collection exists but has no documents",
                "results": None
            })

        results = collection.query(
            query_texts=[query_text],
            n_results=1  # Change to 1 to get only the most relevant result
        )

        if not results['documents'] or len(results['documents']) == 0:
            return jsonify({
                "found": False,
                "message": "No matching documents found",
                "results": None
            })

        # Return only the first (most relevant) result
        return jsonify({
            "found": True,
            "results": {
                "document": results['documents'][0][0],  # Get first document from first result
                "metadata": results['metadatas'][0][0],  # Get first metadata from first result
                "distance": results['distances'][0][0] if 'distances' in results else None
            }
        })
    except Exception as e:
        print(f"Error during query: {str(e)}")
        return jsonify({"error": str(e)}), 500





if __name__ == '__main__':
    app.run(port=8000) 