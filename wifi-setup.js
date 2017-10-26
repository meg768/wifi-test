
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
                fs.unlinkSync(fileName);
            }
            catch(error) {
                debug(error);
            }

        }

        var wifi = new WiFi();

        Promise.resolve().then(() => {
            return Promise.resolve(loadFile());
        })

        .then((config) => {
            if (config && isString(config.ssid)) {
                this.emit('working');

                return wifi.connectToNetwork(config.ssid, config.password, 30000).then(() => {
                    return true;
                })
                .catch((error) => {
                    return false;
                })
            }
            else {
                return wifi.getConnectionState();
            }
        })

        .then((connected) => {
            if (!connected)
                throw new Error('No wi-fi connection.');

            this.emit('ready');
        })
        .catch((error) => {
            this.emit('error', error);
        })
        .then(() => {
            deleteFile();
        })

    }

}

var setup = new WifiSetup();

setup.on('working', () => {
    debug('working');
});

setup.on('ready', (connection) => {
    debug('ready!');
});

setup.on('error', (error) => {
    console.log(error);
    debug('error!');
});


setup.setup('/boot/bluetooth/config.json');
