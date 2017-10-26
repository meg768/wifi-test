
var WiFi = require('./wifi-connection.js');
var isString = require('yow/is').isString;
var Events  = require('events');

class WifiSetup extends Events {

    constructor() {
        super();

    }

    setup(fileName) {
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
                //fs.unlinkSync(fileName);
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
                        this.emit('connecting');

                        console.log('Trying to connect to ', config.ssid);

                        return wifi.connectToNetwork(config.ssid, config.password).then(() => {
                            this.emit('connected');

                        });
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
                this.emit('done');
                resolve();
            })
            .catch((error) => {
                this.emit('error', error);
                reject(error);
            });

        });
    }

}

var setup = new WifiSetup();

setup.on('connecting', () => {
    console.log('connecting');
});

setup.on('done', () => {
    console.log('done!');
});

setup.on('connected', () => {
    console.log('connected!');
});

setup.on('error', (error) => {
    console.log('ERROR!!');
    console.log(error);
});


setup.setup('/boot/bluetooth/config.json').then(() => {
    console.log('Done!');

})
.catch((error) => {
    console.log('Upps!');
    console.log(error);
})
