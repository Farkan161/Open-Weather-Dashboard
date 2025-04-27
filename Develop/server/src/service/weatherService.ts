import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Make sure you installed this
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private apiKey = process.env.API_KEY as string;
  private geoBaseUrl = 'https://api.openweathermap.org/geo/1.0/direct';
  private forecastBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  private cityName = '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const url = this.buildGeocodeQuery(query);
    const response = await fetch(url);
    const data = await response.json();
    if (!data.length) throw new Error('City not found.');
    return data[0];
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.geoBaseUrl}?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.forecastBaseUrl}?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const current = response.list[0];
    return new Weather(
      response.city.name,
      new Date(current.dt * 1000).toLocaleDateString(),
      current.weather[0].icon,
      current.weather[0].description,
      current.main.temp,
      current.wind.speed,
      current.main.humidity
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [];

    for (let i = 7; i < weatherData.length; i += 8) { // every 8 items = 1 day
      const forecastItem = weatherData[i];
      forecastArray.push(
        new Weather(
          currentWeather.city,
          new Date(forecastItem.dt * 1000).toLocaleDateString(),
          forecastItem.weather[0].icon,
          forecastItem.weather[0].description,
          forecastItem.main.temp,
          forecastItem.wind.speed,
          forecastItem.main.humidity
        )
      );
    }

    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherResponse = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherResponse);
    const forecast = this.buildForecastArray(currentWeather, weatherResponse.list);

    return [currentWeather, ...forecast];
  }
}

export default new WeatherService();
