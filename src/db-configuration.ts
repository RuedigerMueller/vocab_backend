import { Injectable, Logger } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { getConnectionOptions } from "typeorm";
import * as PostgressConnectionStringParser from "pg-connection-string";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
   async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
      const logger:Logger = new Logger('DB Config');

      // Running on Cloud Foundry?
      if (process.env.VCAP_SERVICES !== undefined) {
         logger.log('Running on Cloud Foundry');
         const vcap_services = JSON.parse(process.env.VCAP_SERVICES);
         return {
            type: 'postgres',
            host: vcap_services['postgresql-db'][0].credentials.hostname,
            port: vcap_services['postgresql-db'][0].credentials.port,
            username: vcap_services['postgresql-db'][0].credentials.username,
            password: vcap_services['postgresql-db'][0].credentials.password,
            database: vcap_services['postgresql-db'][0].credentials.dbname,
            url: vcap_services['postgresql-db'][0].credentials.uri,
            entities: ['dist/**/*.entity.js'],
            synchronize: true,
            migrations: ['migration/*.js'],
            extra: '{ "ssl": true, "rejectUnauthorized": true }',
            ssl: {
               ca: vcap_services['postgresql-db'][0].credentials.sslrootcert,
               cert: vcap_services['postgresql-db'][0].credentials.sslcert,
            }
         };
      }

      // Running on Heroku?
      if (process.env.DATABASE_URL !== undefined) {
         logger.log('Running on Heroku');
         const databaseUrl: string = process.env.DATABASE_URL;
         const connectionOptions = PostgressConnectionStringParser.parse(databaseUrl);
         return {
            type: 'postgres',
            host: connectionOptions.host,
            port: parseInt(connectionOptions.port),
            username: connectionOptions.user,
            password: connectionOptions.password,
            database: connectionOptions.database,
            url: databaseUrl,
            entities: ['dist/**/*.entity.js'],
            synchronize: true,
            migrations: ['migration/*.js'],
            ssl: true,
            extra: '{ "ssl": true, "rejectUnauthorized": false }',
         };
      }

      // if not running in Cloud Foundry or on Heroku take the connectionOpions as is which means
      // 1) from ENV variables => used when running in the Cloud
      // 2) from .env/ormconfig.json when running locally
      logger.log('Neither running on Cloud Foundry or Heroku');
      return await getConnectionOptions();
   }
}