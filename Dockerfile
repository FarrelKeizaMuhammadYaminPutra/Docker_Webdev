FROM node:18-alpine3.20

WORKDIR /app/backend

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]
