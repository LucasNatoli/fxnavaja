'use strict'

module.exports = (app, db) => {
  app.get('/triggers', (req, res) => {
    db.trigger
    .findAll()
    .then(
      triggers => {
        res.json(triggers)
      }
    )
  })

  app.post('/triggers/', (req, res) => {
    
    var name = req.body.name
    var termA = req.body.termA
    var termB = req.body.termB
    var operator = req.body.operator

    db.trigger.create({
      name: name,
      termA: termA,
      termB: termB,
      operator: operator
    })
    .then(trigger => {
      res.json(trigger)
    })
  })
}
