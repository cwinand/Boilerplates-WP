var $ = jQuery, app = app || {};
app.ArchiveItemView = Backbone.View.extend({

	className: 'archive-item',
	template: wp.template('item-archive-template'),

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

});
app.ArchiveView = Backbone.View.extend({

	className: "archive",

	events: {
		'click .archive-item a': 'goToItem'
	},

	initialize: function(opts) {
		var that = this;
		this.archiveCollection = {};

		switch (opts.archiveRoute) {
			case 'casestudies':
				if (app.caseStudies) {
					this.archiveCollection = app.caseStudies;					
				} else {
					this.archiveCollection = new app.CaseStudies();
					app.caseStudies = this.archiveCollection;
				}
				break;
			case 'perspectives':
				if (app.perspectives) {
					this.archiveCollection = app.perspectives;					
				} else {
					this.archiveCollection = new app.Perspectives();
					app.perspectives = this.archiveCollection;
				}
				break;
			case 'news':
				if (app.news) {
					this.archiveCollection = app.news;					
				} else {
					this.archiveCollection = new app.NewsArticles();
					app.news = this.archiveCollection;
				}
				break;
			default:
				break;
		}

		if (this.archiveCollection.length > 0) {
			this.render();
		} else if (opts.archiveRoute){
			this.archiveCollection.fetch({ 
				success: function() {
					that.render();
				}
			});
		}
	},

	render: function() {
		this.archiveCollection.each(function(archiveItem) {
			this.renderArchiveItem(archiveItem);
		}, this);
		return this;
	},

	renderArchiveItem: function(archiveItem) {
		var archiveItemView = new app.ArchiveItemView({ model: archiveItem });
		this.$el.append( archiveItemView.render().el );
	},

	goToItem: function(e) {
		e.preventDefault();
		var pathname = e.target.pathname;
		app.router.navigate(pathname, {trigger: true});
	}
});
app.CareersFormView = Backbone.View.extend({

	el: '#application',

	initialize: function() {
		var that = this;

		this.formEl = this.$el;
		this.inputEls = this.formEl.children('input');
		this.inputs = {};
		_.each(that.inputEls, function(input, index){
			var inputName = input.getAttribute('name');

			that.inputs[inputName] = input;
		});
	},

	events: {
		'submit': 'submitForm',
		'keydown input': 'handleKeypress',
		'blur input': 'handleBlur',
		'click button': 'uploadFile'
	},

	handleKeypress: function(e) {
		var inputEl = $(e.target),
			inputElLabel = this.$el.find('label[for=' + inputEl.attr('name') + ']');

		if (e.which !== 9) { //don't fire on tab keydown
			inputElLabel.addClass('active').removeClass('locked');
			inputEl.addClass('processing');

		}
	},

	handleBlur: function(e) {
		var inputEl = $(e.target),
			inputName = e.target.name,
			inputElLabel = this.$el.find('label[for=' + inputEl.attr('name') + ']');

		switch (inputName) {
			case "fname":
			case "lname":
			case "email":
				if (inputEl.val().trim() === '') {
					inputEl.attr({
						placeholder: 'This is required',
						class: 'negative'
					});	
				} else {
					inputEl.addClass('positive').removeClass('negative');
				}
				inputElLabel.addClass('locked').removeClass('active');
				inputEl.removeClass('processing');
				break;

			case "phone":
				if (inputEl.val().trim() === '') {
					inputElLabel.removeClass('active');
					inputEl.removeClass();
				} else {
					inputEl.addClass('positive').removeClass('negative');
					inputElLabel.addClass('locked').removeClass('active');
				}
				inputEl.removeClass('processing');
				break;

			case "portfolio":
			case "linkedin":
			case "website":
			case "referrer":
				if (inputEl.val().trim() === '') {
					inputElLabel.removeClass('active');
					inputEl.removeClass();
				} else {
					inputEl.addClass('positive').removeClass('negative');
					inputElLabel.addClass('locked').removeClass('active');
				}
				inputEl.removeClass('processing');
				break;

			case "resume": 
				break;
				
			default:
				break;

		}
	},



	validateFields: function() {
		var fname = $(this.inputs.fname).val(),
			lname = $(this.inputs.lname).val(),
			email = $(this.inputs.email).val();

		if (fname !== "" && lname !== "" && email !== "") {
			return true;
		}
	},

	uploadFile: function(evt) {
		var that = this;

		$(that.inputs.resume).click();
		$(that.inputs.resume).on('change', function(e) {
			if (that.inputs.resume.files[0].size <= 10000000) {
				$('.file-upload').css('border', '2px solid lime')
								 .text(that.inputs.resume.files[0].name);
			} else {
				that.inputs.resume.value = "";
				$('.file-upload').css('border', '2px solid red')
								 .text("File size must be less than 10MB");

			}

		});
	},

	submitForm: function(evt) {
		evt.preventDefault();
		var that = this;

		 if ( this.validateFields() ){
			var applicationData = new FormData(this.el);
			applicationData.append('action', 'sendApplication');

			var request = $.ajax({
				url: WPAjax.ajaxurl,
				method: 'POST',
				data: applicationData,
				processData: false,
				contentType: false
			});

			request.done(function(response) {
				console.log(response);

				var newHeight = that.formEl.height();
				$('.application-container').height(newHeight)
									   .children('h2').text('Success!');
				that.formEl.remove();

			});
		}
	}
});
app.CarouselItemView = Backbone.View.extend({

	template: wp.template('item-carousel-template'),

	initialize: function(opts) {
		this.$el.addClass('item' + opts.itemNumber);
		if (opts.isCopy) {
			this.$el.addClass('copy');
		}
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}

});
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
app.ContactFormView = Backbone.View.extend({

	el: '#contact',

	initialize: function() {
		var that = this;

		this.formEl = this.$el;
		this.inputEls = this.formEl.children('input');
		this.inputs = {};
		
		_.each(that.inputEls, function(input, index){
			var inputName = input.getAttribute('name');

			that.inputs[inputName] = input;
		});

	},

	events: {
		'submit': 'submitForm',
		'keydown input': 'handleKeypress',
		'blur input': 'handleBlur'
	},

	handleKeypress: function(e) {
		var inputEl = $(e.target),
			inputElLabel = this.$el.find('label[for=' + inputEl.attr('name') + ']');

		if (e.which !== 9) { //don't fire on tab keydown
			inputElLabel.addClass('active').removeClass('locked');
			inputEl.addClass('processing');
		}
	},

	handleBlur: function(e) {
		var inputEl = $(e.target),
			inputName = e.target.name,
			inputElLabel = this.$el.find('label[for=' + inputEl.attr('name') + ']');

		switch (inputName) {
			case "fname":
			case "lname":
			case "email":
				if (inputEl.val().trim() === "") {
					inputEl.attr({
						placeholder: 'This is required',
						class: 'negative'
					});
				} else {
					inputEl.addClass('positive').removeClass('negative');
				}

				inputElLabel.addClass('locked').removeClass('active');
				inputEl.removeClass('processing');
				break;

			case "phone":
				if (inputEl.val().trim() === '') {
					inputElLabel.removeClass('active');
					inputEl.removeClass();
				} else {
					inputEl.addClass('positive').removeClass('negative');
					inputElLabel.addClass('locked').removeClass('active');
				}
				inputEl.removeClass('processing');
				break;
			case "message":
				break;

		}
	},



	validateFields: function() {
		var fname = $(this.inputs.fname).val(),
			lname = $(this.inputs.lname).val(),
			email = $(this.inputs.email).val();

		if (fname !== "" && lname !== "" && email !== "") {
			return true;
		}

	},

	submitForm: function(evt) {
		evt.preventDefault();
		var that = this;
		 if ( this.validateFields() ){
			var applicationData = new FormData(this.el);
			applicationData.append('action', 'sendContactForm');

			var request = $.ajax({
				url: WPAjax.ajaxurl,
				method: 'POST',
				data: applicationData,
				processData: false,
				contentType: false
			});

			request.done(function(response) {
				console.log(response);

				var newHeight = that.formEl.height();
				$('.contact-container').height(newHeight)
									   .children('h2').text('Success!');
				that.formEl.remove();
			});
		}
	}
});
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
app.PageView = Backbone.View.extend({

	initialize: function(opts) {
		var that = this;

		this.pageModel = app.pages.get(opts.page);
		this.template = wp.template("page-" + opts.page + "-template");
		
		if (this.pageModel) {
			if (opts.page === 'culture') {
			
				this.render();
				$('#content').empty().html(this.$el);
				window.picturefill();
			}
			else {
				this.render();
			}
		} else {
			this.pageModel = new app.Page({id: opts.page});
			app.pages.add(this.pageModel);

			this.pageModel.fetch({ 
				success: function() {
					if (opts.page !== 'culture') {
						if (opts.page === 'what-we-do') {
							that.pageModel.attributes.nextPost = app.caseStudies.models[0].attributes;
							that.pageModel.attributes.prevPost = app.caseStudies.models[1].attributes;
						}
						that.render();

						if (opts.page === 'careers') {
							app.pubSub.trigger('initCareerForm');
						} else if (opts.page === "contact") {
							app.pubSub.trigger('initContactForm');
						}
					} else {

						//temporary solution to avoid re-writing generation of culture page in JS
						$.get(window.location.href).done(function(data) {
							
							that.pageModel.attributes.content = $(data).find('#content').html();
							$('#content').empty().html(that.pageModel.attributes.content);
							window.picturefill();
						});

					}
				}
			});
		}

	},

	render: function() {
		this.$el.html(this.template(this.pageModel.attributes));
		return this;
	}
});
app.SinglePostView = Backbone.View.extend({
	
	events: {
		'click .next-prev a': 'navigateToTarget'
	},

	initialize: function(opts) {
		var that = this;
		this.viewCollection = app[opts.collectionName];
		this.template = wp.template("single-" + opts.postType + "-template");

		this.postModel = this.viewCollection.get(opts.page);
 
		if (this.postModel) {
			
			if (!this.postModel.attributes.nextPost || !this.postModel.attributes.prevPost) {
				
				that.getNextPrev();
			}
			this.render();
		} else {
			this.viewCollection.fetch({
				success: function() {
					that.postModel = that.viewCollection.get(opts.page);
					
					that.getNextPrev();
					that.render();
				}
			});
		}
	},

	getNextPrev: function() {
		var models = this.viewCollection.models,
			postModelIndex = _.indexOf(models, this.postModel);

		if (postModelIndex !== -1) {		

			if (postModelIndex === 0 ) {

				this.postModel.attributes.nextPost = models[postModelIndex + 1].attributes;
				this.postModel.attributes.prevPost = models[models.length - 1].attributes;

			} else if (postModelIndex + 1 === models.length) {
				
				this.postModel.attributes.nextPost = models[0].attributes;
				this.postModel.attributes.prevPost = models[postModelIndex - 1].attributes;

			} else {

				this.postModel.attributes.nextPost = models[postModelIndex + 1].attributes;
				this.postModel.attributes.prevPost = models[postModelIndex - 1].attributes;
			}
		}
	},

	navigateToTarget: function (e) {
		e.preventDefault();
		
		var pathname = e.target.pathname,
			that = this;

		app.router.navigate(pathname, {trigger: true});
	},

	setParallax: function() {
		var w = $(window),
			parallaxEl = this.$el.children('.parallax'),
			parallaxElTitle = parallaxEl.children('.article-title');

		w.on('scroll', function(){
			var pos = w.scrollTop() / 3,
				headerTranslateVal = 'translateY(' + pos + 'px)',
				titleTranslateVal = 'translateY(-' + pos + 'px)';

			parallaxEl.css({
				transform: headerTranslateVal
			});
			
			parallaxElTitle.css({
				transform: titleTranslateVal
			});
		});
	},

	render: function() {
		this.$el.html(this.template(this.postModel.attributes));
		this.setParallax();
		return this;
	}
});
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