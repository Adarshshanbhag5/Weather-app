
const api = {
    key: "b7238eafe4603d0a88f87bda10c3a4a5",
    baseUrl: "https://api.openweathermap.org/data/2.5/",
    iconUrl: "http://openweathermap.org/img/wn/",
};

const searchBox = document.querySelector(".search-box");
searchBox.addEventListener("keypress", dosomething);

window.addEventListener("load", () => {
    let long; //longitude
    let lat; //latitude

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            fetch(
                `${api.baseUrl}weather?lat=${lat}&lon=${long}&units=metric&APPID=${api.key}`
            )
                .then((weather) => {
                    return weather.json();
                })
                .then(getResults);
        });
    }
});

function dosomething(e) {
    if (e.keyCode == 13) {
        initialRequest();
    }
}

function initialRequest() {
    let value = searchBox.value;
    fetch(`${api.baseUrl}weather?q=${value}&units=metric&APPID=${api.key}`)
        .then((weather) => {
            return weather.json();
        })
        .then(getResults);
}

function getResults(data) {
    console.log(data);

    const mainDetail = document.querySelector(".today-weather-wrap");

    const temperature = mainDetail.querySelector(".main-temperature");
    temperature.innerHTML = `${Math.round(data.main.temp)}<span>&deg;C</span>`;

    const feelsLike = mainDetail.querySelector(".feels-like-temp");
    feelsLike.innerHTML = `Feels like ${Math.round(data.main.feels_like)}<span>&deg;C</span>`;

    const dayNightTemp = mainDetail.querySelector(".day-night-temp-container");
    dayNightTemp.innerHTML = `<span>Day ${Math.round(data.main.temp_max)}&deg;&uarr;</span> <span>Night ${Math.round(data.main.temp_min)}&deg;&darr;</span>`;

    const icon = mainDetail.querySelector(".icon img");
    icon.src = `${api.iconUrl}${data.weather[0].icon}@2x.png`;

    const iconDescription = mainDetail.querySelector(".icon-description");
    iconDescription.innerText = `${data.weather[0].description}`;

    searchBox.value = `${data.name}`;

    let latitude = data.coord.lat;
    let longitude = data.coord.lon;

    fetch(
        `${api.baseUrl}onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&units=metric&appid=${api.key}`)
        .then((fullWeather) => {
            return fullWeather.json();
        })
        .then((details) => {
            mainApiResult(details);
        });
}

