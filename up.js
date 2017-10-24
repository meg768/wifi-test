var ifconfig = require('wireless-tools/ifconfig');

ifconfig.up('wlan0', function(err) {
    console.log('Done');
    console.log(err);
  // the interface is down
});
