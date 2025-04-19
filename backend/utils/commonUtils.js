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

exports.findClosestAgeReferenceData = (data, ageInDays) => {
    // Sort by day
    console.log('Data:', data[0].Month);
    const ageInMonths = ageInDays / 30.4375;
    console.log('Age in Months:', ageInMonths, ageInDays);
    const sortedData = data.find((entry)=> {
        if(entry.Month === Math.floor(ageInMonths)){
            console.log('Entry:', entry);
            return entry ;
        }
    });
    console.log('Sorted Data:', sortedData);
    return sortedData;
}

exports.calculateWfaZscore = (measurement, L, M, S) => {
    console.log('Measurement:', measurement, 'L:', L, 'M:', M, 'S:', S);
    if (L !== 0) {
        return (Math.pow(measurement / M, L) - 1) / (L * S);
    } else {
        return Math.log(measurement / M) / S;
    }
}

exports.zScoreToPercentile = (zScore) => {
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

exports.interpretWeightForAge=(zScore, gender, ageInDays) => {
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
  