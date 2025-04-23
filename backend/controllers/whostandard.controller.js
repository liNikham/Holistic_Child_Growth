const Child = require('../models/childProfile.model');
const { calculateAgeInDays,
    interpretWeightForAge,
    interpretWeightForHeight,
    interpretWeightForLength,
    interpretLengthHeightForAge,
    zScoreToPercentileForWfa,
    zScoreToPercentileForWfh,
    calculateWfaZscore,
    calculateWfhZscore,
    findClosestAgeReferenceDataForWfa,
    findClosestAgeReferenceDataForWfh,
} = require('../utils/commonUtils');

// Import datasets
const wfaBoyDataset = require('../../dataset/downloads/wfa_boys_0-to-5-years_zscores.json');
const wfaGirlDataset = require('../../dataset/downloads/wfa_girls_0-to-5-years_zscores.json');
const wfhBoyDataset = require('../../dataset/downloads/wfh_boys_2-to-5-years_zscores.json')
const wfhGirlDataset = require('../../dataset/downloads/wfh_girls_2-to-5-years_zscores.json')
const wflBoyDataset = require('../../dataset/downloads/wfl_boys_0-to-2-years_zscores.json')
const wflGirlDataset = require('../../dataset/downloads/wfl_girls_0-to-2-years_zscores.json')
const lhfaBoyDataset = require('../../dataset/downloads/lhfa_boys_2-to-5-years_zscores.json')
const lhfaGirlDataset = require('../../dataset/downloads/lhfa_girls_2-to-5-years_zscores.json')
const lhflBoyDataset = require('../../dataset/downloads/lhfa_boys_0-to-2-years_zscores.json')
const lhflGirlDataset = require('../../dataset/downloads/lhfa_girls_0-to-2-years_zscores.json')
const bfaBoyDataset = require('../../dataset/downloads/bmi_boys_2-to-5-years_zscores.json')
const bfaGirlDataset = require('../../dataset/downloads/bmi_girls_2-to-5-years_zscores.json')
const bflBoyDataset = require('../../dataset/downloads/bmi_boys_0-to-2-years_zcores.json')
const bflGirlDataset = require('../../dataset/downloads/bmi_girls_0-to-2-years_zscores.json');



exports.wfa = async (req, res) => {
    try {
        const { childId } = req.params;

        console.log("childId", childId);

        // Fetch child data from DB using the childId
        const child = await Child.findById(childId);

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const { dateOfBirth, weight, gender, height } = child;
        console.log("child", child);
        console.log("dateOfBirth", dateOfBirth);

        console.log("weight", weight);
        console.log("gender", gender);
        console.log("height", height);
        const currentDate = new Date();
        const birthDate = new Date(dateOfBirth);

        // Calculate age in days
        const ageInDays = calculateAgeInDays(birthDate, currentDate);
        if (!['male', 'female'].includes(gender.toLowerCase())) {
            return res.status(400).json({
                error: 'Gender must be either "male" or "female".'
            });
        }

        if (typeof weight !== 'number' || weight <= 0) {
            return res.status(400).json({
                error: 'Weight must be a positive number.'
            });
        }

        if (ageInDays > 1827) {
            return res.status(400).json({
                error: 'This assessment is designed for children up to 5 years of age.'
            });
        }

        const dataset = gender.toLowerCase() === 'male' ? wfaBoyDataset : wfaGirlDataset;
        // Find the closest reference data
        const reference = findClosestAgeReferenceDataForWfa(dataset, ageInDays);
        
        // Calculate z-score
        const zScore = calculateWfaZscore(parseFloat(weight), parseFloat(reference.L), parseFloat(reference.M), parseFloat(reference.S));
        
        // Calculate percentile
        const percentile = zScoreToPercentileForWfa(zScore);

        // Interpret results
        const interpretation = interpretWeightForAge(zScore, gender, ageInDays);

        // Generate historical data for time-series chart
        const historicalData = generateHistoricalWeightData(birthDate, currentDate, weight, gender.toLowerCase());

        const growthMeasurement = new GrowthMeasurement({
            childId,
            date: currentDate,
            measurementType: 'weight-for-age',
            weight: parseFloat(weight),
            zScore: parseFloat(zScore.toFixed(2)),
            percentile,
            status: interpretation.status,
            severity: interpretation.severity,
            recommendation: interpretation.recommendation,
            details: interpretation.details,
            referenceRanges: {
                SD4neg: reference.SD4neg,
                SD3neg: reference.SD3neg,
                SD2neg: reference.SD2neg,
                SD1neg: reference.SD1neg,
                median: reference.SD0,
                SD1: reference.SD1,
                SD2: reference.SD2,
                SD3: reference.SD3,
                SD4: reference.SD4
            }

        });

        await growthMeasurement.save();

        // Return the assessment results
        return res.json({
            assessment: 'weight-for-age',
            input: {
                gender,
                weight,
                dateOfBirth,
            },
            reference: {
                day: reference.Day,
                median: reference.M,
                L: reference.L,
                S: reference.S
            },
            results: {
                zScore: parseFloat(zScore.toFixed(2)),
                percentile,
                status: interpretation.status,
                severity: interpretation.severity,
                recommendation: interpretation.recommendation,
                details: interpretation.details
            },
            referenceRanges: {
                SD4neg: reference.SD4neg,
                SD3neg: reference.SD3neg,
                SD2neg: reference.SD2neg,
                SD1neg: reference.SD1neg,
                median: reference.SD0,
                SD1: reference.SD1,
                SD2: reference.SD2,
                SD3: reference.SD3,
                SD4: reference.SD4
            },
            historicalData
        });
        // Continue processing with the calculated age in days

    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({
            error: 'Failed to process query',
            details: error.message
        });
    }
}

