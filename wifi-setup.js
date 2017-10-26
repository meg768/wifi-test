
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

            Promise.resolve().then(() => {
                return Promise.resolve(loadFile());
            })
            .then((config) => {
                if (config && isString(config.ssid)) {
                    this.emit('connecting');

                    return wifi.connectToNetwork(config.ssid, config.password, 30000).then(() => {
                        this.emit('connected');
                        return true;
                    })
                    .catch((error) => {
                        this.emit('disconnected');
                        return false;
                    })
                }
                else {
                    return wifi.getConnectionState();
                }
            })

            .then((connected) => {
                console.log('state', connected);
                if (!connected)
                    throw new Error('No network connection.');

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

setup.on('ready', () => {
    debug('ready!');
});


setup.setup('/boot/bluetooth/config.json').then(() => {
    debug('Done!');

})
.catch((error) => {
    debug('Upps!');
    debug(error);
})
