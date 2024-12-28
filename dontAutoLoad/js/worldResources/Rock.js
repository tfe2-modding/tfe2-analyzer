var worldResources_Rock = $hxClasses["worldResources.Rock"] = function(game,id,city,world,position,worldPosition,stage,texture,resourceAmount) {
	if(resourceAmount == null) {
		resourceAmount = 250;
	}
	if(texture == null) {
		texture = "spr_rock";
	}
	worldResources_LimitedWorldResource.call(this,game,id,city,world,position,worldPosition,stage,texture,resourceAmount);
	this.managementMode = worldResources_RockManagementMode.Mine;
};
worldResources_Rock.__name__ = "worldResources.Rock";
worldResources_Rock.__super__ = worldResources_LimitedWorldResource;
worldResources_Rock.prototype = $extend(worldResources_LimitedWorldResource.prototype,{
	get_name: function() {
		return common_Localize.lo("rock");
	}
	,get_resourceName: function() {
		return "stone";
	}
	,get_doNotGather: function() {
		return this.managementMode == worldResources_RockManagementMode.Protect;
	}
	,setManagementMode: function(mode,noRecursion) {
		if(noRecursion == null) {
			noRecursion = false;
		}
		this.managementMode = mode;
		if(!noRecursion && gui_UpgradeWindowParts.hasMultiUpgradeModeOn) {
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var permanent = _g1[_g];
				++_g;
				if(permanent.is(worldResources_Rock)) {
					permanent.setManagementMode(mode,true);
				}
			}
		}
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		var gui = this.city.gui;
		if(Settings.language == "en") {
			gui.window.minWidth = 195;
		}
		worldResources_LimitedWorldResource.prototype.createMainWindowPart.call(this);
		var titleContainer = gui_UpgradeWindowParts.createHeader(gui,common_Localize.lo("rock_mining"));
		gui_UpgradeWindowParts.addOneAndMaxButtons(gui,titleContainer,function() {
			gui_UpgradeWindowParts.hasMultiUpgradeModeOn = false;
			_gthis.reloadWindow();
		},function() {
			gui_UpgradeWindowParts.hasMultiUpgradeModeOn = true;
			_gthis.reloadWindow();
		},common_Localize.lo("set_management_rock"),function() {
			return "---";
		},function() {
			return common_Localize.lo("set_management_all_rocks") + (" (" + _gthis.city.simulation.stats.amountOfBuildingsOfType(worldResources_Rock) + ").");
		},false);
		gui.windowAddInfoText(gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? common_Localize.lo("rock_management_question_1") + " " : common_Localize.lo("rock_management_question_2") + " ");
		gui_UpgradeWindowParts.createActivatableButton(gui,this.managementMode == worldResources_RockManagementMode.Mine,function() {
			_gthis.setManagementMode(worldResources_RockManagementMode.Mine);
			_gthis.reloadWindow();
		},common_Localize.lo("rock_management_mine"),gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? common_Localize.lo("rock_management_mine_description_1") : common_Localize.lo("rock_management_mine_description_2"));
		gui_UpgradeWindowParts.createActivatableButton(gui,this.managementMode == worldResources_RockManagementMode.Protect,function() {
			_gthis.setManagementMode(worldResources_RockManagementMode.Protect);
			_gthis.reloadWindow();
		},common_Localize.lo("forest_protect"),gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? common_Localize.lo("rock_management_protect_description_1") : common_Localize.lo("rock_management_protect_description_2"));
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		var prioritizeButton = null;
		prioritizeButton = this.city.gui.windowAddBottomButtons([{ text : this.city.simulation.resourcePriorityManager.isPrioritized(this) ? common_Localize.lo("prioritized") : common_Localize.lo("prioritize"), onHover : function() {
			if(_gthis.city.simulation.resourcePriorityManager.isPrioritized(_gthis)) {
				_gthis.city.gui.tooltip.setText(_gthis,common_Localize.lo("rock_prioritized_description"),common_Localize.lo("prioritized"));
			} else {
				_gthis.city.gui.tooltip.setText(_gthis,common_Localize.lo("rock_prioritized_description_2"),common_Localize.lo("prioritize"));
			}
		}, action : function() {
			if(_gthis.city.simulation.resourcePriorityManager.isPrioritized(_gthis)) {
				_gthis.city.simulation.resourcePriorityManager.deprioritize(_gthis);
				prioritizeButton.setText(common_Localize.lo("prioritize"));
			} else {
				_gthis.city.simulation.resourcePriorityManager.prioritize(_gthis);
				prioritizeButton.setText(common_Localize.lo("prioritized"));
			}
		}}])[0];
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		worldResources_LimitedWorldResource.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(worldResources_Rock.saveDefinition);
		}
		var e = this.managementMode;
		queue.addString($hxEnums[e.__enum__].__constructs__[e._hx_index]);
	}
	,load: function(queue,definition) {
		worldResources_LimitedWorldResource.prototype.load.call(this,queue);
		if(queue.version < 39) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"managementMode")) {
			this.managementMode = loadMap.h["managementMode"];
		}
	}
	,__class__: worldResources_Rock
});
