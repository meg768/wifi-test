# wifi-test

wpa_cli -i wlan0 add_network
wpa_cli -i wlan0 set_network 0 ssid  '"Julia"'
wpa_cli -i wlan0 set_network 0 psk  '"potatismos"'
wpa_cli -i wlan0 enable_network 0
wpa_cli -i wlan0 select_network 0

wpa_cli -i wlan0 status
wpa_cli -i wlan0 save_config

wpa_cli -i wlan0 list_networks


wpa_cli -i wlan0 remove_network 0
