FROM node:alpine
WORKDIR /usr/app
COPY . .

RUN npm install

USER node
EXPOSE 9101
CMD [ "node", "index.js" ]
