'use strict'

module.exports = (app, db) => {
  app.get('/ranking', (req, res) => {
    db.coinmarketcapTick.findAll()
    .then(ticks => {
      res.json(ticks)
    }),
    (err) => {
      console.log(err)
    }    
  })  
}