const { searchJournalEntries } = require('../utils/s3Config')

exports.queryToJournal = async (req, res) => {
    try {
        const { question, childId } = req.body;
        console.log(question, childId);
        if (!question || !childId) {
            return res.status(400).json({
                success: false,
                error: "Question and childId are required"
            });
        }
        const result = await searchJournalEntries(question, childId);
        console.log(result);
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: result.message
            })
        }
        if (!result.found) {
            return res.status(404).json({
                success: false,
                error: result.message
            })
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}