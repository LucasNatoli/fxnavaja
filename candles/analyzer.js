const Indicator = require('../utils/indicator')
const Calc = require('../utils/calc')
const Operators = require('./operators')

function Analyzer(candles, strategy){
  this.candles = candles
  this.strategy = strategy
  this.valueA
  this.valueB
  this.lastCandle = () => {
    return this.candles[this.candles.length-1]
  }
  this.check = () => {
    var ret = false
    var s = this.strategy
    if (Calc.isIndicator(s.termA)) {
      this.candles = Indicator.parse(s.termA).applyTo(this.candles)
    }
    if (Calc.isIndicator(s.termB)) {
      this.candles = Indicator.parse(s.termB).applyTo(this.candles)
    }
    this.valueA = this.lastCandle()[s.termA]
    this.valueB = this.lastCandle()[s.termB]

    if (Operators[s.operator](this.valueA, this.valueB)) { ret = true }
    return ret
  }
}

module.exports = Analyzer