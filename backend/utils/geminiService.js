const dotenv = require("dotenv");
const axios = require("axios");
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