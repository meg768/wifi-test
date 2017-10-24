var piWifi = require('pi-wifi');

piWifi.scan(function(err, networks) {
  if (err) {
    return console.error(err.message);
  }
  console.log(networks);
});
