$(function(){

    /*$("link.favicon").attr("href", $.url('{$favicon}'));

     if (!{$isEmbeddable}){
     $.redirectIFrame();
     }*/

    var symphonyCore = infaw.SymphonyCore.instance();
    symphonyCore.ready();

    if (infaw.SymphonyExtension) {
        symphonyCore.log({message:'Extension Enabled!'});
        infaw.SymphonyExtension.instance().configExtension(function(type){
            var deferred = $.Deferred();

            if (type === 'com.informatica.tools.web.shell.portletContainer') {
                deferred.resolve([{
                    configElem: "portletProvider",
                    workspaceId: "SonataDatasetsWS",
                    portletInstance: {
                        label: 'Mapping',
                        configElem: "portletInstance",
                        configId: "mappingConfig",
                        instanceId: "mappingInstance"
                    }
                }, {
                    closable: "false",
                    configElem: "portletConfigDescriptor",
                    configId: "mappingConfig",
                    portletDescriptorId: "MappingPortlet"
                }, {
                    columnSpan: "1",
                    configElem: "portletDescriptor",
                    defaultPortletConfigId: "mappingConfig",
                    hasDropdown: "false",
                    height: "auto",
                    jsClass: "MappingPortlet",
                    maxHeight: "950",
                    minWidth: "300",
                    package: [],
                    portletId: "MappingPortlet"
                }]);
            } else {
                deferred.resolve([]);
            }


            return deferred.promise();
        });
    }
    
    symphonyCore.configHeader({
        label: 'Sonata',
        search: {
            jsClass: "infaw.AppSearch"
        },
        setting: {
            jsClass: "infaw.AppSetting"
        },
        user: {
            jsClass: "infaw.AppUser"
        },
        help: {
            jsClass: "infaw.AppHelp"
        },
        switcher: {
            jsClass: "infaw.AppSwitch",
            title: 'Informatica Cloud',
            icon: $.url('images/pageHeader/infa-logo.png')
        }
    });

    symphonyCore.configWorkspace({
        workspaces: [{
            jsClass: "SonataProjectWS",
            icon: $.url('res/img/home_color.svg'),
            label: "Project",
            multiTabs: "false",
            workspaceId: "SonataProjectWS"
        },{
            jsClass: "RatingsWS",
            icon: $.url('res/img/user_24x24.svg'),
            label: "Rating",
            multiTabs: "false",
            workspaceId: "RatingsWS"
        },{
            jsClass: "SonataDatasetsWS",
            label: "DataSets",
            multiTabs: "true",
            workspaceId: "SonataDatasetsWS",
            permanent: false
        }]});

});

$.Class("infaw.AppSearch", {
    onSearch: function(objInf) {
    	infaw.SymphonyCore.instance().openObject('SonataDatasetsWS', {id: objInf.objectId});
    },

    onAutoComplete: function(searchTerm, response){
        var curList = [];
        $.each(DemoData.catalog, function(i, cur){
            if(cur.objectName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1){
                curList.push({value: cur.objectName, object: cur});
            }
        });

        return response(curList);
    }
});

$.Class("infaw.AppSetting", {
    onSettingClick: function(){
        infaw.SymphonyCore.instance().addWorkspace({
            jsClass: "SettingWS",
            workspaceId: "SettingWS",
            permanent: false
        });
        infaw.SymphonyCore.instance().selectWorkspace('SettingWS')
    },

    getItems: function() {
        var $deferred = $.Deferred();

        $deferred.resolve([{
            "label": "Settings",
            "icon": "res/img/source.png",
            "onClick": this.onSettingClick
        }])

        return $deferred.promise();

    }
});

$.Class("infaw.AppUser", {

    getItems: function() {
        var $deferred = $.Deferred();

        $deferred.resolve([{
            "label": "Administrator",
            "icon": "res/img/user_24x24.svg"
        }])

        return $deferred.promise();

    }
});

$.Class("infaw.AppHelp", {

    onHelpClick: function(){
        window.open("http://dolphin/");
    },

    onAboutClick: function(){
        new infaw.AboutDialog();
    },

    getItems: function() {
        var $deferred = $.Deferred();

        $deferred.resolve([{
            "label": "Help Contents",
            "icon": "res/img/source.png",
            "onClick": this.onHelpClick
        }, {
            "label": "About",
            "icon": "res/img/source.png",
            "onClick": this.onAboutClick
        }])

        return $deferred.promise();

    }
});

$.Class("infaw.AppSwitch", {
    getItems: function() {
        var $deferred = $.Deferred();

        $deferred.resolve([{
            "label": "Internet of Things",
            "category": "Analytics",
            "icon": "https://pbs.twimg.com/profile_images/590971614545612800/eV8h6rz7_bigger.png",
            "url": "http://www.google.com",
            "openNewWin": false,
            "tooltip": "This will open in the same window"
        }, {
            "label": "Rev Data Preparation",
            "category": "Analytics",
            "icon": "https://pbs.twimg.com/profile_images/650718438273355776/9aE6APLa_bigger.jpg",
            "url": "http://www.yahoo.com",
            "openNewWin": true
        },{
            "label": "Internet of Things",
            "category": "Data Exchange",
            "icon": "https://pbs.twimg.com/profile_images/573984336271122432/k8vEBoCW_bigger.jpeg",
            "url": "http://www.google.com",
            "openNewWin": true
        },{
            "label": "B2B Gateway",
            "category": "Data Governance",
            "icon": "http://www.informatica.com/content/dam/informatica-com/global/amer/us/image/icons/audience-icon-marketing.png",
            "url": "http://www.google.com",
            "openNewWin": true
        },{
            "label": "Business Glossary",
            "category": "Data Governance",
            "icon": "https://pbs.twimg.com/profile_images/573984336271122432/k8vEBoCW_bigger.jpeg",
            "url": "http://www.google.com",
            "openNewWin": true
        },{
            "label": "Business Rules",
            "category": "Data Governance",
            "icon": "https://pbs.twimg.com/profile_images/654833662375174144/g4cFHHt0_bigger.png",
            "url": "http://www.google.com",
            "openNewWin": true
        },{
            "label": "Data Profiling",
            "category": "Data Governance",
            "icon": "https://pbs.twimg.com/profile_images/573984336271122432/k8vEBoCW_bigger.jpeg",
            "url": "http://www.google.com",
            "openNewWin": true
        },{
            "label": "Integration Design",
            "category": "Data Integration",
            "icon": "https://pbs.twimg.com/profile_images/610513708700139522/ne3Ob_Ey_bigger.jpg",
            "url": "http://www.google.com",
            "openNewWin": true
        },{
            "label": "Internet of Things",
            "category": "More",
            "icon": "https://pbs.twimg.com/profile_images/590971614545612800/eV8h6rz7_bigger.png",
            "url": "http://www.google.com",
            "openNewWin": false,
            "tooltip": "This will open in the same window"
        }, {
            "label": "Rev Data Preparation",
            "category": "More",
            "icon": "https://pbs.twimg.com/profile_images/650718438273355776/9aE6APLa_bigger.jpg",
            "url": "http://www.yahoo.com",
            "openNewWin": true
        },{
            "label": "Internet of Things",
            "category": "More",
            "icon": "https://pbs.twimg.com/profile_images/573984336271122432/k8vEBoCW_bigger.jpeg",
            "url": "http://www.google.com",
            "openNewWin": true
        }])

        return $deferred.promise();

    }
});
