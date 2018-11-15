module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    {
      name      : 'web-server',
      script    : 'webserver.js',      
      watch     : true,
      ignore_watch : ["node_modules", "docs", "sqlite3", ".git", "web", "backtest_dev"],      
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production : {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name      : 'watcher',
      script    : 'watcher.js',
      watch     : true,
      ignore_watch : ["node_modules", "docs", "sqlite3", ".git", "web", "backtest_dev"],      
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production : {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name      : 'mailer',
      script    : 'mailer.js',
      watch     : true,
      ignore_watch : ["node_modules", "docs", "sqlite3", ".git", "web", "backtest_dev"],      
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production : {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ],
  deploy : {
    production : {
      key  : '/home/lucas/.ssh/id_rsa.pub',
      user : 'razor',
      host : 'fxnavaja.com',
      ref  : 'origin/master',
      repo : 'https://github.com/LucasNatoli/fxnavaja.git',
      path : '/home/razor/node',
      "post-deploy" : "npm install && node sync.js"
    }
  }
};

/*
"post-deploy" : "npm install && pm2 startOrRestart ecosystem.config.js --env production"
*/
