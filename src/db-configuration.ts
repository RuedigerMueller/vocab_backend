import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { getConnectionOptions } from "typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
     // if not running in Cloud Foundry take the connectionOpions as is which means
     // 1) from ENV variables => used when running in the Cloud
     // 2) from .env/ormconfig.json when running locally
     if(process.env.VCAP_SERVICES === undefined) {
        return await getConnectionOptions();
     } else {
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
                cert:vcap_services['postgresql-db'][0].credentials.sslcert,
            }
          };
     }   
  }
}