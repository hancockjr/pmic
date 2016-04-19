//http://www.idangero.us/framework7/tutorials/maintain-both-ios-and-material-themes-in-single-app.html
// Determine theme depending on device
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

// Set Template7 global devices flags
Template7.global = {
  android: isAndroid,
  ios: isIos
};

// Export selectors engine
var $$ = Dom7;

// Add CSS Styles
if (isAndroid) {
  $$('head').append(
    '<link rel="stylesheet" href="css/framework7.material.min.css">' +
    '<link rel="stylesheet" href="css/framework7.material.colors.min.css">' +
    '<link rel="stylesheet" href="css/my-app.material.css">'
  );
}
else {
  $$('head').append(
    '<link rel="stylesheet" href="css/framework7.ios.min.css">' +
    '<link rel="stylesheet" href="css/framework7.ios.colors.min.css">' +
    '<link rel="stylesheet" href="css/my-app.ios.css">'
  );
}

// Change Through navbar layout to Fixed
if (isAndroid) {
  // Change class
  $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
  // And move Navbar into Page
  $$('.view .navbar').prependTo('.view .page');
}

// Init App
var myApp = new Framework7({
  // Enable Material theme for Android device only
  material: isAndroid ? true : false,
  // Enable Template7 pages
  template7Pages: true
});

// Init View
var mainView = myApp.addView('.view-main', {
  // Don't worry about that Material doesn't support it
  // F7 will just ignore it for Material theme

  // Because we use fixed-through navbar we can enable dynamic navbar
  dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
  // run createContentPage func after link was clicked
  $$('.create-page').on('click', function () {
    createContentPage();
  });
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
    '<!-- Top Navbar-->' +
    '<div class="navbar">' +
    '  <div class="navbar-inner">' +
    '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
    '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
    '  </div>' +
    '</div>' +
    '<div class="pages">' +
    '  <!-- Page, data-page contains page name-->' +
    '  <div data-page="dynamic-pages" class="page">' +
    '    <!-- Scrollable page content-->' +
    '    <div class="page-content">' +
    '      <div class="content-block">' +
    '        <div class="content-block-inner">' +
    '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
    '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>'
  );
	return;
}
