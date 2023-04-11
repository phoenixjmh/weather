
async function getWeather(searchTerm) {
    try {
        const raw = await fetch(`https://api.weatherapi.com/v1/current.json?key=0d4c610fe1a14000bb0154925231004&q=${searchTerm}`, { mode: 'cors' });
        const result = await raw.json();
        tempDiv.textContent = result.current.temp_f;
        cityDiv.textContent = result.location.name;
        conditionDiv.textContent = result.current.condition.text;
        console.log(raw);
    }
    catch (err) { console.log(`getWeather Error:  ${err}`) }
}

async function getSearched(searchTerm) {
    try {
        const result = await fetch(`https://api.weatherapi.com/v1/search.json?key=0d4c610fe1a14000bb0154925231004&q=${searchTerm}`, { mode: 'cors' })
        const data = await result.json();
        return data;
    }
    catch (err) { console.log(`getSearched Error:  ${err}`) }
}


const searchButton = document.getElementById('search-button')
const searchInput = document.getElementById('search');


searchButton.onclick = (e) => {
    e.preventDefault();
    getWeather(searchInput.value);
}
searchInput.oninput = async () => {
    if (searchInput.value != '') {
        try {
            let locationsArray = await getSearched(searchInput.value);
            clearSearchResults();
            if (locationsArray.length > 0) {
                for (let o of locationsArray) {
                    createSearchResult(o.name, o.region, o.url);
                    console.log(locationsArray.length);
                }
            }
            else{
                noMatchingLocation();
            }
        } catch (err) { console.log(`onInput Error:  ${err}`) }
    }
    
}
const clearSearchResults = () => {
    
    let searchOptions = document.querySelector('.search-options')
    searchOptions.innerHTML = '';
}
const createSearchResult = (name, region, url) => {
    let searchOptions = document.querySelector('.search-options');
    
    
    let locationOption = document.createElement('div');
    locationOption.classList.add('location-option');
    locationOption.textContent = `${name} ${region}`;
    locationOption.onclick = () => {
        clearSearchResults();
        getWeather(url);
    }
    
    searchOptions.appendChild(locationOption);
}
const noMatchingLocation=()=>{
    let searchOptions=document.querySelector('.search-options');
    searchOptions.innerHTML="<div class = 'location-option' id = 'no-match'>No results found</div>"
}

const tempDiv = document.getElementById('temp');
const cityDiv = document.getElementById('city');
const conditionDiv = document.getElementById('condition');
getWeather('Ojai');