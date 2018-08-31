module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'web-server',
      script    : 'webserver.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 3306,
        DB_NAME: 'razor',
        DB_USER: 'webuser',
        DB_PASSWORD: 'Termo1333Huawei'
      },
      env_production : {
        NODE_ENV: 'production',
        PORT: 80,
        DB_HOST: 'localhost',
        DB_PORT: 3306,
        DB_NAME: 'razor',
        DB_USER: 'webuser',
        DB_PASSWORD: 'Termo1333Huawei'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      key  : '/home/lucas/.ssh/id_rsa.pub',
      user : 'razor',
      host : 'fxnavaja.com',
      ref  : 'origin/master',
      repo : 'https://github.com/LucasNatoli/fxnavaja.git',
      path : '~/node',
      'post-deploy' : 'npm install && pm2 start ecosystem.config.js --env production'
    }
  }
};
