var piWifi = require('pi-wifi');

piWifi.listNetworks(function(err, networksArray) {
  if (err) {
    return console.error(err.message);
  }
  console.log(networksArray);
});
