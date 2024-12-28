var miscCityElements_Bridge = $hxClasses["miscCityElements.Bridge"] = function(city,position,spriteIndex) {
	if(spriteIndex == null) {
		spriteIndex = 0;
	}
	this.destroyed = false;
	var _gthis = this;
	miscCityElements_MiscCityElement.call(this,city,new common_Rectangle(position.x,position.y,20,20));
	this.position = position;
	this.sprites = [];
	this.backSprites = [];
	this.spriteIndex = spriteIndex;
	this.bridgeTextures = Resources.getTexturesBySizeInverse(this.get_texturesName(),20,20,2)[spriteIndex];
	this.bridgeInfo = Lambda.find(Resources.bridgesInfo,function(bi) {
		var c = js_Boot.getClass(_gthis);
		return "miscCityElements." + bi.className == c.__name__;
	});
};
miscCityElements_Bridge.__name__ = "miscCityElements.Bridge";
miscCityElements_Bridge.instantiateFromSave = function(city,queue) {
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
	var newBridge = new miscCityElements_Bridge(city,bridgePos,spriteIndex);
	return newBridge;
};
miscCityElements_Bridge.__super__ = miscCityElements_MiscCityElement;
miscCityElements_Bridge.prototype = $extend(miscCityElements_MiscCityElement.prototype,{
	get_maxSize: function() {
		return this.bridgeInfo.maxSize;
	}
	,get_texturesName: function() {
		return "spr_bridge";
	}
	,get_potentialTexturesName: function() {
		return "spr_bridge_potential";
	}
	,get_humanCanWalkOn: function() {
		return true;
	}
	,get_hiddenTexturesNum: function() {
		return 0;
	}
	,postCreate: function() {
		this.determinePlacement(true);
	}
	,save: function(queue) {
		var value = this.position.x;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.position.y;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.spriteIndex;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,determinePlacement: function(firstTime) {
		var _gthis = this;
		var oldLeftBuilding = this.leftBuilding;
		var oldRightBuilding = this.rightBuilding;
		this.leftBuilding = null;
		this.rightBuilding = null;
		var xx = this.position.x;
		var _g = 0;
		var _g1 = this.get_maxSize();
		while(_g < _g1) {
			var i = _g++;
			xx -= 20;
			var permanentHere = this.city.getPermanentAtPos(xx,this.position.y);
			if(permanentHere != null) {
				if(permanentHere.isBuilding && !permanentHere.cannotBuildOnTop) {
					this.leftBuilding = permanentHere;
				}
				break;
			}
		}
		xx += 20;
		if(this.leftBuilding != null) {
			var _g = 0;
			var _g1 = this.get_maxSize();
			while(_g < _g1) {
				var i = _g++;
				xx += 20;
				var permanentHere = this.city.getPermanentAtPos(xx,this.position.y);
				if(permanentHere != null) {
					if(permanentHere.isBuilding && !permanentHere.cannotBuildOnTop) {
						this.rightBuilding = permanentHere;
					}
					break;
				}
			}
			if(this.rightBuilding != null) {
				var allCol = this.city.miscCityElements.collidesAll(new common_Point(this.rect.x,this.rect.y));
				if(common_ArrayExtensions.any(allCol,function(el) {
					if(el != _gthis) {
						return el.is(miscCityElements_Bridge);
					} else {
						return false;
					}
				})) {
					if(!Game.isLoading) {
						this.destroy();
					}
					return;
				}
				this.city.miscCityElements.changeElementPos(this,new common_Rectangle(this.leftBuilding.position.x + 20,this.position.y,this.rightBuilding.position.x - this.leftBuilding.position.x - 20,20));
			}
		}
		if(this.leftBuilding != oldLeftBuilding || this.rightBuilding != oldRightBuilding || firstTime || this.needsToChangeConnections()) {
			this.updateSprite();
			if(this.leftBuilding == null || this.rightBuilding == null) {
				this.city.miscCityElements.changeElementPos(this,new common_Rectangle(this.position.x,this.position.y,20,20));
			}
		}
	}
	,needsToChangeConnections: function() {
		return false;
	}
	,onCityChange: function() {
		this.determinePlacement(false);
	}
	,resizeSpritesArray: function(num) {
		while(this.sprites.length < num) {
			var newSprite = new PIXI.Sprite();
			this.sprites.push(newSprite);
			this.city.cityMidStage.addChild(newSprite);
			var backSprite = new PIXI.Sprite();
			this.backSprites.push(backSprite);
			this.city.cityBgStage.addChild(backSprite);
		}
		while(this.sprites.length > num) {
			var oldSprite = this.sprites.pop();
			oldSprite.destroy();
			var oldBackSprite = this.backSprites.pop();
			oldBackSprite.destroy();
		}
	}
	,updateSprite: function() {
		if(this.leftBuilding != null && this.rightBuilding != null) {
			var numSprites = ((this.rightBuilding.position.x - this.leftBuilding.position.x) / 20 | 0) - 1;
			this.resizeSpritesArray(numSprites);
			var _g = 0;
			var _g1 = numSprites;
			while(_g < _g1) {
				var i = _g++;
				var backSprite = this.backSprites[i];
				backSprite.position.x = this.leftBuilding.position.x + (i + 1) * 20;
				backSprite.position.y = this.position.y;
				backSprite.texture = this.bridgeTextures[4];
				var sprite = this.sprites[i];
				sprite.position.x = this.leftBuilding.position.x + (i + 1) * 20;
				sprite.position.y = this.position.y;
				sprite.texture = this.bridgeTextures[(i == 0 ? 1 : 0) + (i == numSprites - 1 ? 2 : 0)];
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
	,onClick: function() {
		if(this.city.game.keyboard.down[46] || this.city.buildingMode == BuildingMode.Destroy || this.city.buildingMode == BuildingMode.DestroyLeavingHole) {
			if(!this.city.progress.story.disableDestroy) {
				if(this.city.gui.windowRelatedTo == this) {
					this.city.gui.closeWindow();
				}
				if(this.tryDestroy()) {
					this.city.game.audio.playSound(this.city.game.audio.buttonFailSound);
				}
			} else {
				this.city.gui.showSimpleWindow(common_Localize.lo("no_destroy_allowed"),null,true);
			}
		} else if(!this.city.game.keyboard.down[16]) {
			this.createWindow();
			this.city.game.audio.playSound(this.city.game.audio.buildingClickSound);
		}
	}
	,tryDestroy: function() {
		this.destroy();
		return true;
	}
	,destroy: function() {
		var _g = 0;
		var _g1 = this.city.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(this.rightBuilding != null && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null) == this.rightBuilding && citizen.relativeX < 0) {
				citizen.setRelativeX(0);
				citizen.actuallyUpdateDraw();
			}
		}
		var _g = 0;
		var _g1 = this.city.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(this.leftBuilding != null && (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null) == this.leftBuilding && citizen.relativeX > 18) {
				citizen.setRelativeX(18);
				citizen.actuallyUpdateDraw();
			}
		}
		var _g = 0;
		var _g1 = this.sprites;
		while(_g < _g1.length) {
			var sprite = _g1[_g];
			++_g;
			sprite.destroy();
		}
		var _g = 0;
		var _g1 = this.backSprites;
		while(_g < _g1.length) {
			var backSprite = _g1[_g];
			++_g;
			backSprite.destroy();
		}
		if(this.selectedSprite != null) {
			this.selectedSprite.destroy();
		}
		this.city.miscCityElements.destroyElement(this);
		this.destroyed = true;
		this.city.connections.updateCityConnections();
		this.city.simulation.updatePathfinder(true);
		this.giveRecycleReward();
	}
	,giveRecycleReward: function() {
		if(this.bridgeInfo != null) {
			var mats = Materials.fromBridgeInfo(this.bridgeInfo);
			mats.knowledge = 0;
			mats.multiply(this.city.upgrades.vars.recyclingAmount);
			this.city.materials.add(mats);
		}
	}
	,onHover: function(isActive) {
		if((this.city.game.keyboard.down[46] || this.city.buildingMode == BuildingMode.Destroy || this.city.buildingMode == BuildingMode.DestroyLeavingHole) && this.city.specialAction == null) {
			var destroySprite = new PIXI.Sprite(Resources.getTexture("spr_destroying"));
			destroySprite.position.set(this.rect.get_center().x - 10.,this.position.y);
			this.city.furtherForegroundTempStage.addChild(destroySprite);
			destroySprite.alpha = isActive ? 1 : !this.city.game.isMobile ? 0.5 : 0;
		}
	}
	,createWindow: function() {
		var _gthis = this;
		this.city.gui.createWindow(this);
		this.city.gui.setWindowReload($bind(this,this.createWindow));
		this.city.gui.windowAddTitleText(this.bridgeInfo.name);
		this.city.gui.windowAddInfoText(null,function() {
			if(_gthis.leftBuilding == null || _gthis.rightBuilding == null) {
				return common_Localize.lo("bridge_is_potential");
			} else {
				return "";
			}
		});
		var textures = Resources.getTexturesBySizeInverse(this.get_texturesName(),20,20,2);
		if(textures.length > 1) {
			gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.spriteIndex;
			},function(t) {
				_gthis.spriteIndex = t;
				var f = _gthis.spriteIndex;
				if(isNaN(f)) {
					_gthis.spriteIndex = 0;
				}
				_gthis.bridgeTextures = textures[_gthis.spriteIndex];
				_gthis.updateSprite();
				_gthis.onUpdateTexture();
			},function() {
				return textures.length - _gthis.get_hiddenTexturesNum();
			},common_Localize.lo("change_building_color"));
		}
		var destroyButton = null;
		var isConfirmButton = false;
		destroyButton = this.city.gui.windowAddBottomButtons([{ text : common_Localize.lo("destroy"), action : function() {
			if(isConfirmButton) {
				_gthis.city.gui.closeWindow();
				_gthis.tryDestroy();
			} else {
				destroyButton.setText(common_Localize.lo("really_destroy"));
				isConfirmButton = true;
			}
		}}])[0];
		this.selectedSprite = new gui_NinePatch(Resources.getTexture("spr_selectedbuilding"),10,this.rect.width + 2,this.rect.height + 2);
		this.selectedSprite.position.set(this.rect.x - 1,this.position.y - 1);
		this.city.farForegroundStage.addChild(this.selectedSprite);
		this.city.gui.windowOnDestroy = function() {
			_gthis.selectedSprite.destroy();
			_gthis.selectedSprite = null;
		};
		this.city.gui.clearWindowStack();
		this.city.gui.addWindowToStack(function() {
			if(!_gthis.destroyed) {
				_gthis.createWindow();
			}
		});
	}
	,cycleSprite: function() {
		var textures = Resources.getTexturesBySizeInverse(this.get_texturesName(),20,20,2);
		var f = this.spriteIndex += 1;
		if(isNaN(f) || this.spriteIndex >= textures.length) {
			this.spriteIndex = 0;
		}
		this.bridgeTextures = textures[this.spriteIndex];
		this.updateSprite();
		this.onUpdateTexture();
	}
	,onUpdateTexture: function() {
	}
	,__class__: miscCityElements_Bridge
});
