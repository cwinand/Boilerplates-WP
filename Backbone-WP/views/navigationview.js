app.NavigationView =  Backbone.View.extend({
	
	events: {
		'click a': 'navigateToTarget'
	},

	bgColors: ['#FF7E00', '#00A92A', '#0099E6', '#7F32A6'],

	initialize: function() {
		app.pubSub.on('navToggle', this.toggleNavMenu, this);
	},

	navigateToTarget: function (e) {
		e.preventDefault();
		
		var pathname = e.target.pathname,
			that = this;
			
		app.router.navigate(pathname, {trigger: true});

		that.toggleNavMenu();

	},

	toggleNavMenu: function() {
		var that = this;
		app.pubSub.trigger('flipBurger');

		if (that.$el.hasClass('open')) {
			that.$el.addClass('fade-out');
			setTimeout(function(){
				that.$el.removeClass('open fade-out');
				that.$el.removeAttr('style');
			}, 250);
		} else {
			var color = that.bgColors[_.random(that.bgColors.length)];
			that.$el.css('background-color', color);
			that.$el.addClass('open');
		}
	}
});