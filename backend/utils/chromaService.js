const axios = require('axios');

const CHROMA_SERVICE_URL = 'http://localhost:8000';


exports.addDocuments = async function addDocuments(collectionName, documents) {
    try {
        // Format documents to match ChromaDB expectations
        const formattedDocuments = documents.map(doc => ({
            month: doc.month || '',
            year: doc.year || '',
            summary: doc.summary || ''
        }));

        const response = await axios.post(`${CHROMA_SERVICE_URL}/add_documents`, {
            collection: collectionName,
            documents: formattedDocuments
        });
        return response.data;
    } catch (error) {
        console.error('Error adding documents:', error.response?.data || error);
        throw error;
    }
};

exports.query = async function query(collectionName, queryText) {
    try {
        const response = await axios.post(`${CHROMA_SERVICE_URL}/query`, {
            collection: collectionName,
            query: queryText
        });
        
        if (!response.data.found) {
            return { 
                found: false, 
                message: response.data.message 
            };
        }
        
        // Return the single most relevant result
        return {
            found: true,
            document: response.data.results.document,
            metadata: response.data.results.metadata,
            distance: response.data.results.distance
        };
    } catch (error) {
        console.error('Error querying collection:', error.response?.data || error);
        throw error;
    }
};


 