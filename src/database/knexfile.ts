import path from 'node:path';
import { Knex } from 'knex';

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'db.sqlite3')
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
};

export default config;
