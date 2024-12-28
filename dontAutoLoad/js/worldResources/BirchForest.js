var worldResources_BirchForest = $hxClasses["worldResources.BirchForest"] = function(game,id,city,world,position,worldPosition,stage) {
	worldResources_Forest.call(this,game,id,city,world,position,worldPosition,stage,"spr_birchforest",120,"spr_pineforest_grow");
};
worldResources_BirchForest.__name__ = "worldResources.BirchForest";
worldResources_BirchForest.__super__ = worldResources_Forest;
worldResources_BirchForest.prototype = $extend(worldResources_Forest.prototype,{
	get_name: function() {
		return "Pine Forest";
	}
	,get_regrowSpeed: function() {
		return 0.01;
	}
	,get_treeClimbX: function() {
		return 12;
	}
	,get_treeClimbY: function() {
		return 13;
	}
	,__class__: worldResources_BirchForest
});
