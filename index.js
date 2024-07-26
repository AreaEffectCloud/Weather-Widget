const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const cityInput = document.querySelector('.search-box input');
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

search.addEventListener('click', searchWeather);

async function searchWeather() {
    const APIKey = 'YOUR_API_KEY';
    const city = cityInput.value;

    if (city === '') {
        alert('都市名を入力してください。');
        return;
    }

    try {
        // 都市名から緯度と経度を取得
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
            throw new Error(`HTTP error! status: ${geoResponse.status}`);
        }
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            showError('都市が見つかりません。');
            return;
        }

        // 緯度と経度を使用して天気情報を取得
        const { lat, lon } = geoData[0];
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error(`HTTP error! status: ${weatherResponse.status}`);
        }
        const weatherData = await weatherResponse.json();

        hideError();
        updateWeather(weatherData);
    } catch (error) {
        console.error('天気情報の取得に失敗しました:', error);
        showError('天気情報の取得に失敗しました。');
    }
}

function showError(message) {
    error404.textContent = message;
    container.style.height = '400px';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    error404.style.display = 'block';
    error404.classList.add('fadeIn');
}

function hideError() {
    error404.style.display = 'none';
    error404.classList.remove('fadeIn');
}

function updateWeather(data) {
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    const weatherIcons = {
        'Clear': 'clear.png',
        'Clouds': 'cloud.png',
        'Rain': 'rain.png',
        'Drizzle': 'rain.png',
        'Thunderstorm': 'rain.png',
        'Snow': 'snow.png',
        'Mist': 'mist.png',
        'Smoke': 'mist.png',
        'Haze': 'mist.png',
        'Dust': 'mist.png',
        'Fog': 'mist.png'
    };
    image.src = `images/${weatherIcons[data.weather[0].main] || 'unknown.png'}`;

    temperature.textContent = `${Math.round(data.main.temp)}`;
    temperature.innerHTML += '<span>℃</span>';
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;

    weatherBox.style.display = '';
    weatherDetails.style.display = '';
    weatherBox.classList.add('fadeIn');
    weatherDetails.classList.add('fadeIn');
    container.style.height = '590px';

    // cityInput.value = '';
}