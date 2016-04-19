///////////////////////////////////
// in, out
///////////////////////////////////
var inDisplay  = SegmentDisplayFactory('in');
var outDisplay = SegmentDisplayFactory('out');

window.setInterval('inOutAnimate()', 100);
function inOutAnimate() {
  inDisplay.setValue('in ');
  outDisplay.setValue('out');
  //window.setTimeout('inOutAnimate()', 100);
}

///////////////////////////////////
// SWAP MODE
///////////////////////////////////
gCycleMode = true;
function GameSwapMode(id) {
  if (id == 'game-cycle') {
    gCycleMode = true;
    document.getElementById('game-cycle').setAttribute('class','button button-raised button-fill');
    document.getElementById('game-manual').setAttribute('class','button button-raised');
  } else {
    gCycleMode = false;
    document.getElementById('game-cycle').setAttribute('class','button button-raised');
    document.getElementById('game-manual').setAttribute('class','button button-raised button-fill');
  }
}
function IsCycleMode() { return gCycleMode; }
function IsManualMode() { return !gCycleMode; }

///////////////////////////////////
// SKIP buttons
///////////////////////////////////
function InOut(label) {
  this.label    = label;
  this.color    = label == 'Bench' ? 'red' : 'green';
  this.players  = []; // array of player objects
  this.selected = -1;
}

InOut.prototype.Clean = function() {
  this.players.splice(0, this.players.length);
  this.selected = -1;
}


InOut.prototype.Skip = function() {
  if (this.selected != -1 ) {
    var i = this.selected + 1;
    if (i >= this.players.length)
      i = 0;
    this.Deselect(this.selected);
    this.Select(i);
  }
}

InOut.prototype.GetHtml = function(player) {
  var nameStr = player.name;
  return '<a href="#" id="game-'+player.hash+'" class="button color-'+this.color+'" onclick="g'+this.label+'.Choose(this.id)">'+player.number+' - '+nameStr.toUpperCase()+'</a>'
}

InOut.prototype.AddHtml = function(player) {
  // properly place in array
  var div = document.getElementById('game-'+this.label);
  div.innerHTML = div.innerHTML + this.GetHtml(player);
}

InOut.prototype.Deselect = function(index) {
  var a = document.getElementById('game-'+this.players[index].hash);
  a.setAttribute('class','button color-'+this.color);
  this.selected = -1;
}

InOut.prototype.Select = function(index) {
  var a = document.getElementById('game-'+this.players[index].hash);
  a.setAttribute('class','button color-'+this.color+' button-fill');
  this.selected = index;
}

InOut.prototype.InitHtml = function() {
  for (i=0; i<this.players.length; i++) {
    this.AddHtml(this.players[i]);
  }
  if (this.players.length > 0)
    this.Select(0)
}

InOut.prototype.RemoveHtml = function(player) {
  // remove item inserted by innerHTML...
  var element = document.getElementById('game-'+player.hash); // will return element
  element.parentNode.removeChild(element); // will remove the element from DOM
}

InOut.prototype.GetPlayerIndex = function(id) {
  for (i=0; i<this.players.length; i++) {
    if ('game-'+this.players[i].hash == id)
      return i;
  }
  return -1;
}

///////////////////////////////////
// MANUAL mode select
///////////////////////////////////
InOut.prototype.Choose = function(id) {
  if (IsManualMode()) {
    var i = this.GetPlayerIndex(id);
    this.Deselect(this.selected);
    this.Select(i);
  }
}

InOut.prototype.Add = function(player) {
  this.players.push(player);
  this.AddHtml(player);
// not working:
//  if (this.selected == -1 && this.players.length == 1)
//    this.Select(0);
}

InOut.prototype.InsertHtml = function(player, tail) {
  var div           = document.getElementById('game-'+this.label);
  var node          = div.childNodes[tail?this.players.length-1:this.selected];
  var newnode       = document.createElement('a');
  newnode.href      = '#';
  newnode.id        = 'game-'+player.hash;
  newnode.className = 'button color-'+this.color;
  newnode.setAttribute('onclick','g'+this.label+'.Choose(this.id)');
  var nameStr = player.name;
  newnode.innerHTML = player.number+' - '+nameStr.toUpperCase();
  div.insertBefore(newnode, node);
}

InOut.prototype.Insert = function(player, tail) {
  if (IsCycleMode()) {
     // insert before selected
    if (tail) {
      this.players.splice(this.players.length, 0, player);
      this.InsertHtml(player, true);
    } else {
      this.players.splice(this.selected, 0, player);
      this.InsertHtml(player, false);
      this.selected++;
      if (this.selected >= this.players.length)
        this.selected = 0;
    }
  } else { // Manual mode
    // insert at selected
    this.players.splice(this.selected, 0, player);
    this.InsertHtml(player, true);
  }
}

InOut.prototype.Remove = function(index) {
  this.RemoveHtml(this.players[index]);
  var player = this.players.splice(index, 1);

  // update selected index
  if (IsCycleMode()) {
    if (this.players.length == 0)
      this.selected = -1;
    else if (index == this.players.length)
      this.selected = 0;
    else if (index < this.selected)
      this.selected--;
    this.Select(this.selected); // highlight
  }

  return player ? player[0] : null; // splice returns an array of removed elements
}

var gInGame = new InOut('InGame');
var gBench = new InOut('Bench');

function Players() {
  return gInGame.players;
}

function Bench() {
  return gBench.players;
}
///////////////////////////////////
// SUB button
///////////////////////////////////
function GameSub() {
  if (gBench.players.length == 0)
    return;

  if (gInGame.players.length < gCurrentTeam.nPlayersIn) {
    // add players to in-game
    var benchIndex = gBench.selected;
    gBench.Skip(); // point to next in line
    gInGame.Add(gBench.players[benchIndex]); // add to in-game
    gBench.Remove(benchIndex); // remove from bench
    if (gInGame.selected == -1)
      gInGame.Select(0);
  } else {
    // swap players on bench with those in-game
    var benchTail   = gBench.selected == gBench.players.length-1;
    var playingTail = gInGame.selected == gInGame.players.length-1;
    var benching = gInGame.Remove(gInGame.selected);
    var playing  = gBench.Remove(gBench.selected);
    gBench.Insert(benching, benchTail);
    gInGame.Insert(playing, playingTail);
  } // TODO:!!! swap w/o moving selected, use IsCycleMode()/IsManualMode() to determine how it should update
}

//TODO: disable SUB if no players on bench

///////////////////////////////////
// UNDO button
///////////////////////////////////
function GameUndo() {
  //undo last swap
}

///////////////////////////////////
// END GAME link
///////////////////////////////////
function GameClear() {
  gInGame.Clean(); // TODO: consider a Game() class which contains a bench, ingame players
  gBench.Clean();
  // hide Log link
  LogInitHtml(true);
  // reset End Game link
  var elem = document.getElementById('game-end');
  elem.setAttribute('class', 'link');
}

function GameEnd() {
  var elem = document.getElementById('game-end');
  if (confirm('Are you sure you wish to end this game?') == true) {
    GameClear();
    elem.setAttribute('class', 'back link');
  }
  else
    elem.setAttribute('class', 'link');
}

// TODO: add feature to add players from roster to bench if more show up

///////////////////////////////////
// PAGE
///////////////////////////////////
myApp.onPageInit('game', function (page) {
  console.log(page);
  gBench.InitHtml();
  LogInitHtml(false);
});
