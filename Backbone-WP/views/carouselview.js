app.CarouselView = Backbone.View.extend({

	className: 'carousel is-animated__slide-right',

	events: {
		'click .carousel-item a': 'goToItem'
	},

	timingConfig: {
		slideStatic: 4000,
		slideTransition: 750,
		slideTotal: 4750,
		headlineFade: 250,
		scrollToTop: 750
	},

	initialize: function(opts) {
		var that = this;
		
		this.$returnHomeAnchor = $('#return-home-anchor');

		if (app.carouselCollection) {
			this.render();
			app.pubSub.trigger('carouselLoaded');
		} else {
			app.carouselCollection = [];

			$.when( 
				app.perspectives.fetch(),
				app.caseStudies.fetch(),
				app.newsArticles.fetch(),
				app.postType.fetch()
			 ).done(function() {

			 	app.perspectives.each(function(model) {
			 		model.set({
			 			typeLabel: app.postType.attributes.perspectives.name
			 		});
			 	});

			 	app.newsArticles.each(function(model) {
			 		model.set({
			 			typeLabel: app.postType.attributes.news.name
			 		});
			 	});

			 	app.caseStudies.each(function(model) {
			 		model.set({
			 			typeLabel: app.postType.attributes.casestudies.name
			 		});
			 	});

				app.carouselCollection.push(
					app.perspectives.where({ part_of_carousel: true }),
					app.caseStudies.where({ part_of_carousel: true }),
					app.newsArticles.where({ part_of_carousel: true })
				);
				
				app.carouselCollection = _.chain(app.carouselCollection)
					.flatten()
					.sortBy(function(n){ return n.attributes.date; })
					.reverse()
					.value();

				that.render();
				app.pubSub.trigger('carouselLoaded');
			});
		}
		this.$returnHomeAnchor.addClass('is-invisible');

		app.pubSub.on('openingSwipeEnded', this.handleOpeningSwipeEnd, this);
		app.pubSub.on('pauseCarousel', this.handleCarouselPause, this);
		app.pubSub.on('resumeCarousel', this.handleCarouselResume, this);
	},

	render: function() {
		this.$el.empty();
		_.each(app.carouselCollection, function(carouselItem, index) {
			if (index === 0) {
				this.renderCarouselItem(carouselItem, index, true);
			}
			this.renderCarouselItem(carouselItem, index, false);
		}, this);
		return this;
	},

	renderCarouselItem: function(carouselItem, itemNumber, isCopy) {
		var carouselItemView = new app.CarouselItemView({ 
			model: carouselItem,
			itemNumber: itemNumber,
			isCopy: isCopy
		});
		this.$el.append( carouselItemView.render().el );
	},

	goToItem: function(e) {
		e.preventDefault();
		var pathname = e.target.pathname;
		app.router.navigate(pathname, {trigger: true});
	},

	handleOpeningSwipeEnd: function(args) {
		var that = this;

		that.categories = $('.carousel-item-category');
		that.titles = $('.carousel-item-title');

		// that.slideStartTime = Date.now();
		// that.addFadeAnim(that.categories, that.titles);
		// that.startHeadlineFadeAnim();
		// that.removeFadeAnimTimer();

		app.pubSub.off('openingSwipeEnded', that.handleOpeningSwipeEnd);
	},

	handleCarouselPause: function() {
		var that = this;

		app.$body.addClass('is-scrollable');
		app.$html.addClass('is-scrollable');
		that.$el.addClass('is-animated__pause');

		// clearTimeout(that.removeFadeTimeout);
		// clearInterval(that.startHeadlineFadeInterval);

		// that.slidePausedTime = Date.now();
		// that.slideElapsedTime = that.slidePausedTime - that.slideStartTime;

		//loop over total elapsed time, reducing it until have only the current slide's 'elapsed time'
		// while (!that.slideRemainingTime) {		
		// 	if (that.slideElapsedTime > that.timingConfig.slideTotal) {
		// 		that.slideElapsedTime = that.slideElapsedTime - that.timingConfig.slideTotal;
		// 	} else {
		// 		that.slideRemainingTime = that.timingConfig.slideTotal - that.slideElapsedTime;
		// 	}
		// }
	},

	handleCarouselResume: function() {
		var that = this;

		body.animate({scrollTop: 0}, that.timingConfig.scrollToTop);
		html.animate({scrollTop: 0}, that.timingConfig.scrollToTop);

		app.$body.removeClass('is-scrollable');
		app.$html.removeClass('is-scrollable');
		that.$el.removeClass('is-animated__pause');

		// that.slideResumeTime = Date.now();
		// that.slideStartTime = that.slideStartTime + (that.slideResumeTime - that.slidePausedTime);

		// setTimeout(function() {
		// 	that.addFadeAnim(that.categories, that.titles);
		// 	that.startHeadlineFadeAnim();
		// 	that.removeFadeAnimTimer();

		// 	that.slideRemainingTime = false;
		// }, that.slideRemainingTime);

	},

	// startHeadlineFadeAnim: function() { 
	// 	var that = this;

	// 	that.removeFadeAnimTimer();

	// 	that.startHeadlineFadeInterval = setInterval(function() {
	// 		that.addFadeAnim(that.categories, that.titles);
	// 		that.removeFadeAnimTimer();
	// 	}, that.timingConfig.slideTotal);
	// },

	// removeFadeAnimTimer: function() { 
	// 	var that = this;
	// 	that.removeFadeTimeout = setTimeout(function() {
	// 		that.removeFadeAnim(that.categories, that.titles);
	// 	}, that.timingConfig.slideStatic);
	// },

	// addFadeAnim: function(category, title) { 
	// 	var that = this;
	// 	category.addClass('is-animated__fade-slide');
	// 	setTimeout(function() {
	// 		title.addClass('is-animated__fade-slide');
	// 	}, that.timingConfig.headlineFade);
	// },

	// removeFadeAnim: function(category, title) { 
	// 	category.removeClass('is-animated__fade-slide');
	// 	title.removeClass('is-animated__fade-slide');
	// }
});