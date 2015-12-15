infaw.workspace.AbstractWorkspace.extend('RatingsWS',{
	
	initialize: function(blockElementId, instanceId){
		this._super(blockElementId, instanceId);
		this.$elem = $("#" + blockElementId);
		this._createRatingLayout();
		this._updateLayout();
	},

	_createRatingLayout: function(){
		
		var $div = $('<div"></div>').attr('id','ratingWS');
		var $title = $('<fieldset></fieldset>').append('<legend>Rated Projects</legend>');
		
		if(DemoData && DemoData.projects){
			$.each(DemoData.projects, function(i, proj){
				if(!proj.ratingStars) {
					var ratingUtils = new infaw.ratingUtils();
					ratingUtils._createProjectRatings();
				}
				var $ratedProject = $('<div>' + proj.name + '</div>').addClass('rated');
				$ratedProject.attr('id', proj.name.replace(/ /g,""));
				$title.append($ratedProject);
				for(var k = 0; k < 5; k++) {
					$ratedProject.append(proj.ratingStars[k]);
				}
				if(proj._currentRating == 0){
					$ratedProject.hide();
				}
			});
		}
		
		$div.append($title);
		this.$elem.addClass('ratingColor');
		this.$elem.append($div);
	},
	
	_updateLayout: function(){
		$('#RatingsWS').on('click', function(){
			$.each(DemoData.projects, function(i, proj){
				var $ratedProject = $('#ratingWS').find('#' + proj.name.replace(/ /g,""));
				for(var k = 0; k < 5; k++) {
					$ratedProject.append(proj.ratingStars[k]);
				}
				$ratedProject.show();
				if(proj._currentRating == 0){
					$ratedProject.hide();
				}
			});
		});
	}
});

$.Class("infaw.ratingUtils", {
	_createProjectRatings: function(){
		var self = this;
		if(DemoData && DemoData.projects){
			$.each(DemoData.projects, function(i, proj){
				proj._currentRating = 0;
				self._createRatingStars(proj);
			});
		}
	},

	_createRatingStars: function(proj){
		var self = this;
		proj.ratingStars = [];
		for(var i = 1; i <= 5; i++) {
			var $star = $('<svg version="1.1" x="0px" y="0px" width="20" height="20" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><polygon points="256,60.082 304.63,209.75 462,209.75 334.686,302.25 383.315,451.918 256,359.418 128.685,451.918    177.315,302.25 50,209.75 207.37,209.75"></polygon></svg>');
			$star.attr('id', i);
			$star.css('cursor', 'pointer');
			if (i==1) {
				$star.css('padding-left', '10px');
			}
			$star.on('click', function(e) {
				self._updateRatingStars(e.currentTarget.id, proj);
			});
			proj.ratingStars.push($star);
		}
		this._updateRatingStars(proj.rating, proj);
	},

	_updateRatingStars: function(rating, proj){
		if(rating > proj._currentRating){
			for(var i = proj._currentRating; i < rating; i++){
				var $star = proj.ratingStars[i].find("polygon");
				$star.css("fill","#333333");
			}
		}else if(rating < proj._currentRating){
			for(var i = rating; i < proj._currentRating; i++){
				var $star = proj.ratingStars[i].find("polygon");
				$star.css("fill","#999999");
			}
		}else if(rating == 1){
			var $star = proj.ratingStars[0].find("polygon");
			$star.css("fill","#999999");
			rating = 0;
			//trigger event for updating ratingWS
		}
		proj._currentRating = rating;
	}
});
