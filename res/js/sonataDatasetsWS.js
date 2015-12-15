infaw.workspace.PaneledWorkspace.extend('SonataDatasetsWS', {
	
	initialize : function(blockElementId, instanceId, config) {
		this._super(blockElementId, instanceId, config);

		infaw.SymphonyCore.instance().configPortlet([{
			configElem: "portletProvider",
			workspaceId: "SonataDatasetsWS",
			portletInstance: {
				configElem: "portletInstance",
				configId: "headerConfig",
				instanceId: "headerInstance",
				position: "1"
			}
		}, {
			closable: "false",
			configElem: "portletConfigDescriptor",
			configId: "headerConfig",
			portletDescriptorId: "HeaderPortlet",
		},{
			columnSpan: "2",
			configElem: "portletDescriptor",
			defaultPortletConfigId: "headerConfig",
			hasDropdown: "false",
			hasHeader: "false",
			cssClass: 'ldmHeaderPanel',
			height: "auto",
			jsClass: "HeaderPortlet",
			package: [],
			portletId: "HeaderPortlet"
		}, {
			configElem: "portletProvider",
			workspaceId: "SonataDatasetsWS",
			portletInstance: {
				label: 'Properties',
				configElem: "portletInstance",
				configId: "propertyConfig",
				instanceId: "propertyInstance",
				position: "1"
			}
		}, {
			closable: "false",
			configElem: "portletConfigDescriptor",
			configId: "propertyConfig",
			portletDescriptorId: "PropertyPortlet",
		},{
			columnSpan: "1",
			configElem: "portletDescriptor",
			defaultPortletConfigId: "propertyConfig",
			hasDropdown: "false",
			height: "auto",
			jsClass: "PropertyPortlet",
			minWidth: "300",
			package: [],
			portletId: "PropertyPortlet"
		},{
			configElem: "portletProvider",
			workspaceId: "SonataDatasetsWS",
			portletInstance: {
				label: 'Data Quality',
				configElem: "portletInstance",
				configId: "dataQualityConfig",
				instanceId: "dataQualityInstance",
				position: "3"
			}
		}, {
			closable: "false",
			configElem: "portletConfigDescriptor",
			configId: "dataQualityConfig",
			portletDescriptorId: "DataQualityPortlet",
		},{
			columnSpan: "1",
			configElem: "portletDescriptor",
			defaultPortletConfigId: "dataQualityConfig",
			hasDropdown: "false",
			height: "auto",
			jsClass: "DataQualityPortlet",
			maxHeight: "950",
			minWidth: "300",
			package: [],
			portletId: "DataQualityPortlet"
		}]);

    },

	init : function() {
		this.getColumnCount = function() {
			return 2;
		};
		
		/*this.getRowHeight = function() {
			return 850;
		},*/

		this.openObject = function(objectInfo) {
			if(this.isInstanceExists(objectInfo.id)) {
				this.selectInstance(objectInfo.id);
			} else {
				var self = this, icon,
					data = DemoData.getObject(objectInfo.id);

				switch(data.type) {
					case 'Glossary Term':
						icon = 'res/img/business_term_24x24.svg';
						break;
					case 'View':
						icon = 'res/img/view_24x24.svg';
						break;
					case 'Column':
						icon = 'res/img/column_24x24.svg';
						break;
					case 'Table':
						icon = 'res/img/table_24x24.svg';
						break;
					case 'BI Report':
						icon = 'res/img/report_24x24.svg';
						break;
					case 'Data Domain':
						icon = 'res/img/data_domain_24x24.svg';
						break;
					default:
						icon = 'res/img/generic_24x24.svg';
				}
				data.icon = icon;

				return $.when(self.addInstance({
					instanceId : objectInfo.id,
					instanceName: data.objectName,
					icon: $.url(icon),
					groupId: 'dataAssets',
					groupLabel: 'Data Assets'
				})).then(function(instanceDivId) {

					$('#' + instanceDivId).addClass('ldmPortletContainer').css('overflow', 'hidden');
					var $container = $('<div></div>').appendTo('#' + instanceDivId).portletContainer({
	    				parentId: "SonataDatasetsWS",
	    				columns: 2,
	    				resizable: false,
	    				gutterWidth: 20,
	    				gutterHeight: 20,
	    				data: data,
	    				lazy: true
	    			});

					var _portletContainer = $.getWidget($container, 'portletContainer');

	                return _portletContainer.createPortlets().then(function () {
	                    
	                    var $portlets = _portletContainer.getPortlets();
	                    for(var i = 0; i < $portlets.length; i++) {
	                    	 _portletContainer.getPortletInstance($portlets[i]).updateUI(data);
	                    }
	                });
				});

			}
		};
	},

/**
	 * Called when browser history state changed (HTML5 History/State API)
	 * back & forward button - 'onpopstate' event)
	 * Can be deferred;
	 */
	onPopState: function(stateObj, oldStateObj) {
		var self = this;

		this._onPopState = true;
		this._super(stateObj, oldStateObj).done(function() {
			self._onPopState = false;
		});
	},

	_formatAndPushState: function(instance) {
		if(!this._onPopState) {
			var instanceId = instance.id,
					stateObj = this.getWorkspaceStateObj();

			stateObj.$obj = instanceId;

			this.pushStateURL(stateObj);
		}
	},

	processStateURL: function(stateObj, onPopState) {
		var objId = stateObj.$obj;
		if(objId) {
			this.openObject({
				id: objId
			});
		} else {
			// Remove workspace
			this._workspaceMgr.removeWorkspace(this._instanceId);
		}
	},
});