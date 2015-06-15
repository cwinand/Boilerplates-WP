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