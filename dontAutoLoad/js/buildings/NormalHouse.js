var buildings_NormalHouse = $hxClasses["buildings.NormalHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.doorMainTexture = 0;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.doorTextures = Resources.getTexturesByWidth("spr_coloreddoors",20);
	this.makeDoorSpriteIfNeeded();
};
buildings_NormalHouse.__name__ = "buildings.NormalHouse";
buildings_NormalHouse.__super__ = buildings_House;
buildings_NormalHouse.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_Flowers,buildingUpgrades_MiniChristmasTree,buildingUpgrades_Pumpkin];
	}
	,positionSprites: function() {
		buildings_House.prototype.positionSprites.call(this);
		if(this.doorSprite != null) {
			this.doorSprite.position.set(this.position.x,this.position.y);
			if(this.worldPosition.y != 0) {
				this.doorSprite.destroy();
				this.doorSprite = null;
			}
		} else {
			this.makeDoorSpriteIfNeeded();
		}
	}
	,postLoad: function() {
		if(this.doorSprite != null) {
			this.doorSprite.texture = this.doorTextures[this.doorMainTexture];
		}
	}
	,makeDoorSpriteIfNeeded: function() {
		if(this.doorSprite == null) {
			if(this.worldPosition.y == 0) {
				this.doorSprite = new PIXI.Sprite(this.doorTextures[this.doorMainTexture]);
				this.doorSprite.position.set(this.position.x,this.position.y);
				this.stage.addChild(this.doorSprite);
			}
		}
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		if(this.doorSprite != null) {
			var cycleButton = gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.doorMainTexture;
			},function(t) {
				if(_gthis.doorSprite != null) {
					_gthis.doorMainTexture = t;
					_gthis.doorSprite.texture = _gthis.doorTextures[_gthis.doorMainTexture];
				}
			},function() {
				return _gthis.doorTextures.length;
			},common_Localize.lo("change_door_color"));
			cycleButton.onUpdate = function() {
				if(_gthis.doorSprite == null) {
					_gthis.city.gui.windowInner.removeChild(cycleButton);
				}
			};
		}
		buildings_House.prototype.createWindowAddBottomButtons.call(this);
	}
	,destroy: function() {
		if(this.doorSprite != null) {
			this.doorSprite.destroy();
		}
		buildings_House.prototype.destroy.call(this);
	}
	,addWindowInfoLines: function() {
		buildings_House.prototype.addWindowInfoLines.call(this);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_NormalHouse.saveDefinition);
		}
		var value = this.doorMainTexture;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		buildings_House.prototype.load.call(this,queue);
		if(queue.version < 18) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"doorMainTexture")) {
			this.doorMainTexture = loadMap.h["doorMainTexture"];
		}
		this.postLoad();
	}
	,__class__: buildings_NormalHouse
});
