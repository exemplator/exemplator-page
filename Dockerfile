FROM node:5-onbuild

EXPOSE 80

ENTRYPOINT ["/bin/bash", "-c", "envsubst < /tools/ENV_VARS.js > /tools/ENV_VARS.js && npm start"]