// Helper function to generate simulated historical weight data
function generateHistoricalWeightData(birthDate, currentDate, currentWeight, gender) {
    const now = new Date(currentDate);
    const records = [];

    // Calculate age in months currently
    const ageInMonthsNow = calculateAgeInDays(birthDate, now) / 30.4375;

    // Generate data points every month from birth until now
    for (let months = 0; months <= ageInMonthsNow; months += 1) {
        // Skip too frequent records for older children
        if (ageInMonthsNow > 24 && months % 3 !== 0 && months !== ageInMonthsNow) {
            continue;
        }

        const recordDate = new Date(birthDate);
        recordDate.setMonth(birthDate.getMonth() + months);

        // Don't include future dates
        if (recordDate > now) continue;

        const ageInDays = calculateAgeInDays(birthDate, recordDate);

        // Generate realistic weight based on age - simulated growth curve
        // Infants typically triple birth weight by 12 months
        // Using WHO growth charts as a rough reference
        let expectedWeight;

        if (ageInDays < 365) {
            // For first year, weight gain is more rapid
            const birthWeight = 3.5; // Assume average birth weight in kg
            expectedWeight = birthWeight + (currentWeight - birthWeight) * (months / ageInMonthsNow) * 1.5;
        } else {
            // After first year, slower but steady growth
            expectedWeight = currentWeight * (ageInDays / calculateAgeInDays(birthDate, now)) * 0.9;
        }

        // Add random variation (±5%)
        const randomVariation = (Math.random() - 0.5) * 0.1;
        const historicalWeight = Math.max(2.5, expectedWeight * (1 + randomVariation));

        // Calculate z-score for this historical point
        const dataset = gender === 'male' ? wfaBoyDataset : wfaGirlDataset;
        let reference;
        try {
            reference = findClosestAgeReferenceDataForWfa(dataset, ageInDays);
            const zScore = calculateWfaZscore(parseFloat(historicalWeight), parseFloat(reference.L), parseFloat(reference.M), parseFloat(reference.S));

            records.push({
                date: recordDate.toISOString(),
                weight: parseFloat(historicalWeight.toFixed(2)),
                zScore: parseFloat(zScore.toFixed(2)),
                ageInMonths: Math.floor(ageInDays / 30.4375)
            });
        } catch (error) {
            // Skip this record if the age is outside the reference range
            continue;
        }
    }

    // Sort by date ascending
    return records.sort((a, b) => new Date(a.date) - new Date(b.date));
}

