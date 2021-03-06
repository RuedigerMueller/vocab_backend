# Vocab - Backend

This is the backend component of a basic vocabulary trainer. The focus of this program was not on providing a feature reach vocabulary trainer but to teach myself the development of a cloud native component.
The backend component is a [Node.js](https://nodejs.org/en/) component which leverages the [NestJS](https://nestjs.com/) framework. For connecting to the database the backend is making use of [TypeORM](https://typeorm.io/#/)
The backend is called by frontend component; the coding for the frontend component is available in the repository [RuedigerMueller/vocab_frontend](https://github.com/RuedigerMueller/vocab_frontend).

## Development server

Run `nest start --watch` or `npm run start:dev` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Build

Run `nest build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. 

## Running unit tests

Run `jest` or `npm run test` to execute the unit tests via [Jest](https://jestjs.io/docs/en/getting-started.html).

## Running end-to-end tests

Run `npm run test:e2e` to execute the end-to-end tests via [Jest](https://jestjs.io/docs/en/getting-started.html).

## Further help

You can also use the ready to run Docker Image [ruedigermueller/vocab_backend](https://hub.docker.com/repository/docker/ruedigermueller/vocab_backend) to run the application. 

You will have to set the `JWT_SECRET` environment variable to enable authenticted communication with the backend. For more information see [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token).

In order to setup to a database connection when running outside of Cloud Foundry or Heroku you will have to provide the following environment variables (see: [TypeORM Connection Options](https://typeorm.io/#/connection-options)):
* `TYPEORM_CONNECTION`
* `TYPEORM_DATABASE`
* `TYPEORM_HOST`
* `TYPEORM_PASSWORD`
* `TYPEORM_PORT `
* `TYPEORM_SYNCHRONIZE`
* `TYPEORM_URL`
* `TYPEORM_USERNAME`
* `TYPEORM_ENTITIES = dist/**/*.entity.js`
* `TYPEORM_MIGRATIONS = migration/*.js`

The backend is running on [Heroku](https://www.heroku.com/home):
* [Test](https://vocabbetest.herokuapp.com/)
* [Prod](https://vocabbeprod.herokuapp.com/)

It is easy to run the application leveraging [Kubernetes](https://kubernetes.io) locally on Minikube  or in the public cloud on a free account like [Okteto](https://okteto.com/). While I am playing around with the app it e.g. available at [Vocab TS](https://vocab-frontend-ruedigermueller.cloud.okteto.net/).