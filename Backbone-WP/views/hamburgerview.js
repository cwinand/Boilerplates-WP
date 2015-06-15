app.HamburgerView = Backbone.View.extend({

	events: {
		'click': 'toggleNavMenu'
	},

	initialize: function() {
		this.$returnHomeAnchor = $('#return-home-anchor');
		app.pubSub.on('flipBurger', this.flipBurger, this);
	},

	toggleNavMenu: function(evt) {
		evt.preventDefault();
		app.pubSub.trigger('navToggle');
	},

	flipBurger: function() {
		this.$el.toggleClass('opened closed');
		this.$returnHomeAnchor.toggleClass('nav-opened');
		if (this.$returnHomeAnchor.hasClass('is-invisible')){
			this.$returnHomeAnchor.toggleClass('is-invisible');
		}
	}
});