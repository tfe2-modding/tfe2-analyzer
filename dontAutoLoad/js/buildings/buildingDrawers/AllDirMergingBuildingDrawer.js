var buildings_buildingDrawers_AllDirMergingBuildingDrawer = $hxClasses["buildings.buildingDrawers.AllDirMergingBuildingDrawer"] = function(building,stage,bgStage,textureName) {
	this.bridgeRightMergeFlag = false;
	this.bridgeLeftMergeFlag = false;
	this.fgTexturesSet = null;
	this.bgTexturesSet = null;
	this.currentSecondaryTexture = 0;
	this.secondaryBackgroundTextureName = null;
	this.verticalCompatibility = 0;
	buildings_buildingDrawers_BuildingDrawer.call(this,building,stage,bgStage,textureName);
	this.canMergeH = true;
	this.canMergeV = true;
	this.bgSpriteTopLeft = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.bgSpriteTopLeft);
	bgStage.isInvalid = true;
	this.bgSpriteTopRight = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.bgSpriteTopRight);
	bgStage.isInvalid = true;
	this.spriteTopLeft = new PIXI.Sprite();
	stage.cacheableChildren.push(this.spriteTopLeft);
	stage.isInvalid = true;
	this.spriteTopRight = new PIXI.Sprite();
	stage.cacheableChildren.push(this.spriteTopRight);
	stage.isInvalid = true;
	this.bgSpriteBottomLeft = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.bgSpriteBottomLeft);
	bgStage.isInvalid = true;
	this.bgSpriteBottomRight = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.bgSpriteBottomRight);
	bgStage.isInvalid = true;
	this.spriteBottomLeft = new PIXI.Sprite();
	stage.cacheableChildren.push(this.spriteBottomLeft);
	stage.isInvalid = true;
	this.spriteBottomRight = new PIXI.Sprite();
	stage.cacheableChildren.push(this.spriteBottomRight);
	stage.isInvalid = true;
	this.spriteSecondaryBackground = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.spriteSecondaryBackground);
	bgStage.isInvalid = true;
	this.positionSprites();
	this.secondaryBackgroundTextureName = null;
};
buildings_buildingDrawers_AllDirMergingBuildingDrawer.__name__ = "buildings.buildingDrawers.AllDirMergingBuildingDrawer";
buildings_buildingDrawers_AllDirMergingBuildingDrawer.__interfaces__ = [buildings_buildingDrawers_AtLeastLRMergingBuildingDrawer];
buildings_buildingDrawers_AllDirMergingBuildingDrawer.__super__ = buildings_buildingDrawers_BuildingDrawer;
buildings_buildingDrawers_AllDirMergingBuildingDrawer.prototype = $extend(buildings_buildingDrawers_BuildingDrawer.prototype,{
	positionSprites: function() {
		this.building.city.updateConnectedBuildingSprites = true;
	}
	,setBackgroundTextures: function(bgTextures) {
		this.bgTexturesSet = Resources.getTexturesAsGrid(bgTextures,10,2,2,true);
	}
	,setForegroundTextures: function(fgTextures) {
		this.fgTexturesSet = Resources.getTexturesAsGrid(fgTextures,10,2,2,true);
	}
	,positionSpritesMerging: function() {
		var halfPermWidth = 10. | 0;
		var halfPermHeight = 10. | 0;
		this.spriteTopLeft.position.set(this.building.position.x,this.building.position.y);
		this.bgSpriteTopLeft.position.set(this.building.position.x,this.building.position.y);
		this.spriteTopRight.position.set(this.building.position.x + halfPermWidth,this.building.position.y);
		this.bgSpriteTopRight.position.set(this.building.position.x + halfPermWidth,this.building.position.y);
		this.spriteBottomLeft.position.set(this.building.position.x,this.building.position.y + halfPermHeight);
		this.bgSpriteBottomLeft.position.set(this.building.position.x,this.building.position.y + halfPermHeight);
		this.spriteBottomRight.position.set(this.building.position.x + halfPermWidth,this.building.position.y + halfPermHeight);
		this.bgSpriteBottomRight.position.set(this.building.position.x + halfPermWidth,this.building.position.y + halfPermHeight);
		this.spriteSecondaryBackground.position.set(this.building.position.x,this.building.position.y);
		var hasLeftBuilding = this.isConnectedBuilding(this.building.leftBuilding);
		var hasRightBuilding = this.isConnectedBuilding(this.building.rightBuilding);
		var hasTopBuilding = this.isConnectedBuilding(this.building.topBuilding);
		var hasBottomBuilding = this.isConnectedBuilding(this.building.bottomBuilding);
		var hasTopLeftBuilding = false;
		var hasTopRightBuilding = false;
		var hasBottomLeftBuilding = false;
		var hasBottomRightBuilding = false;
		hasLeftBuilding = hasLeftBuilding || this.isConnectedBuildingHOnly(this.building.leftBuilding);
		hasRightBuilding = hasRightBuilding || this.isConnectedBuildingHOnly(this.building.rightBuilding);
		if(hasLeftBuilding && hasTopBuilding) {
			hasTopLeftBuilding = this.isConnectedBuildingWithSpecificVCompat(this.building.topBuilding.leftBuilding,this.building.leftBuilding);
		}
		if(hasRightBuilding && hasTopBuilding) {
			hasTopRightBuilding = this.isConnectedBuildingWithSpecificVCompat(this.building.topBuilding.rightBuilding,this.building.rightBuilding);
		}
		if(hasLeftBuilding && hasBottomBuilding) {
			hasBottomLeftBuilding = this.isConnectedBuildingWithSpecificVCompat(this.building.leftBuilding.bottomBuilding,this.building.leftBuilding);
		}
		if(hasRightBuilding && hasBottomBuilding) {
			hasBottomRightBuilding = this.isConnectedBuildingWithSpecificVCompat(this.building.rightBuilding.bottomBuilding,this.building.rightBuilding);
		}
		hasLeftBuilding = hasLeftBuilding || this.bridgeLeftMergeFlag;
		hasRightBuilding = hasRightBuilding || this.bridgeRightMergeFlag;
		var textures = Resources.getTexturesBySize(this.currentTextureName,halfPermWidth,halfPermHeight,2,true);
		var useDoor = this.building.worldPosition.y == 0;
		var topLeftIndex = 6 * ((hasLeftBuilding ? 1 : 0) + (hasTopBuilding ? 2 : 0) + (hasTopLeftBuilding ? 1 : 0));
		var topRightIndex = 1 + 6 * ((hasRightBuilding ? 1 : 0) + (hasTopBuilding ? 2 : 0) + (hasTopRightBuilding ? 1 : 0));
		var bottomLeftIndex = 6 * ((hasLeftBuilding ? 1 : 0) + (hasBottomBuilding ? 2 : 0) + (hasBottomLeftBuilding ? 1 : 0));
		var bottomRightIndex = 1 + 6 * ((hasRightBuilding ? 1 : 0) + (hasBottomBuilding ? 2 : 0) + (hasBottomRightBuilding ? 1 : 0));
		if(this.fgTexturesSet != null && !useDoor) {
			var topLeftIndex2 = 2 * ((hasLeftBuilding ? 1 : 0) + (hasTopBuilding ? 2 : 0) + (hasTopLeftBuilding ? 1 : 0));
			this.spriteTopLeft.texture = this.fgTexturesSet[topLeftIndex2][0];
			var topRightIndex2 = 1 + 2 * ((hasRightBuilding ? 1 : 0) + (hasTopBuilding ? 2 : 0) + (hasTopRightBuilding ? 1 : 0));
			this.spriteTopRight.texture = this.fgTexturesSet[topRightIndex2][0];
			var bottomLeftIndex2 = 2 * ((hasLeftBuilding ? 1 : 0) + (hasBottomBuilding ? 2 : 0) + (hasBottomLeftBuilding ? 1 : 0));
			this.spriteBottomLeft.texture = this.fgTexturesSet[bottomLeftIndex2][1];
			var bottomRightIndex2 = 1 + 2 * ((hasRightBuilding ? 1 : 0) + (hasBottomBuilding ? 2 : 0) + (hasBottomRightBuilding ? 1 : 0));
			this.spriteBottomRight.texture = this.fgTexturesSet[bottomRightIndex2][1];
		} else {
			this.spriteTopLeft.texture = textures[topLeftIndex + (useDoor ? 2 : 0)][0];
			this.spriteTopRight.texture = textures[topRightIndex + (useDoor ? 2 : 0)][0];
			this.spriteBottomLeft.texture = textures[bottomLeftIndex + (useDoor ? 2 : 0)][1];
			this.spriteBottomRight.texture = textures[bottomRightIndex + (useDoor ? 2 : 0)][1];
		}
		if(this.bgTexturesSet != null) {
			var topLeftIndex2 = 2 * ((hasLeftBuilding ? 1 : 0) + (hasTopBuilding ? 2 : 0) + (hasTopLeftBuilding ? 1 : 0));
			this.bgSpriteTopLeft.texture = this.bgTexturesSet[topLeftIndex2][0];
			var topRightIndex2 = 1 + 2 * ((hasRightBuilding ? 1 : 0) + (hasTopBuilding ? 2 : 0) + (hasTopRightBuilding ? 1 : 0));
			this.bgSpriteTopRight.texture = this.bgTexturesSet[topRightIndex2][0];
			var bottomLeftIndex2 = 2 * ((hasLeftBuilding ? 1 : 0) + (hasBottomBuilding ? 2 : 0) + (hasBottomLeftBuilding ? 1 : 0));
			this.bgSpriteBottomLeft.texture = this.bgTexturesSet[bottomLeftIndex2][1];
			var bottomRightIndex2 = 1 + 2 * ((hasRightBuilding ? 1 : 0) + (hasBottomBuilding ? 2 : 0) + (hasBottomRightBuilding ? 1 : 0));
			this.bgSpriteBottomRight.texture = this.bgTexturesSet[bottomRightIndex2][1];
		} else {
			this.bgSpriteTopLeft.texture = textures[topLeftIndex + 4][0];
			this.bgSpriteTopRight.texture = textures[topRightIndex + 4][0];
			this.bgSpriteBottomLeft.texture = textures[bottomLeftIndex + 4][1];
			this.bgSpriteBottomRight.texture = textures[bottomRightIndex + 4][1];
		}
		this.bgStage.isInvalid = true;
		this.stage.isInvalid = true;
		if(this.secondaryBackgroundTextureName != null) {
			var leaderBuilding = this.building;
			var cl = js_Boot.getClass(this.building);
			while(leaderBuilding.bottomBuilding != null && leaderBuilding.bottomBuilding.is(cl)) leaderBuilding = leaderBuilding.bottomBuilding;
			if(leaderBuilding != this.building) {
				var drawer = leaderBuilding.drawer;
				if(drawer.secondaryBackgroundTextureName != null) {
					var leaderGroup = drawer.getCurrentSecondaryTextureGroup();
					if(leaderGroup != this.getCurrentSecondaryTextureGroup()) {
						this.setGroupOfSecondaryTextureForBuilding(this.building,leaderGroup);
					}
				}
			}
			this.updateSecondaryBackgroundImage(hasTopBuilding,hasBottomBuilding);
		}
		this.building.hasBottomConnectedBuilding = hasBottomBuilding;
	}
	,setSecondaryBackgroundImages: function(image,secondaryBackgroundSets,currentTexture,secondaryTextureOnSet) {
		this.secondaryBackgroundTextureName = image;
		this.secondaryBackgroundSets = secondaryBackgroundSets;
		this.currentSecondaryTexture = currentTexture;
		this.secondaryTextureOnSet = secondaryTextureOnSet;
		this.updateSecondaryBackgroundImageNoExtraInfo();
	}
	,updateSecondaryBackgroundImageNoExtraInfo: function() {
		this.updateSecondaryBackgroundImage(this.isConnectedBuilding(this.building.topBuilding),this.isConnectedBuilding(this.building.bottomBuilding));
	}
	,updateSecondaryBackgroundImage: function(hasTopBuilding,hasBottomBuilding) {
		if(this.secondaryBackgroundTextureName == null) {
			return;
		}
		var tmp = this.getCurrentSecondaryBackTextures();
		this.spriteSecondaryBackground.texture = tmp[(hasBottomBuilding ? 1 : 0) + (hasTopBuilding ? 3 : 0) + (hasTopBuilding && hasBottomBuilding ? -2 : 0)];
		this.bgStage.isInvalid = true;
	}
	,changeMainTexture: function(textureName) {
		buildings_buildingDrawers_BuildingDrawer.prototype.changeMainTexture.call(this,textureName);
		this.positionSprites();
	}
	,destroy: function() {
		buildings_buildingDrawers_BuildingDrawer.prototype.destroy.call(this);
		var _this = this.bgStage;
		var child = this.bgSpriteTopLeft;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.bgStage;
		var child = this.bgSpriteTopRight;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.bgStage;
		var child = this.bgSpriteBottomLeft;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.bgStage;
		var child = this.bgSpriteBottomRight;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.bgStage;
		var child = this.spriteSecondaryBackground;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.spriteTopLeft;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.spriteTopRight;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.spriteBottomLeft;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.spriteBottomRight;
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
		if(otherAMDrawer.currentTextureName == this.currentTextureName || otherAMDrawer.currentTextureGroupName == this.currentTextureGroupName) {
			return otherAMDrawer.verticalCompatibility == this.verticalCompatibility;
		} else {
			return false;
		}
	}
	,isConnectedBuildingWithSpecificVCompat: function(otherBuilding,otherBuildingVCompat) {
		if(otherBuilding == null) {
			return false;
		}
		var otherAMDrawer = this.getOtherAMDrawer(otherBuilding);
		if(otherAMDrawer == null) {
			return false;
		}
		var otherAMDrawer2 = this.getOtherAMDrawer(otherBuildingVCompat);
		if(otherAMDrawer2 == null) {
			return false;
		}
		if(otherAMDrawer.currentTextureName == this.currentTextureName || otherAMDrawer.currentTextureGroupName == this.currentTextureGroupName) {
			return otherAMDrawer.verticalCompatibility == otherAMDrawer2.verticalCompatibility;
		} else {
			return false;
		}
	}
	,isConnectedBuildingHOnly: function(otherBuilding) {
		if(otherBuilding == null) {
			return false;
		}
		var otherAMDrawer = this.getOtherAMDrawerHOnly(otherBuilding);
		if(otherAMDrawer == null) {
			return false;
		}
		if(otherAMDrawer.currentTextureName != this.currentTextureName) {
			return otherAMDrawer.currentTextureGroupName == this.currentTextureGroupName;
		} else {
			return true;
		}
	}
	,getOtherAMDrawer: function(otherBuilding) {
		if(otherBuilding == null) {
			return null;
		}
		var otherDrawer = otherBuilding.drawer;
		if(!otherDrawer.canMergeH || !otherDrawer.canMergeV) {
			return null;
		}
		return otherDrawer;
	}
	,getOtherAMDrawerHOnly: function(otherBuilding) {
		if(otherBuilding == null) {
			return null;
		}
		var otherDrawer = otherBuilding.drawer;
		if(!otherDrawer.canMergeH) {
			return null;
		}
		return otherDrawer;
	}
	,getSecondaryBackTextures: function() {
		return Resources.getTexturesBySize(this.secondaryBackgroundTextureName,20,20);
	}
	,getCurrentSecondaryBackTextures: function() {
		return this.getSecondaryBackTextures()[this.currentSecondaryTexture];
	}
	,getCurrentSecondaryTextureGroup: function() {
		return this.getSecondaryTextureGroup(this.currentSecondaryTexture);
	}
	,getSecondaryTextureGroup: function(tex) {
		var currentGroup = -1;
		var i = 0;
		while(i <= tex) {
			++currentGroup;
			i += this.secondaryBackgroundSets[currentGroup];
		}
		return currentGroup;
	}
	,getFirstSecondaryTextureOfGroup: function(group) {
		var actualTexture = 0;
		var i = 0;
		while(i < group) {
			actualTexture += this.secondaryBackgroundSets[i];
			++i;
		}
		return actualTexture;
	}
	,setSecondaryTextureWithinGroup: function(num) {
		this.currentSecondaryTexture = this.getFirstSecondaryTextureOfGroup(this.getCurrentSecondaryTextureGroup()) + num;
		this.secondaryTextureOnSet(this.currentSecondaryTexture);
		this.updateSecondaryBackgroundImageNoExtraInfo();
	}
	,setGroupOfSecondaryTexture: function(t) {
		var cl = js_Boot.getClass(this.building);
		var currentBuilding = this.building;
		while(currentBuilding.bottomBuilding != null && currentBuilding.bottomBuilding.is(cl) && this.isConnectedBuilding(currentBuilding.bottomBuilding)) currentBuilding = currentBuilding.bottomBuilding;
		while(true) {
			this.setGroupOfSecondaryTextureForBuilding(currentBuilding,t);
			if(currentBuilding.topBuilding != null && currentBuilding.topBuilding.is(cl) && this.isConnectedBuilding(currentBuilding.topBuilding)) {
				currentBuilding = currentBuilding.topBuilding;
			} else {
				break;
			}
		}
	}
	,setGroupOfSecondaryTextureForThisBuilding: function(group) {
		this.setGroupOfSecondaryTextureForBuilding(this.building,group);
	}
	,setGroupOfSecondaryTextureForBuilding: function(currentBuilding,group) {
		var drawer = currentBuilding.drawer;
		drawer.currentSecondaryTexture = this.getFirstSecondaryTextureOfGroup(group) + random_Random.getInt(this.secondaryBackgroundSets[group]);
		drawer.secondaryTextureOnSet(drawer.currentSecondaryTexture);
		drawer.updateSecondaryBackgroundImageNoExtraInfo();
	}
	,__class__: buildings_buildingDrawers_AllDirMergingBuildingDrawer
});
