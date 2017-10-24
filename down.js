var piWifi = require('pi-wifi');

piWifi.interfaceDown('wlan0', function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Interface dropped succesfully!');
});
