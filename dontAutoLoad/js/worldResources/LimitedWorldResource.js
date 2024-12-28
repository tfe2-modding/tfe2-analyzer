var worldResources_LimitedWorldResource = $hxClasses["worldResources.LimitedWorldResource"] = function(game,id,city,world,position,worldPosition,stage,texturesName,initialMaterials,regrowTexturesName) {
	this.maxCitizenX = 17;
	this.minCitizenX = 1;
	this.regrowProgress = 0;
	this.textures = Resources.getTexturesByWidth(texturesName,20);
	this.regrowTextures = regrowTexturesName == null ? null : Resources.getTexturesByWidth(regrowTexturesName,20);
	this.initialMaterials = initialMaterials;
	this.materialsLeft = initialMaterials;
	WorldResource.call(this,game,id,city,world,position,worldPosition,stage,this.textures[0]);
};
worldResources_LimitedWorldResource.__name__ = "worldResources.LimitedWorldResource";
worldResources_LimitedWorldResource.__interfaces__ = [worldResources_ILimitedMaterialGatherPlace];
worldResources_LimitedWorldResource.updateTextureOfLimitedResourceSprite = function(materialsLeft,initialMaterials,regrowProgress,textures,regrowTextures,sprite) {
	if(materialsLeft <= 0.0000001) {
		sprite.texture = regrowTextures != null ? regrowTextures[regrowProgress / 100 * regrowTextures.length | 0] : textures[textures.length - 1];
	} else {
		var i = Math.floor((initialMaterials - materialsLeft) / initialMaterials * textures.length);
		if(initialMaterials != materialsLeft && i == 0 && textures.length > 1) {
			i = 1;
		}
		sprite.texture = textures[i];
	}
};
worldResources_LimitedWorldResource.updateRegrow = function(target,timeMod,city) {
	if(target.materialsLeft <= 0) {
		var this1 = city.simulation.time.timeSinceStart / 60 % 24;
		var start = 7;
		var end = 20;
		if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
			target.regrowProgress += target.get_regrowSpeed() * timeMod * city.upgrades.vars.forestRegrowSpeedMod;
		} else {
			var this1 = city.simulation.time.timeSinceStart / 60 % 24;
			var start = 7 - 1;
			var end = 20 + 1;
			if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
				target.regrowProgress += target.get_regrowSpeed() * timeMod * 0.5 * city.upgrades.vars.forestRegrowSpeedMod;
			}
		}
		if(target.regrowProgress >= 100) {
			target.materialsLeft = target.initialMaterials;
			target.regrowProgress = 0;
		}
		target.updateTexture();
	}
};
worldResources_LimitedWorldResource.__super__ = WorldResource;
worldResources_LimitedWorldResource.prototype = $extend(WorldResource.prototype,{
	get_destroyedOnEmpty: function() {
		return true;
	}
	,get_doNotGather: function() {
		return false;
	}
	,get_resourceName: function() {
		return "";
	}
	,get_regrowSpeed: function() {
		return 0.0;
	}
	,get_stayIfEmpty: function() {
		return false;
	}
	,postLoad: function() {
		this.updateTexture();
	}
	,update: function(timeMod) {
		WorldResource.prototype.update.call(this,timeMod);
		var city = this.city;
		if(this.materialsLeft <= 0) {
			var this1 = city.simulation.time.timeSinceStart / 60 % 24;
			var start = 7;
			var end = 20;
			if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
				this.regrowProgress += this.get_regrowSpeed() * timeMod * city.upgrades.vars.forestRegrowSpeedMod;
			} else {
				var this1 = city.simulation.time.timeSinceStart / 60 % 24;
				var start = 7 - 1;
				var end = 20 + 1;
				if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
					this.regrowProgress += this.get_regrowSpeed() * timeMod * 0.5 * city.upgrades.vars.forestRegrowSpeedMod;
				}
			}
			if(this.regrowProgress >= 100) {
				this.materialsLeft = this.initialMaterials;
				this.regrowProgress = 0;
			}
			this.updateTexture();
		}
	}
	,updateTexture: function() {
		var materialsLeft = this.materialsLeft;
		var initialMaterials = this.initialMaterials;
		var textures = this.textures;
		var regrowTextures = this.regrowTextures;
		var sprite = this.sprite;
		if(materialsLeft <= 0.0000001) {
			sprite.texture = regrowTextures != null ? regrowTextures[this.regrowProgress / 100 * regrowTextures.length | 0] : textures[textures.length - 1];
		} else {
			var i = Math.floor((initialMaterials - materialsLeft) / initialMaterials * textures.length);
			if(initialMaterials != materialsLeft && i == 0 && textures.length > 1) {
				i = 1;
			}
			sprite.texture = textures[i];
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		WorldResource.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			if(_gthis.materialsLeft <= 0) {
				return common_Localize.lo("pct_grown",[_gthis.regrowProgress | 0]);
			} else {
				return common_Localize.lo("pct_left",[_gthis.materialsLeft | 0,_gthis.initialMaterials,_gthis.get_resourceName()]);
			}
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		WorldResource.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(worldResources_LimitedWorldResource.saveDefinition);
		}
		var value = this.materialsLeft;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.regrowProgress;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		WorldResource.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"materialsLeft")) {
			this.materialsLeft = loadMap.h["materialsLeft"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"regrowProgress")) {
			this.regrowProgress = loadMap.h["regrowProgress"];
		}
		this.postLoad();
	}
	,__class__: worldResources_LimitedWorldResource
});
