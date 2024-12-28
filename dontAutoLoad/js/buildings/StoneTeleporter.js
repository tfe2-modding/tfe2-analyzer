var buildings_StoneTeleporter = $hxClasses["buildings.StoneTeleporter"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.hasBigStone = false;
	this.hasRemoteControl = false;
	this.teleportButtonNotPressedTime = 0;
	this.teleportButtonPressed = false;
	this.maxCitizenX = 13;
	this.minCitizenX = 5;
	this.initialMaterials = 50;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.updateStoneTextures();
	this.stoneSprite = new PIXI.Sprite(this.stoneTextures[0]);
	bgStage.addChild(this.stoneSprite);
	this.positionSprites();
	this.doorX = 12;
	this.materialsLeft = 0;
	this.regrowProgress = 0;
	this.teleportButtonNotPressedTime = 0;
	this.updateTexture();
};
buildings_StoneTeleporter.__name__ = "buildings.StoneTeleporter";
buildings_StoneTeleporter.__interfaces__ = [worldResources_ILimitedMaterialGatherPlace];
buildings_StoneTeleporter.__super__ = buildings_Work;
buildings_StoneTeleporter.prototype = $extend(buildings_Work.prototype,{
	get_destroyedOnEmpty: function() {
		return false;
	}
	,get_resourceName: function() {
		return "stone";
	}
	,get_doNotGather: function() {
		return false;
	}
	,get_regrowSpeed: function() {
		return 0.0;
	}
	,get_stayIfEmpty: function() {
		return true;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_StoneTeleporterRemote];
	}
	,postLoad: function() {
		if(this.hasBigStone) {
			this.initialMaterials = 150;
			this.updateStoneTextures();
		}
		this.updateTexture();
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		var _gthis = this;
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			if(!this.hasRemoteControl) {
				var spd = citizen.pathWalkSpeed * timeMod;
				Citizen.shouldUpdateDraw = true;
				if(Math.abs(3 - citizen.relativeX) < spd) {
					citizen.relativeX = 3;
				} else {
					var num = 3 - citizen.relativeX;
					citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
				}
			}
			if(this.materialsLeft <= 0) {
				this.teleportButtonPressed = true;
				this.teleportButtonNotPressedTime = 0;
			} else if(this.hasRemoteControl) {
				var modifyWithHappiness = true;
				if(modifyWithHappiness == null) {
					modifyWithHappiness = false;
				}
				citizen.moveAndWait(random_Random.getInt(this.minCitizenX,this.maxCitizenX),random_Random.getInt(90,120),function() {
					if(_gthis.materialsLeft > 0) {
						var stoneProduced = _gthis.city.simulation.boostManager.currentGlobalBoostAmount * 0.2 * _gthis.city.upgrades.vars.stoneMiningSpeed;
						_gthis.materialsLeft -= stoneProduced;
						_gthis.city.materials.stone += stoneProduced;
						_gthis.city.simulation.stats.materialProduction[2][0] += stoneProduced;
					}
					_gthis.updateTexture();
				},modifyWithHappiness,false);
			}
		}
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
		if(this.materialsLeft <= 0) {
			if(this.teleportButtonPressed) {
				if(this.regrowProgress == 0) {
					this.hasBigStone = this.city.upgrades.vars.stoneTeleporterHasBigStones;
					this.updateStoneTextures();
				}
				this.regrowProgress += 2 * timeMod;
				if(this.regrowProgress >= 100) {
					this.regrowProgress = 0;
					if(this.hasBigStone) {
						this.initialMaterials = 150;
					}
					this.materialsLeft = this.initialMaterials;
					this.teleportButtonPressed = false;
					this.teleportButtonNotPressedTime = 0;
					if(this.city.upgrades.vars.stoneResearchCenterWithFossils != null && random_Random.getFloat() < 0.00001 * this.initialMaterials) {
						this.city.materials.knowledge += 10000;
						this.city.simulation.stats.materialProduction[10][0] += 10000;
						this.city.simulation.bonuses.fossilsCollected++;
					}
				}
				this.updateTexture();
			} else if(this.hasRemoteControl && this.workers.length > 0) {
				this.teleportButtonPressed = true;
				this.teleportButtonNotPressedTime = 0;
			} else {
				this.teleportButtonNotPressedTime += timeMod;
			}
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		this.stoneSprite.destroy();
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.stoneSprite != null) {
			this.stoneSprite.position.set(this.position.x,this.position.y);
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			if(_gthis.materialsLeft > 0 || !_gthis.teleportButtonPressed && _gthis.teleportButtonNotPressedTime < 3) {
				return common_Localize.lo("stone_left",[_gthis.materialsLeft | 0]);
			}
			if(!_gthis.teleportButtonPressed) {
				return common_Localize.lo("waiting_for_worker_teleport");
			}
			return common_Localize.lo("teleporting_meteroid");
		});
	}
	,updateStoneTextures: function() {
		this.stoneTextures = Resources.getTexturesByWidth(this.hasBigStone ? "spr_stoneteleporter_stone_big" : "spr_stoneteleporter_stone",20);
	}
	,updateTexture: function() {
		if(this.materialsLeft <= 0) {
			this.stoneSprite.texture = this.stoneTextures[0];
			this.stoneSprite.alpha = this.regrowProgress / 100;
		} else {
			var materialsLeft = this.materialsLeft;
			var initialMaterials = this.initialMaterials;
			var textures = this.stoneTextures;
			var regrowTextures = null;
			var sprite = this.stoneSprite;
			if(materialsLeft <= 0.0000001) {
				sprite.texture = regrowTextures != null ? regrowTextures[this.regrowProgress / 100 * regrowTextures.length | 0] : textures[textures.length - 1];
			} else {
				var i = Math.floor((initialMaterials - materialsLeft) / initialMaterials * textures.length);
				if(initialMaterials != materialsLeft && i == 0 && textures.length > 1) {
					i = 1;
				}
				sprite.texture = textures[i];
			}
			this.stoneSprite.alpha = 1;
		}
		if(this.stoneSprite.texture == null) {
			debugger;
			console.log("FloatingSpaceCities/buildings/StoneTeleporter.hx:205:",common_Localize.lo("something_went_wrong_stone"));
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_StoneTeleporter.saveDefinition);
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
		var value = this.hasBigStone;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hasBigStone")) {
			this.hasBigStone = loadMap.h["hasBigStone"];
		}
		this.postLoad();
	}
	,__class__: buildings_StoneTeleporter
});
