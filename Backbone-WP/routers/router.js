app.AppRouter = Backbone.Router.extend({

	routes: {
		'(/)': 'home',
		'/:posttype/:page(/)': 'getArticle',
		'/casestudies(/)': 'getArchive',
		'/perspectives(/)': 'getArchive',
		'/news(/)': 'getArchive',
		'/:page(/)': 'getPage'
	},

	home: function() {

		app.carouselView = app.carouselView || new app.CarouselView({previousView: app.previousView});

		$('#carousel-container').html(app.carouselView.render().el);
		$('#content').empty();
		app.$body.addClass('is-not-scrollable');
		app.$body.removeClass('page post');
		$(window).off('scroll');

		app.pubSub.trigger('swipeToCarousel', app.previousView);
		app.previousView = 'carousel';
	},

	getPage: function (page) {
		if (page === 'what-we-do') {
			if (app.caseStudies.isEmpty()) {
				app.caseStudies = new app.CaseStudies();
				app.caseStudies.fetch({
					success: function() {
						app.singlePageView = new app.PageView({ page: page });
						$('#content').html(app.singlePageView.el);	
					}
				});
			} else {
				app.singlePageView = new app.PageView({ page: page });
				$('#content').html(app.singlePageView.el);	
			}
		} else {
			
			app.singlePageView = new app.PageView({ page: page });
			$('#content').html(app.singlePageView.el);			
		}

		$('#carousel-container').empty();
		window.scrollTo(0,0);
		$(window).off('scroll');

		app.$body.addClass('is-scrollable page');
		app.$body.removeClass('post archive is-not-scrollable');
		
		if (page === 'careers') {
			app.pubSub.on('initCareerForm', function(){
				app.careersFormView = new app.CareersFormView();
			});
		} else 	if (page === 'contact') {
			app.pubSub.on('initContactForm', function(){
				app.contactFormView = new app.ContactFormView();
			});
		}

		app.pubSub.trigger('swipeToPage', app.previousView);
		app.previousView = 'page';
	},

	getArticle: function(postType, page) {
		var collectionName;
		switch (postType){

			case "customtypes":
				collectionName = "customTypes";
				break;

			default:
				break;
		}

		app.singlePostView = new app.SinglePostView({ 
			collectionName: collectionName,
			postType: postType,
			page: page 
		});

		$('#content').html(app.singlePostView.el);
		$('#carousel-container').empty();
		window.scrollTo(0,0);

		app.$body.addClass('is-scrollable post');
		app.$body.removeClass('page archive is-not-scrollable');

		app.pubSub.trigger('swipeToArticle', app.previousView);
		app.previousView = 'article';
	},

	getArchive: function() {
			//get the archive route
			var splitPath = document.location.pathname.split('/').reverse();
			var archiveRoute = _.without(splitPath, '')[0];
			app.archiveView = new app.ArchiveView({ archiveRoute: archiveRoute });

			$('#content').html(app.archiveView.el);
			$('#carousel-container').empty();
			window.scrollTo(0,0);
			$(window).off('scroll');

			app.$body.addClass('is-scrollable archive');
			app.$body.removeClass('page post is-not-scrollable');

		app.pubSub.trigger('swipeToArchive', app.previousView);
		app.previousView = 'archive';
	}


});

