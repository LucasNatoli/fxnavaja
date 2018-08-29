
'use strict';
var templates = {
  rankingCard: document.getElementById('ranking_card_template'),
  exchangesListItem: document.getElementById('exchanges_listitem'),
  alarmListItem: document.getElementById('alarms_listitem'),
}

var storage = {};

storage.fetch = function(endpoint, slotName, onSuccess){
  if (!storage[slotName]) {
    sendAjaxRequest(endpoint, 'GET', null, (status, results) => {
      if (status===200) {
        storage[slotName]=results
        if (onSuccess) onSuccess(storage[slotName])
      }
    })
  }
}

var app = {
  isLoading: true,
  baseUrl: 'http://localhost:3000',
  userData: {},
  spinner: document.getElementById('spinner'),
  registerDialog: document.getElementById('register_dialog'),
  loginDialog: document.getElementById('login_dialog'),
  rankingPanel: document.getElementById('ranking_panel'),
  exchangesPanel: document.getElementById('exchanges_panel'),
  alarmsPanel: document.getElementById('alarms_panel'),
  notification: document.querySelector('.mdl-js-snackbar')
};  

/***************************************************************************
* UI events
****************************************************************************/
document.addEventListener("DOMContentLoaded", function(event) { 
  sendAjaxRequest('/accounts/check', 'GET', null, callBackCheckSession)
});

document.getElementById('btn_exchanges').addEventListener('click', function(e){
  e.preventDefault()
  hideAll()
  showElement(app.exchangesPanel)
});

document.getElementById('btn_home').addEventListener('click', function(e){
  e.preventDefault()
  hideAll()
  showElement(app.rankingPanel)
});

document.getElementById('btn_alarms').addEventListener('click', function(e) {
  e.preventDefault()
  hideAll()
  showElement(app.alarmsPanel)
});

document.getElementById('btn_logout').addEventListener('click', function(){
  sendAjaxRequest('/accounts/logout', 'GET')
});

document.getElementById('new_account').addEventListener('click', function(){
  hideElement(app.loginDialog);
  showElement(app.registerDialog);
});

document.getElementById('register_button').addEventListener('click', function(){
  var parameters = JSON.stringify({
    "userid": document.getElementById('reg-userid').value,
    "name": document.getElementById('reg-name').value,
    "phone": document.getElementById('reg-phone').value,
    "password": document.getElementById('reg-password').value
  })
  hideElement(app.registerDialog)
  sendAjaxRequest("/accounts/register", "POST", parameters, callBackRegister)
})

document.getElementById('login_button').addEventListener('click', function() {
  var parameters = JSON.stringify({
      "userid": document.getElementById('userid').value,
      "password": document.getElementById('password').value
  })
  hideElement(app.loginDialog)
  sendAjaxRequest("/accounts/login", "POST", parameters, callBackLogin)
});





/***************************************************************************
* UI methods
****************************************************************************/
function showElement(element){
  element.classList.remove("hide");
}

function hideElement(element){
  element.classList.add("hide");
}

function hideAll(){
  hideElement(app.registerDialog)
  hideElement(app.loginDialog)
  hideElement(app.alarmsPanel)
  hideElement(app.rankingPanel)
  hideElement(app.exchangesPanel)
}

function clearList(element) {
  while(element.childElementCount>0){
    list.removeChild(element.firstChild)
  }
}

function drawRanking(ranking){
  
  /* let list = app.rankingPanel.getElementsByClassName('mdl-list')[0]
  clearList(list)
 */

  clearList(app.rankingPanel)

  ranking.forEach(element => {
    var e = templates.rankingCard.cloneNode(true)
    e.getElementsByClassName('name')[0].innerText = element.name
    e.getElementsByClassName('price_btc')[0].innerText = element.price_btc
    e.getElementsByClassName('price_usd')[0].innerText = element.price_usd
    e.getElementsByClassName('vol_24h_usd')[0].innerText = element.vol_24h_usd
    e.getElementsByClassName('percent_change_24h')[0].innerText = element.percent_change_24h + '%'
    app.rankingPanel.appendChild(e)
    showElement(e)
  })
}

function drawListExchanges(exchanges){
  
  let list = app.exchangesPanel.getElementsByClassName('mdl-list')[0]
  clearList(list)

  exchanges.forEach(element => {
    var e = templates.exchangesListItem.cloneNode(true)
     e.getElementsByClassName('name')[0].innerText = element.name
    list.appendChild(e)
    showElement(e)
  })
}

function drawListAlarms(){
  
  let list = app.alarmsPanel.getElementsByClassName('mdl-list')[0]
  clearList(list)
  storage.alarms.forEach(alarm => {
    var e = templates.alarmListItem.cloneNode(true)
    e.getElementsByClassName('alarm_name')[0].innerText = alarm.name
    list.appendChild(e)
    showElement(e)
  })
}

function showNotification(message, timeout, actionText, actionHandler){
  var data = {
    message: message,
    timeout: timeout,
    actionText: actionText
  }
  if (actionHandler) {
    data.actionHandler = actionHandler(event)
  }
  app.notification.MaterialSnackbar.showSnackbar(data)
}





/***************************************************************************
* Callbacks
****************************************************************************/

function callBackCheckSession(status, response) {

  if (status === 200) {
    app.userData = response;
    storage.fetch('/ranking', 'ranking', drawRanking);
    storage.fetch('/exchanges', 'exchanges', drawListExchanges)
    storage.fetch('/alarms', 'alarms', drawListAlarms)
    showElement(app.rankingPanel)
  }
  if (status === 401) {
    showElement(app.loginDialog); 
  }
}

function callBackLogin(status, response) {
  if (status === 200) {
      app.userData = response;
      storage.fetch('/ranking', 'ranking', drawRanking);
      storage.fetch('/exchanges', 'exchanges', drawListExchanges)
      storage.fetch('/alarms', 'alarms', drawListAlarms)
      showElement(app.rankingPanel)
  }
  if (status === 401) {
    showNotification('Combinacion incorrecta!', 4000, 'ok')
    showElement(app.loginDialog)
  }  
}

function callBackRegister(status, response) {
  if (status === 200) {
    hideElement(app.registerDialog);
    showElement(app.loginDialog);
  }
  if (status === 401) {
    showNotification('Esa cuenta ya existe!', 4000, 'Ok')
    showElement(app.registerDialog);
  }
  if (status === 500) {
      //showElement(app.registerError);
  } 
}   




/***************************************************************************
* Server comm
****************************************************************************/
function sendAjaxRequest(endpoint, method, parameters, onComplete) {
  var request = new XMLHttpRequest();
  showElement(app.spinner);
  request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        hideElement(app.spinner);
        var res = []; 
        if (request.response) res = JSON.parse(request.response);
        if (onComplete) onComplete(request.status, res)
      }
  } 
  request.open(method, endpoint, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(parameters);
}