exports.wfh = async (req, res) => {
    try {
        const { childId } = req.params;

        // Fetch child data from DB using the childId
        const child = await Child.findById(childId);

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const { dateOfBirth, weight, gender, height } = child;

        // Validate required inputs
        if (!gender || weight === undefined || height === undefined) {
            return res.status(400).json({
                error: 'Missing required parameters. Please provide gender, weight, and height.'
            });
        }

        const currentDate = new Date();
        const birthDate = new Date(dateOfBirth);

        const ageInDays = calculateAgeInDays(birthDate, currentDate);
        const ageInYears = ageInDays / 365.25; // Convert days to years

        if (ageInYears > 5) {
            return res.status(400).json({
                error: 'This assessment is designed for children between 0 and 5 years of age.'
            });
        }

        if (!['male', 'female'].includes(gender.toLowerCase())) {
            return res.status(400).json({
                error: 'Gender must be either "male" or "female".'
            });
        }

        if (typeof weight !== 'number' || weight <= 0) {
            return res.status(400).json({
                error: 'Weight must be a positive number.'
            });
        }

        let wfl = false;
        let dataset
        if (ageInYears < 2 && gender.toLowerCase() === 'male') {
            dataset = wflBoyDataset;
            wfl = true;
        }
        else if (ageInYears < 2 && gender.toLowerCase() === 'female') {
            dataset = wflGirlDataset;
            wfl = true;
        }
        else if (ageInYears >= 2 && ageInYears <= 5 && gender.toLowerCase() === 'female') {
            dataset = wfhGirlDataset;
        }
        else if (ageInYears >= 2 && ageInYears <= 5 && gender.toLowerCase() === 'male') {
            dataset = wfhBoyDataset;
        }

        let minHeight, maxHeight;
        if (wfl) {
            minLength = Math.min(...dataset.map(item => item.Length));
            maxLength = Math.max(...dataset.map(item => item.Length));
        }
        else {
            minLength = Math.min(...dataset.map(item => item.Height));
            maxLength = Math.max(...dataset.map(item => item.Height));
        }

        if (height < minHeight || height > maxHeight) {
            return res.status(400).json({
                error: `Height must be between ${minHeight} and ${maxHeight} cm for this assessment.`
            });
        }

        const reference = findClosestAgeReferenceDataForWfh(dataset, parseFloat(height), wfl);
        let zScore;
        try {
            zScore = calculateWfhZscore(parseFloat(weight), parseFloat(reference.L), parseFloat(reference.M), parseFloat(reference.S));

            // Constrain extreme values for practical use
            if (zScore > 8) zScore = 8;
            if (zScore < -8) zScore = -8;

        } catch (error) {
            console.error('Z-score calculation error:', error);
            return res.status(500).json({
                error: 'Error calculating z-score. Please check input values.'
            });
        }

        // Calculate percentile
        const percentile = zScoreToPercentileForWfh(zScore);

        // Interpret results
        let interpretation
        if (!wfl) {
            interpretation = interpretWeightForHeight(zScore, gender, height);
        }
        else {
            interpretation = interpretWeightForLength(zScore, gender, height)
        }

        // Prepare result object
        const result = {
            assessment: wfl ? 'weight-for-length' : 'weight-for-height',
            input: {
                gender,
                weight,
                height
            },
            reference: {
                height: reference.Height || reference.Length,
                median: reference.M,
                L: reference.L,
                S: reference.S
            },
            results: {
                zScore: parseFloat(zScore.toFixed(2)),
                percentile,
                status: interpretation.status,
                severity: interpretation.severity,
                nutritionalStatus: interpretation.nutritionalStatus,
                recommendation: interpretation.recommendation,
                details: interpretation.details
            },
            referenceRanges: {
                SD3neg: reference.SD3neg,
                SD2neg: reference.SD2neg,
                SD1neg: reference.SD1neg,
                median: reference.SD0,
                SD1: reference.SD1,
                SD2: reference.SD2,
                SD3: reference.SD3
            }
        };

        // Store measurement in database
        const growthMeasurement = new GrowthMeasurement({
            childId,
            date: currentDate,
            measurementType: wfl ? 'weight-for-length' : 'weight-for-height',
            weight: parseFloat(weight),
            height: parseFloat(height),
            zScore: parseFloat(zScore.toFixed(2)),
            percentile,
            status: interpretation.status,
            severity: interpretation.severity,
            nutritionalStatus: interpretation.nutritionalStatus,
            recommendation: interpretation.recommendation,
            details: interpretation.details,
            referenceRanges: {
                SD3neg: reference.SD3neg,
                SD2neg: reference.SD2neg,
                SD1neg: reference.SD1neg,
                median: reference.SD0,
                SD1: reference.SD1,
                SD2: reference.SD2,
                SD3: reference.SD3
            }
        });

        await growthMeasurement.save();

        // Return the assessment results
        return res.json(result);

    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({
            error: 'Failed to process query',
            details: error.message
        });
    }
};

