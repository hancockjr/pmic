///////////////////////////////////
// START
///////////////////////////////////
function GameStart() {
  var roster = myApp.formGetData(gCurrentTeam.hash+'-roster');
  if (roster) {
    for (i=0; i<roster.length; i++) {
      var a = document.getElementById('game-select-'+roster[i].hash);
      if (a && a.checked) {
        var player = new Player(roster[i].name, roster[i].number, roster[i].phone, roster[i].email, roster[i].hash);
        gBench.players.push(player);
      }
    }
  }
}

///////////////////////////////////
// RESET
///////////////////////////////////
function GameSelectReset() {
  var roster = myApp.formGetData(gCurrentTeam.hash+'-roster');
  if (roster) {
    for (i=0; i<roster.length; i++) {
      var a = document.getElementById('game-select-'+roster[i].hash);
      if (a) {
        a.reset();
      }
    }
  }
}

///////////////////////////////////
// WHO'S HERE / WHO'S NOT
///////////////////////////////////
gWhosHere = true;
function GameSelectWhosHere(id) {
  var roster = myApp.formGetData(gCurrentTeam.hash+'-roster');
  if (id == 'game-select-whoishere') {
    gWhosHere = true;
    document.getElementById('game-select-whoishere').setAttribute('class','button button-raised button-fill');
    document.getElementById('game-select-whoisnot').setAttribute('class','button button-raised');
    if (roster) {
      for (i=0; i<roster.length; i++) {
        var a = document.getElementById('game-select-'+roster[i].hash);
        if (a)
          a.removeAttribute('checked');
      }
    }
  } else {
    gWhosHere = false;
    document.getElementById('game-select-whoishere').setAttribute('class','button button-raised');
    document.getElementById('game-select-whoisnot').setAttribute('class','button button-raised button-fill');
    if (roster) {
      for (i=0; i<roster.length; i++) {
        var a = document.getElementById('game-select-'+roster[i].hash);
        if (a)
          a.setAttribute('checked','checked');
      }
    }
  }
}

///////////////////////////////////
// PAGE
///////////////////////////////////
myApp.onPageBack('game-select', function (page) {
});

myApp.onPageInit('game-select', function (page) {
  console.log(page);
  var roster = myApp.formGetData(gCurrentTeam.hash+'-roster');
  if (roster) {
    var ul = document.getElementById('roster-select');
    for (i=0; i<roster.length; i++) {
      ul.innerHTML = ul.innerHTML +
        '<li>' +
          '<label class="label-checkbox item-content">' +
            '<input type="checkbox" id="game-select-'+roster[i].hash+'" checked="checked"/>' +
            '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>' +
            '<div class="item-inner">' +
              '<div class="item-title">'+roster[i].name+'</div>' +
            '</div>' +
          '</label>' +
        '</li>';
    }
  }
});
