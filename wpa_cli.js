

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
                resolve(output);
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

                console.log(output);
                // Remove header and footer
                output.splice(0, 2);
                output.splice(output.length - 1, 1);

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
