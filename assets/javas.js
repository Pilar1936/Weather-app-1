// DOM Elements
const cityInput = document.querySelector(".City-input");
const searchButton = document.querySelector(".search");
const forecastCard = document.querySelector(".card-ul");
const WeatherCard = document.querySelector(".curret");

// API Key
const apiKey = '39311b3ddc9f82f8cdec8e30beda1ea8';

// Function to save city to local storage
const saveCityToLocalStorage = (cityname) => {
    localStorage.setItem('lastSearchedCity', cityname);
};

// Function to get last searched city from local storage
const getLastSearchedCityFromLocalStorage = () => {
    return localStorage.getItem('lastSearchedCity') || '';
};

// Function to update the UI with the last searched city
const updateUIWithLastSearchedCity = () => {
    const lastSearchedCity = getLastSearchedCityFromLocalStorage();
    if (lastSearchedCity) {
        cityInput.value = lastSearchedCity;
        getCityCoordinate();
    }
};

// Event listener for the search button
searchButton.addEventListener("click", () => {
    getCityCoordinate();
    // Save the searched city to local storage
    saveCityToLocalStorage(cityInput.value.trim());
});

// Function to create weather card HTML
const createWeatherCard = (cityname, watheritem, index) => {
    const tempInFahrenheit = ((watheritem.main.temp - 273.15) * 9/5 + 32).toFixed(2);

    if (index === 0) {
        return `<div class="details">
            <h2>${cityname} (${watheritem.dt_txt.split(" ")[0]})</h2>
            <h4>Temperature: ${tempInFahrenheit}°F </h4>
            <h4>Wind: ${watheritem.wind.speed} m/s</h4>
            <h4>Humidity: ${watheritem.main.humidity}%</h4>
        </div>
        <div class="iconos">
            <img src="https://openweathermap.org/img/wn/${watheritem.weather[0].icon}@4x.png" alt="icono-weather">
            <h4>${watheritem.weather[0].description}</h4>
        </div>`;
    } else {
        return `<li class="card-li">
            <h3>(${watheritem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${watheritem.weather[0].icon}@2x.png" alt="icono-weather">
            <h4>Temp: ${tempInFahrenheit}°F </h4>
            <h4>Wind: ${watheritem.wind.speed} m/s</h4>
            <h4>Humidity: ${watheritem.main.humidity}%</h4>
        </li>`;
    }
};

// Function to fetch weather details
const WeatherDetails = (cityname, lat, lon) => {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            const uniqForeDays = [];
            const daysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqForeDays.includes(forecastDate)) {
                    return uniqForeDays.push(forecastDate);
                }
            });

            // Prevents the card from being duplicated in HTML and JavaScript
            cityInput.value = "";
            WeatherCard.innerHTML = "";
            forecastCard.innerHTML = "";

            daysForecast.forEach((watheritem, index) => {
                if (index === 0) {
                    WeatherCard.insertAdjacentHTML("beforeend", createWeatherCard(cityname, watheritem, index));
                } else {
                    forecastCard.insertAdjacentHTML("beforeend", createWeatherCard(cityname, watheritem, index));
                }
            });
        })
        .catch(error => {
            console.error('weather details error:', error);
        });
};

// Function to get location
const getCityCoordinate = () => {
    const cityname = cityInput.value.trim();
    if (!cityname) return;
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${apiKey}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No location for ${cityname}`);
            const { name, lat, lon } = data[0];
            WeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert('An error occurred');
        });
};

// Call this function to check if there is a last searched city in local storage
updateUIWithLastSearchedCity();
