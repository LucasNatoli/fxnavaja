'use strict'

const routes = [
  require('./accounts'),
  require('./exchanges'),
  require('./ranking'),
  require('./scan-profiles'),
  require('./triggers'),
  require('./bookmarks')
]

module.exports = function router(app, db) {
  return routes.forEach((route) => {
    route(app, db)
  })
}
