// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'hackathon_task',
      user:     'root',
      password: 'Nav@gur1'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'hackathon_task',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};