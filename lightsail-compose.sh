#!/bin/bash

# install latest version of docker the lazy way
curl -sSL https://get.docker.com | sh

# avoid having to use sudo to run docker commands
usermod -aG docker ubuntu

# install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

mkdir /srv/docker
curl -o /srv/docker/docker-compose.yml https://github.com/brendanAlbert/partygame.git

