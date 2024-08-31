const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector(".error-container");

const errorImg = document.querySelector("[data-notFound]");
const errorText = document.querySelector("[data-errorText]");
const errorBtn = document.querySelector(".errorBtn");


// initaially variables

let currentTab = userTab;
const API_KEY = "10818f20df53285d9e82e5185bda7cef";
currentTab.classList.add("current-tab")

getFromSessionStorage();


function switchTab(clickedTab) {
    errorContainer.classList.remove("active");
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            // first on search tab and clicked on your weather tab 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now i am on weather tab, so i have to display weather, so lets check local storage first for coordinates, if we have saved them there
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
})

// check if coordinates are already present in session storage
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        // if no local coordinates present
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;

    // make grant container incisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API call
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        // make loading screen invisible
        loadingScreen.classList.remove("active");

        // now visible weather data on ui
        userInfoContainer.classList.add("active");

        if(!data.sys){
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // render values of weather data on ui
        renderWeatherInfo(data);

    }
    catch(error){
        loadingScreen.classList.remove("active");
        
        errorContainer.classList.add("active");
        errorImg.computedStyleMap.display = "none";
        errorText.innerText = `Error : ${error?.message}`;
        errorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}

function renderWeatherInfo(weatherInfo) {
    // console.log(weatherInfo)
    // fetch elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherinfo to UI
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

const messageText = document.querySelector(".get-access-text-info");
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
    }
    else {
        // show an alert for no geolocation support available
        grantAccessButton.computedStyleMap.display = "none";
        messageText.innerText = "Geolocation is not supported by this browser";

    }
}
function showPosition(position) {
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation)

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") {
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
})


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        const data = await response.json();
        // console.log(data);
        if(!data.sys){
            throw data;
        }
        loadingScreen.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(error) {
        // handle error
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        errorText.innerText = `${error?.message}`;
        errorBtn.computedStyleMap.display = "none";
    }
}

// handle any errors
function handleError(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            messageText.innerText = "You denied the request for Geolocation";
            break;
        case error.POSITION_UNAVAILABLE:
            messageText.innerText = "Location information is unavailable";
            break;
        case error.TIMEOUT:
            messageText.innerText = "The request to getuser location is timed out";
            break;
        case error.UNKNOWN_ERROR:
            messageText.innerText = "An unknown error occured";
            break;
    }
}
