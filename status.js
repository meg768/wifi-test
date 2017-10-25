var Wpa_Cli = require('./wpa_cli.js');
var wpa_cli = new Wpa_Cli('wlan0');

wpa_cli.status().then((output) => {
    console.log(output);
})
.catch((error) => {
    console.log(error);
});
