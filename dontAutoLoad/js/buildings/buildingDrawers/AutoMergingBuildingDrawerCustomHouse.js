var buildings_buildingDrawers_AutoMergingBuildingDrawerCustomHouse = $hxClasses["buildings.buildingDrawers.AutoMergingBuildingDrawerCustomHouse"] = function(building,stage,bgStage,textureName) {
	this.bridgeRightMergeFlag = false;
	this.bridgeLeftMergeFlag = false;
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
buildings_buildingDrawers_AutoMergingBuildingDrawerCustomHouse.__name__ = "buildings.buildingDrawers.AutoMergingBuildingDrawerCustomHouse";
buildings_buildingDrawers_AutoMergingBuildingDrawerCustomHouse.__interfaces__ = [buildings_buildingDrawers_AtLeastLRMergingBuildingDrawer];
buildings_buildingDrawers_AutoMergingBuildingDrawerCustomHouse.__super__ = buildings_buildingDrawers_BuildingDrawer;
buildings_buildingDrawers_AutoMergingBuildingDrawerCustomHouse.prototype = $extend(buildings_buildingDrawers_BuildingDrawer.prototype,{
	positionSpritesMerging: function() {
		this.building.updateWindowRects();
		var halfPermWidth = 10. | 0;
		this.spriteLeft.position.set(this.building.position.x,this.building.position.y);
		this.bgSpriteLeft.position.set(this.building.position.x,this.building.position.y);
		this.spriteRight.position.set(this.building.position.x + halfPermWidth,this.building.position.y);
		this.bgSpriteRight.position.set(this.building.position.x + halfPermWidth,this.building.position.y);
		var useDoor = this.building.worldPosition.y == 0;
		var hasLeftBuilding = this.bridgeLeftMergeFlag || this.isConnectedBuilding(this.getLeftBuilding(this.building));
		var hasRightBuilding = this.bridgeRightMergeFlag || this.isConnectedBuilding(this.getRightBuilding(this.building));
		var textures = Resources.getTexturesByWidth(this.currentTextureName,halfPermWidth,true);
		this.bgSpriteLeft.texture = textures[4 + (hasLeftBuilding ? 10 : 0)];
		this.bgSpriteRight.texture = textures[5 + (hasRightBuilding ? 10 : 0)];
		this.spriteLeft.texture = textures[(useDoor ? 2 : 0) + (hasLeftBuilding ? 10 : 0)];
		this.spriteRight.texture = textures[1 + (useDoor ? 2 : 0) + (hasRightBuilding ? 10 : 0)];
		this.stage.isInvalid = true;
		this.bgStage.isInvalid = true;
	}
	,getLeftBuilding: function(bld) {
		return bld.leftBuilding;
	}
	,getRightBuilding: function(bld) {
		return bld.rightBuilding;
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
		if(!otherBuilding.is(buildings_CustomHouse)) {
			return false;
		}
		var customHouse = otherBuilding;
		var thisCustomHouse = this.building;
		if(customHouse.properties.mainColor == thisCustomHouse.properties.mainColor && customHouse.properties.windowColor == thisCustomHouse.properties.windowColor) {
			return customHouse.properties.mergeWithSimilar;
		} else {
			return false;
		}
	}
	,setTint: function(tint,bgTint) {
		if(bgTint == null) {
			bgTint = -1;
		}
		if(bgTint == -1) {
			bgTint = tint;
		}
		this.spriteLeft.tint = tint;
		this.spriteRight.tint = tint;
		this.bgSpriteLeft.tint = bgTint;
		this.bgSpriteRight.tint = bgTint;
		this.stage.isInvalid = true;
		this.bgStage.isInvalid = true;
	}
	,__class__: buildings_buildingDrawers_AutoMergingBuildingDrawerCustomHouse
});
