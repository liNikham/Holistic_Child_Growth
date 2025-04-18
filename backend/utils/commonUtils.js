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