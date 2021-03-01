const express = require('express');
const app = express();
const listenPort = process.env.METRICS_PORT;
const prefix = process.env.METRICS_PREFIX;

const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://' + host + ':' + port, {
  clientId: process.env.MQTT_CLIENT_ID,
  clean: true,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD
});

console.log('Environment');
console.log(process.env);

console.log('Starting up...');

let state = {};
client.on('connect', function () {
  console.log('Connected to MQTT (' + host + ':' + port + ')');
  client.subscribe('#', function (err) {});
});

client.on('message', function (topic, message) {
  console.log('[' + (new Date()).toGMTString() + '] ' + topic);
  state[topic.replace(/\//gi,'_')] = message.toString().trim().replace(/\0.*$/g,'');;
});

app.get('/metrics', (request, response) => {
    let output = '';

    Object.keys(state).map(function (item) {
      output += (prefix + item + ' ' + state[item] + "\n");
    });

    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    console.log('[' + (new Date()).toGMTString() + '] ' + ip);

    response.send(output);
});

app.listen(listenPort, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${listenPort}`);
});

