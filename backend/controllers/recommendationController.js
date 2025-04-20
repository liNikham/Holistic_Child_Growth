const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const ChildProfile = require('../models/childProfile.model');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const { retryRequest } = require('../utils/commonUtils');

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = "gemini-1.5-flash";

const AWSClient = new S3Client({
    region: process.env.AWS_REGION,

    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

function streamToString(stream) {
  return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

exports.getJournalEntriesByChildId = async (req, res) => {
  try {
    console.log("Fetching journal entries for childId:", req.params.childId);
    const { childId } = req.params;
    console.log("Fetching journal entries for childId:", childId);
    
    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = `summaries/${childId}.json`;
    const getObjectParams = {
      Bucket: bucketName,
      Key: key,
    };
    console.time('s3-fetch');
    const command = new GetObjectCommand(getObjectParams);
    
    // Send the command to S3
    const { Body, ContentType } = await AWSClient.send(command);
    console.timeEnd('s3-fetch');

    if (!Body) {
      return res.status(200).json({
        success: true,
        found: false,
        message: "No journal entries found"
      });
    }

    // Set the appropriate content type
    res.setHeader('Content-Type', ContentType || 'application/json');
    
    // Pipe the S3 stream directly to the response
    Body.pipe(res);
    
    // Handle any errors in the stream
    Body.on('error', (err) => {
      console.error('Error streaming from S3:', err);
      // If headers have not been sent yet
      if (!res.headersSent) {
        res.status(500).json({
          message: 'Error streaming journal entries',
          error: err.message
        });
      } else {
        // If headers already sent, just end the response
        res.end();
      }
    });

  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({
      message: 'Error fetching journal entries',
      error: error.message
    });
  }
}

exports.getRecommendations = async (req, res) => {
  try {
    const { childId } = req.params;
    const child = await ChildProfile.findById(childId);

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Get recent activities
    const recentActivities = child.activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // Analyze activities using Gemini AI
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Based on these recent activities:
      ${JSON.stringify(recentActivities)}
      
      Generate exactly 4 personalized activity recommendations in the following JSON format:
      {
        "recommendations": [
          {
            "title": "Activity Name",
            "description": "Brief description",
            "duration": 30 or necessary time in minutes,
            "category": "physical/cognitive/social/creative",
            "developmentalBenefits": ["benefit1", "benefit2"]
          }
        ]
      }
      
      Important: Respond ONLY with the JSON object, no additional text or formatting.
    `;

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

    const result = await retryRequest(config, 3, 1000); // Retry logic for API call
    const responseText = result.data.candidates[0].content.parts[0].text;
    if (!responseText) {
      throw new Error('No response from AI');
    }
    console.log('AI response:', result.data.candidates[0].content.parts[0].text); // Log the AI response for debugging

    let recommendations;
    try {
      // Extract JSON part strictly
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]).recommendations;
      } else {
        throw new Error('No valid JSON found');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Provide fallback recommendations
      recommendations = [
        {
          title: "Physical Exercise",
          description: "30 minutes of active play or structured exercise",
          duration: 30,
          category: "physical",
          developmentalBenefits: ["Motor skills", "Physical fitness"]
        },
        {
          title: "Reading Time",
          description: "Read age-appropriate books together",
          duration: 20,
          category: "cognitive",
          developmentalBenefits: ["Language development", "Cognitive growth"]
        },
        {
          title: "Creative Art",
          description: "Drawing or craft activity",
          duration: 25,
          category: "creative",
          developmentalBenefits: ["Fine motor skills", "Creative expression"]
        },
        {
          title: "Social Play",
          description: "Interactive play with siblings or friends",
          duration: 30,
          category: "social",
          developmentalBenefits: ["Social skills", "Emotional development"]
        }
      ];
    }

    // Calculate activity stats
    const activityStats = calculateActivityStats(recentActivities);

    // Generate insights
    const insightsPrompt = `
      Analyze these activities and provide a brief summary of developmental progress:
      ${JSON.stringify(recentActivities)}
      
      Keep the response under 200 words.
    `;

    // const insightsResult = await model.generateContent(insightsPrompt);
    // const insights = await insightsResult.response.text();

    res.status(200).json({
      recommendations,
      // insights,
      activityStats
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      message: 'Error generating recommendations',
      error: error.message
    });
  }
};

const calculateActivityStats = (activities) => {
  if (!activities || activities.length === 0) {
    return {
      totalActivities: 0,
      categoryBreakdown: {},
      averageDuration: 0
    };
  }

  return {
    totalActivities: activities.length,
    categoryBreakdown: activities.reduce((acc, act) => {
      acc[act.category] = (acc[act.category] || 0) + 1;
      return acc;
    }, {}),
    averageDuration: Math.round(
      activities.reduce((sum, act) => sum + (parseInt(act.duration) || 0), 0) / activities.length
    )
  };
};
