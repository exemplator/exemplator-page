FROM node:5.1

RUN rm -rf /usr/local/lib/node_modules/npm \
    && git clone https://github.com/DIREKTSPEED-LTD/npm /usr/local/lib/node_modules/npm \
    && rm -f  /usr/local/lib/node_modules/npm/.git \
    && rm -f  /usr/local/bin/npm \
    && ln -s -f /usr/local/bin/npm /usr/bin/npm \
    && cd /usr/local/lib/node_modules/npm \
    && npm install

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