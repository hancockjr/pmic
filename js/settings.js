function Coach() {
  // TODO: see http://www.idangero.us/framework7/docs/accordion.html for coach (or grouped) settings
  return myApp.formGetData('settings-coach');
}

function Settings() {
  return myApp.formGetData('settings-options');
}

function DemoTeamEnable() {
  if (document.getElementById('enable-demo-team').checked) {
    var team = new Team('Demo Team', /*template,*/ 5, 'demo-hash');
    if (team) {
      // add team
      team.Save(true);
      gTeams.push(team); // add team to set
      team.InitHtml();
      // add roster
      var roster = [];
      var player;
      player = new Player('Miles',    '12', null, null, 'demo-hash-miles');  roster.push(player.GetAttributes());
      player = new Player('Hailey',   '23', null, null, 'demo-hash-hailey'); roster.push(player.GetAttributes());
      player = new Player('Clay',     '25', null, null, 'demo-hash-clay');   roster.push(player.GetAttributes());
      player = new Player('Paige',     '3', null, null, 'demo-hash-paige');  roster.push(player.GetAttributes());
      player = new Player('Stephanie','30', null, null, 'demo-hash-steph');  roster.push(player.GetAttributes());
      player = new Player('Chance',   '19', null, null, 'demo-hash-chance'); roster.push(player.GetAttributes());
      player = new Player('Weston',   '29', null, null, 'demo-hash-weston'); roster.push(player.GetAttributes());
      player = new Player('Megan',     '9', null, null, 'demo-hash-megan');  roster.push(player.GetAttributes());
      player = new Player('Kate',     '19', null, null, 'demo-hash-kate');   roster.push(player.GetAttributes());
      player = new Player('Brent',    '31', null, null, 'demo-hash-brent');  roster.push(player.GetAttributes());
      player = new Player('Ethan',    '25', null, null, 'demo-hash-ethan');  roster.push(player.GetAttributes());
      player = new Player('Cody',     '28', null, null, 'demo-hash-cody');   roster.push(player.GetAttributes());
      myApp.formStoreData('demo-hash-roster', roster);
    }
  } else {
    var team = GetTeam('demo-hash');
    if (team) {
      // delete team
      team.Delete();
      // delete roster
      myApp.formDeleteData('demo-hash-roster');
    }
  }
}

function SettingsLinkToggle(id) {
  var isSettings = (id == 'toolbar-settings') ? true : false;
  var elem = document.getElementById(id);
  elem.href = isSettings ? 'settings.html' : '#';
  elem.setAttribute('class', isSettings ? 'link' : 'back link');
  elem.id = 'toolbar-settings' + (isSettings ? '-minimize' : '');
}

myApp.onPageInit('settings', function (page) {

  // do I need this? it seems the info is retained when reloading
  // whenever I need to access a setting from a different JS
  // I can just do "myApp.formGetData('settings-coach').name"

  // to consider:
  // http://www.w3schools.com/bootstrap/bootstrap_ref_js_collapse.asp
});


///////////////////////////////////
// SOUNDS
///////////////////////////////////
