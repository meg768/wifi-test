var piWifi = require('pi-wifi');

piWifi.disconnect(function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Disconnected from network!');
});
