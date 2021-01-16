#! /bin/bash

installSoftware() {
    apt -qq -y install nginx
}

installMyIP() {
    mkdir -p /var/www/myip
    curl -Lo- https://github.com/sunshineplan/myip/releases/download/v1.0/release.tar.gz | tar zxC /var/www/myip
}

writeLogrotateScrip() {
    if [ ! -f '/etc/logrotate.d/app' ]; then
	cat >/etc/logrotate.d/app <<-EOF
		/var/log/app/*.log {
		    copytruncate
		    rotate 12
		    compress
		    delaycompress
		    missingok
		    notifempty
		}
		EOF
    fi
}

setupNGINX() {
    cp -s /var/www/myip/scripts/myip.conf /etc/nginx/conf.d
    sed -i "s/\$domain/$domain/" /var/www/myip/scripts/myip.conf
    service nginx reload
}

main() {
    read -p 'Please enter domain:' domain
    installSoftware
    installMyIP
    writeLogrotateScrip
    setupNGINX
}

main
