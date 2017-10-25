

var wpa_cli = require('wireless-tools/wpa_cli');

wpa_cli.select_network('wlan0', 0, function(err, data){
    if (err) {
        // most likely the set values for the specified id are wrong
        console.dir(err);
    } else {
        // successfully connected to the new network
        console.dir(data);
    }
});
