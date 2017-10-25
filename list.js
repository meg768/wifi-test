var piWifi = require('pi-wifi');

piWifi.listNetworks(function(err, networksArray) {
  if (err) {
    return console.error(err.message);
  }
  console.log(networksArray);
});

var Wpa_Cli = require('./wpa_cli.js');
var wpa_cli = new Wpa_Cli('wlan0');

wpa_cli.list_networks().then((output) => {
    console.log(output);
})
.catch((error) => {
    console.log(error);
});
