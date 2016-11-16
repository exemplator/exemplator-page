FROM node:5-onbuild

RUN apt-get intall gettext

EXPOSE 80

ENTRYPOINT ["/bin/bash", "-c", "envsubst < ./tools/ENV_VARS.js > ./tools/ENV_VARS.js && npm start"]