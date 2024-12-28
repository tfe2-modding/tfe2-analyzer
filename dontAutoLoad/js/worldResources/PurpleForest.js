var worldResources_PurpleForest = $hxClasses["worldResources.PurpleForest"] = function(game,id,city,world,position,worldPosition,stage) {
	worldResources_Forest.call(this,game,id,city,world,position,worldPosition,stage,"spr_purpleforest",200,"spr_purpleforest_grow");
};
worldResources_PurpleForest.__name__ = "worldResources.PurpleForest";
worldResources_PurpleForest.__super__ = worldResources_Forest;
worldResources_PurpleForest.prototype = $extend(worldResources_Forest.prototype,{
	get_name: function() {
		return common_Localize.lo("forest");
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
	,__class__: worldResources_PurpleForest
});
