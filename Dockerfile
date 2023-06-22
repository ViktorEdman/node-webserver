# syntax=docker/dockerfile:1
FROM node:current-alpine
ENV NODE_ENV=production 
WORKDIR /app 
COPY ["package.json", "package-lock.json*", "./"] 
RUN npm install
COPY . .
RUN apk --no-cache add curl
EXPOSE 30000
CMD [ "node", "app.js" ]
