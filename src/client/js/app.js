/* eslint-disable max-len */
/* Function to POST data to application */
const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
    },
    // body data type must match "Content-Type" header
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log('error', error);
  }
};

/* Function to GET data from web API GeoNames */
const maxRows = 1;
const GeoNamesBaseURL = 'http://api.geonames.org/searchJSON?q=';
const rows = `&maxRows=${maxRows}`;
const user = '&username=kalquiza';

const getDestination = async (GeoNamesBaseURL, city, rows, user) => {
  const res = await fetch(GeoNamesBaseURL + city + rows + user);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

/* Function to GET data from web API Weatherbit*/
const weatherBitBaseURL = 'https://api.weatherbit.io/v2.0/normals?';
const weatherBitApiKey = '7a6d0799b5e440c58fcfa254e7630cc8';

const getClimateNormals = async (weatherBitBaseURL, lat, lon, start, end, weatherBitApiKey) => {
  const res = await fetch(`${weatherBitBaseURL}lat=${lat}&lon=${lon}&start_day=${start}&end_day=${end}&units=i&tp=daily&key=${weatherBitApiKey}`);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

/* Function to GET data from web API Pixabay*/
const pixabayBaseURL = 'https://pixabay.com/api/';
const pixabayApiKey = '16127186-7e85907c44b053167dd566e1d';

const getDestinationImage = async (pixabayBaseURL, pixabayApiKey, destination) => {
  const res = await fetch(`${pixabayBaseURL}?key=${pixabayApiKey}&q=${destination}&image_type=photo&pretty=true&order=popular&safesearch=true`);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

// eslint-disable-next-line require-jsdoc
function performAction(e) {
  const destination = document.getElementById('destination-input').value;
  const departureDateUTC = document.getElementById('departure-input').valueAsDate;
  const returnDateUTC = document.getElementById('return-input').valueAsDate;

  // Get destination info from Geonames API
  getDestination(GeoNamesBaseURL, destination, rows, user)
      .then((data) => {
        /* Build travel planner entry */
        const city = data.geonames[0].name;
        const country = data.geonames[0].countryName;

        // Determine days away countdown
        const _second = 1000;
        const _minute = _second * 60;
        const _hour = _minute * 60;
        const _day = _hour * 24;

        // Get the current date
        const currentDate = new Date();

        // Convert from utc to local
        const departureDate = new Date(departureDateUTC.getUTCFullYear(), departureDateUTC.getUTCMonth(), departureDateUTC.getUTCDate());
        const returnDate = new Date(returnDateUTC.getUTCFullYear(), returnDateUTC.getUTCMonth(), returnDateUTC.getUTCDate());

        // Match time for countdown calculation
        departureDate.setHours(currentDate.getHours());
        departureDate.setMinutes(currentDate.getMinutes());
        departureDate.setSeconds(currentDate.getSeconds());
        departureDate.setMilliseconds(currentDate.getMilliseconds());

        returnDate.setHours(currentDate.getHours());
        returnDate.setMinutes(currentDate.getMinutes());
        returnDate.setSeconds(currentDate.getSeconds());
        returnDate.setMilliseconds(currentDate.getMilliseconds());


        const countdown = departureDate - currentDate;
        const countdownDays = Math.floor(countdown / _day);

        const tripLength = returnDate - departureDate;
        const tripLengthDays = Math.floor(tripLength / _day);

        // Determine weatherbit api request parameters

        const endDate = new Date(departureDate);
        endDate.setDate(endDate.getDate() + 1);
        const startDay = (departureDate.getMonth()+1) + '-' + departureDate.getDate();
        const endDay = (endDate.getMonth()+1) + '-' + endDate.getDate();
        const depDate = departureDate.getFullYear() + '-' + (departureDate.getMonth()+1) + '-' + departureDate.getDate();
        const repDate = returnDate.getFullYear() + '-' + (returnDate.getMonth()+1) + '-' + returnDate.getDate();

        // Get weather from WeatherBit API
        getClimateNormals(weatherBitBaseURL, data.geonames[0].lat, data.geonames[0].lng, startDay, endDay, weatherBitApiKey)
            .then((data) => {
              const avgTemp = data.data[0].temp;
              const minTemp = data.data[0].min_temp;
              const maxTemp = data.data[0].max_temp;

              // Determine pixabay api request parameters
              const cityFormatted = city.replace(' ', '+');

              // Get destination image from Pixabay API
              getDestinationImage(pixabayBaseURL, pixabayApiKey, cityFormatted)
                  .then((data) => {
                    let imageUrl = 'https://pixabay.com/get/5ee4d4474e53b10ff3d8992cc62e367c123ed6e34e507441722879d4934ec6_640.jpg';
                    if (parseInt(data.total) > 0) {
                      imageUrl = data.hits[0].webformatURL;
                    }
                    // Post data to the server
                    postData('http://localhost:8081/', {
                      city: city,
                      country: country,
                      depart: depDate,
                      return: repDate,
                      countdown: countdownDays,
                      tripLength: tripLengthDays,
                      avgTemp: avgTemp,
                      minTemp: minTemp,
                      maxTemp: maxTemp,
                      imageUrl: imageUrl,
                    }).then((data) => {
                      // Update the view
                      updateUI();
                    }, (error) => {
                      console.log('error', error); // postData
                    });
                  }, (error) => {
                    console.log('error', error); // getDestinationImage
                  });
            }, (error) => {
              console.log('error', error); // getClimateNormals
            });
      }, (error) => {
        console.log('error', error);
      });
  e.preventDefault();
}

const updateUI = async () => {
  const request = await fetch('http://localhost:8081/all');
  try {
    const allData = await request.json();
    console.log(allData);
    const key = Object.keys(allData).length-1;
    document.getElementById('countdown').innerHTML = `${allData[key].city}, ${allData[key].country} is ${allData[key].countdown} days away`;
    document.getElementById('tripLength').innerHTML = `Length of stay: ${allData[key].tripLength} days`;
    document.getElementById('weather-title').innerHTML = `Typical weather for then is:`;
    document.getElementById('avgTemp').innerHTML = `Average: ${allData[key].avgTemp}&deg F`;
    document.getElementById('hiLoTemp').innerHTML = `High: ${allData[key].maxTemp}&deg F, Low: ${allData[key].minTemp}&deg F`;
    document.getElementById('destination-img').src = allData[key].imageUrl;
  } catch (error) {
    console.log('error', error);
  }
};

export {performAction};
export {postData};
export {getDestination};
export {getClimateNormals};
export {getDestinationImage};

