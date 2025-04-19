const axios = require("axios");


const isRetryableError = (error) => {
    return error.response && error.response.status === 429;
};

exports.retryRequest = async (config, retries = 3, delay = 1000) => {
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

exports.calculateAgeInDays = (birthDate, currentDate) => {
    // Get time difference in milliseconds
    const timeDiff = currentDate.getTime() - birthDate.getTime();

    // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
    const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
    console.log('Age in Days:', days);
    return days;
}

exports.findClosestAgeReferenceDataForWfa = (data, ageInDays) => {
    // Sort by day
    console.log('Data:', data[0].Month);
    const ageInMonths = ageInDays / 30.4375;
    console.log('Age in Months:', ageInMonths, ageInDays);
    const sortedData = data.find((entry) => {
        if (entry.Month === Math.floor(ageInMonths)) {
            console.log('Entry:', entry);
            return entry;
        }
    });
    console.log('Sorted Data:', sortedData);
    return sortedData;
}

exports.findClosestAgeReferenceDataForWfh = (data, height, wfl) => {
    if (wfl) {
        const sortedData = data.sort((a, b) =>
            Math.abs(a.Length - height) - Math.abs(b.Length - height)
        );

        // Return the closest match
        return sortedData[0];
    } else {

        const sortedData = data.sort((a, b) =>
            Math.abs(a.Height - height) - Math.abs(b.Height - height)
        );

        // Return the closest match
        return sortedData[0];
    }
}

exports.calculateWfaZscore = (measurement, L, M, S) => {
    console.log('Measurement:', measurement, 'L:', L, 'M:', M, 'S:', S);
    if (L !== 0) {
        return (Math.pow(measurement / M, L) - 1) / (L * S);
    } else {
        return Math.log(measurement / M) / S;
    }
}

exports.calculateWfhZscore = (measurement, L, M, S) => {
    if (S === 0) {
        throw new Error("S parameter cannot be zero");
    }

    if (measurement <= 0 || M <= 0) {
        throw new Error("Measurement and M must be positive values");
    }

    // LMS formula implementation
    if (L === 0) {
        return Math.log(measurement / M) / S;
    } else {
        return (Math.pow(measurement / M, L) - 1) / (L * S);
    }
}

exports.zScoreToPercentileForWfa = (zScore) => {
    // Using the cumulative distribution function of the standard normal distribution
    // This is an approximation, but works well for typical z-scores
    function normalCDF(x) {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - p : p;
    }

    return Math.round(normalCDF(zScore) * 100);
}

exports.zScoreToPercentileForWfh = (zScore) => {
    if (zScore <= -8) return 0;
    if (zScore >= 8) return 100;

    // Rational approximation for cumulative distribution function
    // Abramowitz and Stegun formula 26.2.17
    function normalCDF(x) {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        // Save the sign of x
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x) / Math.sqrt(2.0);

        // A&S formula 7.1.26
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return 0.5 * (1.0 + sign * y);
    }

    // Convert to percentile (from proportion)
    return Math.round(normalCDF(zScore) * 100);
}

