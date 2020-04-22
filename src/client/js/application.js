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
  const baseURL = 'http://api.geonames.org/searchJSON?q=';
  const rows = `&maxRows=${maxRows}`
  const user = '&username=kalquiza';
  
  const getDestination = async (baseURL, city, rows, user) => {
    const res = await fetch(baseURL + city + rows + user);
    try {
      const data = await res.json();
      return data;
    } catch (error) {
      console.log('error', error);
    }
  };
  
/* Function to GET data from web API Weatherbit*/

/* Function to GET data from web API Pixabay*/

  /* Add event listener to generate new entry */
  document.getElementById('generate').addEventListener('click', performAction);
  
  // eslint-disable-next-line require-jsdoc
  function performAction(e) {
    const city = document.getElementById('city').value;
    const departureDate = document.getElementById('departure-date').valueAsDate;

    // TODO: Get departure date from form field
    getDestination(baseURL, city, rows, user)
        .then((data) => {
          /* Build travel planner entry */
  
          // Determine days away countdown

          // Get the current date
          // Create a new date instance dynamically with JS
          const currentDate = new Date();
  
          const _second = 1000;
          const _minute = _second * 60;
          const _hour = _minute * 60;
          const _day = _hour * 24;
   
          console.log(`Current Date: ${currentDate}`);
          console.log(`Departure Date: ${departureDate}`);

          const countdown = departureDate - currentDate;
          const days = Math.floor(countdown / _day) + 1;

          console.log(`Countdown: ${days} Days`);

          console.log(data);
          console.log(data.geonames[0].name);
          console.log(data.geonames[0].countryName);

          // TODO: Determine typical weather for departure day
          //const currentTemp = data.main.temp;
  
          // Get the user input
          //const feelings = document.getElementById('feelings').value;
  
          // Post data to app
          postData('http://localhost:8081/', {
            // TODO: Format application data
            temperature: null,
            date: countdown,
            feelings: feelings,
          }).then(
              updateUI(),
              (error) => {
                console.log('error', error);
              });
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
  