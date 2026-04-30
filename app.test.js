const request = require('supertest');
const app = require('./app');


// Mock the weather_api module
jest.mock('./weather_api.js', () => ({
    fetchWeatherData: jest.fn()
}));

const api = require('./weather_api.js');

describe('GET /weather', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return weather data for a valid city', async () => {
        const mockResponse = {
            data: {
                name: 'London',
                main: {
                    temp: 15.5,
                    humidity: 72,
                    feels_like: 14.2
                },
                weather: [{ description: 'overcast clouds' }],
                wind: { speed: 3.6 }
            }
        };

        api.fetchWeatherData.mockResolvedValue(mockResponse);

        const response = await request(app)
            .get('/weather?city=London');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            city: 'London',
            temperature: 15.5,
            weather: 'overcast clouds',
            humidity: 72,
            windSpeed: 3.6,
            feelsLike: 14.2
        });
    });

    it('should return 400 if city parameter is missing', async () => {
        const response = await request(app)
            .get('/weather');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'City is required' });
    });

    it('should return 400 if city parameter is empty', async () => {
        const response = await request(app)
            .get('/weather?city=');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'City is required' });
    });

    it('should return 500 if API call fails', async () => {
        api.fetchWeatherData.mockRejectedValue({
            response: {
                data: { message: 'City not found' }
            }
        });

        const response = await request(app)
            .get('/weather?city=InvalidCity');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Failed to fetch weather data',
            details: { message: 'City not found' }
        });
    });

    it('should return 500 if API call fails without response data', async () => {
        api.fetchWeatherData.mockRejectedValue(new Error('Network error'));

        const response = await request(app)
            .get('/weather?city=London');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Failed to fetch weather data',
            details: 'Network error'
        });
    });
});