exports.lhfa = async (req, res) => {
    try {
        const { childId } = req.params;

        // Fetch child data from DB using the childId
        const child = await Child.findById(childId);

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const { dateOfBirth, gender, height } = child;

        // Validate required inputs
        if (!dateOfBirth || !height || !gender) {
            return res.status(400).json({
                error: 'Missing required parameters. Please provide dateOfBirth, height, and gender.'
            });
        }

        const currentDate = new Date();
        const birthDate = new Date(dateOfBirth);
        const ageInDays = calculateAgeInDays(birthDate, currentDate);
        const ageInYears = ageInDays / 365.25;

        if (ageInYears > 5) {
            return res.status(400).json({
                error: 'This assessment is designed for children between 0 and 5 years of age.'
            });
        }

        if (!['male', 'female'].includes(gender.toLowerCase())) {
            return res.status(400).json({
                error: 'Gender must be either "male" or "female".'
            });
        }

        if (typeof height !== 'number' || height <= 0) {
            return res.status(400).json({
                error: 'Height must be a positive number.'
            });
        }

        let isLength = false;
        let dataset;

        if (ageInYears < 2) {
            // Use Length-for-Age datasets
            isLength = true;
            dataset = gender.toLowerCase() === 'male' ? lhflBoyDataset : lhflGirlDataset;
        } else {
            // Use Height-for-Age datasets
            dataset = gender.toLowerCase() === 'male' ? lhfaBoyDataset : lhfaGirlDataset;
        }

        // Find the closest height/length in the dataset
        const reference = findClosestAgeReferenceDataForWfa(dataset, ageInDays); // Reusing function by age

        const zScore = calculateWfaZscore(parseFloat(height), parseFloat(reference.L), parseFloat(reference.M), parseFloat(reference.S));
        const percentile = zScoreToPercentileForWfh(zScore);

        const interpretation = interpretLengthHeightForAge(zScore, gender, ageInDays);

        const assessmentType = isLength ? 'length-for-age' : 'height-for-age';

        const result = {
            assessment: assessmentType,
            input: {
                gender,
                height,
                dateOfBirth
            },
            reference: {
                day: reference.Day,
                month: reference.Month,
                median: reference.M,
                L: reference.L,
                S: reference.S
            },
            results: {
                zScore: parseFloat(zScore.toFixed(2)),
                percentile,
                status: interpretation.status,
                severity: interpretation.severity,
                recommendation: interpretation.recommendation,
                details: interpretation.details
            },
            referenceRanges: {
                SD3neg: reference.SD3neg,
                SD2neg: reference.SD2neg,
                SD1neg: reference.SD1neg,
                median: reference.SD0 || reference.M,
                SD1: reference.SD1,
                SD2: reference.SD2,
                SD3: reference.SD3
            }
        };

        // Store measurement in database
        const growthMeasurement = new GrowthMeasurement({
            childId,
            date: currentDate,
            measurementType: assessmentType,
            height: parseFloat(height),
            zScore: parseFloat(zScore.toFixed(2)),
            percentile,
            status: interpretation.status,
            severity: interpretation.severity,
            recommendation: interpretation.recommendation,
            details: interpretation.details,
            referenceRanges: {
                SD3neg: reference.SD3neg,
                SD2neg: reference.SD2neg,
                SD1neg: reference.SD1neg,
                median: reference.SD0 || reference.M,
                SD1: reference.SD1,
                SD2: reference.SD2,
                SD3: reference.SD3
            }
        });

        await growthMeasurement.save();

        return res.json(result);

    } catch (error) {
        console.error('Error processing LHFA:', error);
        res.status(500).json({
            error: 'Failed to process LHFA query',
            details: error.message
        });
    }
};


