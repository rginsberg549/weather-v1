var searchCityBtn = $("#search-city");
var clearCityBtn = $("#clear-city");

var cityInputElement = $("#city-input");
var searchHistoryElement = $("#search-history");
var errorMessageElement = $(".error-message");

var city = $(".city");
var temperature = $(".temperature");
var humidity = $(".humidity");
var windSpeed = $(".wind-speed");
var uvIndex = $(".uv-index");

var forecastElement = $("#forecast");

var searchHistoryId = 0;

var searchHistoryArray = [];


function getCityInputValue() {
    var citySearchValue = cityInputElement.val()
    return citySearchValue;
}

function clearCity() {
    cityInputElement.val("");
}

function createSearchHistoryButton() {

    var cityValue = getCityInputValue();
    if (searchHistoryArray.includes(cityValue)) {
        return;
    }

    searchHistoryArray.push(cityValue);

    var btn = $("<button>");
    btn.attr("class", "m-1 search-history-button");
    btn.attr("id", "search-history-btn-" + searchHistoryId);
    btn.attr("value", cityValue);
    btn.text(cityValue);

    var span = $("<span>");
    span.attr("class", "clear-search-history");
    span.attr("id", searchHistoryId);
    searchHistoryId += 1;
    span.html("&times;");
    span.on("click", removeSearchHistoryButton)

    btn.append(span);
    btn.on("click", getSearchHistoryButtonValue);

    searchHistoryElement.append(btn);
}

function createForecastElements(response) {

    for (let index = 0; index < 5; index++) {
        var card = $("<div>")
        card.attr("class", "card m-1 p-1 col-sm align-items-center")
        card.attr("id", "card-" + index);
        
        var date = $("<p>");
        date.text(moment().utc(response.list[index].dt).add(index + 1, 'days').format("MM/DD/YYYY"));

        var icon = $("<img>");
        icon.attr("class", "weather-icon");
        icon.attr("src", "http://openweathermap.org/img/wn/" + response.list[index].weather[0].icon +  "@2x.png")

        var temperature = $("<p>");
        temperature.text("Temp: " + response.list[index].main.temp + "°F");

        var humidity = $("<p>");
        humidity.text("Humidity: " + response.list[index].main.humidity + "%");

        card.append(date, icon, temperature, humidity);
        forecastElement.append(card);
    }  
}

function clearForecast() {
    forecastElement.empty();
}

function getSearchHistoryButtonValue() {
    var historyButtonValue = $(this).val();
    cityInputElement.val(historyButtonValue);
    getCityWeather();
}

function removeSearchHistoryButton() {
    var btnId = $("#search-history-btn-" + $(this).attr("id"));

    var idx = searchHistoryArray.indexOf(btnId.val());

    if (idx > -1) {
        console.log(searchHistoryArray);
        searchHistoryArray.splice(idx, 1);
        console.log(searchHistoryArray);
    }

    btnId.remove();
    
}

function clearErrorMessage() {
    errorMessageElement.text("");
}

function renderData(response) {
    city.text("City: " + (response.name) + "-" + (moment().utc(response.dt).format("MM/DD/YYYY")));
    temperature.text("Temperature: " + response.main.temp + "°F");
    humidity.text("Humidity: " + response.main.humidity + "%");
    windSpeed.text("Wind Speed: " + response.wind.speed + "MPH");
    getUVIndex(response).then(function(val) {
        uvIndex.text("UV Index: " + val)
    });
}

function renderForecastData(response) {
    clearForecast()
    createForecastElements(response);
}

function getUVIndex(response) {
    var apiKey = "&appid=8193a135ed65b0037f8b962f08134b54";
    var lat = "lat=" + response.coord.lat;
    var lon = "&lon=" + response.coord.lon;

    var baseUrl = "https://api.openweathermap.org/data/2.5/uvi?"

    var endpointURL = baseUrl + lat + lon + apiKey;

    return $.ajax({
        type: 'get',
        timeout: 5000,
        url: endpointURL
    }).then(function(response) {
        return response.value
    })
}

function getCityWeather() {
    var apiKey = "&appid=8193a135ed65b0037f8b962f08134b54";
    var baseUrl = "https://api.openweathermap.org/data/2.5/weather?"

    var cityParameter = "q=" + getCityInputValue();
    var temperatureUnit = "&units=imperial"

    var endpointURL = (baseUrl + cityParameter + temperatureUnit + apiKey);
    console.log(endpointURL);

    $.ajax({
        type: 'get',
        timeout: 5000,
        url: endpointURL,
    }).done(function(response) {
        clearErrorMessage();
        renderData(response);
        createSearchHistoryButton();
        getForecastWeather()
    }).fail(function() {
        errorMessageElement.text("Please enter a valid city");
    })
}

function getForecastWeather() {
    var apiKey = "&appid=8193a135ed65b0037f8b962f08134b54";
    var baseUrl = "https://api.openweathermap.org/data/2.5/forecast?"

    var cityParameter = "q=" + getCityInputValue();
    var temperatureUnit = "&units=imperial"

    var endpointURL = (baseUrl + cityParameter + temperatureUnit + apiKey);
    console.log(endpointURL);

    $.ajax({
        type: 'get',
        timeout: 5000,
        url: endpointURL,
    }).done(function(response) {
        clearForecast()
        createForecastElements(response);
    }).fail(function() {
        errorMessageElement.text("Please enter a valid city");
    })
}

searchCityBtn.on("click", getCityWeather);