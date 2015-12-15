
infaw.portlet.AbstractPortlet.extend('DataQualityPortlet', {
	$chart: null,
	
	init: function(blockElementId, instanceId, customPropMap) {
		this._super(blockElementId, instanceId, customPropMap);
		var $portlet = this.getPortletElem();				
		
		this.$chart = $portlet.infaLineChart({
			width: 450,
			height: 300,
			data: [10,1,2,-3,3,3,4,5,3,4,-4,10,20,40,15,10,-19,20]
		});
		
	},
	
	updateUI: function(objInfo) {
		var chart = $.getWidget(this.$chart, 'infaLineChart');
		chart.updateData(objInfo.dataQuality.split(', '));
	}

});