app.CustomType = Backbone.Collection.extend({ 
	model: app.CaseStudy,
	url: '/wordpress/wp-json/posts?type=customtype'
});

app.caseStudies = new app.CustomTypes();