
infaw.portlet.AbstractPortlet.extend('HeaderPortlet', {

	$objName: null,

	init: function(blockElementId, instanceId, customPropMap) {
		this._super(blockElementId, instanceId, customPropMap);
		
		var $el = this.getPortletElem();

		$el.css('padding', '0px');
	},

	updateUI: function(objInfo) {

		this._createHeader(objInfo);

		var h = [], $container = $('<div id="' + $.htmlId('headerText') + '" class="ldmHeaderPortlet"></div>')
						.appendTo(this.getPortletElem())
						.css('padding-top', '20px');

		h.push('<div class="ldmHeaderContainer">')
		this._addProperty(h, 'Asset Type', objInfo.type);
		this._addProperty(h, 'Department', objInfo.department);
		this._addProperty(h, 'Owner', objInfo.owner);

		this.$objName = objInfo.objectName;

		h.push('</div>');
		$container.html(h.join(''));

		this._createDropdown($container);

	},

	_addProperty : function(h, label, value) {
		if(value) {
			h.push('<span class="ldmHeaderPanel-title">' + label + ': </span>');
			h.push('<span class="ldmHeaderPanel-subtitle" title="' + value + '"> ' + value + '</span>');
		}
	},

	_createHeader: function(objInfo) {
		this.getPortletElem().empty();

		var $hdDiv = $('<div></div>').appendTo(this.getPortletElem());
		var $mainToggle = $hdDiv.addClass('ldmViewTogglePanel').css('width', '100%'),
				h = [];

		var nameDiv = $('<div class="ldmViewTogglePanel-title"></div>').appendTo($mainToggle);

		if (objInfo.icon) {
			h.push('<img src="' + $.url(objInfo.icon) + '" height="24" width="24"/>' + '&nbsp;');
		}
		h.push('<span class="ldmViewTogglePanel-name">' + $.infa.Formats.escapeComprehensive(objInfo.objectName) + '</span>');
		nameDiv.html(h.join(''));

		$('<div class="ldmViewTogglePanel-close"></div>').appendTo($mainToggle)
				.infaButton({
					shape: 'iconic',
					height: 20,
					width: 20,
					icon: $.url('images/common/close.svg'),
					activeOOFColor: '#000'
				}).on('onSelect', function () {
			infaw.SymphonyCore.instance().getActiveWorkspace().removeInstance(objInfo.objectId);
		});
	},
	
	_createDropdown: function($el){
		$('<div id="dropdown" style="float:right;"><select id="dropdownMenu"><option id="default" selected disabled>Add to Project</option></select></div>').appendTo($el);
		
		var $dropdown = $("#dropdown #dropdownMenu");
		
		var	self = this;
	
		$.each(DemoData.projects, function(i, proj){
			$dropdown.append("<option>" + proj.name + "</option>");
		});
		
		$dropdown.on("change", function(e, v){
			var pName = $(e.currentTarget).val();
			
			$dropdown.find('option').removeAttr('selected');
			$dropdown.find('#default').attr('selected', 'selected');
			
			$.each(DemoData.projects, function(i, proj){
				if(pName === proj.name){
					if(!proj.sonataSources)
						proj.sonataSources = [];
					
					if($.inArray(self.$objName, proj.sonataSources) === -1)
						proj.sonataSources.push(self.$objName);
				}
			});

			infaw.SymphonyCore.instance().selectWorkspace('SonataProjectWS').then(function(projWS) {
				projWS.createProjectLayout();
			});
		});
	}

});