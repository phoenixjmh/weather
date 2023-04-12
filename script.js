/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const tempDiv = document.getElementById('temp');
const cityDiv = document.getElementById('city');
const conditionDiv = document.getElementById('condition');
const conditionIcon = document.getElementById('condition-icon');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search');
const changeFontByTemp = async (div) => {
    const temperature = Number(div.textContent.replace('°', ''));
    if (temperature >= 90) { div.style.color = 'red'; } else if (temperature >= 75) { div.style.color = 'orange'; } else if (temperature >= 65) { div.style.color = 'yellow'; } else if (temperature >= 60) { div.style.color = 'chartreuse'; } else if (temperature >= 50) { div.style.color = 'lightseagreen'; } else if (temperature > 40) { div.style.color = 'teal'; } else if (temperature <= 40) { div.style.color = 'aqua'; }
};
const addHourDiv = (time, temp, icon) => {
    const gridFrame = document.querySelector('.grid-frame');
    const hourPanel = document.createElement('div');
    hourPanel.className = 'hour-panel';
    hourPanel.innerHTML = `<p class = 'temp'>${temp}</p><img src =${icon}><p class='hour'>${time}</p>`;
    gridFrame.appendChild(hourPanel);
    changeFontByTemp(hourPanel.childNodes[0]);
};
async function getForecast(searchTerm) {
    try {
        const result = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=0d4c610fe1a14000bb0154925231004&q=${searchTerm}`, { mode: 'cors' });
        const data = await result.json();
        const hourArray = data.forecast.forecastday[0].hour;
        return hourArray;
    } catch (err) { console.log(`getForecast Error:  ${err}`); }
}
const removeDateFromTime = (string) => {
    const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
    const unformattedTime = string.replace(regex, '');
    let formattedTime = Number(unformattedTime.replace(/:0{2}/, ''));
    if (formattedTime > 12) {
        formattedTime -= 12;
        formattedTime += 'PM';
    } else if (formattedTime !== 12) {
        formattedTime += 'AM';
    }
    if (formattedTime === 12) {
        formattedTime += 'PM';
    }
    if (formattedTime !== '0AM') return formattedTime;
    return '12AM';
};
const updateForecast = async (searchTerm) => {
    const hoursOfDay = await getForecast(searchTerm);
    document.querySelector('.grid-frame').innerHTML = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const h of hoursOfDay) {
        const { icon } = h.condition;
        const processedTime = removeDateFromTime(h.time);
        const processedTemp = `${Math.round(h.temp_f)}°`;
        addHourDiv(processedTime, processedTemp, icon);
    }
};

async function getWeather(searchTerm) {
    try {
        const raw = await fetch(`https://api.weatherapi.com/v1/current.json?key=0d4c610fe1a14000bb0154925231004&q=${searchTerm}`, { mode: 'cors' });
        const result = await raw.json();
        tempDiv.textContent = `${Math.round(result.current.temp_f)}°`;
        cityDiv.textContent = result.location.name;
        conditionIcon.src = result.current.condition.icon;
        conditionDiv.textContent = result.current.condition.text;
        updateForecast(searchTerm);
        await changeFontByTemp(tempDiv);
    } catch (err) { console.log(`getWeather Error:  ${err}`); }
}

async function getSearched(searchTerm) {
    try {
        const result = await fetch(`https://api.weatherapi.com/v1/search.json?key=0d4c610fe1a14000bb0154925231004&q=${searchTerm}`, { mode: 'cors' });
        const data = await result.json();
        return data;
    } catch (err) { console.log(`getSearched Error:  ${err}`); }
}

const clearSearchResults = () => {
    const searchOptions = document.querySelector('.search-options');
    searchOptions.innerHTML = '';
};
const refreshWidget = (event) => {
    event.preventDefault();
    getWeather(searchInput.value);
    clearSearchResults();
};
searchButton.onclick = (e) => {
    refreshWidget(e);
};
const createSearchResult = (name, region, url) => {
    const searchOptions = document.querySelector('.search-options');
    const locationOption = document.createElement('div');
    locationOption.classList.add('location-option');
    locationOption.textContent = `${name} ${region}`;
    locationOption.onclick = () => {
        clearSearchResults();
        getWeather(url);
        searchInput.value = '';
    };

    searchOptions.appendChild(locationOption);
};
const noMatchingLocation = () => {
    const searchOptions = document.querySelector('.search-options');
    searchOptions.innerHTML = "<div class = 'location-option' id = 'no-match'>No results found</div>";
};
searchInput.oninput = async () => {
    searchInput.onkeydown = (event) => ((event.key === 'Enter') ? refreshWidget(event) : 0);
    if (searchInput.value !== '') {
        try {
            const locationsArray = await getSearched(searchInput.value);
            clearSearchResults();
            if (locationsArray.length > 0) {
                for (const o of locationsArray) {
                    createSearchResult(o.name, o.region, o.url);
                }
            } else {
                noMatchingLocation();
            }
        } catch (err) { console.log(`onInput Error:  ${err}`); }
    }
    if (searchInput.value === '') { clearSearchResults(); }
};

getWeather('Dallas');
