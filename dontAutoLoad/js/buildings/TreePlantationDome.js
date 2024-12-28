var buildings_TreePlantationDome = $hxClasses["buildings.TreePlantationDome"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_TreePlantation.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.treesCutTextures = Resources.getTexturesByWidth("spr_treeplantation_dome_trees",20);
	this.regrowTextures = Resources.getTexturesByWidth("spr_treeplantation_dome_trees_grow",20);
	this.treesSprite.texture = this.regrowTextures[0];
	this.initialMaterials = 90;
};
buildings_TreePlantationDome.__name__ = "buildings.TreePlantationDome";
buildings_TreePlantationDome.__super__ = buildings_TreePlantation;
buildings_TreePlantationDome.prototype = $extend(buildings_TreePlantation.prototype,{
	getExtraTreeGrowth: function() {
		return 2 * (1 + this.getEffectsOfAdjecentBuildings("increaseTreeGrowth"));
	}
	,__class__: buildings_TreePlantationDome
});