exports.bfa = async (req, res) => {
    try {
        const { childId } = req.params;
        const child = await Child.findById(childId);

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const { dateOfBirth, weight, gender, height } = child;
        const currentDate = new Date();
        const birthDate = new Date(dateOfBirth);
        const ageInDays = calculateAgeInDays(birthDate, currentDate);
        const ageInYears = ageInDays / 365.25;

        if (!['male', 'female'].includes(gender.toLowerCase())) {
            return res.status(400).json({ error: 'Gender must be either "male" or "female".' });
        }

        if (typeof height !== 'number' || height <= 0 || typeof weight !== 'number' || weight <= 0) {
            return res.status(400).json({ error: 'Weight and height must be positive numbers.' });
        }

        const bmi = weight / Math.pow(height / 100, 2); // Convert height from cm to meters
        let dataset, reference;

        if (ageInYears < 2) {
            dataset = gender.toLowerCase() === 'male' ? bflBoyDataset : bflGirlDataset;
        } else if (ageInYears >= 2 && ageInYears <= 5) {
            dataset = gender.toLowerCase() === 'male' ? bfaBoyDataset : bfaGirlDataset;
        } else {
            return res.status(400).json({
                error: 'This assessment is only designed for children up to 5 years of age.'
            });
        }

        reference = findClosestAgeReferenceDataForWfa(dataset, ageInDays);
        const zScore = calculateWfaZscore(parseFloat(bmi), parseFloat(reference.L), parseFloat(reference.M), parseFloat(reference.S));
        const percentile = zScoreToPercentileForWfa(zScore);

        // Interpretation logic
        let status, severity, nutritionalStatus, recommendation, details;
        if (zScore < -3) {
            status = 'Severely Underweight';
            severity = 'Severe';
            nutritionalStatus = 'Severe Acute Malnutrition';
            recommendation = 'Urgent medical evaluation needed. Consider nutritional intervention and medical assessment.';
            details = 'BMI is significantly below the expected range for age.';
        } else if (zScore >= -3 && zScore < -2) {
            status = 'Underweight';
            severity = 'Moderate';
            nutritionalStatus = 'Moderate Acute Malnutrition';
            recommendation = 'Nutritional assessment and intervention recommended.';
            details = 'BMI is below the expected range for age.';
        } else if (zScore >= -2 && zScore < -1) {
            status = 'Risk of Underweight';
            severity = 'Mild';
            nutritionalStatus = 'At Risk';
            recommendation = 'Monitor nutrition and growth.';
            details = 'BMI is slightly below the expected range.';
        } else if (zScore >= -1 && zScore <= 1) {
            status = 'Normal Weight';
            severity = 'None';
            nutritionalStatus = 'Normal';
            recommendation = 'Continue healthy diet and physical activity.';
            details = 'BMI is within the normal range.';
        } else if (zScore > 1 && zScore <= 2) {
            status = 'Risk of Overweight';
            severity = 'Mild';
            nutritionalStatus = 'At Risk';
            recommendation = 'Monitor diet and encourage physical activity.';
            details = 'BMI is slightly above the expected range.';
        } else if (zScore > 2 && zScore <= 3) {
            status = 'Overweight';
            severity = 'Moderate';
            nutritionalStatus = 'Overweight';
            recommendation = 'Consult with a healthcare provider.';
            details = 'BMI is above the expected range.';
        } else {
            status = 'Obesity';
            severity = 'Severe';
            nutritionalStatus = 'Obesity';
            recommendation = 'Medical evaluation and nutritional counseling recommended.';
            details = 'BMI is significantly above the expected range.';
        }

        const historicalData = generateHistoricalBmiData(birthDate, currentDate, bmi, zScore, gender.toLowerCase());

        const growthMeasurement = new GrowthMeasurement({
            childId,
            date: currentDate,
            measurementType: 'bmi-for-age',
            weight: parseFloat(weight),
            height: parseFloat(height),
            bmi: parseFloat(bmi.toFixed(2)),
            zScore: parseFloat(zScore.toFixed(2)),
            percentile,
            referenceRanges: {
                SD3neg: reference.SD3neg,
                SD2neg: reference.SD2neg,
                SD1neg: reference.SD1neg,
                median: reference.SD0,
                SD1: reference.SD1,
                SD2: reference.SD2,
                SD3: reference.SD3
            }
        });

        await growthMeasurement.save();

        return res.json({
            assessment: 'bmi-for-age',
            input: { gender, height, weight, bmi: parseFloat(bmi.toFixed(2)), dateOfBirth },
            reference: {
                day: reference.Day,
                median: reference.M,
                L: reference.L,
                S: reference.S
            },
            results: {
                zScore: parseFloat(zScore.toFixed(2)),
                percentile,
                status,
                severity,
                nutritionalStatus,
                recommendation,
                details
            },
            referenceRanges: {
                SD3neg: reference.SD3neg,
                SD2neg: reference.SD2neg,
                SD1neg: reference.SD1neg,
                median: reference.SD0,
                SD1: reference.SD1,
                SD2: reference.SD2,
                SD3: reference.SD3
            },
            historicalData
        });

    } catch (error) {
        console.error('Error processing BFA:', error);
        res.status(500).json({
            error: 'Failed to process BFA query',
            details: error.message
        });
    }
};


