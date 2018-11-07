const db = require('./db')

db.sequelize.sync()
.then(
  ()=>{
    console.log("db sync ok")
    process.exit()
  },
  (err)=>{
    console.log('db sync error', err)
    process.exit()
  }
)        
