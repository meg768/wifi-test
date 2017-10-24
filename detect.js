var piWifi = require('pi-wifi');

piWifi.detectSupplicant(function(err, iface, configFile) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Supplicant running in interface', iface, 'using the configuration file', configFile);
});
