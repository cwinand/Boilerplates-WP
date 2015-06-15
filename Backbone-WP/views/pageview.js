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