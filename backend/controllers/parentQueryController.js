const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askQuestion = async (req, res) => {
    try {
        const { childId, query, language, childInfo } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Construct prompt with language specification
        const prompt = `
        As a child development expert, please answer this question about child development: "${query}"
        
        Child's Context:
        - Age: ${childInfo.age}
        - Recent Activities: ${childInfo.activities?.slice(-5).map(a => a.activity).join(', ')}
        - Development Stage: ${calculateDevelopmentStage(childInfo.dateOfBirth)}
        
        Please provide a clear, structured answer that:
        1. Is specific to this child's age and development stage
        2. References their recent activities when relevant
        3. Includes actionable recommendations
        4. Is formatted with clear sections using markdown
        
        Important: Provide the response in ${language} language.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        res.status(200).json({ answer });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({
            error: 'Failed to process query',
            details: error.message
        });
    }
};

function calculateDevelopmentStage(dateOfBirth) {
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age < 1) return 'Infant';
    if (age < 3) return 'Toddler';
    if (age < 5) return 'Preschooler';
    return 'School Age';
} 