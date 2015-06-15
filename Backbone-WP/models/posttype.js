app.PostType = Backbone.Model.extend({
	url: '/wordpress/wp-json/posts/types'
});

app.postType = new app.PostType();