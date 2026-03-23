export function showLoading() {
    document.querySelector(".loading").classList.remove("hidden");
}

export function hideLoading() {
    document.querySelector(".loading").classList.add("hidden");
}

export function showLoadingImage(){
    document.querySelector(".weather-image").src = "assets/img/loading.gif";
}


/* dropdown (igual que antes) */
export function displayCityOptions(options) {

    const old = document.querySelector(".city-select");
    if (old) old.remove();

    const select = document.createElement("select");
    select.classList.add("city-select");

    const placeholder = document.createElement("option");
    placeholder.textContent = "Select a city...";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    options.forEach((opt, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${opt.name}, ${opt.country}`;
        select.appendChild(option);
    });

    const input = document.getElementById("city-input");
    input.parentNode.insertBefore(select, input.nextSibling);

    return new Promise((resolve) => {
        select.addEventListener("change", () => {
            const selected = options[select.value];
            select.remove();
            resolve(selected);
        });
    });
}


/* 🔽 NUEVO: forecast */
export function displayForecast(daily) {

    // eliminar forecast anterior
    const old = document.querySelector(".forecast");
    if (old) old.remove();

    const container = document.createElement("div");
    container.classList.add("forecast");

    // mañana + 3 días
    const days = daily.time.slice(1, 5);
    const temps = daily.temperature_2m_max.slice(1, 5);
    const codes = daily.weathercode.slice(1, 5);

    days.forEach((date, i) => {

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        // 👇 fix zona horaria (evita que muestre hoy)
        const d = new Date(date + "T00:00:00");

        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        const dayNum = d.getDate();

        card.innerHTML = `
            <div class="forecast-top">
                <span>${dayName}</span>
                <span>${dayNum}</span>
            </div>
            <div class="forecast-bottom">
                <div>${getWeatherIcon(codes[i])}</div>
                <div>${Math.round(temps[i])}°</div>
            </div>
        `;

        container.appendChild(card);
    });

    document.querySelector(".weather-card").after(container);
}


/* reutilizamos lógica simple de icono */
function getWeatherIcon(code) {

    if (code === 0) return "☀️";
    if (code <= 3) return "☁️";
    if (code >= 61) return "🌧️";

    return "☁️";
}


export function displayWeather(city, weather) {

    const card = document.querySelector(".weather-card");

    card.classList.remove("hidden");
    document.querySelector(".app").classList.remove("centered");

    document.querySelector(".city").textContent = city;

    document.querySelector(".temp").textContent =
        `${Math.round(weather.temperature)}°`;

    document.querySelector(".description").textContent =
        weathercodeToText(weather.weathercode);

    document.querySelector(".detail span").textContent =
        `Wind ${weather.windspeed} km/h`;

    updateIcon(weather.weathercode);
    updateImage(weather.weathercode);
    updateTime();
}


/* resto igual */
function updateTime() {
    const now = new Date();
    document.querySelector(".time").textContent =
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function updateIcon(code) {
    const iconContainer = document.querySelector(".icon");
    let svg = "";

    if (code === 0) {
        svg = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/></svg>`;
    } else if (code <= 3) {
        svg = `<svg viewBox="0 0 24 24"><path d="M6 14a4 4 0 0 1 1-7.9A5 5 0 0 1 17 8a3.5 3.5 0 0 1 .5 7H6z"/></svg>`;
    } else if (code >= 61) {
        svg = `<svg viewBox="0 0 24 24"><path d="M6 14a4 4 0 0 1 1-7.9A5 5 0 0 1 17 8a3.5 3.5 0 0 1 .5 7H6z"/><line x1="8" y1="18" x2="8" y2="21"/><line x1="12" y1="18" x2="12" y2="21"/></svg>`;
    }

    iconContainer.innerHTML = svg;
}

function updateImage(code) {
    const img = document.querySelector(".weather-image");
    let category = "cloudy";

    if (code === 0) category = "clear-sky";
    else if (code <= 3) category = "cloudy";
    else if (code >= 61) category = "rain";

    img.src = `assets/img/weather_${category}.jpg`;
}

function weathercodeToText(code) {
    const map = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        61: "Rain"
    };
    return map[code] || "Weather";
}