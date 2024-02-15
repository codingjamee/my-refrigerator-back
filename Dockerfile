# FROM node:17-alpine
FROM node:17

ENV DOCKERIZE_VERSION v0.2.0

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \  
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz
WORKDIR /src


COPY package*.json .
RUN npm install

COPY . .

RUN ["chmod", "+x", "./docker-entrypoint.sh"]
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]

EXPOSE 5000

CMD ["node", "index.js"]
