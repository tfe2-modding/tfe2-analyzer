var buildings_buildingDrawers_CustomizableBuildingDrawer = $hxClasses["buildings.buildingDrawers.CustomizableBuildingDrawer"] = function(building,stage,bgStage,standardTextureName) {
	this.backTexture = null;
	this.frontTextureWithDoor = null;
	this.frontTextureNoDoor = null;
	buildings_buildingDrawers_NormalBuildingDrawer.call(this,building,stage,bgStage,standardTextureName);
};
buildings_buildingDrawers_CustomizableBuildingDrawer.__name__ = "buildings.buildingDrawers.CustomizableBuildingDrawer";
buildings_buildingDrawers_CustomizableBuildingDrawer.__super__ = buildings_buildingDrawers_NormalBuildingDrawer;
buildings_buildingDrawers_CustomizableBuildingDrawer.prototype = $extend(buildings_buildingDrawers_NormalBuildingDrawer.prototype,{
	positionSprites: function() {
		this.sprite.position.set(this.building.position.x,this.building.position.y);
		this.bgSprite.position.set(this.building.position.x,this.building.position.y);
		var customTexture = this.frontTextureNoDoor;
		var mainSpriteRect = new common_Rectangle(0,0,20,20);
		if(this.building.worldPosition.y == 0) {
			mainSpriteRect.x += 22;
			customTexture = this.frontTextureWithDoor;
		}
		var tmp = customTexture != null ? customTexture : Resources.getTexture(this.currentTextureName,mainSpriteRect);
		this.sprite.texture = tmp;
		this.stage.isInvalid = true;
		this.bgStage.isInvalid = true;
	}
	,setCustomTextures: function(frontTextureNoDoor,frontTextureWithDoor,backTexture) {
		this.frontTextureNoDoor = frontTextureNoDoor;
		this.frontTextureWithDoor = frontTextureWithDoor;
		this.backTexture = backTexture;
		if(backTexture != null) {
			this.bgSprite.texture = backTexture;
			this.bgStage.isInvalid = true;
		}
		this.positionSprites();
	}
	,__class__: buildings_buildingDrawers_CustomizableBuildingDrawer
});
