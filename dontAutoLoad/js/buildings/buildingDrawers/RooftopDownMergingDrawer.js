var buildings_buildingDrawers_RooftopDownMergingDrawer = $hxClasses["buildings.buildingDrawers.RooftopDownMergingDrawer"] = function(building,stage,bgStage,textureName) {
	this.verticalCompatibility = 0;
	this.fgTexturesSet = null;
	this.bgTexturesSet = null;
	this.currentSecondaryTexture = 0;
	this.secondaryBackgroundTextureName = null;
	buildings_buildingDrawers_BuildingDrawer.call(this,building,stage,bgStage,textureName);
	this.canMergeH = true;
	this.canMergeV = true;
	this.bgSprite = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.bgSprite);
	bgStage.isInvalid = true;
	this.sprite = new PIXI.Sprite();
	stage.cacheableChildren.push(this.sprite);
	stage.isInvalid = true;
	this.spriteSecondaryBackground = new PIXI.Sprite();
	bgStage.cacheableChildren.push(this.spriteSecondaryBackground);
	bgStage.isInvalid = true;
	this.positionSprites();
	this.secondaryBackgroundTextureName = null;
	this.mergeClass = js_Boot.getClass(building);
};
buildings_buildingDrawers_RooftopDownMergingDrawer.__name__ = "buildings.buildingDrawers.RooftopDownMergingDrawer";
buildings_buildingDrawers_RooftopDownMergingDrawer.__super__ = buildings_buildingDrawers_BuildingDrawer;
buildings_buildingDrawers_RooftopDownMergingDrawer.prototype = $extend(buildings_buildingDrawers_BuildingDrawer.prototype,{
	positionSprites: function() {
		this.building.city.updateConnectedBuildingSprites = true;
	}
	,positionSpritesMerging: function() {
		this.bgSprite.position.set(this.building.position.x,this.building.position.y);
		this.sprite.position.set(this.building.position.x,this.building.position.y);
		this.spriteSecondaryBackground.position.set(this.building.position.x,this.building.position.y);
		var hasBottomBuilding = this.isConnectedBuilding(this.building.bottomBuilding);
		var textures = Resources.getTexturesByWidth(this.currentTextureName,20);
		var useDoor = this.building.worldPosition.y == 0;
		this.bgSprite.texture = textures[hasBottomBuilding ? 5 : 2];
		this.sprite.texture = textures[(hasBottomBuilding ? 3 : 0) + (useDoor ? 1 : 0)];
		this.bgStage.isInvalid = true;
		this.stage.isInvalid = true;
		if(this.secondaryBackgroundTextureName != null) {
			var leaderBuilding = this.building;
			var cl = this.mergeClass;
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
			this.updateSecondaryBackgroundImage(false,hasBottomBuilding);
		}
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
		var child = this.bgSprite;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.bgStage;
		var child = this.spriteSecondaryBackground;
		HxOverrides.remove(_this.cacheableChildren,child);
		_this.isInvalid = true;
		child.destroy({ children : true, texture : false});
		var _this = this.stage;
		var child = this.sprite;
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
			return this.verticalCompatibility == otherAMDrawer.verticalCompatibility;
		} else {
			return false;
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
	,getOtherAMDrawerAboveOnly: function(otherBuilding) {
		if(otherBuilding == null) {
			return null;
		}
		var otherDrawer = otherBuilding.drawer;
		if(!otherDrawer.canMergeV && !otherDrawer.canMergeRooftop) {
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
		var cl = this.mergeClass;
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
	,__class__: buildings_buildingDrawers_RooftopDownMergingDrawer
});
