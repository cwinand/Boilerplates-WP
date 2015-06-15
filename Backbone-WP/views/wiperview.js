app.WiperView = Backbone.View.extend({

	el: '#wiper',

	events: {
		'animationend': 'handleOpeningSwipeEnd',
		'webkitAnimationEnd': 'handleOpeningSwipeEnd'
	},

	initialize: function() {
		this.$wiperLogo = $('.wiper-logo');
		this.$returnHomeAnchor = $('#return-home-anchor');

		this.$wiperLogo.children().addClass('is-animated__fade-slide');

		app.pubSub.on('carouselLoaded', this.startOpeningSwipe, this);
		app.pubSub.on('swipeToPage', this.handleSwipeToPage, this);
		app.pubSub.on('swipeToCarousel', this.handleSwipeToCarousel, this);
		app.pubSub.on('swipeToArticle', this.handleSwipeToArticle, this);
		app.pubSub.on('swipeToArchive', this.handleSwipeToArchive, this);
	},

	startOpeningSwipe: function() {
		this.$el.addClass('is-animated__opening-swipe');
		this.$wiperLogo.addClass('is-animated__logo-slide');
	},

	handleOpeningSwipeEnd: function(e) {
		app.pubSub.trigger('openingSwipeEnded', e.originalEvent);
	},

	handleSwipeToCarousel: function(from) {
		this.$wiperLogo.removeClass('is-hidden');

		if (from && !_.isEmpty(app.carouselCollection)) {

			this.$el.removeClass().show();
			this.$el.addClass('is-animated__opening-swipe');
			this.$returnHomeAnchor.addClass('is-invisible');
			this.$wiperLogo.children()
						   .removeClass('fade-out')
						   .addClass('is-animated__fade-slide');

			switch (from) {
				case 'article':

					break;

				case 'page':
		   
					// need swipe animation
					break;
				case 'archive':
   
					//what animation goes to/from archive
					break;
			}
		} else if (from) {

		}
	},
	handleSwipeToPage: function(from) {
		if (from) {
			switch (from) {
				case 'carousel':
					this.$el.removeClass().hide();
					this.$returnHomeAnchor.removeClass('is-invisible');
					this.$wiperLogo.children()
								   .removeClass('is-animated__fade-slide')
								   .addClass('fade-out');
					// this.$el.addClass('is-animated__swipe-down-counter');
					break;

				case 'article':
					// need swipe animation
					break;
				case 'archive':
					break;
			}
		} else {
			// this.$el.addClass('load-page-view');
		}
	},
	handleSwipeToArticle: function(from) {
		if (from) {
			switch (from) {
				case 'carousel':
					this.$el.removeClass().hide();
					this.$returnHomeAnchor.removeClass('is-invisible');
					this.$wiperLogo.children()
								   .removeClass('is-animated__fade-slide')
								   .addClass('fade-out');
					// this.$el.addClass('is-animated__swipe-down-clock');
					// app.pubSub.trigger('pauseCarousel');
					break;

				case 'page':
					break;
				case 'archive':
					break;
			}
		} else {
			// this.$el.addClass('load-article-view');
		}
	},
	handleSwipeToArchive: function(from) {
		if (from) {
			switch (from) {
				case 'carousel':
					this.$el.removeClass().hide();
					this.$returnHomeAnchor.removeClass('is-invisible');
					this.$wiperLogo.children()
								   .removeClass('is-animated__fade-slide')
								   .addClass('fade-out');
					break;
				case 'page':
					break;
				case 'article':
					break;
			}
		}
	}
});