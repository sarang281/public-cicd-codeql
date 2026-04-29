require('dotenv').config();
const express = require('express');
const app = express();
const api = require('./weather_api.js');

const PORT = 3000;

if (require.main === module) {
    app.listen(PORT, function(err){
        if (err) console.log("Error in server setup")
        // console.log("Server listening on Port", PORT);
    })
}

/**
 * Endpoint to fetch current weather data for a city
 */
app.get('/weather', async (req, res) => {
    try {
        const city = req.query.city;

        if (!city) {
            return res.status(400).json({ error: 'City is required' });
        }
        //console.log(`Received request for weather data of city: ${city}`);
        response = await api.fetchWeatherData(city);

        const data = response.data;

        res.json({
            city: data.name,
            temperature: data.main.temp,
            weather: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            feelsLike: data.main.feels_like
        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch weather data',
            details: error.response?.data || error.message
        });
    }
});


module.exports = app;
