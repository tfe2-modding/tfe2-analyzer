var worldResources_ForestSnow = $hxClasses["worldResources.ForestSnow"] = function(game,id,city,world,position,worldPosition,stage) {
	worldResources_Forest.call(this,game,id,city,world,position,worldPosition,stage,"spr_forest_snow",200,"spr_forest_snow_grow");
};
worldResources_ForestSnow.__name__ = "worldResources.ForestSnow";
worldResources_ForestSnow.__super__ = worldResources_Forest;
worldResources_ForestSnow.prototype = $extend(worldResources_Forest.prototype,{
	get_name: function() {
		return common_Localize.lo("forest");
	}
	,__class__: worldResources_ForestSnow
});
