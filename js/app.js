function updateTime(timezone) {
    const time = document.getElementById('time');
    const date = document.getElementById('day');
    const now = new Date();

    const options = {timezone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit'};
    const dateOption = {timezone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const timeString = now.toLocaleTimeString('en-US', options);
    const dateString = now.toLocaleDateString('en-US', dateOption);

    time.innerText = timeString;
    date.innerText = dateString;
}

function startClock(timezone) {
    updateTime(timezone);
    clearInterval(window.clockInterval);
    window.clockInterval = setInterval(() => {
        updateTime(timezone);
    }, 1000);
}

document.getElementById('search-btn').addEventListener('click', function() {
    const location = document.getElementById('searchbar-text').value;
    fetchWeatherDetails(location);
});

function fetchWeatherDetails(location) {
    const apiKey = '5b4b05e7214f46c5b3444427242708';
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10`)
    .then(response => response.json())
    .then(data => {
        updateWeather(data);
        const timezone = data.location.tz_id;
        startClock(timezone);
        // console.log(data);
    })
    .catch(error => console.error('Error fetching the weather data:',error));
}

function updateWeather(data) {
    const location = data.location;
    document.getElementById('cityName').innerText = location.name;

    const current = data.current;
    document.getElementById('current-location-weather-img').src = current.condition.icon;
    document.getElementById('current-location-weather-img').alt = current.condition.text;
    document.getElementById('current-location-temperature').innerText = `${current.temp_c}°C`;
    document.getElementById('weatherCondition').innerText = current.condition.text;
    document.getElementById('wind-speed').innerText = `${current.wind_kph} km/h`;
    document.getElementById('Humidity').innerText = `${current.humidity} %`;
    document.getElementById('Pressure').innerText = `${current.pressure_mb} hPa`;
    document.getElementById('Precipitation').innerText = `${current.precip_mm} mm `;
    document.getElementById('Sunset').innerText = `${data.forecast.forecastday[0].astro.sunset} `;
    document.getElementById('Sunrise').innerText = `${data.forecast.forecastday[0].astro.sunrise} `;
    document.getElementById('uvIndex').innerText = `${current.uv}`;
    document.getElementById('Visibility').innerText = `${current.vis_km} `;
    document.getElementById('feelLikes').innerText = `${current.feelslike_c} `;
 
    const hourly_forecast = $('#hourly-forecast');
    data.forecast.forecastday[0].hour.forEach(hour => {
        hourly_forecast.append(`
            <div class="card">
                <p class="text-center mt-2">${hour.time.split(' ')[1]}</p>
                <img src="${hour.condition.icon}" alt="${hour.condition.text} class="card-img">
                <p class="text-center mt-2">${hour.temp_c}°C</p>
            </div>    
        `);
    });

    const tenDayForeCast = $('#10-Days-Forecast');
    data.forecast.forecastday.forEach(day => {
        tenDayForeCast.append(`
            <div class = "cardForecast d-flex">
                <div class = "mt-3" style="width: 30%;"><p>${new Date(day.date).toDateString()}</p></div>
                <div style="margin-left: 20px; width: 10%;">
                    <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                    <p class = "text-center">${day.day.daily_chance_of_rain} % </p>
                </div>
                <div class="mt-3" style = "margin-left: 10%">
                    <p style="font-size: 60%;">Max temperature</p>
                    <p>${day.day.maxtemp_c} °C</p>
                </div>
                <div class="mt-3" style = "margin-left: 10%">
                    <p style="font-size: 60%;">Min temperature</p>
                    <p>${day.day.mintemp_c} °C</p>
                </div>
                <hr/>
            </div>
        `);
    });
} 

function fetchCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherDetails(`${lat},${lon}`);
        }, error => {
            console.error('Error getting location:',error);
            fetchWeatherDetails('Colombo');
        });
    }else{
        fetchWeatherDetails('Colombo');
    }
}

fetchCurrentLocationWeather();