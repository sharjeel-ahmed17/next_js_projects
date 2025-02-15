"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

const Weather = () => {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimLocation = location.trim();
    if (trimLocation === "") {
      setIsError("Please enter a valid location.");
      setWeather(null);
      return;
    }
    setIsError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimLocation}`
      );

      if (!response.ok) {
        throw new Error("City not found.");
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        location: data.location.name,
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setIsError("City not found! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTemperatureMessage = (temperature: number, unit: string): string => {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C! Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
      } else {
        return `It's hot at ${temperature}°C. Stay hydrated!`;
      }
    } else {
      return `${temperature}°${unit}`;
    }
  };

  const getWeatherMessage = (description: string): string => {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
    }
  };

  const getLocationMessage = (location: string): string => {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    return `${location} ${isNight ? "at Night" : "During the Day"}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Weather App
          </CardTitle>
          <CardDescription className="text-center">
            Enter a location to get the current weather.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLocation(e.target.value)
                }
                className="flex-1"
              />
            </div>
            <Button type="submit" variant="outline" className="w-full" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
          {isError && (
            <p className="mt-4 text-sm text-red-500 text-center">{isError}</p>
          )}
          {weather && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <ThermometerIcon className="w-5 h-5 text-gray-500" />
                <p className="text-lg">
                  {getTemperatureMessage(weather.temperature, weather.unit)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-5 h-5 text-gray-500" />
                <p className="text-lg">{getWeatherMessage(weather.description)}</p>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {getLocationMessage(weather.location)}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-gray-500 text-center">
          Powered by WeatherAPI.com
        </CardFooter>
      </Card>
    </div>
  );
};

export default Weather;