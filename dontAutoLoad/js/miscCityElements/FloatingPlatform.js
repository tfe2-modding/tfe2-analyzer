var miscCityElements_FloatingPlatform = $hxClasses["miscCityElements.FloatingPlatform"] = function(city,position,appearance) {
	if(appearance == null) {
		appearance = 0;
	}
	this.appearance = 0;
	this.destroyed = false;
	miscCityElements_MiscCityElement.call(this,city,new common_Rectangle(position.x,position.y,20,20));
	this.stage = city.cityBgStage;
	this.position = position;
	this.appearance = appearance;
	this.updateSpriteTextures();
	this.sprite = new PIXI.Sprite(this.topSpriteTextures[0]);
	this.sprite.position.set(position.x,position.y);
	this.stage.addChild(this.sprite);
	this.animSprite = new PIXI.Sprite(this.animSpriteTextures[0]);
	this.animSprite.position.set(position.x,position.y);
	this.stage.addChild(this.animSprite);
};
miscCityElements_FloatingPlatform.__name__ = "miscCityElements.FloatingPlatform";
miscCityElements_FloatingPlatform.instantiateFromSave = function(city,queue) {
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var xx = intToRead;
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var yy = intToRead;
	var appearance = 0;
	if(queue.version >= 64) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		appearance = intToRead;
	}
	var platformPos = new common_Point(xx,yy);
	var newFloatingPlatform = new miscCityElements_FloatingPlatform(city,platformPos,appearance);
	return newFloatingPlatform;
};
miscCityElements_FloatingPlatform.__super__ = miscCityElements_MiscCityElement;
miscCityElements_FloatingPlatform.prototype = $extend(miscCityElements_MiscCityElement.prototype,{
	save: function(queue) {
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
		var value = this.appearance;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,postCreate: function() {
		this.updateSprites();
	}
	,update: function(timeMod) {
		this.animSprite.texture = this.animSpriteTextures[Math.floor(this.city.simulation.time.timeSinceStart / 1.5 % this.animSpriteTextures.length)];
	}
	,onCityChange: function() {
		this.updateSprites();
	}
	,updateSpriteTextures: function() {
		var sprites = "spr_floatingplatform_top";
		if(this.appearance != 0) {
			sprites = sprites + "_" + this.appearance;
		}
		var spritesBottom = "spr_floatingplatform_bottom";
		if(this.appearance != 0) {
			spritesBottom = spritesBottom + "_" + this.appearance;
		}
		this.topSpriteTextures = Resources.getTexturesByWidth(sprites,20);
		this.animSpriteTextures = Resources.getTexturesByWidth(spritesBottom,20);
	}
	,updateSprites: function() {
		var theLeft = this.city.miscCityElements.findSpecific(new common_Point(this.position.x - 20,this.position.y),miscCityElements_FloatingPlatform);
		var theRight = this.city.miscCityElements.findSpecific(new common_Point(this.position.x + 20,this.position.y),miscCityElements_FloatingPlatform);
		var hasLeft = 0;
		var hasRight = 0;
		if(theLeft != null && theLeft.appearance == this.appearance) {
			hasLeft = 1;
		}
		if(theRight != null && theRight.appearance == this.appearance) {
			hasRight = 1;
		}
		this.sprite.texture = this.topSpriteTextures[hasLeft + 2 * hasRight];
	}
	,destroy: function() {
		this.sprite.destroy();
		if(this.selectedSprite != null) {
			this.selectedSprite.destroy();
		}
		this.animSprite.destroy();
		this.city.miscCityElements.destroyElement(this);
		this.destroyed = true;
		this.city.connections.updateCityConnections();
		this.city.simulation.updatePathfinder(false);
		this.giveRecycleReward();
	}
	,giveRecycleReward: function() {
		if(Builder.floatingPlatformCost != null) {
			var mats = Builder.floatingPlatformCost.copy();
			mats.knowledge = 0;
			mats.multiply(this.city.upgrades.vars.recyclingAmount);
			this.city.materials.add(mats);
		}
	}
	,tryDestroy: function() {
		if(this.city.getPermanentAtPos(this.position.x,this.position.y - 20) == null) {
			this.destroy();
			return true;
		}
		var permanentBelow = this.city.getPermanentAtPos(this.position.x,this.position.y + 20);
		if(permanentBelow != null) {
			var thisPermanentStack = permanentBelow.world.permanents[permanentBelow.worldPosition.x];
			var worldPosition = permanentBelow.worldPosition;
			var world = permanentBelow.world;
			permanentBelow.world.permanents[permanentBelow.worldPosition.x].splice(permanentBelow.worldPosition.y + 1,1);
			var _g = worldPosition.y + 1;
			var _g1 = thisPermanentStack.length;
			while(_g < _g1) {
				var yy = _g++;
				var thisPermanent = thisPermanentStack[yy];
				if(thisPermanent == null) {
					thisPermanentStack.splice(yy,0,null);
					break;
				}
				thisPermanent.worldPosition.y -= 1;
				thisPermanent.position.y = world.rect.y - (thisPermanent.worldPosition.y + 1) * 20;
				if(thisPermanent.isBuilding && thisPermanent.isRooftopBuilding && yy + 1 < thisPermanentStack.length) {
					thisPermanentStack.splice(yy + 1,0,null);
					break;
				}
			}
			var _g = worldPosition.y + 1;
			var _g1 = thisPermanentStack.length;
			while(_g < _g1) {
				var yy = _g++;
				if(thisPermanentStack[yy] != null) {
					thisPermanentStack[yy].positionSprites();
				}
			}
			this.city.connections.updateCityConnections();
			this.city.simulation.updatePathfinder(true);
			this.destroy();
			return true;
		}
		this.city.gui.showSimpleWindow(common_Localize.lo("floating_platform_cannot_destroy"),null,true);
		return false;
	}
	,onHover: function(isActive) {
		if((this.city.game.keyboard.down[46] || this.city.buildingMode == BuildingMode.Destroy || this.city.buildingMode == BuildingMode.DestroyLeavingHole) && this.city.specialAction == null) {
			var destroySprite = new PIXI.Sprite(Resources.getTexture("spr_destroying"));
			destroySprite.position.set(this.position.x,this.position.y);
			this.city.furtherForegroundTempStage.addChild(destroySprite);
			destroySprite.alpha = isActive ? 1 : !this.city.game.isMobile ? 0.5 : 0;
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
	,createWindow: function() {
		var _gthis = this;
		this.city.gui.createWindow(this);
		this.city.gui.setWindowReload($bind(this,this.createWindow));
		this.city.gui.windowAddTitleText(common_Localize.lo("floating_platform"));
		gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			_gthis.appearance += 1;
			_gthis.appearance %= 4;
			_gthis.updateSpriteTextures();
			_gthis.city.miscCityElements.onCityChange();
		},this.city.gui.windowInner,function() {
			return common_Localize.lo("change_variant");
		},this.city.gui.innerWindowStage);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
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
		this.selectedSprite = Resources.makeSprite("spr_selectedbuilding");
		this.selectedSprite.position.set(this.position.x - 1,this.position.y - 1);
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
	,__class__: miscCityElements_FloatingPlatform
});
