

var sprintf = require('yow/sprintf');
var child_process = require('child_process');


class WiFi {

    constructor(iface = 'wlan0') {
        this.iface = iface;
    }


    wpa_cli(command, pattern) {

        return new Promise((resolve, reject) => {

            console.log(command);

            child_process.exec(sprintf('wpa_cli -i %s %s', this.iface, command), (error, stdout, stderr) => {
                if (error)
                    reject(error);
                else {
                    var output = stdout.trim();

                    if (pattern) {
                        var match = output.match(pattern);

                        console.log('Matching', pattern, output, match);

                        if (match) {
                            if (match[1])
                                resolve(match[1]);
                            else
                                resolve();
                        }
                        else
                            reject(new Error(sprintf('Could not parse reply from wpa_cli: "%s"', output)));

                    }
                    else {
                        resolve(output);
                    }
                }
            });
        });
    }

    addNetwork() {
        console.log('Adding network...');
        return this.wpa_cli('add_network', '^([0-9]+)');
    }

    selectNetwork(id) {
        console.log(sprintf('Selecting network %d...', id));
        return this.wpa_cli(sprintf('select_network %s', id), '^OK');
    }

    connectToNetwork(ssid, password) {
        return new Promise((resolve, reject) => {

            var networkID = undefined;

            this.removeAllNetworks().then(() => {
                return this.addNetwork();
            })
            .then((id) => {
                console.log('Network created:', id);
                networkID = parseInt(id);
                return Promise.resolve();
            })
            .then(() => {
                return this.setNetworkVariable(networkID, 'ssid', ssid);
            })
            .then(() => {
                if (password != undefined)
                    return this.setNetworkVariable(networkID, 'psk', password);
                else
                    return Promise.resolve();
            })
            .then(() => {
                return this.selectNetwork(networkID);
            })
            .catch((error) => {
                reject(error);
            })
        });


    }

    setNetworkVariable(id, name, value) {
        console.log(sprintf('Setting variable %s=%s for network %d.', name, value, id));
        return this.wpa_cli(sprintf('set_network %d %s \'"%s"\'', id, name, value), '^OK');
    }

    removeAllNetworks() {
        console.log('Removing all networks...');

        return new Promise((resolve, reject) => {
            this.getNetworks().then((networks) => {
                var promise = Promise.resolve();

                networks.forEach((network) => {
                    promise = promise.then(() => {
                        return this.removeNetwork(network.id);
                    });
                });

                promise.then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
            });
        });

    }

    removeNetwork(id) {
        this.wpa_cli(sprintf('remove_network %d', id), '^OK');
    }

    getNetworkStatus() {
        return new Promise((resolve, reject) => {

            this.wpa_cli('status').then((output) => {

                var match;
                var status = {};

                if ((match = output.match(/[^b]ssid=([^\n]+)/))) {
                    status.ssid = match[1];
                }

                if ((match = output.match(/wpa_state=([^\s]+)/))) {
                    status.wpa_state = match[1];
                }

                if ((match = output.match(/ip_address=([^\n]+)/))) {
                    status.ip_address = match[1];
                }

                resolve(status);
            })
            .catch((error) => {
                reject(error);
            })
        });

    }

    getNetworks() {
        return new Promise((resolve, reject) => {

            this.wpa_cli('list_networks').then((output) => {

                output = output.split('\n');

                // Remove header
                output.splice(0, 1);

                var networks = [];

                output.forEach((line) => {
                    var params = line.split('\t');
                    networks.push({
                        id   : parseInt(params[0]),
                        ssid : params[1]
                    });

                });

                resolve(networks);
            })
            .catch((error) => {
                reject(error);
            })
        });

    }
}

function test() {


    var wifi = new WiFi();
/*
    wifi.getNetworkStatus().then((output) => {
        console.log('Status');
        console.log('------');
        console.log(output);
    })
    .catch((error) => {
        console.log(error);
    });

    wifi.getNetworks().then((output) => {
        console.log('Networks');
        console.log('--------');
        console.log(output);
    })
    .catch((error) => {
        console.log(error);
    });
*/
    wifi.connectToNetwork('Julia', 'potatismos').then((output) => {
        console.log('Connected!');
    })
    .catch((error) => {
        console.log(error);
    });


}

test();
