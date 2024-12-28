var worldResources_RedForest = $hxClasses["worldResources.RedForest"] = function(game,id,city,world,position,worldPosition,stage) {
	worldResources_Forest.call(this,game,id,city,world,position,worldPosition,stage,"spr_redforest",200,"spr_redforest_grow");
};
worldResources_RedForest.__name__ = "worldResources.RedForest";
worldResources_RedForest.__super__ = worldResources_Forest;
worldResources_RedForest.prototype = $extend(worldResources_Forest.prototype,{
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
	,__class__: worldResources_RedForest
});
