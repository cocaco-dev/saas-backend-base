import { Module, DynamicModule, Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema'; // Adjust the path to your Drizzle schema file

// Token for DI
export const DRIZZLE_CONNECTION = Symbol('DRIZZLE_CONNECTION');

export interface DrizzleModuleOptions {
  databaseUrl: string;
  ssl?: boolean;
}

export interface DrizzleModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<DrizzleModuleOptions> | DrizzleModuleOptions;
  inject?: any[];
}

@Module({})
export class DrizzleModule {
  static forRootAsync(options: DrizzleModuleAsyncOptions): DynamicModule {
    const drizzleProvider: Provider = {
      provide: DRIZZLE_CONNECTION,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        const pool = new Pool({
          connectionString: config.databaseUrl,
          ssl: config.ssl ?? true,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
      inject: options.inject || [],
    };

    return {
      module: DrizzleModule,
      providers: [drizzleProvider],
      exports: [DRIZZLE_CONNECTION],
    };
  }
}
