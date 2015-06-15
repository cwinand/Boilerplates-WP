app.Posts = Backbone.Collection.extend({ 
	model: app.Post,
	url: '/wordpress/wp-json/posts'
});