import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConnectionOptions, getConnectionOptions } from "typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const entities = ['dist/**/*.entity.js'];
    const synchronize = true;
    const migrations = ['migration/*.js'];
    const driver_extra = '{ "ssl": true, "rejectUnauthorized": false }';

     const connectionOption: ConnectionOptions = await getConnectionOptions();
     console.log(connectionOption);

     // if not running in Cloud Foundry take the connectionOpions as is which means
     // 1) from ENV variables => used when running in the Cloud
     // 2) from .env/ormconfig.json when running locally
     if(process.env.VCAP_SERVICES === undefined) {
        return connectionOption;
     } else {
        const vcap_services = JSON.parse(process.env.VCAP_SERVICES);
        return {
            type: 'postgres',
            host: vcap_services['postgresql-db'][0].credentials.hostname,
            port: vcap_services['postgresql-db'][0].credentials.port,
            username: vcap_services['postgresql-db'][0].credentials.username,
            password: vcap_services['postgresql-db'][0].credentials.password,
            database: vcap_services['postgresql-db'][0].credentials.dbname,
            url: vcap_services['postgresql-db'][0].credentials.dbname,
            entities: entities,
            synchronize: synchronize,
            migrations: migrations,
            extra: driver_extra,
          };
     }   
  }
}