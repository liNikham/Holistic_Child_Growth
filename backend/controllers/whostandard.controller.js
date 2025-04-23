const { calculateAgeInDays,
    interpretWeightForAge,
    interpretWeightForHeight,
    interpretWeightForLength,
    zScoreToPercentileForWfa,
    zScoreToPercentileForWfh,
    calculateWfaZscore,
    calculateWfhZscore,
    findClosestAgeReferenceDataForWfa,
    findClosestAgeReferenceDataForWfh,
} = require('../utils/commonUtils');
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



exports.wfa = async (req, res) => {
    try {
        const { dob, weight, gender } = req.body;
        const currentDate = new Date();
        const birthDate = new Date(dob);

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
        console.log('Reference Data:', reference);
        // Calculate z-score
        const zScore = calculateWfaZscore(parseFloat(weight), parseFloat(reference.L), parseFloat(reference.M), parseFloat(reference.S));
        console.log('Z-Score:', zScore);
        // Calculate percentile
        const percentile = zScoreToPercentileForWfa(zScore);
        console.log('Percentile:', percentile);

        // Interpret results
        const interpretation = interpretWeightForAge(zScore, gender, ageInDays);

        // Return the assessment results
        return res.json({
            assessment: 'weight-for-age',
            input: {
                gender,
                weight,
                dob,
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
            }
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

exports.wfh = async (req, res) => {
    try {
        const { gender, weight, height, dob } = req.body;

        // Validate required inputs
        if (!gender || weight === undefined || height === undefined) {
            return res.status(400).json({
                error: 'Missing required parameters. Please provide gender, weight, and height.'
            });
        }

        const currentDate = new Date();
        const birthDate = new Date(dob);

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

        let wfl= false;
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


        let minHeight
        let maxHeight
        if (wfl) {
            minLength = Math.min(...dataset.map(item => item.Length));
            maxLength = Math.max(...dataset.map(item => item.Length));
        }
        else{
            minLength = Math.min(...dataset.map(item => item.Height));
            maxLength = Math.max(...dataset.map(item => item.Height));
        }


        if (height < minHeight || height > maxHeight) {
            return res.status(400).json({
                error: `Height must be between ${minHeight} and ${maxHeight} cm for this assessment.`
            });
        }

        const reference = findClosestAgeReferenceDataForWfh(dataset, parseFloat(height),wfl);
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
        if(!wfl){
            interpretation = interpretWeightForHeight(zScore, gender, height);
        }
        else{
            interpretation = interpretWeightForLength(zScore, gender, height)
        }

        // Return the assessment results
        return res.json({
            assessment: 'weight-for-height',
            input: {
                gender,
                weight,
                height
            },
            reference: {
                height: reference.Height,
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
        });


    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({
            error: 'Failed to process query',
            details: error.message
        });
    }
}

exports.lhfa = async (req, res) => {
    try {
        const { dob, height, gender } = req.body;

        // Validate required inputs
        if (!dob || !height || !gender) {
            return res.status(400).json({
                error: 'Missing required parameters. Please provide dob, height, and gender.'
            });
        }

        const currentDate = new Date();
        const birthDate = new Date(dob);
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
        const percentile = zScoreToPercentileForWfa(zScore);

        const assessmentType = isLength ? 'length-for-age' : 'height-for-age';

        return res.json({
            assessment: assessmentType,
            input: {
                gender,
                height,
                dob
            },
            reference: {
                day: reference.Day,
                median: reference.M,
                L: reference.L,
                S: reference.S
            },
            results: {
                zScore: parseFloat(zScore.toFixed(2)),
                percentile
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
        });

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
        const { dob, height, weight, gender } = req.body;
        const currentDate = new Date();
        const birthDate = new Date(dob);
        const ageInDays = calculateAgeInDays(birthDate, currentDate);
        const ageInYears = ageInDays / 365.25;

        if (ageInYears < 2 || ageInYears > 5) {
            return res.status(400).json({
                error: 'This assessment is designed for children between 2 and 5 years of age.'
            });
        }

        if (!['male', 'female'].includes(gender.toLowerCase())) {
            return res.status(400).json({
                error: 'Gender must be either "male" or "female".'
            });
        }

        if (typeof height !== 'number' || height <= 0 || typeof weight !== 'number' || weight <= 0) {
            return res.status(400).json({
                error: 'Weight and height must be positive numbers.'
            });
        }

        const bmi = weight / Math.pow(height / 100, 2); // height in cm to m
        const dataset = gender.toLowerCase() === 'male' ? bfaBoyDataset : bfaGirlDataset;
        const reference = findClosestAgeReferenceDataForWfa(dataset, ageInDays); // dataset has age in days
        const zScore = calculateWfaZscore(parseFloat(bmi), parseFloat(reference.L), parseFloat(reference.M), parseFloat(reference.S));
        const percentile = zScoreToPercentileForWfa(zScore);

        return res.json({
            assessment: 'bmi-for-age',
            input: { gender, height, weight, bmi: parseFloat(bmi.toFixed(2)), dob },
            reference: {
                day: reference.Day,
                median: reference.M,
                L: reference.L,
                S: reference.S
            },
            results: {
                zScore: parseFloat(zScore.toFixed(2)),
                percentile
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
        });

    } catch (error) {
        console.error('Error processing BFA:', error);
        res.status(500).json({
            error: 'Failed to process BFA query',
            details: error.message
        });
    }
};


