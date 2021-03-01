const express = require('express');
const app = express();
const listenPort = process.env.METRICS_PORT;
const prefix = process.env.METRICS_PREFIX;

const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://' + process.env.MQTT_HOST + ':' + process.env.MQTT_PORT, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
});
let state = {};

client.on('connect', function () {
  client.subscribe('#', function (err) {});
});

client.on('message', function (topic, message) {
  state[topic.replace(/\//gi,'_')] = message.toString().trim().replace(/\0.*$/g,'');;
});

app.get('/metrics', (request, response) => {
    let output = '';

    Object.keys(state).map(function (item) {
      output += (prefix + item + ' ' + state[item] + "\n");
    });

    response.send(output);
});

app.listen(listenPort, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${listenPort}`);
});

