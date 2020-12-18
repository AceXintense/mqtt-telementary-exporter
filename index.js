const express = require('express');
const app = express();
const listenPort = 9102;
const prefix = 'mqtt_';

const host = '';
const port = 1883;

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://' + host + ':' + port);
let state = {
	xbox: {
		exhaust: { c: 0, f: 0},
		ambient: { c: 0, f: 0},
		delta: { c: 0, f: 0},
	}
};

client.on('connect', function () {
  client.subscribe('xbox/exhaust/c', function (err) {});
  client.subscribe('xbox/exhaust/f', function (err) {});
  client.subscribe('xbox/ambient/c', function (err) {});
  client.subscribe('xbox/ambient/f', function (err) {});
  client.subscribe('xbox/delta/c', function (err) {});
  client.subscribe('xbox/delta/f', function (err) {});
});

client.on('message', function (topic, message) {
  let location = topic.split('/');
  state[location[0]][location[1]][location[2]] = message.toString().trim().replace(/\0.*$/g,'');
  console.log(location, state[location[0]][location[1]][location[2]]);

});

app.get('/metrics', (request, response) => {
    let main = '';
    let strings = [
	{xbox_exhust_c: state.xbox.exhaust.c},
	{xbox_exhust_f: state.xbox.exhaust.f},
	{xbox_ambient_c: state.xbox.ambient.c},
	{xbox_ambient_f: state.xbox.ambient.f},
	{xbox_delta_c: state.xbox.delta.c},
	{xbox_ambient_f: state.xbox.delta.f},
    ];

    console.log(Object.keys(state));

    strings.map((object) => {
        main += prefix + Object.keys(object)[0] + ' ' + Object.values(object)[0] + '\n';
    });

    response.send(main);
});

app.listen(listenPort, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${listenPort}`);
});

