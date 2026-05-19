import path from 'path';
import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const defaultClient = env('NODE_ENV') === 'production' ? 'postgres' : 'sqlite';
  const requestedClient = env('DATABASE_CLIENT', defaultClient).toLowerCase();
  const clientAliases = {
    pg: 'postgres',
    postgresql: 'postgres',
    sqlite3: 'sqlite',
  };
  const client = clientAliases[requestedClient] ?? requestedClient;
  const isProduction = env('NODE_ENV') === 'production';
  const isBuild = process.argv.includes('build');
  const databaseUrl =
    env('DATABASE_URL') ||
    env('DATABASE_PRIVATE_URL') ||
    env('DATABASE_PUBLIC_URL') ||
    env('POSTGRES_URL') ||
    env('POSTGRES_PRIVATE_URL') ||
    env('POSTGRES_PUBLIC_URL');
  const databaseHost = env('DATABASE_HOST') || env('PGHOST') || env('POSTGRES_HOST');

  if (isProduction && !isBuild && client === 'postgres' && !databaseUrl && !databaseHost) {
    throw new Error(
      'Production Postgres is enabled, but no database connection was configured. In Railway, add DATABASE_URL=${{Postgres.DATABASE_URL}} to the Jeeva_Gold service variables, or set DATABASE_HOST/DATABASE_PORT/DATABASE_NAME/DATABASE_USERNAME/DATABASE_PASSWORD.'
    );
  }

  const postgresConnection = databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      }
    : {
        host: databaseHost,
        port: env.int('DATABASE_PORT', env.int('PGPORT', 5432)),
        database: env('DATABASE_NAME', env('PGDATABASE', 'strapi')),
        user: env('DATABASE_USERNAME', env('PGUSER', 'strapi')),
        password: env('DATABASE_PASSWORD', env('PGPASSWORD', 'strapi')),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      };

  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    postgres: {
      connection: postgresConnection,
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  if (!connections[client]) {
    throw new Error(
      `Unsupported DATABASE_CLIENT "${requestedClient}". Use one of: postgres, sqlite, mysql.`
    );
  }

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};

export default config;
