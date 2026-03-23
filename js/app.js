import { getCoordinates, getWeather } from "./api.js";
import { displayWeather, displayForecast, showLoading, hideLoading, showLoadingImage, displayCityOptions } from "./ui.js";

const input = document.getElementById("city-input");
const button = document.getElementById("search-btn");

button.addEventListener("click", searchWeather);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchWeather();
});


async function searchWeather() {

    const city = input.value.trim();
    if (!city) return;

    const card = document.querySelector(".weather-card");

    try {

        if (card.classList.contains("hidden")) {
            card.classList.remove("hidden");
            document.querySelector(".app").classList.remove("centered");
        }

        showLoading();
        showLoadingImage();

        const locations = await getCoordinates(city);
        const selected = await displayCityOptions(locations);

        const data = await getWeather(
            selected.latitude,
            selected.longitude
        );

        displayWeather(
            `${selected.name}, ${selected.country}`,
            data.current
        );

        displayForecast(data.daily);

    } catch (err) {
        alert("Error");
    } finally {
        hideLoading();
    }
}