// Helper function to generate simulated historical BMI data
function generateHistoricalBmiData(birthDate, currentDate, currentBmi, currentZScore, gender) {
    const now = new Date(currentDate);
    const records = [];

    // Get a 6-month interval between each data point, up to 24 months in the past
    for (let months = 0; months <= 24; months += 3) {
        const recordDate = new Date(now);
        recordDate.setMonth(now.getMonth() - months);

        // Don't include records from before the child was born
        if (recordDate < birthDate) continue;

        const ageInDays = calculateAgeInDays(birthDate, recordDate);

        // Only generate records if the child was at least 2 years old at that point
        if (ageInDays < 2 * 365.25) continue;

        // Create slightly random but trending data
        // For demonstration, we'll make the BMI trend slightly upward or downward
        const trend = (months / 24) * (Math.random() > 0.5 ? -1 : 1) * 2;
        const randomVariation = (Math.random() - 0.5) * 0.5;
        const historicalBmi = Math.max(13, currentBmi + trend + randomVariation);

        // Calculate z-score for this historical point
        const dataset = gender === 'male' ? bfaBoyDataset : bfaGirlDataset;
        const reference = findClosestAgeReferenceDataForWfa(dataset, ageInDays);
        const zScore = calculateWfaZscore(parseFloat(historicalBmi), parseFloat(reference.L), parseFloat(reference.M), parseFloat(reference.S));

        records.push({
            date: recordDate.toISOString(),
            bmi: parseFloat(historicalBmi.toFixed(2)),
            zScore: parseFloat(zScore.toFixed(2)),
            ageInMonths: Math.floor(ageInDays / 30.4375)
        });
    }

    // Sort by date ascending
    return records.sort((a, b) => new Date(a.date) - new Date(b.date));
}


