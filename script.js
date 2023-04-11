
async function getWeather(searchTerm){
   try{ const raw = await fetch(`https://api.weatherapi.com/v1/current.json?key=0d4c610fe1a14000bb0154925231004&q=${searchTerm}`,{mode:'cors'});
    const result = await raw.json();
    tempDiv.textContent =  result.current.temp_f;
    cityDiv.textContent= result.location.name;
    conditionDiv.textContent=result.current.condition.text;
    console.log( result)}
    catch(err){console.log(`getWeather Error:  ${err}`)}
}
let tempDiv=document.getElementById('temp');
let cityDiv=document.getElementById('city');
let conditionDiv=document.getElementById('condition');
console.log(condition);
getWeather('portland');


const searchButton=document.getElementById('search-button')
const searchInput=document.getElementById('search');
searchButton.onclick=(e)=>{
    e.preventDefault();
    getWeather(searchInput.value);
}