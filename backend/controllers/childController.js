exports.predictMilestones = async (req, res) => {
    try {
        const { childId } = req.params;
        const child = await ChildProfile.findById(childId);
        
        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
            Based on these recent activities and the child's age (${child.age}):
            ${JSON.stringify(child.activities.slice(-20))}

            Generate 4 predicted upcoming developmental milestones in this JSON format:
            {
                "predictions": [
                    {
                        "title": "Milestone name",
                        "description": "Brief description",
                        "timeframe": "Expected timeframe (e.g., '2-3 weeks')",
                        "confidence": confidence_percentage,
                        "recommendations": ["activity1", "activity2", "activity3"]
                    }
                ]
            }

            Consider:
            1. Current activity patterns
            2. Age-appropriate milestones
            3. Development rate in different areas
            4. Recent achievements

            Make predictions realistic and actionable.
            Response must be valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const predictions = JSON.parse(result.response.text());

        res.status(200).json(predictions);
    } catch (error) {
        console.error('Error predicting milestones:', error);
        res.status(500).json({ 
            message: 'Error predicting milestones',
            error: error.message 
        });
    }
}; 