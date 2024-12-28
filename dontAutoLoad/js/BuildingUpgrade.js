var BuildingUpgrade = $hxClasses["BuildingUpgrade"] = function(stage,building) {
	this.stage = stage;
	this.building = building;
	var c = js_Boot.getClass(this);
	this.className = c.__name__;
	building.bonusAttractiveness += this.get_bonusAttractiveness();
	if(stage != null) {
		this.textures = Resources.getTexturesByWidth(this.get_textureName(),20);
		this.spriteIndex = random_Random.getInt(this.get_availableTextures());
		this.sprite = new PIXI.Sprite(this.textures[this.spriteIndex]);
		this.reposition();
		if(this.get_canCacheSprite()) {
			stage.cacheableChildren.push(this.sprite);
			stage.isInvalid = true;
		} else {
			stage.addChild(this.sprite);
		}
	} else {
		this.textures = [];
	}
};
BuildingUpgrade.__name__ = "BuildingUpgrade";
BuildingUpgrade.__interfaces__ = [ICreatableCityElement];
BuildingUpgrade.prototype = {
	get_textureName: function() {
		return "";
	}
	,get_hasChangeableAppearance: function() {
		return this.textures.length > 1;
	}
	,get_bonusAttractiveness: function() {
		return 0;
	}
	,get_canCacheSprite: function() {
		return true;
	}
	,get_availableTextures: function() {
		return this.textures.length;
	}
	,set_onUpdate: function(to) {
		if(this.building.city.simulation.buildingUpgradesToUpdate.indexOf(this) == -1) {
			this.building.city.simulation.buildingUpgradesToUpdate.push(this);
		}
		this.onUpdate = to;
		return this.onUpdate;
	}
	,changeAppearance: function() {
		if(this.textures.length <= 1) {
			return;
		}
		if((this.spriteIndex += 1) >= this.get_availableTextures()) {
			this.spriteIndex = 0;
		}
		this.sprite.texture = this.textures[this.spriteIndex];
		if(this.get_canCacheSprite()) {
			this.stage.isInvalid = true;
		}
	}
	,reposition: function() {
		if(this.stage != null) {
			this.sprite.position.set(this.building.position.x,this.building.position.y);
			if(this.get_canCacheSprite()) {
				this.stage.isInvalid = true;
			}
		}
	}
	,postLoad: function() {
		if(this.stage != null) {
			this.sprite.texture = this.textures[this.spriteIndex];
			if(this.get_canCacheSprite()) {
				this.stage.isInvalid = true;
			}
		}
	}
	,destroy: function() {
		this.building.bonusAttractiveness -= this.get_bonusAttractiveness();
		if(this.stage != null) {
			if(this.get_canCacheSprite()) {
				var _this = this.stage;
				var child = this.sprite;
				HxOverrides.remove(_this.cacheableChildren,child);
				_this.isInvalid = true;
				child.destroy({ children : true, texture : false});
			} else {
				this.sprite.destroy();
			}
		}
	}
	,update: function(timeMod) {
		this.onUpdate(timeMod);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(BuildingUpgrade.saveDefinition);
		}
		var value = this.spriteIndex;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"spriteIndex")) {
			this.spriteIndex = loadMap.h["spriteIndex"];
		}
		this.postLoad();
	}
	,__class__: BuildingUpgrade
};
