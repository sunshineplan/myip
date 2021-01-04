#! /bin/bash

installSoftware() {
    apt -qq -y install nginx
    apt -qq -y -t $(lsb_release -sc)-backports install npm
}

installMyIP() {
    curl -Lo- https://github.com/sunshineplan/myip/archive/v1.0.tar.gz | tar zxC /var/www
    mv /var/www/myip* /var/www/myip
    cd /var/www/myip
    npm i
    npm run build -- --environment API_KEY:$api_key
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
    read -p 'Please enter API key:' api_key
    installSoftware
    installMyIP
    writeLogrotateScrip
    setupNGINX
}

main
