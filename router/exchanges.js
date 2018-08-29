'use strict'

module.exports = (app, db) => {
  app.get('/exchanges', (req, res) => {
    let exchanges = [
      {id: 1, name: 'Binance'},
      {id: 2, name: 'Oanda'}
    ] 
    res.json(exchanges)
  })  
}
