var worldResources_PineForest = $hxClasses["worldResources.PineForest"] = function(game,id,city,world,position,worldPosition,stage) {
	worldResources_Forest.call(this,game,id,city,world,position,worldPosition,stage,"spr_pineforest",200,"spr_pineforest_grow");
};
worldResources_PineForest.__name__ = "worldResources.PineForest";
worldResources_PineForest.__super__ = worldResources_Forest;
worldResources_PineForest.prototype = $extend(worldResources_Forest.prototype,{
	get_name: function() {
		return common_Localize.lo("pine_forest");
	}
	,get_regrowSpeed: function() {
		return 0.005;
	}
	,get_treeClimbX: function() {
		return 15;
	}
	,get_treeClimbY: function() {
		return 3;
	}
	,__class__: worldResources_PineForest
});
