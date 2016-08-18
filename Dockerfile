FROM node:5.11.1

RUN     yum install -y epel-release
RUN     yum install -y nodejs npm

# Upgrade node and npm to latest version
RUN     npm cache clean
RUN     npm install -g n
RUN     n stable
RUN     curl -L https://npmjs.org/install.sh | sh

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 80
CMD [ "npm", "start" ]