import {  S3Client } from "@aws-sdk/client-s3";

const AWSClient = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function uploadSummaryToS3(summary, childId, month, year) {
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

        return { success: true };
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