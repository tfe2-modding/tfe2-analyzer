var worldResources_BranchyForest = $hxClasses["worldResources.BranchyForest"] = function(game,id,city,world,position,worldPosition,stage) {
	worldResources_Forest.call(this,game,id,city,world,position,worldPosition,stage,"spr_forest_branches",200,"spr_forest_branches_grow");
};
worldResources_BranchyForest.__name__ = "worldResources.BranchyForest";
worldResources_BranchyForest.__super__ = worldResources_Forest;
worldResources_BranchyForest.prototype = $extend(worldResources_Forest.prototype,{
	get_name: function() {
		return common_Localize.lo("buildableWorldResourcesInfo.json/BranchyForest.name");
	}
	,get_regrowSpeed: function() {
		return 0.005;
	}
	,get_treeClimbX: function() {
		return 16;
	}
	,get_treeClimbY: function() {
		return 12;
	}
	,createMainWindowPart: function() {
		this.city.gui.windowAddInfoText("Texture by DT from the Discord, who won the first art contest!");
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
		worldResources_Forest.prototype.createMainWindowPart.call(this);
	}
	,__class__: worldResources_BranchyForest
});
