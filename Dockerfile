FROM node:20
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

RUN test -f .env || mv default.env .env
EXPOSE $API_PORT

CMD ["npm", "start"]