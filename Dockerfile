FROM node:alpine
RUN apk add --no-cache make gcc g++ python

WORKDIR /usr/app
USER node
EXPOSE 9102
CMD [ "node", "index.js" ]