'use strict'

const CandlesStore = require('./candles_store')
const Indicator = require('./utils/indicator')

//candelabrum
function CandlesAnalyzer(profile) {
  this.profile = profile
  this.analyze = function(strategy) {

    new CandlesStore(this.profile)
    .read(140)
    .then(
      candles=> {
        
         var res = Indicator
           .parse(strategy)
           .applyTo(candles)

        console.log(
          strategy, 
          res[res.length-1][strategy]
        )
      },
      err => {
        console.log('read limit error', err)
      }
    )
  }
}

module.exports = CandlesAnalyzer