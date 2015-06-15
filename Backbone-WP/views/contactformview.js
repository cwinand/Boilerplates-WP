app.ContactFormView = Backbone.View.extend({

	el: '#contact',

	initialize: function() {
		var that = this;

		this.formEl = this.$el;
		this.inputEls = this.formEl.children('input');
		this.inputs = {};
		
		_.each(that.inputEls, function(input, index){
			var inputName = input.getAttribute('name');

			that.inputs[inputName] = input;
		});

	},

	events: {
		'submit': 'submitForm',
		'keydown input': 'handleKeypress',
		'blur input': 'handleBlur'
	},

	handleKeypress: function(e) {
		var inputEl = $(e.target),
			inputElLabel = this.$el.find('label[for=' + inputEl.attr('name') + ']');

		if (e.which !== 9) { //don't fire on tab keydown
			inputElLabel.addClass('active').removeClass('locked');
			inputEl.addClass('processing');
		}
	},

	handleBlur: function(e) {
		var inputEl = $(e.target),
			inputName = e.target.name,
			inputElLabel = this.$el.find('label[for=' + inputEl.attr('name') + ']');

		switch (inputName) {
			case "fname":
			case "lname":
			case "email":
				if (inputEl.val().trim() === "") {
					inputEl.attr({
						placeholder: 'This is required',
						class: 'negative'
					});
				} else {
					inputEl.addClass('positive').removeClass('negative');
				}

				inputElLabel.addClass('locked').removeClass('active');
				inputEl.removeClass('processing');
				break;

			case "phone":
				if (inputEl.val().trim() === '') {
					inputElLabel.removeClass('active');
					inputEl.removeClass();
				} else {
					inputEl.addClass('positive').removeClass('negative');
					inputElLabel.addClass('locked').removeClass('active');
				}
				inputEl.removeClass('processing');
				break;
			case "message":
				break;

		}
	},



	validateFields: function() {
		var fname = $(this.inputs.fname).val(),
			lname = $(this.inputs.lname).val(),
			email = $(this.inputs.email).val();

		if (fname !== "" && lname !== "" && email !== "") {
			return true;
		}

	},

	submitForm: function(evt) {
		evt.preventDefault();
		var that = this;
		 if ( this.validateFields() ){
			var applicationData = new FormData(this.el);
			applicationData.append('action', 'sendContactForm');

			var request = $.ajax({
				url: WPAjax.ajaxurl,
				method: 'POST',
				data: applicationData,
				processData: false,
				contentType: false
			});

			request.done(function(response) {
				console.log(response);

				var newHeight = that.formEl.height();
				$('.contact-container').height(newHeight)
									   .children('h2').text('Success!');
				that.formEl.remove();
			});
		}
	}
});