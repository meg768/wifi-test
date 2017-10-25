var piWifi = require('pi-wifi');

var wpa_cli = require('./wpa_cli.js');

var wpa = new wpa_cli('wlan0');

wpa.status().then(() => {

})
.catch((error) => {
    console.log(error);
});
/*
piWifi.status('wlan0', function(err, status) {
  if (err) {
    return console.error(err.message);
  }
  console.log(status);
});

*/
