const API_KEY = "10818f20df53285d9e82e5185bda7cef";



function renderWeatherInfo(data){
    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

    document.body.appendChild(newPara);
}


async function fetchWeatherDetails() {
    try {
        const city = "Delhi";


        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        console.log("Weather Data : ->", data)

        renderWeatherInfo(data);

    }
    catch(err) {
        // handle error
    }

}

async function getCustomWeatherDetails() {
    try{
        let latitude = 24.7914;
        let longitude = 85.0002;

        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        let data = await result.json();
        console.log(data);

        renderWeatherInfo(data);
    }
    catch(err){
        console.log("Error Found", err);
    }
}