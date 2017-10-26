
var WiFi = require('./wifi.js');
 
function install(fileName) {
    var fs = require('fs');

    function loadFile() {
        try {
            return JSON.parse(fs.readFileSync(fileName));
        }
        catch(error) {
            console.log(error);
        }
    }

    function deleteFile() {
        try {
            fs.unlinkSync(fileName);
        }
        catch(error) {
            console.log(error);
        }

    }

    return new Promise((resolve, reject) => {
        var wifi = new WiFi();

        wifi.getConnectionState().then((connected) => {
            if (!connected) {
                console.log('Not connected, trying to connect');

                var config = loadFile();

                if (config && isString(config.ssid)) {
                    console.log('Trying to connect to ', config.ssid);
                    return wifi.connectToNetwork(config.ssid, config.password);
                }
                else {
                    console.log('No network credentials in config file.');
                    return Promise.resolve();
                }
            }
            else {
                console.log('Already connected!');
                return Promise.resolve();
            }
        })
        .then(() => {
            deleteFile();
            resolve();
        })
        .catch((error) => {
            reject(error);
        });

    });
}


install('/boot/bluetooth/config.json').then(() => {
    console.log('Done!');

})
.catch((error) => {
    console.log('Upps!');
    console.log(error);
})
