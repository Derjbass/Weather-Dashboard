var searchedCity, cityObj, latLong;
var childDate, childIcon, childTemp, childWind, childHumid;
const currentTime = moment();

//to be able to for loop later
childDate = $('.fiveDDate');
childIcon = $('.icon');
childTemp = $('.fiveDTemp');
childWind = $('.fiveDWind');
childHumid = $('.fiveDHumid');


//search button listener
$('button').on('click', function(){
    searchedCity = $('input').val();
    $('#searchBox').append('<p>' + searchedCity + '</p>');
    $('#searchBox p').last().addClass('prevSearched');
    $('#city').text(searchedCity + currentTime.format(' (M/D/YYYY)'));
    fetchData(searchedCity);

})

//previous searches listener
$('#searchBox').on('click', 'p', function(event){
    $('#city').text(event.target.textContent + currentTime.format(' (M/D/YYYY)'));
    fetchData(event.target.textContent);
})

function fetchData(searchedCity){
    //api call for searched city to get lat and long
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchedCity + '&appid=641d616cc253f9aa5973a278385b686d')
    .then(function(response) { 
        return response.json()
      })
      //store lat/long from first call and fetch to get complete data
      .then(function(data) {   
        latLong = data.coord;
        return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latLong.lat + '&lon=' + latLong.lon +'&units=imperial&exclude={part}&appid=641d616cc253f9aa5973a278385b686d')
      })
      .then(function(response) { 
        return response.json(); 
      })
      .then(function(data) {
        //current temp
        $('#temp').text('Temp: '+ data.current.temp + '\xB0F');
        //current wind
        $('#wind').text('Wind: ' + data.current.wind_speed + ' MPH');
        //current humidity
        $('#humid').text('Humidity: ' + data.current.humidity + '%');
        //current UV Index
        $('#uvIndex').text(data.current.uvi);
        //change background color for UV Index
        if(parseFloat(data.current.uvi) <= 3){
            $('#uvIndex').attr('class', 'low')
        }else if (parseFloat(data.current.uvi) > 3 && parseFloat(data.current.uvi) <= 7) {
            $('#uvIndex').attr('class', 'moderate')
        }else{
            $('#uvIndex').attr('class', 'severe')
        }
        for(var i = 0; i < 5; i++){
            //add dates
            let date = moment().add(i+1, 'days');
            $(childDate[i]).text(date.format(' (M/D/YYYY)'))
            //add icons
            let iconCode = data.daily[i].weather[0].icon
            let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
            $(childIcon[i]).attr('src', iconURL);
            //add temp
            $(childTemp[i]).text('Temp: ' + data.daily[i].temp.max + '\xB0F');
            //add wind
            $(childWind[i]).text('Wind: ' + data.daily[i].wind_speed + ' MPH');
            //add humidity
            $(childHumid[i]).text('Humidity: ' + data.daily[i].humidity + '%');
        }
      })
      .catch(function(error) { 
      });
}