var piWifi = require('pi-wifi');

piWifi.status('wlan0', function(err, status) {
  if (err) {
    return console.error(err.message);
  }
  console.log(status);
});
