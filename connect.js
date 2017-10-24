var wpa_supplicant = require('wireless-tools/wpa_supplicant');

var options = {
  interface: 'wlan0',
  ssid: 'Romeo',
  passphrase: 'potatismos',
  driver: 'nl80211'
};

wpa_supplicant.enable(options, function(err) {
    console.log('Done!');
    console.log(err);
  // connected to the wireless network
});
