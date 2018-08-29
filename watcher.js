
const db = require('./db')

db.sequelize.sync(
    /* {force: true} */
  ).then(() => {
  console.log('db sync ok')
/* 
  db.account.create({
    userid: 'lucas'
  })
*/

  db.alarm.create({
    name: 'BTCUSDT close cruzando bb lower',
    coin: 'USDT',
    asset: 'BTC',
    candleSize: 'oneHour',
    termA: 'C',
    termB: 'BB_20_2_C_L',
    operator: 'lessOrEqual'
  }) 

  db.alarmSuscription.create({
    active: true
  }) 
  
/*   db.account.findAll({ 
    include: [{
      model: db.alarmSuscription,
      include: [db.alarm]
    }] 
  })
  .then(accounts => {
    console.log(JSON.stringify(accounts))
  }) */

  db.alarm.findAll()
  .then(alarms=> {
    console.log(JSON.stringify(alarms))
  })
})