FROM node:16.13.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript@4.5.5

COPY . .

CMD [ "npm", "start" ]