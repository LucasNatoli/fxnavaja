'use strict'

const routes = [
  require('./accounts'),
  require('./alarms'),
  require('./exchanges'),
  require('./ranking'),
  require('./scan-profiles'),
  require('./triggers'),
  require('./scan-bookmarks')
]

module.exports = function router(app, db) {
  return routes.forEach((route) => {
    route(app, db)
  })
}
