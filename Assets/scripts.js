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


function getCityInputValue() {
    return cityInputElement.val();
}

function clearCity() {
    cityInputElement.val("");
}

function createSearchHistoryButton() {
    var btn = $("<button>");
    btn.attr("class", "m-1 search-history-button");
    btn.attr("id", "search-history-btn-" + searchHistoryId);
    btn.attr("value", getCityInputValue());
    btn.text(getCityInputValue());

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
        card.attr("class", "card m-1 p-1")
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
    btnId.remove();
}

function clearErrorMessage() {
    errorMessageElement.text("");
}

function renderData(response) {
    city.text("City: " + (response.name) + "-" + (moment().utc(response.dt).format("MM/DD/YYYY")));
    temperature.text("Temperature: " + response.main.temp + "°F")
    humidity.text("Humidity: " + response.main.humidity + "%")
    windSpeed.text("Wind Speed: " + response.wind.speed + "MPH")
    uvIndex.text("UV Index: TBD")
}

function renderForecastData(response) {
    clearForecast()
    createForecastElements(response);
    console.log("YAY!")
}



function getCityWeather() {
    var apiKey = "&appid=8193a135ed65b0037f8b962f08134b54";
    var baseUrl = "https://api.openweathermap.org/data/2.5/weather?"

    var cityParameter = "q=" + getCityInputValue();
    var temperatureUnit = "&units=imperial"

    var endpointURL = (baseUrl + cityParameter + temperatureUnit + apiKey);

    $.ajax({
        type: 'get',
        timeout: 5000,
        url: endpointURL,
    }).done(function(response) {
        clearErrorMessage();
        createSearchHistoryButton();
        renderData(response);
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

