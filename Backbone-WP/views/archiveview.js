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