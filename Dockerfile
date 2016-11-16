FROM node:5-onbuild

RUN apt-get update
RUN yes | apt-get install gettext

EXPOSE 8080

ENTRYPOINT ["/bin/bash", "-c", "envsubst < ./tools/ENV_VARS.js > ./tools/ENV_VARS.js && npm start"]