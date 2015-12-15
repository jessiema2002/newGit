
infaw.portlet.AbstractPortlet.extend('PropertyPortlet', {
	
	$objGrid: null,
	
	$objName: null,
	
	init: function(blockElementId, instanceId, customPropMap) {
		var self = this;
		self._super(blockElementId, instanceId, customPropMap);
		
		var $el = this.getPortletElem();
		$el.addClass('ldmPortletContainer');

		self.$objGrid = $('<div></div>').appendTo($el);

		self.$objGrid = this.$objGrid.infaDataGrid({
			altRows: false,
			sortable: true,
			readOnly: true,
			width: 500,
			rownumbers: false,
			columnInfo:[
				{name:'property',label:'Property', width:'35%', resizable: false},
				{name:'value',label:'Value', width:'65%', resizable: false}
			]
		});

		$(window).on('pageresize', function() {
			var grid = $.getWidget(self.$objGrid, 'infaDataGrid');
			if (grid) {
				grid.setWidth($el.width());
			}
		});

		
		
	},
	
	updateUI: function(objInfo) {
		var objGrid = $.getWidget(this.$objGrid, 'infaDataGrid');
		objGrid.setWidth(this.getPortletElem().width());

		for(var property in objInfo){
			if (property == 'objectName') {
				this.$objName = objInfo[property];
			}
			if (property == 'application'||
				property == 'businessDomain' ||
					property == 'color' ||
					property == 'dataSteward' ||
					property == 'department' ||
					property == 'description' ||
					property == 'lastUpdated' ||
					property == 'resource' ||
					property == 'usedBy' ||
					property == 'location' ||
					property == 'relDomains' ||
					property == 'relPeople' ||
					property == 'relTerms' ||
					property == 'size' ||
					property == 'tags') {
				if (objInfo[property]) {
					objGrid.addRow(
							{
								"property": property,
								"value": objInfo[property],
							});;
				}
			}

		}
	}

});