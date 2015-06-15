$(document).ready(function() {
	app.pubSub = _.extend({}, Backbone.Events);
	app.$html = $('html');
	app.$body = $('body');

	app.mainNavigation = new app.NavigationView( { el: '#site-navigation' } );
	app.hamburgerButton = new app.HamburgerView( {el: '#hamburger-menu'} );

	app.wiperView = new app.WiperView();

	app.router = new app.AppRouter();

	$('#return-home-anchor').on('click', function(e) {
		e.preventDefault();

		var pathname = e.currentTarget.pathname,
			that = this;

		app.router.navigate(pathname, {trigger: true});
		if ($(e.currentTarget).hasClass('nav-opened')) {
			app.pubSub.trigger('navToggle');
		}
	});
	
	Backbone.history.start({ 
		pushState: true,
		hashChange: false
	});
});