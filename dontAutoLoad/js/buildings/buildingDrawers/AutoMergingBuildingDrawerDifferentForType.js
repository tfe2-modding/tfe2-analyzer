var buildings_buildingDrawers_AutoMergingBuildingDrawerDifferentForType = $hxClasses["buildings.buildingDrawers.AutoMergingBuildingDrawerDifferentForType"] = function(building,stage,bgStage,textureName) {
	buildings_buildingDrawers_BuildingDrawer.call(this,building,stage,bgStage,textureName);
	this.canMergeH = true;
	this.canMergeV = false;
	this.bgSpriteLeft = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.bgSpriteLeft);
	bgStage.isInvalid = true;
	this.bgSpriteRight = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.bgSpriteRight);
	bgStage.isInvalid = true;
	this.spriteLeft = new PIXI.Sprite();
	stage.cacheableChildren.push(this.spriteLeft);
	stage.isInvalid = true;
	this.spriteRight = new PIXI.Sprite();
	stage.cacheableChildren.push(this.spriteRight);
	stage.isInvalid = true;
	this.positionSprites();
};
buildings_buildingDrawers_AutoMergingBuildingDrawerDifferentForType.__name__ = "buildings.buildingDrawers.AutoMergingBuildingDrawerDifferentForType";
buildings_buildingDrawers_AutoMergingBuildingDrawerDifferentForType.__super__ = buildings_buildingDrawers_BuildingDrawer;
buildings_buildingDrawers_AutoMergingBuildingDrawerDifferentForType.prototype = $extend(buildings_buildingDrawers_BuildingDrawer.prototype,{
	positionSpritesMerging: function() {
		var halfPermWidth = 10. | 0;
		this.spriteLeft.position.set(this.building.position.x,this.building.position.y);
		this.bgSpriteLeft.position.set(this.building.position.x,this.building.position.y);
		this.spriteRight.position.set(this.building.position.x + halfPermWidth,this.building.position.y);
		this.bgSpriteRight.position.set(this.building.position.x + halfPermWidth,this.building.position.y);
		var useDoor = this.building.worldPosition.y == 0;
		var hasLeftBuilding = this.isConnectedBuilding(this.building.leftBuilding);
		var hasRightBuilding = this.isConnectedBuilding(this.building.rightBuilding);
		var hasExactSameLeftBuilding = true;
		var hasExactSameRightBuilding = true;
		if(hasLeftBuilding) {
			hasExactSameLeftBuilding = this.isFullyConnectedBuilding(this.building.leftBuilding);
		}
		if(hasRightBuilding) {
			hasExactSameRightBuilding = this.isFullyConnectedBuilding(this.building.rightBuilding);
		}
		var textures = Resources.getTexturesByWidth(this.currentTextureName,halfPermWidth,true);
		this.bgSpriteLeft.texture = textures[4 + (hasLeftBuilding ? 6 : 0) + (hasExactSameLeftBuilding ? 0 : 6)];
		this.bgSpriteRight.texture = textures[5 + (hasRightBuilding ? 6 : 0) + (hasExactSameRightBuilding ? 0 : 6)];
		this.spriteLeft.texture = textures[(useDoor ? 2 : 0) + (hasLeftBuilding ? 6 : 0) + (hasExactSameLeftBuilding ? 0 : 6)];
		this.spriteRight.texture = textures[1 + (useDoor ? 2 : 0) + (hasRightBuilding ? 6 : 0) + (hasExactSameRightBuilding ? 0 : 6)];
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
		var child = this.bgSpriteLeft;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.bgStage;
		var child = this.bgSpriteRight;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.spriteLeft;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.spriteRight;
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
		if(otherAMDrawer.currentTextureName != this.currentTextureName) {
			return otherAMDrawer.currentTextureGroupName == this.currentTextureGroupName;
		} else {
			return true;
		}
	}
	,isFullyConnectedBuilding: function(otherBuilding) {
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
		if(!otherDrawer.canMergeH) {
			return null;
		}
		return otherDrawer;
	}
	,__class__: buildings_buildingDrawers_AutoMergingBuildingDrawerDifferentForType
});