exports.interpretWeightForAge = (zScore, gender, ageInDays) => {
    const ageInMonths = ageInDays / 30.4375;

    let interpretation = {
        status: '',
        severity: '',
        recommendation: '',
        details: ''
    };

    // Interpretation based on WHO guidelines
    if (zScore < -3) {
        interpretation.status = "Severely underweight";
        interpretation.severity = "Critical";
        interpretation.recommendation = "Immediate healthcare provider consultation required";
        interpretation.details = "Child's weight is significantly below the healthy range for their age, indicating potential severe malnutrition or other health concerns.";
    } else if (zScore < -2) {
        interpretation.status = "Underweight";
        interpretation.severity = "Moderate concern";
        interpretation.recommendation = "Consult healthcare provider";
        interpretation.details = "Child's weight is below the healthy range for their age and may require nutritional intervention.";
    } else if (zScore > 3) {
        interpretation.status = "Severely overweight";
        interpretation.severity = "High concern";
        interpretation.recommendation = "Consult healthcare provider to assess nutrition and activity levels";
        interpretation.details = "Child's weight is significantly above the healthy range for their age, which may indicate nutritional or metabolic concerns.";
    } else if (zScore > 2) {
        interpretation.status = "Overweight";
        interpretation.severity = "Moderate concern";
        interpretation.recommendation = "Discuss with healthcare provider at next visit";
        interpretation.details = "Child's weight is above the typical range for their age. Monitor diet and physical activity.";
    } else if (zScore > 1) {
        interpretation.status = "Possible risk of overweight";
        interpretation.severity = "Low concern";
        interpretation.recommendation = "Monitor growth and discuss preventive measures with healthcare provider";
        interpretation.details = "Child's weight is in the upper end of the normal range. Consider reviewing nutrition and activity patterns.";
    } else if (zScore >= -1) {
        interpretation.status = "Normal weight";
        interpretation.severity = "No concern";
        interpretation.recommendation = "Continue regular growth monitoring";
        interpretation.details = "Child's weight is within the healthy range for their age.";
    } else { // -2 <= zScore < -1
        interpretation.status = "Mild underweight";
        interpretation.severity = "Low concern";
        interpretation.recommendation = "Monitor growth and nutrition";
        interpretation.details = "Child's weight is on the lower end of the normal range. Ensure adequate nutrition.";
    }

    // Add age-specific recommendations
    if (ageInMonths < 6) {
        interpretation.recommendation += ". For infants under 6 months, exclusive breastfeeding is recommended when possible.";
    } else if (ageInMonths < 24) {
        interpretation.recommendation += ". For children 6-24 months, ensure adequate complementary feeding along with continued breastfeeding.";
    }

    return interpretation;
}

