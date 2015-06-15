app.ArchiveItemView = Backbone.View.extend({

	className: 'archive-item',
	template: wp.template('item-archive-template'),

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

});