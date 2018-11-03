
// this.isNumber = expression => {
//   return typeof(value) === 'number';
//}

// Utils.prototype.getTerm = function(candle, term){
//     if(this.isNumber(term)){return term};
//     if(this.isCandleValue(term)){return candle[term]};
//     if(this.isIndicator(term)){return candle[term]};
// };

function Operators () {
  this.lessOrEqual = (first, second) => {return first <= second}
  this.equals = (first, second) => {return first == second}
  this.greaterOrEqual = (first, second) => { return first >= second}
}

module.exports = new Operators()
