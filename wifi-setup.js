
var WiFi = require('./wifi-connection.js');
var isString = require('yow/is').isString;
var Events  = require('events');

function debug() {
    console.log.apply(this, arguments);
}

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
                debug(error);
            }
        }

        function deleteFile() {
            try {
                //fs.unlinkSync(fileName);
            }
            catch(error) {
                debug(error);
            }

        }

        return new Promise((resolve, reject) => {
            var wifi = new WiFi();

            wifi.getConnectionState().then((connected) => {
                if (!connected) {
                    var config = loadFile();

                    if (config && isString(config.ssid)) {
                        this.emit('connecting');

                        return wifi.connectToNetwork(config.ssid, config.password, 30000).then(() => {
                            this.emit('connected');
                        })
                        .catch((error) => {
                            this.emit('disconnected');
                        })
                    }
                    else {
                        return Promise.resolve();
                    }
                }
                else {
                    return Promise.resolve();
                }
            })
            .then(() => {
                return wifi.getConnectionState();
            });
            .then((connected) => {

                if (!connected)
                    throw new Error('Could not connect.');

                resolve();
            })
            .catch((error) => {
                reject(error);
            })
            .then(() => {
                deleteFile();
            })

        });
    }

}

var setup = new WifiSetup();

setup.on('connecting', () => {
    debug('connecting');
});

setup.on('connected', () => {
    debug('connected!');
});

setup.on('disconnected', () => {
    debug('disconnected!');
});



setup.setup('/boot/bluetooth/config.json').then(() => {
    debug('Done!');

})
.catch((error) => {
    debug('Upps!');
    debug(error);
})
