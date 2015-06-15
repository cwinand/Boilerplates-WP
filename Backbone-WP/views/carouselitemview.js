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