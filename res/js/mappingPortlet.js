infaw.graphicalCanvas.GraphModel.extend("infaw.showcase.graphicalCanvas.SampleGraphModel",
	{
	},
	{

		_wrappedInputs: [],
		_wrappedOutputs: [],

		attachObject: function(object){
			this.object = object;
			this._wrappedInputs.splice(0, this._wrappedInputs.length);
			this._wrappedOutputs.splice(0, this._wrappedOutputs.length);
		},

		/**
		 * Get all nodes that have no input group or no incoming links
		 *
		 */
		getBaseObjects: function(){
			var mapping = this.getObject();

			var baseObjects = $.extend([], mapping.transformations);

			if(mapping.links !== undefined){
				$.each(mapping.links, function(i, link){
					baseObjects = jQuery.grep(baseObjects, function(object){
						return object === link.toTx;
					}, true);
				});
			}

			return baseObjects;
		},

		/**
		 * Get any nodes that the output groups of the node connects to
		 */
		getNextObjects: function(tTx){
			var nextObjects = [];
			var mapping = this.getObject();
			if(mapping.links !== undefined){
				$.each(mapping.links, function(i, link){
					if(link.fromTx === tTx){
						nextObjects.push(link.toTx);
					}
				});
			}

			return nextObjects;
		},

		hasNextObjects: function(tTx) {
			var hasNext = false;
			var mapping = this.getObject();
			if(mapping.links !== undefined){
				$.each(mapping.links, function(i, link){
					if(link.fromTx === tTx){
						hasNext = true;
						return;
					}
				});
			}

			return hasNext;
		},

		/**
		 * Get all the output groups
		 */
		getOutputs: function(object){
			var toReturn = [];
			var self = this;
			if(object.groups !== undefined){
				$.each(object.groups, function (i, group){
					if(group.output){
						var output = self._wrapInputOutput(object, group, false);
						toReturn.push(output);
					}
				});
			}

			return toReturn;
		},

		/**
		 * Get all the input groups
		 */
		getInputs: function(object){
			var toReturn = [];
			var self = this;
			if(object.groups !== undefined){
				$.each(object.groups, function (i, group){
					if(group.input){
						var input = self._wrapInputOutput(object, group, true);
						toReturn.push(input);
					}
				});
			}

			return toReturn;
		},


		/**
		 * Get the link that associates these two nodes
		 */
		getLinks: function(fromObject, toObject) {
			var mapping = this.getObject();
			var toReturn = [];
			$.each(mapping.links, function(i, link){
				if(link.fromTx == fromObject && link.toTx == toObject){
					toReturn.push(link);
					return;
				}
			});
			return toReturn;
		},

		/**
		 * Return the group that feeds into this link
		 */
		getInput: function(link){
			return this._wrapInputOutput(link.toTx, link.toGroup, true);
		},

		/**
		 * Return the group that this link feeds into
		 */
		getOutput: function(link){
			return this._wrapInputOutput(link.fromTx, link.fromGroup, false);
		},

		isInput: function(object){
			return (object.input === true);
		},

		isOutput: function(object){
			return (object.input === false);
		},

		_wrapInputOutput : function(object, group, input){
			var returnWrap = this._lookupWrap(object, group, input);
			if(returnWrap === undefined){
				returnWrap = {object: object, group:group, input : input};
				if(input){
					this._wrappedInputs.push(returnWrap);
				}else{
					this._wrappedOutputs.push(returnWrap);
				}
			}
			return returnWrap;
		},

		_lookupWrap : function(object, group, input){
			var found;

			if(input){//look in input
				$.each(this._wrappedInputs, function(i, wrap){
					if(wrap.object == object && wrap.group == group){
						found = wrap;
						return;
					}
				});
			}else{
				$.each(this._wrappedOutputs, function(i, wrap){
					if(wrap.object == object && wrap.group == group){
						found = wrap;
						return;
					}
				});
			}

			return found;
		}
	});

infaw.graphicalCanvas.GraphRenderer.extend("infaw.showcase.graphicalCanvas.SampleGraphRenderer",
		{
			
			init: function(config){
				this._super(config);
				var myOptions = {};
				$.extend(true, myOptions, this.options, {
										nodeWidth:110,
										nodeHeight:30,
										nodeOpts:{
											stroke:1,
											color:'#adadad',
											fill:'#eeeeee',
											radius:4
										},
										anchorOpts:{
											fill:'#ffffff',
											color:'#adadad',
										},
										edgeOpts : {
											color : '#adadad',
											stroke : 2
										},
										edgeTipOpts : {
											color : '#adadad',
											stroke : 1,
											fill : '#adadad',
											size : 5
										},
										edgeRelinkOpts : {
											color : '#555555',
											stroke : 1
										}
										});
				this.options = myOptions;
			},
			
			getImage: function(object){
				var master = $.Deferred();
				var url = 'res/img/source.png';
				var imageObject = new Image();
				imageObject.onload = function(){
					master.resolve(imageObject);
				};
				imageObject.src = $.url(url);
			
				return master.promise();
			}
		});

infaw.portlet.AbstractPortlet.extend('MappingPortlet', {
	$chart: null,
	
	init: function(blockElementId, instanceId, customPropMap) {
		this._super(blockElementId, instanceId, customPropMap);
		var $portlet = this.getPortletElem();
		$portlet.css('padding', '0px');

		var graphModel = new infaw.showcase.graphicalCanvas.SampleGraphModel();
		var graphRenderer = new infaw.showcase.graphicalCanvas.SampleGraphRenderer({ 
            _canvas : this.$chart 
        }); 
		this.$chart = $portlet.graphicalCanvas({graphModel: graphModel,graphRenderer: graphRenderer});

	},
	
	updateUI: function(objInfo) {
		var chart = $.getWidget(this.$chart, 'graphicalCanvas');
		var src = objInfo.ultimateSources.split(',');
		var dst = objInfo.ultimateDestinations.split(',');
		var itm = objInfo.intermediaryDestinations.split(',');

		var sourceTx = [];
		var tgtTx = [];
		var expTx = [];

		var sourceGroup = {
			name: 'outputGroup',
			output: true,
			input: false
		};

		var expGroup = {
			name: 'inputOuputGroup',
			input: true,
			output: true
		};

		var tgtGroup = {
			name: 'inputGroup',
			output: false,
			input: true
		};

		$.each(DemoData.catalog, function(i, cur){
			$.each(src, function(j, node) {
				if (cur.objectId == node) {
					sourceTx.push({
						name:cur.objectName,
						groups: [sourceGroup],
						type: 'source'
					});
					return false;
				}
			});
			$.each(dst, function(j, node) {
				if (cur.objectId == node) {
					tgtTx.push({
						name:cur.objectName,
						groups: [tgtGroup],
						type: 'target'
					});
					return false;
				}
			});
			$.each(itm, function(j, node) {
				if (cur.objectId == node) {
					expTx.push({
						name:cur.objectName,
						groups: [expGroup],
						type: 'expression'
					});
					return false;
				}
			});
		});


		var mapping = {
			name: 'TestMapping',
			transformations: [sourceTx[0], expTx[0], tgtTx[0]],
			links: [{fromTx: sourceTx[0], fromGroup: sourceGroup, toTx: expTx[0], toGroup: expGroup},
				{fromTx: expTx[0], fromGroup: expGroup, toTx: tgtTx[0], toGroup: tgtGroup}]
		};

		chart.setInput(mapping);
	}

});