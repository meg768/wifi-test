
var ifconfig = require('wireless-tools/ifconfig');

ifconfig.status("wlan0", function(err, status) {
  console.log(status);
});
