function DateHash() {
  var d = new Date();
  return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+':'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
}

///////////////////////////////////
// Team class
///////////////////////////////////
function Team(name, /*template,*/ nPlayersIn, hash) {
  this.name       = name;
  //  this.template = template;
  this.nPlayersIn = nPlayersIn;
  if (hash) { // stored team
    this.hash = hash;
  } else { // new team
    this.hash = this.name + '_' + DateHash();
  }
}

Team.prototype.Save = function(newteam) {
  var storedData;

  // save team's settings
  var teamSettings =
    {name:this.name, /*template:this.template,*/ nPlayersIn:this.nPlayersIn, hash:this.hash}
  storedData = myApp.formStoreData(this.hash, teamSettings);

  if (newteam) {
    // add team's hash to set of hashes
    gTeamHashes.push(this.hash);
    storedData = myApp.formStoreData('team-hashes', gTeamHashes);
    gCurrentTeam = this;
    gTeamId = this.hash;
  }
}

Team.prototype.Delete = function() {
  // remove team hash from list of hashes
  var index = gTeamHashes.indexOf(this.hash);
  if (index > -1) {
    gTeamHashes.splice(index, 1);
  }
  storedData = myApp.formStoreData('team-hashes', gTeamHashes);

  myApp.formDeleteData(this.hash);

  // remove link inserted by innerHTML...
  var element = document.getElementById(this.hash); // will return element
  element.parentNode.removeChild(element); // will remove the element from DOM

  // delete roster
  myApp.formDeleteData(this.hash+'-roster');

  // TODO: uncheck 'Enable demo team' under settings
  // how do I do that for an initialized/uninitialized page?
}

Team.prototype.InitHtml = function() {
  // populate team under mainmenu
  var ul = document.getElementById('mainmenu');
  ul.innerHTML = ul.innerHTML + '<li><a id="'+this.hash+'" href="team.html" class="item-link" onclick="GetTeamId(this.id)"><div class="item-content"><div class="item-inner"><div class="item-title">'+this.name+'</div></div></div></a></li>';
}

///////////////////////////////////
// globals
///////////////////////////////////
var gTeams = [];
var gTeamHashes = []; // act as indexes to gTeams
var gTeamId = '';
var gCurrentTeam = null;

function GetTeamId(id) {
  gTeamId = id;
}

function GetTeam(hash) {
  for (i=0; i<gTeams.length; i++) {
    if (gTeams[i].hash == hash) {
      return gTeams[i];
    }
  }
  return null;
}

///////////////////////////////////
// initialization
// needed for index page
///////////////////////////////////
{
  // init stored teams
  var storedData = myApp.formGetData('team-hashes');
  if (storedData) {
    gTeamHashes = storedData;

    for (i=0; i<gTeamHashes.length; i++) {
      // load individual team
      var hash = gTeamHashes[i];
      storedData = myApp.formGetData(hash);
      if (storedData) {
        //alert('Init: '+JSON.stringify(storedData));
        var team = new Team(storedData.name, /*storedData.template,*/ storedData.nPlayersIn, hash);
        gTeams.push(team); // add team to set
        team.InitHtml();
      }
    }
  }
}

///////////////////////////////////
// team page
///////////////////////////////////
myApp.onPageInit('team', function (page) {
  // display buttons properly based on new or existing team
  if (gTeamId == 'addteam') {
    document.getElementById('team-deletecancel').innerHTML = 'Cancel';
    document.getElementById('team-roster').setAttribute('disabled','disabled');
    document.getElementById('team-contact').setAttribute('disabled','disabled');
    document.getElementById('team-game').setAttribute('disabled','disabled');
    gCurrentTeam = null;
  } else {
    document.getElementById('team-deletecancel').innerHTML = 'Delete Team';
    document.getElementById('team-roster').removeAttribute('disabled');
    document.getElementById('team-contact').removeAttribute('disabled');
    document.getElementById('team-game').removeAttribute('disabled');
    gCurrentTeam = GetTeam(gTeamId);
    if (gCurrentTeam) {
      // populate fields
      document.getElementById('team-name').value = gCurrentTeam.name;
      //document.getElementById('team-template').value = gCurrentTeam.template;
      document.getElementById('team-nPlayersIn').value = gCurrentTeam.nPlayersIn;
    }
  }

  // save 
  $$('.get-storage-data').on('click', function() {
    var storedData = myApp.formGetData('form-team');
    if (storedData) {
      if (gTeamId == 'addteam') {
        var team = new Team(storedData.name, /*storedData.template,*/ storedData.nPlayersIn, null);
        team.Save(true);
        gTeams.push(team); // add team to set
        team.InitHtml();
        // enable fields now that a team is saved
        document.getElementById('team-deletecancel').innerHTML = 'Delete Team';
        document.getElementById('team-roster').removeAttribute('disabled');
        document.getElementById('team-contact').removeAttribute('disabled');
        document.getElementById('team-game').removeAttribute('disabled');
      } else {
        if (gCurrentTeam) {
          gCurrentTeam.name = storedData.name;
          //gCurrentTeam.template = storedData.template;
          gCurrentTeam.nPlayersIn = storedData.nPlayersIn;
          gCurrentTeam.Save(false);
        }
      }
    } else {
      //alert('There is no stored data for this form yet. Try to change any field');
    }
    var storedData = myApp.formDeleteData('form-team');
  });

  // delete/cancel
  $$('.delete-storage-data').on('click', function() {
    if (gTeamId != 'addteam') {
      if (gCurrentTeam) {
        if (confirm('Are you sure you wish to delete the '+gCurrentTeam.name+'  team?') == true) {
          gCurrentTeam.Delete();
          gCurrentTeam = null;
        }
      }
    }
    var storedData = myApp.formDeleteData('form-team');
  });
});
