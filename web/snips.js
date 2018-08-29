function showRanking(status, res) {
  res.forEach(market => {
    document.write(market.name + '<BR/>')
  });
}


document.addEventListener("DOMContentLoaded", function(event) { 
  sendAjaxRequest('http://localhost:3000/v1/ranking/crypto', 'GET', null, showRanking)
})