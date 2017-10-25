

var sprintf = require('yow/sprintf');
var child_process = require('child_process');


module.exports = class WpaCli {

    constructor(iface = 'wlan0') {
        this.iface = iface;
    }


    exec(command) {

        return new Promise((resolve, reject) => {

            child_process.exec(sprintf('wpa_cli -i %s %s', this.iface, command), (error, stdout, stderr) => {
                if (error)
                    reject(error);
                else
                    resolve(stdout.trim());

            });
        });
    }

    status() {
        return new Promise((resolve, reject) => {

            this.exec('status').then((output) => {

                var match;
                var status = {};

                if ((match = output.match(/bssid=([A-Fa-f0-9:]{17})/))) {
                    status.bssid = match[1].toLowerCase();
                }

                if ((match = output.match(/freq=([0-9]+)/))) {
                    status.frequency = parseInt(match[1], 10);
                }

                if ((match = output.match(/mode=([^\s]+)/))) {
                    status.mode = match[1];
                }

                if ((match = output.match(/key_mgmt=([^\s]+)/))) {
                    status.key_mgmt = match[1].toLowerCase();
                }

                if ((match = output.match(/[^b]ssid=([^\n]+)/))) {
                    status.ssid = match[1];
                }

                if ((match = output.match(/[^b]pairwise_cipher=([^\n]+)/))) {
                    status.pairwise_cipher = match[1];
                }

                if ((match = output.match(/[^b]group_cipher=([^\n]+)/))) {
                    status.group_cipher = match[1];
                }

                if ((match = output.match(/p2p_device_address=([A-Fa-f0-9:]{17})/))) {
                    status.p2p_device_address = match[1];
                }

                if ((match = output.match(/wpa_state=([^\s]+)/))) {
                    status.wpa_state = match[1];
                }

                if ((match = output.match(/ip_address=([^\n]+)/))) {
                    status.ip_address = match[1];
                }

                if ((match = output.match(/[^_]address=([A-Fa-f0-9:]{17})/))) {
                    status.address = match[1].toLowerCase();
                }

                if ((match = output.match(/uuid=([^\n]+)/))) {
                    status.uuid = match[1];
                }

                if ((match = output.match(/[^s]id=([0-9]+)/))) {
                    status.id = parseInt(match[1], 10);
                }
                */

                resolve(status);
            })
            .catch((error) => {
                reject(error);
            })
        });

    }

    list_networks() {
        return new Promise((resolve, reject) => {

            this.exec('list_networks').then((output) => {

                output = output.split('\n');

                // Remove header
                output.splice(0, 1);

                var networks = [];

                output.forEach((line) => {
                    var params = line.split('\t');
                    networks.push({
                        network_id : params[0],
                        ssid       : params[1],
                        bssid      : params[2],
                        flags      : params[3]
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
