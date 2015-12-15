infaw.workspace.AbstractWorkspace.extend('SettingWS',
{	
	initialize: function(blockElementId, instanceId, config) {
		var $superDeferred = this._super(blockElementId, instanceId, config);
		
		this.$elem = $("#" + blockElementId);
		var $div = $('<div style="padding:20px;">Sonata Settings...</div>').attr('id', 'settingWS');

		$('<div style="float: right; margin: 20px; line-height: 34px;"></div>').appendTo(this.$elem).infaButton({
			height: 24,
			label: 'Cancel'
		}).on('onSelect', function() {
			infaw.SymphonyCore.instance().removeWorkspace("SettingWS");
		});

		this.$elem.append($div);

		return $superDeferred;
	}
});