const axios = require('axios');

module.exports = {
    /**
     * Fetches weather data for a given city from OpenWeatherMap API.
     * @param {string} city - The name of the city to fetch weather for.
     * @param {string} units - The units for the weather data (e.g., 'metric', 'imperial').
     * @param {string} call - The specific API endpoint to call (default is 'weather').
     * @returns {Promise<Object>} A promise that resolves to the axios response object containing weather data.
     * @throws {Error} Throws an error if the API request fails.
     */
    fetchWeatherData: async (city, call = 'weather', units = 'metric') => {
        const apiKey = process.env.WEATHER_API_KEY;
        return await axios.get(
            `https://api.openweathermap.org/data/2.5/${call}`,
            {
                params: {
                    q: city,
                    appid: apiKey,
                    units: units
                }
            }
        );
    }
};