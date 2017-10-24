var piWifi = require('pi-wifi');

piWifi.check('Julia', function(err, result) {
  if (err) {
    return console.error(err.message);
  }
  console.log(result);
});
