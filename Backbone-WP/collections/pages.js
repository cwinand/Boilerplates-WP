app.Pages = Backbone.Collection.extend({ 
	model: app.Page,
	url: '/wordpress/wp-json/pages' 
});

app.pages = new app.Pages();