const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
require('dotenv').config();

const AWSClient = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function uploadSummaryToS3(summary, childId, month, year) {
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = `summaries/${childId}.json`;

    try {
        // Fetch existing summaries
        let existingSummaries = [];
        try {
            const getObjectParams = {
                Bucket: bucketName,
                Key: key,
            };
            const data = await AWSClient.send(new GetObjectCommand(getObjectParams));
            const bodyContents = await streamToString(data.Body);
            existingSummaries = JSON.parse(bodyContents);
        } catch (error) {
            if (error.name !== 'NoSuchKey') {
                throw error;
            }
        }

        // Append new summary
        const newSummary = {
            month,
            year,
            summary,
        };
        existingSummaries.push(newSummary);

        // Upload updated summaries
        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: JSON.stringify(existingSummaries, null, 2),
            ContentType: 'application/json',
        };
        await AWSClient.send(new PutObjectCommand(uploadParams));
        const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
        return { success: true, url: s3Url };
    } catch (error) {
        console.error("Error uploading summary to S3:", error);
        return { success: false, error };
    }
}

// Helper function to convert stream to string
function streamToString(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}

async function searchJournalEntries(question, childId) {
    console.log(question, childId);
    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = `summaries/${childId}.json`;

    try {
        // Fetch journal entries
        const getObjectParams = {
            Bucket: bucketName,
            Key: key,
        };
        const data = await AWSClient.send(new GetObjectCommand(getObjectParams));
        // if (!data.body) {
        //     return { success: true, found: false, message: "No journal entries found" };
        // }
        const bodyContents = await streamToString(data.Body);
        const journalEntries = JSON.parse(bodyContents);

        // Prepare TF-IDF search
        const tfidf = new TfIdf();

        // Add all journal entries to the corpus
        journalEntries.forEach((entry, index) => {
            tfidf.addDocument(entry.summary.toLowerCase());
            entry.index = index; // Add index for reference
        });

        // Process the question
        const processedQuestion = question.toLowerCase();

        // Calculate similarity scores
        const scores = [];
        tfidf.tfidfs(processedQuestion, function (i, measure) {
            scores.push({
                index: i,
                score: measure,
                entry: journalEntries[i]
            });
        });

        // Sort by relevance and get top 3 matches
        const topMatches = scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .filter(match => match.score > 0);

        if (topMatches.length === 0) {
            return {
                success: true,
                found: false,
                message: "No relevant information found in the journal.",
                answers: []
            };
        }

        // Format the responses
        const answers = topMatches.map(match => ({
            text: match.entry.summary,
            date: `${match.entry.month}/${match.entry.year}`,
            relevanceScore: match.score.toFixed(2)
        }));

        return {
            success: true,
            found: true,
            answers,
            link: process.env.AWS_S3_ENDPOINT + '/' + key
        };
    } catch (error) {
        console.error("Error searching journal entries:", error);
        return {
            success: false,
            message: error.message
        };
    }
}
module.exports = { uploadSummaryToS3, searchJournalEntries };