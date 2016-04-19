var gPlayerId = '';
var gRoster = []; // array of attributes objects
var gPlayers = []; // array of Player class objects

function GetPlayerId(id) {
  gPlayerId = id;
}

///////////////////////////////////
// Time class
///////////////////////////////////
function Time(m, s) {
  this.m = m; // minutes
  this.s = s; // seconds
}

Time.prototype.Increment = function(s) {
  if (this.s + s >= 60) {
    this.m++;
    this.s = this.s + s - 60;
  } else
    this.s += s;
}

Time.prototype.String = function() {
  if (this.s < 10)
    return this.m + ':0' + this.s;
  else
    return this.m + ':' + this.s;
}
///////////////////////////////////
// Player class
///////////////////////////////////
function Player(name, number, phone, email, hash) {
  this.name   = name;
  this.number = number;
  this.phone  = phone;
  this.email  = email;
  this.time   = new Time(0,0);
  if (hash) { // stored player
    this.hash = hash;
  } else { // new player
    this.hash = this.name + '_' + DateHash();
  }
}

Player.prototype.GetAttributes = function() {
  return {name:this.name, number:this.number, phone:this.phone, email:this.email, hash:this.hash};
}

Player.prototype.InitHtml = function() {
  // populate player under roster
  var ul = document.getElementById('roster');
  ul.innerHTML = ul.innerHTML +
    '<li><a id="'+this.hash+'" href="player.html" class="item-link" onclick="GetPlayerId(this.id)"><div class="item-content"><div class="item-inner"><div class="item-title">'+this.name+'</div></div></div></a></li>';
}

Player.prototype.Save = function(newplayer) {
  var attributes = this.GetAttributes();
  if (newplayer) {
    gRoster.push(attributes);
    gPlayers.push(this);
  } else {
    alert('Player.Save: attributes='+JSON.stringify(attributes));
    alert('Player.Save: gRoster='+JSON.stringify(gRoster));
    for (i=0; i<gRoster.length; i++) {
      if (gRoster[i].hash == gPlayerId) {
        gRoster[i] = attributes;
        gPlayers[i] = this;
        break;
      }
    }
  }
  var storedData = myApp.formStoreData(gCurrentTeam.hash+'-roster', gRoster);
  //alert('Player.Save: gRoster='+JSON.stringify(gRoster));
}

Player.prototype.Delete = function() {
  var index = gRoster.indexOf(this.GetAttributes());
  if (index > -1) {
    gRoster.splice(index, 1);
  }
  this.Save(false);

  // remove link inserted by innerHTML...
  var element = document.getElementById(gPlayerId); // will return element
  element.parentNode.removeChild(element); // will remove the element from DOM
}

function GetPlayer(hash) {
  for (i=0; i<gPlayers.length; i++) {
    if (gPlayers[i].hash == hash) {
      return gPlayers[i];
    }
  }
  return null;
}

///////////////////////////////////
// LOG page helper functions
///////////////////////////////////
Player.prototype.LogAddHtml = function() {
  var ul = document.getElementById('log-players');
  ul.innerHTML = ul.innerHTML +
    '<li>' +
      '<div class="item-content">' + 
        '<div class="item-inner">' +
          '<div class="item-title">'+this.name+'</div>' +
          '<div class="item-after" id="log-'+this.hash+'">'+this.time.String()+'</div>' +
        '</div>' +
      '</div>' +
      '<div class="sortable-handler"></div>' +
    '</li>';
}

Player.prototype.LogUpdate = function() {
  var div = document.getElementById('log-'+this.hash);
  div.innerHTML = this.time.String();
  div.value = this.time.String();
}

///////////////////////////////////
// ROSTER page
///////////////////////////////////
myApp.onPageInit('roster', function (page) {
  // display stored players
  var storedRoster = myApp.formGetData(gCurrentTeam.hash+'-roster');
  if (storedRoster) {
    //alert('storedRoster: '+JSON.stringify(storedRoster));
    for (i=0; i<storedRoster.length; i++) {
      var player = new Player(storedRoster[i].name, storedRoster[i].number, storedRoster[i].phone, storedRoster[i].email, storedRoster[i].hash);
      gRoster.push(player.GetAttributes());
      gPlayers.push(player);
      player.InitHtml();
    }
  }
});

///////////////////////////////////
// PLAYER page
///////////////////////////////////
myApp.onPageInit('player', function (page) {
  // display buttons properly based on new or existing player
  if (gPlayerId == 'addplayer') {
    document.getElementById('player-deletecancel').innerHTML = 'Cancel';
  } else {
    document.getElementById('player-deletecancel').innerHTML = 'Remove Player';
    var player = GetPlayer(gPlayerId);
    if (player) {
      // populate fields
      document.getElementById('player-name').value = player.name;
      document.getElementById('player-number').value = player.number;
      document.getElementById('player-email').value = player.email;
      document.getElementById('player-phone').value = player.phone;
    }
  }

  // save 
  $$('.get-storage-data').on('click', function() {
    var storedData = myApp.formGetData('form-player');
    if (storedData) {
      var player;
      if (gPlayerId == 'addplayer') {
        player = new Player(storedData.name, storedData.number, storedData.phone, storedData.email, null);
        player.Save(true);
        player.InitHtml();
      } else {
        player = new Player(storedData.name, storedData.number, storedData.phone, storedData.email, gPlayerId);
        player.Save(false);
      }
    } else {
      //alert('There is no stored data for this form yet. Try to change any field');
    }
    var storedData = myApp.formDeleteData('form-player');
  });

  // delete/cancel
  $$('.delete-storage-data').on('click', function() {
    if (gPlayerId != 'addplayer') {
      var player = GetPlayer(gPlayerId);
      if (player) {
        if (confirm('Are you sure you wish to remove '+player.name+' from the roster?') == true) {
          player.Delete();
        }
      }
    }
    var storedData = myApp.formDeleteData('form-player');
  });

});
