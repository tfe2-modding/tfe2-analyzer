var buildings_buildingDrawers_AutoMergingBuildingDrawerUD = $hxClasses["buildings.buildingDrawers.AutoMergingBuildingDrawerUD"] = function(building,stage,bgStage,textureName) {
	buildings_buildingDrawers_BuildingDrawer.call(this,building,stage,bgStage,textureName);
	this.canMergeH = false;
	this.canMergeV = true;
	this.bgSpriteTop = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.bgSpriteTop);
	bgStage.isInvalid = true;
	this.bgSpriteBottom = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.bgSpriteBottom);
	bgStage.isInvalid = true;
	this.spriteTop = new PIXI.Sprite();
	stage.cacheableChildren.push(this.spriteTop);
	stage.isInvalid = true;
	this.spriteBottom = new PIXI.Sprite();
	stage.cacheableChildren.push(this.spriteBottom);
	stage.isInvalid = true;
	this.positionSprites();
};
buildings_buildingDrawers_AutoMergingBuildingDrawerUD.__name__ = "buildings.buildingDrawers.AutoMergingBuildingDrawerUD";
buildings_buildingDrawers_AutoMergingBuildingDrawerUD.__super__ = buildings_buildingDrawers_BuildingDrawer;
buildings_buildingDrawers_AutoMergingBuildingDrawerUD.prototype = $extend(buildings_buildingDrawers_BuildingDrawer.prototype,{
	positionSpritesMerging: function() {
		var halfPermHeight = 10. | 0;
		this.spriteTop.position.set(this.building.position.x,this.building.position.y);
		this.bgSpriteTop.position.set(this.building.position.x,this.building.position.y);
		this.spriteBottom.position.set(this.building.position.x,this.building.position.y + halfPermHeight);
		this.bgSpriteBottom.position.set(this.building.position.x,this.building.position.y + halfPermHeight);
		var useDoor = this.building.worldPosition.y == 0;
		var hasTopBuilding = this.isConnectedBuilding(this.building.topBuilding);
		var hasBottomBuilding = this.isConnectedBuilding(this.building.bottomBuilding);
		var textures = Resources.getTexturesAsGrid(this.currentTextureName,6,2,2);
		this.bgSpriteTop.texture = textures[2 + (hasTopBuilding ? 3 : 0)][0];
		this.bgSpriteBottom.texture = textures[2 + (hasBottomBuilding ? 3 : 0)][1];
		this.spriteTop.texture = textures[(useDoor ? 1 : 0) + (hasTopBuilding ? 3 : 0)][0];
		this.spriteBottom.texture = textures[(useDoor ? 1 : 0) + (hasBottomBuilding ? 3 : 0)][1];
		this.stage.isInvalid = true;
		this.bgStage.isInvalid = true;
	}
	,positionSprites: function() {
		this.building.city.updateConnectedBuildingSprites = true;
	}
	,changeMainTexture: function(textureName) {
		buildings_buildingDrawers_BuildingDrawer.prototype.changeMainTexture.call(this,textureName);
		this.positionSprites();
	}
	,destroy: function() {
		buildings_buildingDrawers_BuildingDrawer.prototype.destroy.call(this);
		var _this = this.bgStage;
		var child = this.bgSpriteTop;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.bgStage;
		var child = this.bgSpriteBottom;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.spriteTop;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.spriteBottom;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		this.building.city.updateConnectedBuildingSprites = true;
	}
	,isConnectedBuilding: function(otherBuilding) {
		if(otherBuilding == null) {
			return false;
		}
		var otherAMDrawer = this.getOtherAMDrawer(otherBuilding);
		if(otherAMDrawer == null) {
			return false;
		}
		return otherAMDrawer.currentTextureName == this.currentTextureName;
	}
	,getOtherAMDrawer: function(otherBuilding) {
		if(otherBuilding == null) {
			return null;
		}
		var otherDrawer = otherBuilding.drawer;
		if(!otherDrawer.canMergeV) {
			return null;
		}
		return otherDrawer;
	}
	,__class__: buildings_buildingDrawers_AutoMergingBuildingDrawerUD
});
