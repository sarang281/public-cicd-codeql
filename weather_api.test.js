const axios = require('axios');
const weatherApi = require('./weather_api.js');

jest.mock('axios');

describe('weather_api.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchWeatherData', () => {
        it('should fetch weather data for a valid city', async () => {
            const mockResponse = {
                data: {
                    name: 'New York',
                    main: { temp: 20, humidity: 65, feels_like: 19 },
                    weather: [{ description: 'clear sky' }],
                    wind: { speed: 5.5 }
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await weatherApi.fetchWeatherData('New York');

            expect(axios.get).toHaveBeenCalledWith(
                'https://api.openweathermap.org/data/2.5/weather',
                {
                    params: {
                        q: 'New York',
                        appid: undefined,
                        units: 'metric'
                    }
                }
            );
            expect(result).toEqual(mockResponse);
        });

        it('should use custom units when provided', async () => {
            const mockResponse = { data: {} };
            axios.get.mockResolvedValue(mockResponse);

            await weatherApi.fetchWeatherData('London', 'weather', 'imperial');

            expect(axios.get).toHaveBeenCalledWith(
                'https://api.openweathermap.org/data/2.5/weather',
                expect.objectContaining({
                    params: expect.objectContaining({
                        units: 'imperial'
                    })
                })
            );
        });

        it('should use custom API endpoint when provided', async () => {
            const mockResponse = { data: {} };
            axios.get.mockResolvedValue(mockResponse);

            await weatherApi.fetchWeatherData('Tokyo', 'forecast');

            expect(axios.get).toHaveBeenCalledWith(
                'https://api.openweathermap.org/data/2.5/forecast',
                expect.objectContaining({
                    params: expect.objectContaining({
                        q: 'Tokyo'
                    })
                })
            );
        });

        it('should throw error when API call fails', async () => {
            const error = new Error('Network Error');
            axios.get.mockRejectedValue(error);

            await expect(weatherApi.fetchWeatherData('InvalidCity'))
                .rejects.toThrow('Network Error');
        });
    });
});