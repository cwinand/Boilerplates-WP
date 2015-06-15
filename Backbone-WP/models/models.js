var $ = jQuery, app = app || {};
app.CustomType = Backbone.Model.extend({
	idAttribute: "slug"
});

app.Page = Backbone.Model.extend({
	defaults: {
		title: '',
		content: ''
	}
});

app.Post = Backbone.Model.extend({
	defaults: {
		title: '',
		content: ''
	}
});

app.PostType = Backbone.Model.extend({
	url: '/wordpress/wp-json/posts/types'
});
app.postType = new app.PostType();