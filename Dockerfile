FROM node:14.15.3-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm run build

FROM builder as test
RUN npm run test

FROM node:14.15.3-alpine

# Create app directory
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

#App will be on port 3000
EXPOSE 3000

# Run the app 
CMD npm run-script start
