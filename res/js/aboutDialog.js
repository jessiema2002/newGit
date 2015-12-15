$.Class('infaw.AboutDialog', {
	init: function(options) {

		var createUI = function(items) {

			$.blockRequireTemplate({"res/tmpl/aboutContent.htm": "aboutTmpl"}).then(function () {
				var container = $('<div>').appendTo($dialog);
				container.html($.tmpl("aboutTmpl"));
			});

			$('.productSwitcher-title').append('<img style="padding:5px 0 0 10px;" src="res/img/infa-logo.png">');
		};
		
		var $dialog = $('<div id="'+$.htmlId()+'"></div>').infaDialog({
			title: "",
			canClose: true,
			closeOnEscape: true,
			close: function() {
				$(this).infaDialog('destroy').remove();
			},
			position: {my:'bottom', at:'center', collision:'fit'},
			draggable: true,
			width: 450,
			autoOpen: true,
			titleClass: 'productSwitcher-title'
		});

		createUI();

		
	}

});