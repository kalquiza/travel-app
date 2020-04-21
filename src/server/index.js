const path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

const app = express()
app.use(cors())
// to use json
app.use(bodyParser.json())
// to use url encoded values
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    // res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

// GET test tesponse from mock api
app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

// GET Route
app.get('/all', (req, res) => {
    res.send(projectData);
  });
  
// Setup empty JS object to act as endpoint for all routes
projectData = {};
let entries = 0;

// POST Route
app.post('/', (req, res) => {
newEntry = {
    temperature: req.body.temperature,
    date: req.body.date,
    feelings: req.body.feelings,
};

projectData[entries] = newEntry;
entries++;
console.log(projectData);
},
);
