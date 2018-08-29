'use strict'

const routes = [
  require('./accounts'),
  require('./alarms'),
  require('./exchanges'),
  require('./ranking')
]

module.exports = function router(app, db) {
  return routes.forEach((route) => {
    route(app, db)
  })
}