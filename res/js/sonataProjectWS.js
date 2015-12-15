infaw.workspace.AbstractWorkspace.extend('SonataProjectWS',
{	
	initialize: function(blockElementId, instanceId, config) {
		var $superDeferred = this._super(blockElementId, instanceId, config);
		
		this.$elem = $("#" + blockElementId);
		this.createProjectLayout();
		this._updateLayout();
		return $superDeferred;
	},
	
	createProjectLayout: function(){
		var $div = $('<div class="infaPortlet"></div>').attr('id', 'sonataProjectsWS');
		
		if(DemoData && DemoData.projects){
			$.each(DemoData.projects, function(i, proj){
				var $fieldset = $('<fieldset></fieldset>').append('<legend>' + proj.name + '</legend>');
				$proj = $('<div></div>')
					.addClass('project')
					.append($fieldset);
				
				if(proj.sonataSources){
					$.each(proj.sonataSources, function(i, src){
						$fieldset.append("<p>" + src + "</p>")
					});
				}
				
				var $rating = $('<div></div>').addClass('rated');
				$rating.attr('id',proj.name.replace(/ /g,"_"));
				if(!proj.ratingStars && infaw.ratingUtils) {
					var ratingUtils = new infaw.ratingUtils();
					ratingUtils._createProjectRatings();
				}
				$.each(proj.ratingStars, function(i, star){
					$rating.append(star);
				});


				$fieldset.append($rating);
				
				$div.append($proj);
			});
		}
		this.$elem.empty();
		this.$elem.append($div);
		
		$('.infaSearchField').val("");
	},
	
	_updateLayout: function(){
		$('#SonataProjectWS').on('click', function(){
			if(DemoData && DemoData.projects){
				$.each(DemoData.projects, function(i, proj){
					var $rating = $('#sonataProjectsWS').find('#' + proj.name.replace(/ /g,"_")); //same id is used twice! should be fixed!
					if(proj.ratingStars){
						$.each(proj.ratingStars, function(i, star){
							$rating.append(star);
						});
					}
				});
			}
		});
	}
}
);