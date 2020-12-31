FROM node:14.15.3-alpine

# Create app directory
WORKDIR /vocab_backend

# Assuming the Docker image is build as part of a pipeline
# A previous job already installed the dependencies & executed the build
COPY . .

#App will be on port 3000
EXPOSE 3000

# Run the app 
CMD npm run-script start