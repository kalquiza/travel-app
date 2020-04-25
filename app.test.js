/* eslint-disable max-len */
import {postData} from './src/client/js/app';
import {getDestination} from './src/client/js/app';
import {getClimateNormals} from './src/client/js/app';
import {getDestinationImage} from './src/client/js/app';

test('Post data to server', () => {
  const res = postData('http://localhost:8081/', {
    city: 'Kyoto',
    country: 'Japan',
    depart: '2020-4-29',
    return: '2020-4-30',
    countdown: 4,
    tripLength: 1,
    avgTemp: 59.9,
    minTemp: 50.2,
    maxTemp: 71.4,
    imageUrl: 'https://pixabay.com/get/52e9d1414252a514f1dc84609629317f1738dfed554c704c7d2873d49148cc58_640.jpg',
  });
  expect(res).toMatchObject({});
});

test('Get Destination', () => {
  const maxRows = 1;
  const GeoNamesBaseURL = 'http://api.geonames.org/searchJSON?q=';
  const rows = `&maxRows=${maxRows}`;
  const user = '&username=kalquiza';
  const city = 'Tokyo';
  const data = getDestination(GeoNamesBaseURL, city, rows, user);
  expect(data).toMatchObject({});
});

test('Get Climate Normals', () => {
  const weatherBitBaseURL = 'https://api.weatherbit.io/v2.0/normals?';
  const weatherBitApiKey = '7a6d0799b5e440c58fcfa254e7630cc8';
  const lat = 35.02107;
  const lng = 135.75385;
  const startDay = '5-31';
  const endDay = '6-1';
  const data = getClimateNormals(weatherBitBaseURL, lat, lng, startDay, endDay, weatherBitApiKey);
  expect(data).toMatchObject({});
});

test('Get Destination Image', () => {
  const pixabayBaseURL = 'https://pixabay.com/api/';
  const pixabayApiKey = '16127186-7e85907c44b053167dd566e1d';
  const cityFormatted = 'Tokyo';
  const data = getDestinationImage(pixabayBaseURL, pixabayApiKey, cityFormatted);
  expect(data).toMatchObject({});
});
