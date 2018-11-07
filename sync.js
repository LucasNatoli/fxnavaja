const db = require('./db')
db.scanBookmark.drop().then(
  ()=> {
    db.alarmSuscription.drop().then(
      ()=> {
        db.alarm.drop().then(
          ()=> {
            db.sequelize.sync().then(
              ()=>{
                console.log("db sync ok")
                process.exit()
              },
              (err)=>{
                console.log('db sync error', err)
                process.exit()
              }
            )        
          }
        )     
      }
    )  
  }
)  