function mainApiResult(details) {
    console.log(details);

    let now = new Date();
    let timeZone = details.timezone; //timezone will be same for one search result OR one city so only once declatarion
    const date = document.querySelector(".date-container");
    date.innerText = dateTimeBuilder(now, timeZone, 1);

    const currDetail = document.querySelectorAll(".current-details");
    currDetail[0].children[1].children[1].innerText = `${details.current.humidity} %`;
    currDetail[0].children[1].children[3].innerText = `${details.current.dew_point}°C`;
    currDetail[0].children[1].children[5].innerText = `${details.current.pressure} hPa`;
    currDetail[0].children[1].children[7].innerText = `---,${details.current.uvi}`;
    currDetail[0].children[1].children[9].innerText = `${details.daily[0].pop * 100} %`;
    currDetail[0].children[1].children[11].innerText = `${details.current.visibility / 1000} km`;

    currDetail[1].children[1].children[1].innerText = `${details.daily[1].humidity} %`;
    currDetail[1].children[1].children[3].innerText = `${details.daily[1].dew_point}°C`;
    currDetail[1].children[1].children[5].innerText = `${details.daily[1].pressure} hPa`;
    currDetail[1].children[1].children[7].innerText = `---,${details.daily[1].uvi}`;
    currDetail[1].children[1].children[9].innerText = `${Math.trunc(details.daily[1].pop * 100)} %`;

    //wind related

    const wind = document.querySelectorAll(".wind-box-wrap");
    wind[0].children[0].children[0].innerText = `${Math.round(details.current.wind_speed * 3.6)}`;
    wind[1].children[0].children[0].innerText = `${Math.round(details.daily[1].wind_speed * 3.6)}`;
    //wind direction calculation
    // wind.children[0].children[1].children[0].innerText = `${getCardinalDirection(details.current.wind_deg)}`;

    //sun rise&set detail
    let sunRise = new Date(details.current.sunrise * 1000);
    let sunSet = new Date(details.current.sunset * 1000);
    let diff = new Date(sunRise-sunSet);
    let sunRiseTom = new Date(details.daily[1].sunrise * 1000);
    let sunSetTom = new Date(details.daily[1].sunset * 1000);
    const sunTime = document.querySelectorAll(".sunrise-set-container");
    sunTime[0].children[0].children[1].innerText = `${sunRise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timeZone })}`;
    sunTime[0].children[1].children[1].innerText = `${sunSet.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timeZone })}`;
    sunTime[0].children[2].innerHTML = `Length of day: <span>${diff.getUTCHours()}:${diff.getMinutes()}</span>`
    
    sunTime[1].children[0].children[1].innerText = `${sunRiseTom.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timeZone })}`;
    sunTime[1].children[1].children[1].innerText = `${sunSetTom.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timeZone })}`;

    function tommorowMainTemp() {
        const tommorowDetail = document.querySelector('.tommorow-weather-wrap');

        let now = new Date(details.daily[1].dt * 1000);
        const date = tommorowDetail.querySelector(".date-container");
        date.innerText = dateTimeBuilder(now, timeZone, 2);

        const dayNightTemp = tommorowDetail.querySelector(".day-night-temp-container");
        dayNightTemp.innerHTML = `<span>Day ${Math.round(details.daily[1].temp.day)}&deg;&uarr;</span> <span>Night ${Math.round(details.daily[1].temp.night)}&deg;&darr;</span>`;

        const icon = tommorowDetail.querySelector(".icon img");
        icon.src = `${api.iconUrl}${details.daily[1].weather[0].icon}@2x.png`;

        const iconDescription = tommorowDetail.querySelector(".icon-description");
        iconDescription.innerText = `${details.daily[1].weather[0].description}`;
    }
    tommorowMainTemp();


    function eightDaysWeather() {
        const list = document.querySelectorAll('.lists');
        list.forEach((data, index) => {
            if (index == 0) {
                data.children[0].children[0].innerText = `Today`;
            }
            else {
                data.children[0].children[0].innerText = `${dateTimeBuilder((new Date(details.daily[index].dt * 1000)), timeZone, 2)}`;
            }
            data.children[0].children[1].innerText = `${details.daily[index].weather[0].description}`;

            data.children[1].children[0].children[0].innerText = `${Math.trunc(details.daily[index].pop * 100)} %`;
            data.children[1].children[0].children[1].src = `${api.iconUrl}${details.daily[index].weather[0].icon}@2x.png`;

            data.children[1].children[1].children[0].innerText = `${Math.trunc(details.daily[index].temp.max)} °C`;
            data.children[1].children[1].children[1].innerText = `${Math.trunc(details.daily[index].temp.min)} °C`;
            data.children[1].children[1].children[1].style.color = '#777';
        });

    }
    eightDaysWeather();

    function eightDaysWeatherInner() {

        listsWrap.forEach((list, index) => {  //listWrap is declared globally (see last)
            let sunRise = new Date(details.daily[index].sunrise*1000);
            let sunSet = new Date(details.daily[index].sunset*1000);
            let sunRiseText = sunRise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timeZone });
            let sunSetText = sunSet.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timeZone });
            let dropdownInner = `
      <div class="sub-details-8-days">
        <div class="title">Wind</div>
        <div class="title-detail">Light, ${Math.round(details.daily[index].wind_speed * 3.6)} km/h W</div>
        <div class="title">Humidity</div>
        <div class="title-detail">${details.daily[index].humidity} %</div>
        <div class="title">UV index</div>
        <div class="title-detail">---,${details.daily[index].uvi}</div>
        <div class="title">Chance of rain</div>
        <div class="title-detail">${Math.trunc(details.daily[index].pop * 100)} %</div>
        <div class="title">Sunrise/sunset</div>
        <div class="title-detail">${sunRiseText}, ${sunSetText}</div>
      </div>`;

            dropdown[index].innerHTML = dropdownInner;


        });
    }
    eightDaysWeatherInner();

}

function dateTimeBuilder(d, timezone, call) {
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getUTCDay()];
    let date = d.getUTCDate();
    let month = months[d.getUTCMonth()];
    // let year = d.getFullYear();

    // Time

    let time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timezone });

    if (call == 1) {
        return `${date} ${month}, ${time}`;
    }
    if (call == 2) {
        return `${day}, ${date} ${month}`;
    }
}

// function getCardinalDirection(angle) {
//     const directions = [
//         "↑ N",
//         "↗ NE",
//         "→ E",
//         "↘ SE",
//         "↓ S",
//         "↙ SW",
//         "← W",
//         "↖ NW",
//     ];
//     return directions[Math.round(angle / 45) % 8];
// }


const mainUl = document.querySelector(".main-ul");
const mainUlLi = document.querySelectorAll(".main-ul li");
const mainSlider = document.querySelector(".slider");
const slider = document.querySelectorAll(".slider .container");
let counter = 0;
const size = slider[0].clientWidth;
mainUlLi.forEach((list, index) => {
    list.addEventListener("click", () => {
        counter = index;
        slide();
    });
});

function slide() {
    mainSlider.style.transform = "translateX(" + -size * counter + "px)";
    document.querySelector('.main-ul .selected').classList.remove('selected');
    mainUl.children[counter].classList.add('selected');
}


const listsWrap = document.querySelectorAll('.lists-wrap');
const dropdown = document.querySelectorAll('.information');

listsWrap.forEach((list, index) => {

    list.addEventListener('click', () => {
        dropdown[index].classList.toggle('active');
    });
});
