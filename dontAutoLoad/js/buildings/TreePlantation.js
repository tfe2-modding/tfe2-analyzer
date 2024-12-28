var buildings_TreePlantation = $hxClasses["buildings.TreePlantation"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.regrowSpeedBoost = 1;
	this.initialMaterials = 100;
	this.regrowProgress = 0;
	this.maxCitizenX = 14;
	this.minCitizenX = 4;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.materialsLeft = 0;
	this.treesCutTextures = Resources.getTexturesByWidth(this.get_treesTextureName(),20);
	this.regrowTextures = Resources.getTexturesByWidth(this.get_treesGrowTexturesName(),20);
	this.treesSprite = new PIXI.Sprite(this.regrowTextures[0]);
	this.treesSprite.position.set(position.x,position.y);
	bgStage.addChild(this.treesSprite);
};
buildings_TreePlantation.__name__ = "buildings.TreePlantation";
buildings_TreePlantation.__interfaces__ = [worldResources_ILimitedMaterialGatherPlace];
buildings_TreePlantation.__super__ = buildings_Work;
buildings_TreePlantation.prototype = $extend(buildings_Work.prototype,{
	get_destroyedOnEmpty: function() {
		return false;
	}
	,get_resourceName: function() {
		return "wood";
	}
	,get_regrowSpeed: function() {
		return 0.008 * this.getExtraTreeGrowth() * this.regrowSpeedBoost;
	}
	,get_doNotGather: function() {
		return false;
	}
	,get_stayIfEmpty: function() {
		return false;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_AutomaticWaterManagement];
	}
	,get_treesTextureName: function() {
		return "spr_treeplantation_trees";
	}
	,get_treesGrowTexturesName: function() {
		return "spr_treeplantation_trees_grow";
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
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
		var textures = this.treesCutTextures;
		var regrowTextures = this.regrowTextures;
		var sprite = this.treesSprite;
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
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.treesSprite != null) {
			this.treesSprite.position.set(this.position.x,this.position.y);
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		this.treesSprite.destroy();
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		var _gthis = this;
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		var anyMaterialsLeft = this.materialsLeft > 0;
		var modifyWithHappiness = true;
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(this.minCitizenX,this.maxCitizenX),random_Random.getInt(anyMaterialsLeft ? 60 : 120,anyMaterialsLeft ? 90 : 180),function() {
			if(anyMaterialsLeft) {
				var woodCut = _gthis.city.simulation.boostManager.currentGlobalBoostAmount * 0.2;
				_gthis.materialsLeft -= woodCut;
				_gthis.city.materials.wood += woodCut;
				_gthis.city.simulation.stats.materialProduction[1][0] += woodCut;
			} else {
				_gthis.regrowProgress += 0.5 * _gthis.getExtraTreeGrowth();
			}
			_gthis.updateTexture();
		},modifyWithHappiness,false);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			if(_gthis.materialsLeft <= 0) {
				return common_Localize.lo("trees_grown",[_gthis.regrowProgress | 0]);
			} else {
				return common_Localize.lo("wood_left",[_gthis.materialsLeft | 0,_gthis.initialMaterials | 0]);
			}
		});
	}
	,getExtraTreeGrowth: function() {
		return 1 + this.getEffectsOfAdjecentBuildings("increaseTreeGrowth");
	}
	,postLoad: function() {
		this.updateTexture();
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_TreePlantation.saveDefinition);
		}
		var value = this.regrowProgress;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.materialsLeft;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"regrowProgress")) {
			this.regrowProgress = loadMap.h["regrowProgress"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"materialsLeft")) {
			this.materialsLeft = loadMap.h["materialsLeft"];
		}
		this.postLoad();
	}
	,__class__: buildings_TreePlantation
});
