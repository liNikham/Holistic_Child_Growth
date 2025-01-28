const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const API_KEY = process.env.API_KEY; // Ensure your API key is correctly set in .env
const BASE_URL = "https://api.openai.com/v1";

// Retry logic with exponential backoff
const retryRequest = async (config, retries = 3, delay = 1000) => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      // Attempt to make the API request
      return await axios(config);
    } catch (error) {
      attempt++;
      if (attempt >= retries || !isRetryableError(error)) {
        // If retries exhausted or error is not retryable, throw the error
        throw error;
      }

      console.log(
        `Retrying request... Attempt ${attempt}/${retries} in ${
          delay * Math.pow(2, attempt - 1)
        } ms`
      );

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, attempt - 1))
      );
    }
  }
};

// Helper function to determine if an error is retryable
const isRetryableError = (error) => {
  return error.response && error.response.status === 429; // Retry on 'Too Many Requests'
};

exports.generateAnalysis = async (req, res) => {
  const activities = req.body.activities;
  console.log(process.env.API_KEY);

  try {
    // Construct the messages for the chat-based API
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Analyze the following activities of a child and provide insights on performance, strengths, and areas of improvement:
        ${JSON.stringify(activities)}
        Please include recommendations for the child.`,
      },
    ];

    const config = {
      method: "post",
      url: `${BASE_URL}/chat/completions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 100, // Adjust as needed
        temperature: 0.7, // Controls creativity
      },
    };

    // Use the retryRequest function to handle retries
    const response = await retryRequest(config, 5, 1000);

    // Return the response text
    return res
      .status(200)
      .json({ analysis: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error generating analysis:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch analysis" });
  }
};
