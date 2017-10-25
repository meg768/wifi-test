

var sprintf = require('yow/sprintf');
var child_process = require('child_process');


class WiFi {

    constructor(iface = 'wlan0') {
        this.iface = iface;
    }


    wpa_cli(command, pattern) {

        return new Promise((resolve, reject) => {

            child_process.exec(sprintf('wpa_cli -i %s %s', this.iface, command), (error, stdout, stderr) => {
                if (error)
                    reject(error);
                else {
                    var output = stdout.trim();

                    if (pattern) {
                        var match = output.match(pattern);

                        if (match) {
                            if (match[1])
                                resolve(match[1]);
                            else
                                resolve();
                        }
                        else
                            reject(new Error(sprintf('Could not parse reply from wpa_cli: "%s"', output)));

                    }
                }
                    resolve(stdout.trim());
            });
        });
    }

    addNetwork() {
        this.wpa_cli('add_network', '^([0-9]+)');
    }

    selectNetwork(id) {
        return this.wpa_cli(sprintf('select_network %s', id), '^OK');
    }

    connectToNetwork(ssid, password) {
        return new Promise((resolve, reject) => {

            var networkID = undefined;

            this.removeAllNetworks().then(() => {
                return this.addNetwork();
            })
            .then((id) => {
                networkID = id;
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
        });


    }

    setNetworkVariable(id, name, value) {
        return this.wpa_cli_command(sprintf('set_network %d %s "%s"', id, name, value), '^OK');
    }

    removeAllNetworks() {
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
        this.wpa_cli(sprintf('remove_network %d', id), '^OK').then((output) => {
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

    wifi.getStatus().then((output) => {
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

}

test();
