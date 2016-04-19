///////////////////////////////////
// START
///////////////////////////////////
myApp.onPageInit('contact-email', function (page) {
});

///////////////////////////////////
// RESET
///////////////////////////////////
myApp.onPageInit('contact-text', function (page) {
});

///////////////////////////////////
// NONE / ALL
///////////////////////////////////
gContactAll = true;
function ContactWho(id) {
  var roster = myApp.formGetData(gCurrentTeam.hash+'-roster');
  if (id == 'contact-select-none') {
    gContactAll = false;
    document.getElementById('contact-select-none').setAttribute('class','button button-raised button-fill');
    document.getElementById('contact-select-all').setAttribute('class','button button-raised');
    if (roster) {
      for (i=0; i<roster.length; i++) {
        var a = document.getElementById('contact-select-'+roster[i].hash);
        if (a)
          a.removeAttribute('checked');
      }
    }
  } else {
    gContactAll = true;
    document.getElementById('contact-select-none').setAttribute('class','button button-raised');
    document.getElementById('contact-select-all').setAttribute('class','button button-raised button-fill');
    if (roster) {
      for (i=0; i<roster.length; i++) {
        var a = document.getElementById('contact-select-'+roster[i].hash);
        if (a)
          a.setAttribute('checked','checked');
      }
    }
  }
}

///////////////////////////////////
// SELECT PAGE
///////////////////////////////////
myApp.onPageBack('contact-select', function (page) {
});

myApp.onPageInit('contact-select', function (page) {
  console.log(page);
  var roster = myApp.formGetData(gCurrentTeam.hash+'-roster');
  if (roster) {
    var ul = document.getElementById('contact-roster-select');
    for (i=0; i<roster.length; i++) {
      ul.innerHTML = ul.innerHTML +
        '<li>' +
          '<label class="label-checkbox item-content">' +
            '<input type="checkbox" id="contact-select-'+roster[i].hash+'" checked="checked"/>' +
            '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>' +
            '<div class="item-inner">' +
              '<div class="item-title">'+roster[i].name+'</div>' +
            '</div>' +
          '</label>' +
        '</li>';
    }
  }
});

///////////////////////////////////
// COMPOSE PAGE
///////////////////////////////////
function Compose() {
  alert('TODO');
//http://www.idangero.us/framework7/docs/form-ajax-submit.html
}