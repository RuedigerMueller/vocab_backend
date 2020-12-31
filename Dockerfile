FROM vocab_backend_src

# Create app directory
WORKDIR /usr/src/app

# Assuming the Docker image is build as part of a pipeline
# A previous job already installed the dependencies & executed the build
COPY /app .

#App will be on port 3000
EXPOSE 3000

# Run the app 
CMD npm run-script start