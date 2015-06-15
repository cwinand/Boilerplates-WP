var $ = jQuery, app = app || {};
app.CustomTypes = Backbone.Collection.extend({ 
	model: app.CustomType,
	url: '/wordpress/wp-json/posts?type=customtypes'
});
app.customTypes = new app.CustomTypes();

app.Pages = Backbone.Collection.extend({ 
	model: app.Page,
	url: '/wordpress/wp-json/pages' 
});
app.pages = new app.Pages();

app.Posts = Backbone.Collection.extend({ 
	model: app.Post,
	url: '/wordpress/wp-json/posts'
});
app.posts = new app.Posts();