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
  
  /* Function to GET data from web API OpenWeatherMap */
  const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
  const apiKey = '&appid=5797794e603dad693680b2137143003c';
  const units = '&units=imperial';
  
  const getWeather = async (baseURL, zip, key) => {
    const res = await fetch(baseURL + zip + units + key);
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
    const zip = document.getElementById('zip').value;
    getWeather(baseURL, zip, apiKey)
        .then((data) => {
          /* Build weather journal entry */
  
          // Get the current date
          // Create a new date instance dynamically with JS
          const d = new Date();
          const newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
  
          // Get the temperature
          const currentTemp = data.main.temp;
  
          // Get the user input
          const feelings = document.getElementById('feelings').value;
  
          // Post data to app
          postData('http://localhost:8081/', {
            temperature: currentTemp,
            date: newDate,
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
  