

var sprintf = require('yow/sprintf');
var child_process = require('child_process');


class WiFi {

    constructor(iface = 'wlan0') {
        this.iface = iface;
    }


    wpa_cli(command) {

        return new Promise((resolve, reject) => {

            child_process.exec(sprintf('wpa_cli -i %s %s', this.iface, command), (error, stdout, stderr) => {
                if (error)
                    reject(error);
                else
                    resolve(stdout.trim());

            });
        });
    }



    getStatus() {
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
                        id   : params[0],
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
        console.log(output);
    })
    .catch((error) => {
        console.log(error);
    });

}

test();
