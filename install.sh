#! /bin/bash

installSoftware() {
    apt -qq -y install nginx
    apt -qq -y -t $(lsb_release -sc)-backports install golang-go
}

installMyIP() {
    curl -Lo- https://github.com/sunshineplan/myip-go/archive/v1.0.tar.gz | tar zxC /var/www
    mv /var/www/myip-go* /var/www/myip-go
    cd /var/www/myip-go
    go build
}

configMyIP() {
    read -p 'Please enter metadata server: ' server
    read -p 'Please enter VerifyHeader header: ' header
    read -p 'Please enter VerifyHeader value: ' value
    read -p 'Please enter unix socket(default: /var/www/myip-go/myip-go.sock): ' unix
    [ -z $unix ] && unix=/var/www/myip-go/myip-go.sock
    read -p 'Please enter host(default: 127.0.0.1): ' host
    [ -z $host ] && host=127.0.0.1
    read -p 'Please enter port(default: 12345): ' port
    [ -z $port ] && port=12345
    read -p 'Please enter log path(default: /var/log/app/myip-go.log): ' log
    [ -z $log ] && log=/var/log/app/myip-go.log
    mkdir -p $(dirname $log)
    sed "s,\$server,$server," /var/www/myip-go/config.ini.default > /var/www/myip-go/config.ini
    sed -i "s/\$header/$header/" /var/www/myip-go/config.ini
    sed -i "s/\$value/$value/" /var/www/myip-go/config.ini
    sed -i "s,\$unix,$unix," /var/www/myip-go/config.ini
    sed -i "s,\$log,$log," /var/www/myip-go/config.ini
    sed -i "s/\$host/$host/" /var/www/myip-go/config.ini
    sed -i "s/\$port/$port/" /var/www/myip-go/config.ini
}

setupsystemd() {
    cp -s /var/www/myip-go/myip-go.service /etc/systemd/system
    systemctl enable myip-go
    service myip-go start
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
    cp -s /var/www/myip-go/myip-go.conf /etc/nginx/conf.d
    sed -i "s/\$domain/$domain/" /var/www/myip-go/myip-go.conf
    sed -i "s,\$unix,$unix," /var/www/myip-go/myip-go.conf
    service nginx reload
}

main() {
    read -p 'Please enter domain:' domain
    installSoftware
    installMyIP
    configMyIP
    setupsystemd
    writeLogrotateScrip
    setupNGINX
}

main