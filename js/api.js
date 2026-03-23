export async function getCoordinates(city) {

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) {
        throw new Error("City not found");
    }

    return data.results.map(loc => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        name: loc.name,
        country: loc.country
    }));
}


export async function getWeather(lat, lon) {

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,weathercode&forecast_days=5&timezone=auto`;

    const res = await fetch(url);
    const data = await res.json();

    return {
        current: data.current_weather,
        daily: data.daily
    };
}