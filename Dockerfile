FROM node:14.15.3-alpine as nodebuild
WORKDIR /usr/src/app
COPY . .
RUN npm install &&  \
    npm run build &&  \
    npm run test


FROM node:14.15.3-alpine
WORKDIR /usr/src/app
COPY --from=nodebuild /usr/src/app/dist/ ./
COPY package*.json ./
RUN npm install --only=prod
EXPOSE 3000
CMD npm run-script start
