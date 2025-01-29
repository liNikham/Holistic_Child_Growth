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

exports.generateMonthlySummary = async (reqBody) => {

    try {
        const { childId, month, year } = reqBody;

        if (!childId || !month || !year) {
            return { error: "Child ID, month, and year are required." };
        }
        const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1
        const addToS3 = currentMonth > parseInt(month) ? true : false;
        // Fetch activities from MongoDB
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(`${year}-${month}-31`);

        const child = await ChildProfile.findById(childId);
        if (!child) {
            return { error: "Child not found." };
        }

        const activities = child.activities.filter(activity =>
            new Date(activity.date) >= startDate && new Date(activity.date) <= endDate
        );
        if (activities.length === 0) {
            return { error: "No activities found for this period." };
        }

        const prompt = `Generate a detailed monthly summary for a child based on the following activities for ${month} ${year}:
        ${JSON.stringify(activities)}
        
        The summary should include:
        - Progress and achievements
        - Strengths observed
        - Areas for improvement
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

        return { summary: generatedText.trim(), addToS3 };
    } catch (error) {
        console.error("Error generating monthly summary:", error.response?.data || error.message);
        return { error: "Failed to generate monthly summary" };
    }
};



// Function to categorize activities using Gemini AI
exports.categorizeActivitiesUsingGemini = async (req, res) => {
    const { childId } = req.query; // Expect activities as an array of objects with description and duration

    if (!childId ) {
        return res.status(400).json({ error: "Child ID is required." });
    }

    try {
        // Fetch the child's profile
        const child = await ChildProfile.findById(childId);
        if (!child) {
            return res.status(404).json({ error: "Child not found." });
        }
        const activities = child.activities;

        // Categories object to categorize activities
        const categories = {
            physical: [],
            learning: [],
            social: [],
            creative: [],
            emotional: [],
            diet: [],
            health: [],
            chores: [],
            screenTime: [],
            dailyRoutine: []
        };

        // Function to categorize each activity using Gemini
        const categorizeActivityWithGemini = async (activityDesc) => {
            const prompt = `Categorize the following activity description into one of these categories: 'Physical', 'Learning', 'Social', 'Creative', 'Emotional', 'Diet', 'Health', 'Chores', 'Screen Time', 'Daily Routine'. Activity: "${activityDesc}"`;

            const config = {
                method: "post",
                url: `https://api.gemini.com/v1/models/generate`, // Example endpoint, replace with actual Gemini endpoint
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GEMINI_API_KEY}` // Assuming you use an API key
                },
                data: {
                    input: prompt
                }
            };

            try {
                const response = await axios(config);
                const category = response.data.category; // Assuming response contains category information
                return category;
            } catch (error) {
                console.error("Error categorizing activity with Gemini:", error);
                throw new Error("Failed to categorize activity");
            }
        };

        // Loop through each activity, categorize, and store in categories
        for (const activity of activities) {
            if (!activity.description || !activity.duration) {
                console.log("Activity missing description or duration:", activity);
                continue;
            }

            const category = await categorizeActivityWithGemini(activity.description);

            // Push the activity into the appropriate category with the duration included
            const activityWithDuration = { 
                description: activity.description, 
                duration: activity.duration
            };

            switch (category) {
                case 'Physical':
                    categories.physical.push(activityWithDuration);
                    break;
                case 'Learning':
                    categories.learning.push(activityWithDuration);
                    break;
                case 'Social':
                    categories.social.push(activityWithDuration);
                    break;
                case 'Creative':
                    categories.creative.push(activityWithDuration);
                    break;
                case 'Emotional':
                    categories.emotional.push(activityWithDuration);
                    break;
                case 'Diet':
                    categories.diet.push(activityWithDuration);
                    break;
                case 'Health':
                    categories.health.push(activityWithDuration);
                    break;
                case 'Chores':
                    categories.chores.push(activityWithDuration);
                    break;
                case 'Screen Time':
                    categories.screenTime.push(activityWithDuration);
                    break;
                case 'Daily Routine':
                    categories.dailyRoutine.push(activityWithDuration);
                    break;
                default:
                    console.log(`Uncategorized activity: ${activity.description}`);
            }
        }

        // Return the categorized activities with duration
        return res.status(200).json({ categories });

    } catch (error) {
        console.error("Error categorizing activities:", error.message);
        return res.status(500).json({ error: "Failed to categorize activities" });
    }
};


exports.categorizeActivity = async (req, res) => {
    const { description } = req.body; // Activity description sent in request body
    console.log(description, "here");

    if (!description) {
        return res.status(400).json({ error: "Activity description is required." });
    }

    try {
        const prompt = `Categorize the following activity description into one of these categories: 'Physical', 'Cognitive', 'Social', 'Creative'. Activity: "${description}"`;

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

        // Call Gemini API to categorize the activity
        const response = await retryRequest(config, 5, 1000);
        const category = response.data.candidates[0].content.parts[0].text.trim().toLowerCase();

        // Send the category back in the response
        return res.status(200).json({ category });

    } catch (error) {
        console.error("Error categorizing activity:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to categorize activity" });
    }
};



