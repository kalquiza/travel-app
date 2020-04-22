/* Function to POST data to application */
const postData = async (url = '', data = {}) => {
    console.log(data);
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
  const rows = `&maxRows=${maxRows}`
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

  /* Add event listener to generate new entry */
  document.getElementById('generate').addEventListener('click', performAction);
  
  // eslint-disable-next-line require-jsdoc
  function performAction(e) {
    const city = document.getElementById('city').value;
    const departureDate = document.getElementById('departure-date').valueAsDate;

    // TODO: Get departure date from form field
    getDestination(GeoNamesBaseURL, city, rows, user)
        .then((data) => {
          /* Build travel planner entry */
          
          const city = data.geonames[0].name;
          const country = data.geonames[0].countryName;

          // Geonames destination data
          console.log(data);

          // Determine days away countdown
          const _second = 1000;
          const _minute = _second * 60;
          const _hour = _minute * 60;
          const _day = _hour * 24;

          // Get the current date
          const currentDate = new Date();

          const countdown = departureDate - currentDate;
          const days = Math.floor(countdown / _day) + 1;

          console.log(`Current Date: ${currentDate}`);
          console.log(`Departure Date: ${departureDate}`);
          console.log(`Countdown: ${days} Days until ${city}, ${country}`);

          // Determine weatherbit api request parameters

          // start_day, end_day
          const endDate = new Date(departureDate);
          endDate.setDate(endDate.getDate() + 1);
          const startDay = (departureDate.getUTCMonth()+1) + '-' + departureDate.getUTCDate();
          const endDay = (endDate.getUTCMonth()+1) + '-' + endDate.getUTCDate();

          console.log(`${weatherBitBaseURL}lat=${data.geonames[0].lat}&lon=${data.geonames[0].lng}&start_day=${startDay}&end_day=${endDay}&units=i&tp=daily&key=${weatherBitApiKey}`);

          getClimateNormals(weatherBitBaseURL,data.geonames[0].lat, data.geonames[0].lng, startDay, endDay, weatherBitApiKey)
            .then((data) => {
              console.log(data);

              getDestinationImage(pixabayBaseURL, pixabayApiKey, city)
              .then((data) => {
                console.log(data);

                postData('http://localhost:8081/', {
                  // TODO: Format application data
                  temperature: null,
                  date: countdown,
                  feelings: feelings,
                }).then(
                  updateUI(),
                  (error) => {
                    console.log('error', error); // postData
                  });
                
              }, (error) => {
                console.log('error', error); // getDestinationImage
              });

            }, (error) => {
              console.log('error', error); // getClimateNormals
            });

          // TODO: Determine typical weather for departure day
          //const currentTemp = data.main.temp;
  
          // Get the user input
          //const feelings = document.getElementById('feelings').value;
  
          // Post data to app
 

        }, (error) => {
          console.log('error', error);
        });
  }
  
  const updateUI = async () => {
    const request = await fetch('http://localhost:8081/all');
    try {
      const allData = await request.json();
      document.getElementById('date').innerHTML = allData[Object.keys(allData).length - 1].date;
      document.getElementById('temp').innerHTML = allData[Object.keys(allData).length - 1].temperature;
      document.getElementById('content').innerHTML = allData[Object.keys(allData).length - 1].feelings;
    } catch (error) {
      console.log('error', error);
    }
  };
  