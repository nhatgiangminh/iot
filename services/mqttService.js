const mqtt = require('mqtt');

const options = {
  host: '6b7cae41985344b29aec77c29918cc12.s2.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'iotproject',
  password: '12345678',
};

const client = mqtt.connect(options);

module.exports = client;
