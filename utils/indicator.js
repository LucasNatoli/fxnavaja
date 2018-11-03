
const Calc = require('./calc');

function Indicator() {
  this.expression,
  this.name, 
  this.args,
  this.parse = expression => {
    var splited = expression.split('_')
    this.expression = expression
    this.name = splited[0]
    this.args = splited.slice(1, splited.length)
    return this
  }
  this.applyTo = (candles) => {
    var results = Calc[this.name](candles, this.args)
    return candles.map(
      (candle, i)=> {
        var applied = candle
        applied[this.expression] = results[i]
        return applied
      }
    )
  }
}

module.exports = new Indicator()
/* 

var bbParams = {
  source: 'C',
  input: 20,
  stdDev: 2,
  output: 'base' //lower, base, upper
}

var emaParams = {
  source: 'C',
  input: 9
}
 */