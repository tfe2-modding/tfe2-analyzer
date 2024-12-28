var miscCityElements_BotanicalBridge = $hxClasses["miscCityElements.BotanicalBridge"] = function(city,position,spriteIndex) {
	this.connectedRightTo = null;
	this.connectedLeftTo = null;
	miscCityElements_Bridge.call(this,city,position,spriteIndex);
};
miscCityElements_BotanicalBridge.__name__ = "miscCityElements.BotanicalBridge";
miscCityElements_BotanicalBridge.instantiateFromSave = function(city,queue) {
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var xx = intToRead;
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var yy = intToRead;
	var spriteIndex = 0;
	if(queue.version >= 47) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		spriteIndex = intToRead;
	}
	var bridgePos = new common_Point(xx,yy);
	var newBridge = new miscCityElements_BotanicalBridge(city,bridgePos,spriteIndex);
	return newBridge;
};
miscCityElements_BotanicalBridge.__super__ = miscCityElements_Bridge;
miscCityElements_BotanicalBridge.prototype = $extend(miscCityElements_Bridge.prototype,{
	get_texturesName: function() {
		return "spr_botanicalbridge";
	}
	,get_potentialTexturesName: function() {
		return "spr_botanicalbridge_potential";
	}
	,get_hiddenTexturesNum: function() {
		if(Config.isHalloweenThemed) {
			return 0;
		} else {
			return 1;
		}
	}
	,get_currentTextureName: function() {
		switch(this.spriteIndex) {
		case 0:
			return "spr_botanicalgardens";
		case 1:
			return "spr_indoorpark";
		case 2:
			return "spr_indoorpark_alt1";
		case 3:
			return "spr_bloomrestaurant";
		default:
			return "spr_indoorpark_dark";
		}
	}
	,postCreate: function() {
		miscCityElements_Bridge.prototype.postCreate.call(this);
		this.city.updateConnectedBuildingSprites = true;
	}
	,onCityChange: function() {
		miscCityElements_Bridge.prototype.onCityChange.call(this);
	}
	,onUpdateTexture: function() {
		this.city.updateConnectedBuildingSprites = true;
		this.onCityChangeStage2();
	}
	,onCityChangeStage2: function() {
		if(this.leftBuilding != null && this.rightBuilding != null) {
			if(this.connectedLeftTo != null) {
				this.getOtherAMDrawer(this.leftBuilding).bridgeRightMergeFlag = true;
			}
			if(this.connectedRightTo != null) {
				this.getOtherAMDrawer(this.rightBuilding).bridgeLeftMergeFlag = true;
			}
		}
	}
	,updateSprite: function() {
		if(this.connectedLeftTo != null) {
			this.getOtherAMDrawer(this.connectedLeftTo).bridgeRightMergeFlag = false;
		}
		if(this.connectedRightTo != null) {
			this.getOtherAMDrawer(this.connectedRightTo).bridgeLeftMergeFlag = false;
		}
		this.updateOwnSprite();
	}
	,needsToChangeConnections: function() {
		var connectedLeft = this.isConnectedBuilding(this.leftBuilding);
		var connectedRight = this.isConnectedBuilding(this.rightBuilding);
		if(this.connectedLeftTo != null != connectedLeft) {
			return this.connectedRightTo != null == connectedRight;
		} else {
			return true;
		}
	}
	,updateOwnSprite: function() {
		this.connectedLeftTo = null;
		this.connectedRightTo = null;
		if(this.leftBuilding != null && this.rightBuilding != null) {
			var connectedLeft = this.isConnectedBuilding(this.leftBuilding);
			var connectedRight = this.isConnectedBuilding(this.rightBuilding);
			var leftIsPond = (this.leftBuilding.is(buildings_PondPark) || this.leftBuilding.is(buildings_PondPod)) && connectedLeft;
			var rightIsPond = (this.rightBuilding.is(buildings_PondPark) || this.rightBuilding.is(buildings_PondPod)) && connectedRight;
			var numSprites = ((this.rightBuilding.position.x - this.leftBuilding.position.x) / 20 | 0) - 1;
			this.resizeSpritesArray(numSprites);
			var _g = 0;
			var _g1 = numSprites;
			while(_g < _g1) {
				var i = _g++;
				var backSprite = this.backSprites[i];
				backSprite.position.x = this.leftBuilding.position.x + (i + 1) * 20;
				backSprite.position.y = this.position.y;
				var backSpriteI = 8;
				if(numSprites == 1) {
					backSpriteI = 4;
					if(leftIsPond && rightIsPond) {
						backSpriteI = 13;
					} else if(leftIsPond) {
						backSpriteI = 16;
					} else if(rightIsPond) {
						backSpriteI = 17;
					}
				} else if(i == 0) {
					backSpriteI = 9;
					if(leftIsPond) {
						backSpriteI = 14;
					}
				} else if(i == numSprites - 1) {
					backSpriteI = 10;
					if(rightIsPond) {
						backSpriteI = 15;
					}
				}
				backSprite.texture = this.bridgeTextures[backSpriteI];
				var sprite = this.sprites[i];
				sprite.position.x = this.leftBuilding.position.x + (i + 1) * 20;
				sprite.position.y = this.position.y;
				var bridgeTextureSet = 0;
				if(numSprites == 1) {
					sprite.texture = this.bridgeTextures[connectedLeft && connectedRight ? 7 : connectedLeft ? 12 : connectedRight ? 11 : 3];
				} else {
					if(i == 0 && connectedLeft) {
						bridgeTextureSet = 4;
					} else if(i == numSprites - 1 && connectedRight) {
						bridgeTextureSet = 4;
					}
					sprite.texture = this.bridgeTextures[(i == 0 ? 1 : 0) + (i == numSprites - 1 ? 2 : 0) + bridgeTextureSet];
				}
				if(connectedLeft) {
					this.connectedLeftTo = this.leftBuilding;
				}
				if(connectedRight) {
					this.connectedRightTo = this.rightBuilding;
				}
			}
		} else {
			this.resizeSpritesArray(1);
			var tmp = this.get_potentialTexturesName();
			this.sprites[0].texture = Resources.getTexture(tmp);
			this.sprites[0].position.set(this.position.x,this.position.y);
			var tmp = this.get_potentialTexturesName();
			this.backSprites[0].texture = Resources.getTexture(tmp);
			this.backSprites[0].position.set(this.position.x,this.position.y);
		}
	}
	,isConnectedBuilding: function(otherBuilding) {
		if(otherBuilding == null) {
			return false;
		}
		var otherAMDrawer = this.getOtherAMDrawer(otherBuilding);
		if(otherAMDrawer == null) {
			return false;
		}
		return otherAMDrawer.currentTextureName == this.get_currentTextureName();
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
	,destroy: function() {
		miscCityElements_Bridge.prototype.destroy.call(this);
		if(this.connectedLeftTo != null) {
			this.getOtherAMDrawer(this.connectedLeftTo).bridgeRightMergeFlag = false;
		}
		if(this.connectedRightTo != null) {
			this.getOtherAMDrawer(this.connectedRightTo).bridgeLeftMergeFlag = false;
		}
		this.city.updateConnectedBuildingSprites = true;
	}
	,__class__: miscCityElements_BotanicalBridge
});
