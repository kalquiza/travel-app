# Travel Planner Application

Planning a trip? This simple travel planner application is here to help you prepare for your next trip!

A simple form will take in a location, departure date, and return date from the user. With this information the application will return trip information. This includes a countdown, length of stay, weather predictions, and an image of the destination. Yes this application is basic, but serves to demonstrate an ability to build an application with many moving parts which rely on each other to work. As we pull data from different APIs it is necessary to ochrestrate the logic flow so that everything comes together seamlessly.

# API

In this project we will be pulling data from the following APIs:
- [GeoNames](http://www.geonames.org/) - Geographical Database
- [WeatherBit](https://www.weatherbit.io/) - Weather Data API
- [Pixabay](https://pixabay.com/) - Stock Photography
  
# Getting started
Clone or download the project. In your project directory you will still need to install everything:

This project uses webpack, a static module bundler, which allows us manage assets and combine them into fewer files.

`cd` into your new folder and run:
`npm install`

## Building and Running the Application
To build the application in production mode run:

```npm run build```

To build the application in development mode run:

```npm run dev```

## Running the Server
For the application to run properly the backend express server must be running. To start the express server run:

``` npm start ```

## Testing
Support for testing is included with the Jest framework. Basic examples are provided. To run test files, denoted by the filename ```test.js```, run:

```npm run test```
