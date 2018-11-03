const boll = require('bollinger-bands');
const ma = require('moving-averages');

function getSources(candles, source) {
  return candles.map(candle => {return candle[source]}) 
}

function Calc() {
  this.isIndicator = expression => {
    return !(typeof this[expression.split('_')[0]] === "undefined")
  },
  this.isCandleValue = expression => {
    return ['O', 'H', 'L', 'C', 'v'].includes(expression)
  },

  this.BB = (candles, args) => {return boll(getSources(candles, args[0]), args[1], args[2])[args[3]]}
  this.EMA = (candles, args) => {
    return ma.ema(getSources(candles, args[0]), args[1])
  }
  this.MA = (candles, args) => {return ma.ma(getSources(candles, args[0]), args[1])}
}

module.exports = new Calc()