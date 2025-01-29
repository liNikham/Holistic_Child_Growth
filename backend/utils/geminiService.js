const dotenv = require("dotenv");
const axios = require("axios");
const ChildProfile = require("../models/childProfile.model");
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = "gemini-1.5-flash";

// Retry logic with exponential backoff
const retryRequest = async (config, retries = 3, delay = 1000) => {
    let attempt = 0;

    while (attempt < retries) {
        try {
            return await axios(config);
        } catch (error) {
            attempt++;
            if (attempt >= retries || !isRetryableError(error)) {
                throw error;
            }

            console.log(
                `Retrying request... Attempt ${attempt}/${retries} in ${delay * Math.pow(2, attempt - 1)
                } ms`
            );

            await new Promise((resolve) =>
                setTimeout(resolve, delay * Math.pow(2, attempt - 1))
            );
        }
    }
};

// Helper function to determine if an error is retryable
const isRetryableError = (error) => {
    return error.response && error.response.status === 429;
};

exports.generateAnalysis = async (req, res) => {
    const activities = req.body.activities;

    try {
        const prompt = `Analyze the following activities of a child and provide insights on performance, strengths, and areas of improvement:
    ${JSON.stringify(activities)}
    Please include recommendations for the child.`;

        const config = {
            method: "post",
            url: `${BASE_URL}/models/${MODEL}:generateContent?key=${API_KEY}`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            }
        };

        // Use the retryRequest function to handle retries
        const response = await retryRequest(config, 5, 1000);

        // Extract the generated text from Gemini's response
        const generatedText = response.data.candidates[0].content.parts[0].text;

        return res.status(200).json({ analysis: generatedText.trim() });
    } catch (error) {
        console.error("Error generating analysis:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to fetch analysis" });
    }
}; 

exports.generateMonthlySummary = async (req, res) => {
    const { childId, month, year } = req.query;
    
    if (!childId || !month || !year) {
        return res.status(400).json({ error: "Child ID, month, and year are required." });
    }

    try {
        // Fetch activities from MongoDB
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(`${year}-${month}-31`);
        
        const child = await ChildProfile.findById(childId);
        if (!child) {
            return res.status(404).json({ error: "Child not found." });
        }

        const activities = child.activities.filter(activity => 
            new Date(activity.date) >= startDate && new Date(activity.date) <= endDate
        );

        if (activities.length === 0) {
            return res.status(404).json({ error: "No activities found for this period." });
        }

        const prompt = `Generate a detailed monthly summary for a child based on the following activities for ${month} ${year}:
        ${JSON.stringify(activities)}
        
        The summary should include:
        - Progress and achievements
        - Strengths observed
        - Areas for improvement
        - Recommendations for further development
        - Overall development trends`;

        const config = {
            method: "post",
            url: `${BASE_URL}/models/${MODEL}:generateContent?key=${API_KEY}`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            }
        };

        const response = await retryRequest(config, 5, 1000);
        const generatedText = response.data.candidates[0].content.parts[0].text;

        return res.status(200).json({ summary: generatedText.trim() });
    } catch (error) {
        console.error("Error generating monthly summary:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to generate monthly summary" });
    }
};

