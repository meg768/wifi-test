var piWifi = require('pi-wifi');

var networkDetails = {
  ssid: 'Julia',
  password: 'potatismosX'
};

//A simple connection
piWifi.connectTo(networkDetails, function(err) {
  if (!err) { //Network created correctly
    setTimeout(function () {
      piWifi.check(networkDetails.ssid, function (err, status) {
          console.log('status', status);
        if (!err && status.connected) {
          console.log('Connected to the network ' + networkDetails.ssid + '!');
        } else {
          console.log('Unable to connect to the network ' + networkDetails.ssid + '!');
        }
      });
    }, 2000);
  } else {
    console.log('Unable to create the network ' + ssid + '.');
  }
});

/*

var wpa_supplicant = require('wireless-tools/wpa_supplicant');

var options = {
  interface: 'wlan0',
  ssid: 'Romeo',
  passphrase: 'potatismos',
  driver: 'wext'
};

wpa_supplicant.enable(options, function(err) {
    console.log('Done!');
    console.log(err);
  // connected to the wireless network
});
*/
