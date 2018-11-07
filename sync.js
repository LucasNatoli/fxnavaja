const db = require('./db')

db.sequelize
.sync()
.then(
  (r)=>{
    console.log("db sync ok")
  },
  (err)=>{
    console.log('db sync error', err)
  }
)