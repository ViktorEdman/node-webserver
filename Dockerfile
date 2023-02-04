# syntax=docker/dockerfile:1
FROM node:current-buster
ENV NODE_ENV=production 
WORKDIR /app 
COPY ["package.json", "package-lock.json*", "./"] 
RUN npm install
COPY . .
CMD [ "node", "app.js" ]