exports.interpretWeightForHeight = (zScore, gender, height) => {
    let interpretation = {
        status: '',
        severity: '',
        recommendation: '',
        nutritionalStatus: '',
        details: ''
    };

    // Classify based on z-score ranges according to WHO standards
    if (zScore < -3) {
        interpretation.status = "Severe wasting";
        interpretation.severity = "Critical";
        interpretation.nutritionalStatus = "Severe acute malnutrition";
        interpretation.recommendation = "Immediate medical evaluation required";
        interpretation.details = "Weight is severely below the recommended range for height, indicating serious nutritional deficiency.";
    } else if (zScore < -2) {
        interpretation.status = "Moderate wasting";
        interpretation.severity = "Serious";
        interpretation.nutritionalStatus = "Moderate acute malnutrition";
        interpretation.recommendation = "Consult healthcare provider promptly";
        interpretation.details = "Weight is significantly below the recommended range for height, suggesting nutritional problems.";
    } else if (zScore < -1) {
        interpretation.status = "Mild wasting";
        interpretation.severity = "Moderate";
        interpretation.nutritionalStatus = "At risk of malnutrition";
        interpretation.recommendation = "Monitor nutrition and growth";
        interpretation.details = "Weight is below the typical range for height. Monitor eating habits and ensure adequate nutrition.";
    } else if (zScore <= 1) {
        interpretation.status = "Normal weight-for-height";
        interpretation.severity = "Normal";
        interpretation.nutritionalStatus = "Normal nutritional status";
        interpretation.recommendation = "Continue regular monitoring";
        interpretation.details = "Weight is within the healthy range for height.";
    } else if (zScore <= 2) {
        interpretation.status = "Possible risk of overweight";
        interpretation.severity = "Low concern";
        interpretation.nutritionalStatus = "At risk of overnutrition";
        interpretation.recommendation = "Monitor dietary habits and physical activity";
        interpretation.details = "Weight is slightly above the typical range for height. Review dietary patterns and encourage physical activity.";
    } else if (zScore <= 3) {
        interpretation.status = "Overweight";
        interpretation.severity = "Moderate concern";
        interpretation.nutritionalStatus = "Overweight";
        interpretation.recommendation = "Evaluation of diet and physical activity recommended";
        interpretation.details = "Weight is above the recommended range for height. Assessment of dietary habits and physical activity level is advised.";
    } else {
        interpretation.status = "Obesity";
        interpretation.severity = "High concern";
        interpretation.nutritionalStatus = "Obesity";
        interpretation.recommendation = "Consult healthcare provider for nutritional assessment";
        interpretation.details = "Weight is significantly above the recommended range for height. Consult with healthcare professional for dietary guidance.";
    }

    // Add age/height specific recommendations
    if (height < 87) {
        interpretation.recommendation += " For children under 2 years, growth monitoring is particularly important.";
    }

    return interpretation;
}
exports.interpretWeightForLength =(zScore, gender, length)=> {
    let interpretation = {
      status: '',
      severity: '',
      recommendation: '',
      nutritionalStatus: '',
      details: ''
    };
    
    // Classification based on z-score ranges - same as before
    if (zScore < -3) {
      interpretation.status = "Severe wasting";
      interpretation.severity = "Critical";
      interpretation.nutritionalStatus = "Severe acute malnutrition";
      interpretation.recommendation = "Immediate medical evaluation required";
      interpretation.details = "Weight is severely below the recommended range for length, indicating serious nutritional deficiency.";
    } else if (zScore < -2) {
      interpretation.status = "Moderate wasting";
      interpretation.severity = "Serious";
      interpretation.nutritionalStatus = "Moderate acute malnutrition";
      interpretation.recommendation = "Consult healthcare provider promptly";
      interpretation.details = "Weight is significantly below the recommended range for length, suggesting nutritional problems.";
    } else if (zScore < -1) {
      interpretation.status = "Mild wasting";
      interpretation.severity = "Moderate";
      interpretation.nutritionalStatus = "At risk of malnutrition";
      interpretation.recommendation = "Monitor nutrition and growth";
      interpretation.details = "Weight is below the typical range for length. Monitor eating habits and ensure adequate nutrition.";
    } else if (zScore <= 1) {
      interpretation.status = "Normal weight-for-length";
      interpretation.severity = "Normal";
      interpretation.nutritionalStatus = "Normal nutritional status";
      interpretation.recommendation = "Continue regular monitoring";
      interpretation.details = "Weight is within the healthy range for length.";
    } else if (zScore <= 2) {
      interpretation.status = "Possible risk of overweight";
      interpretation.severity = "Low concern";
      interpretation.nutritionalStatus = "At risk of overnutrition";
      interpretation.recommendation = "Monitor feeding practices";
      interpretation.details = "Weight is slightly above the typical range for length. Review feeding patterns.";
    } else if (zScore <= 3) {
      interpretation.status = "Overweight";
      interpretation.severity = "Moderate concern";
      interpretation.nutritionalStatus = "Overweight";
      interpretation.recommendation = "Evaluation of feeding practices recommended";
      interpretation.details = "Weight is above the recommended range for length. Assessment of feeding habits is advised.";
    } else {
      interpretation.status = "Obesity";
      interpretation.severity = "High concern";
      interpretation.nutritionalStatus = "Obesity";
      interpretation.recommendation = "Consult healthcare provider for nutritional assessment";
      interpretation.details = "Weight is significantly above the recommended range for length. Consult with healthcare professional for guidance.";
    }
    
    // Add age-specific recommendations for 0-2 years
    if (length < 65) {
      interpretation.recommendation += " For infants under 6 months, exclusive breastfeeding is recommended when possible.";
    } else if (length < 85) {
      interpretation.recommendation += " For infants 6-12 months, ensure appropriate complementary feeding along with continued breastfeeding.";
    } else {
      interpretation.recommendation += " For children 12-24 months, ensure adequate nutrition with diverse food groups.";
    }
    
    return interpretation;
  }
