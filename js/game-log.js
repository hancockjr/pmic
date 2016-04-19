var gLogEnable = false;

function LogUpdate() { // TODO: not working, doesn't update when on page
  for (i=0; i<Players().length; i++) {
    Players()[i].LogUpdate();
  }

  if (gLogEnable)
    window.setTimeout('LogUpdate()', 100);
}

function LogInitHtml(hide) {
  var elem = document.getElementById('toolbar-log');
  if (hide)
    elem.setAttribute('style','visibility:hidden');
  else if (elem.getAttribute('style') == 'visibility:hidden')
    elem.removeAttribute('style');
}

function LogLinkToggle(id) {
  var isLog = (id == 'toolbar-log') ? true : false;
  var elem = document.getElementById(id);
  elem.href = isLog ? 'game-log.html' : '#';
  elem.setAttribute('class', isLog ? 'link' : 'back link');
  elem.id = 'toolbar-log' + (isLog ? '-minimize' : '');
}

myApp.onPageInit('log', function (page) {
  console.log(page);
  for (i=0; i<Players().length; i++) {
    Players()[i].LogAddHtml();
  }
  for (i=0; i<Bench().length; i++) {
    Bench()[i].LogAddHtml();
  }
  gLogEnable = true;
  window.setTimeout('LogUpdate()', 100);
});

myApp.onPageBack('log', function (page) {
  gLogEnable = false;
});
