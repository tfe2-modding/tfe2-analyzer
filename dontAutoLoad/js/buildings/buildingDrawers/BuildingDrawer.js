var buildings_buildingDrawers_BuildingDrawer = $hxClasses["buildings.buildingDrawers.BuildingDrawer"] = function(building,stage,bgStage,textureName) {
	this.building = building;
	this.stage = stage;
	this.bgStage = bgStage;
	this.currentTextureName = textureName;
	this.currentTextureGroupName = textureName;
	this.canMergeH = false;
	this.canMergeV = false;
	this.canMergeRooftop = false;
};
buildings_buildingDrawers_BuildingDrawer.__name__ = "buildings.buildingDrawers.BuildingDrawer";
buildings_buildingDrawers_BuildingDrawer.prototype = {
	positionSpritesMerging: function() {
	}
	,positionSprites: function() {
	}
	,changeMainTexture: function(textureName) {
		this.currentTextureName = textureName;
		this.currentTextureGroupName = textureName;
	}
	,changeTextureGroup: function(newGroup) {
		this.currentTextureGroupName = newGroup;
	}
	,destroy: function() {
	}
	,__class__: buildings_buildingDrawers_BuildingDrawer
};
