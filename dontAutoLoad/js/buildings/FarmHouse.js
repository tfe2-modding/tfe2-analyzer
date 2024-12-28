var buildings_FarmHouse = $hxClasses["buildings.FarmHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalMaterialsProduced = 0;
	this.materialPhase = 0;
	this.stageProgress = 0;
	this.resourceSprite = null;
	this.resourceSprite = new PIXI.Sprite(Resources.getTexturesByWidth("spr_communityhouse_crop",5)[0]);
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.buildingMode = Type.createInstance(this.get_possibleBuildingModes()[random_Random.getInt(3)],[stage,city.cityMidStage,bgStage,this]);
	this.currentMaterialTextures = this.get_materialTextures();
	this.resourceSprite.position.set(position.x + 3,position.y + 3);
	bgStage.addChild(this.resourceSprite);
};
buildings_FarmHouse.__name__ = "buildings.FarmHouse";
buildings_FarmHouse.__super__ = buildings_House;
buildings_FarmHouse.prototype = $extend(buildings_House.prototype,{
	get_originalMaterials: function() {
		switch(this.materialType) {
		case 0:
			return 20;
		case 1:
			return 25;
		case 2:
			return 10;
		default:
			return 10;
		}
	}
	,get_materialTextures: function() {
		var tmp;
		switch(this.materialType) {
		case 0:
			tmp = "spr_communityhouse_rock";
			break;
		case 1:
			tmp = "spr_communityhouse_tree";
			break;
		case 2:
			tmp = "spr_communityhouse_crop";
			break;
		default:
			tmp = "";
		}
		return Resources.getTexturesByWidth(tmp,5);
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_IndoorPond];
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_CHProduceFood,buildingUpgrades_CHProduceStone,buildingUpgrades_CHProduceWood];
	}
	,destroy: function() {
		buildings_House.prototype.destroy.call(this);
		this.resourceSprite.destroy();
	}
	,postLoad: function() {
		this.resourceSprite.alpha = 1;
		this.setResourceSpriteTexture();
	}
	,positionSprites: function() {
		buildings_House.prototype.positionSprites.call(this);
		if(this.resourceSprite != null) {
			this.resourceSprite.position.set(this.position.x + 3,this.position.y + 3);
		}
	}
	,update: function(timeMod) {
		if(this.materialPhase == 0) {
			switch(this.materialType) {
			case 0:
				this.stageProgress += timeMod * 0.05;
				if(this.stageProgress >= 1) {
					this.materialPhase = 1;
					this.stageProgress = this.get_originalMaterials();
					this.resourceSprite.alpha = 1;
				}
				this.setResourceSpriteTexture();
				break;
			case 1:
				var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
				var start = 7;
				var end = 20;
				if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
					this.stageProgress += 0.00018 * timeMod;
					if(this.stageProgress >= 1) {
						this.materialPhase = 1;
						this.stageProgress = this.get_originalMaterials();
					}
					this.setResourceSpriteTexture();
				}
				break;
			case 2:
				var this1 = this.city.simulation.time.timeSinceStart / 60 % 24;
				var start = 7;
				var end = 20;
				if(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end) {
					this.stageProgress += 0.00008 * timeMod;
					if(this.stageProgress >= 1) {
						this.materialPhase = 1;
						this.stageProgress = this.get_originalMaterials();
					}
					this.setResourceSpriteTexture();
				}
				break;
			}
		}
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var _gthis = this;
		if(stepsInBuilding < 180) {
			if(citizen.relativeY > 5) {
				citizen.changeFloor();
			} else {
				var timeMin = this.materialPhase == 2 ? 20 : 50;
				var timeMax = this.materialPhase == 2 ? 30 : 80;
				var modifyWithHappiness = true;
				if(modifyWithHappiness == null) {
					modifyWithHappiness = false;
				}
				citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(timeMin,timeMax),function() {
					switch(_gthis.materialType) {
					case 0:
						if(_gthis.materialPhase == 1) {
							var harvestAmount = 0.1;
							var currentHarvestAmount = harvestAmount * _gthis.city.simulation.boostManager.currentGlobalBoostAmount;
							_gthis.stageProgress -= currentHarvestAmount;
							_gthis.city.materials.stone += currentHarvestAmount;
							_gthis.city.simulation.stats.materialProduction[2][0] += currentHarvestAmount;
							_gthis.totalMaterialsProduced += currentHarvestAmount;
							if(_gthis.stageProgress <= 0) {
								_gthis.stageProgress = 0;
								_gthis.materialPhase = 0;
							}
						}
						break;
					case 1:
						if(_gthis.materialPhase == 0) {
							_gthis.stageProgress += 0.005;
							if(_gthis.stageProgress >= 1) {
								_gthis.stageProgress = _gthis.get_originalMaterials();
								_gthis.materialPhase += 1;
							}
						} else {
							var harvestAmount = 0.2;
							var currentHarvestAmount = harvestAmount * _gthis.city.simulation.boostManager.currentGlobalBoostAmount;
							_gthis.stageProgress -= currentHarvestAmount;
							_gthis.city.materials.wood += currentHarvestAmount;
							_gthis.city.simulation.stats.materialProduction[1][0] += currentHarvestAmount;
							_gthis.totalMaterialsProduced += currentHarvestAmount;
							if(_gthis.stageProgress <= 0) {
								_gthis.stageProgress = 0;
								_gthis.materialPhase = 0;
							}
						}
						break;
					case 2:
						if(_gthis.materialPhase == 1) {
							var harvestAmount = 0.25;
							var currentHarvestAmount = harvestAmount * _gthis.city.simulation.boostManager.currentGlobalBoostAmount;
							_gthis.stageProgress -= currentHarvestAmount;
							var _g = _gthis.city.materials;
							_g.set_food(_g.food + currentHarvestAmount);
							_gthis.city.simulation.stats.materialProduction[0][0] += currentHarvestAmount;
							_gthis.totalMaterialsProduced += currentHarvestAmount;
							if(_gthis.stageProgress <= 0) {
								_gthis.stageProgress = 0;
								_gthis.materialPhase = 2;
							}
						} else if(_gthis.materialPhase == 0) {
							_gthis.stageProgress += 0.01;
							if(_gthis.stageProgress >= 1) {
								_gthis.stageProgress = _gthis.get_originalMaterials();
								_gthis.materialPhase += 1;
							}
						} else if(_gthis.materialPhase == 2) {
							_gthis.stageProgress += 0.1;
							if(_gthis.stageProgress >= 1) {
								_gthis.stageProgress = 0;
								_gthis.materialPhase = 0;
							}
						}
						break;
					}
					_gthis.setResourceSpriteTexture();
				},modifyWithHappiness,false);
			}
		} else if(citizen.relativeX > 11 && random_Random.getInt(3) == 1) {
			citizen.changeFloorAndWaitRandom(60,90);
		} else {
			citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(60,90),null,false,false);
		}
	}
	,setMaterialType: function(type) {
		this.materialType = type;
		this.currentMaterialTextures = this.get_materialTextures();
		buildings_FarmHouse.treeGrowTextures = Resources.getTexturesByWidth("spr_communityhouse_tree_grow",5);
		if(this.materialType == 2) {
			this.adjecentBuildingEffects.push({ name : "farm", intensity : 1});
		} else {
			var farmEffect = Lambda.find(this.adjecentBuildingEffects,function(ae) {
				return ae.name == "farm";
			});
			HxOverrides.remove(this.adjecentBuildingEffects,farmEffect);
		}
		this.resourceSprite.alpha = 1;
		this.setResourceSpriteTexture();
	}
	,resetProgress: function() {
		this.materialPhase = 0;
		this.stageProgress = 0;
	}
	,setResourceSpriteTexture: function() {
		if((this.materialType == 0 || this.materialType == 1) && this.materialPhase == 1) {
			var tmp = this.currentMaterialTextures;
			var tmp1 = 1 - this.stageProgress / this.get_originalMaterials();
			this.resourceSprite.texture = tmp[Math.ceil(tmp1 * (this.currentMaterialTextures.length - 1))];
		} else if(this.materialType == 0) {
			this.resourceSprite.texture = this.currentMaterialTextures[0];
			this.resourceSprite.alpha = this.stageProgress;
		} else if(this.materialType == 2 && this.materialPhase == 0) {
			this.resourceSprite.texture = this.currentMaterialTextures[this.stageProgress * (this.currentMaterialTextures.length - 2) | 0];
		} else if(this.materialType == 1 && this.materialPhase == 0) {
			this.resourceSprite.texture = buildings_FarmHouse.treeGrowTextures[this.stageProgress * buildings_FarmHouse.treeGrowTextures.length | 0];
		} else if(this.materialType == 2) {
			if(this.materialPhase == 1) {
				this.resourceSprite.texture = this.currentMaterialTextures[this.currentMaterialTextures.length - 2];
			} else if(this.materialPhase == 2) {
				this.resourceSprite.texture = this.currentMaterialTextures[this.currentMaterialTextures.length - 1];
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_House.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("resources_produced",[_gthis.totalMaterialsProduced | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_FarmHouse.saveDefinition);
		}
		var value = this.stageProgress;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.materialPhase;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.totalMaterialsProduced;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_House.prototype.load.call(this,queue);
		if(queue.version < 23) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"stageProgress")) {
			this.stageProgress = loadMap.h["stageProgress"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"materialPhase")) {
			this.materialPhase = loadMap.h["materialPhase"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalMaterialsProduced")) {
			this.totalMaterialsProduced = loadMap.h["totalMaterialsProduced"];
		}
		this.postLoad();
	}
	,__class__: buildings_FarmHouse
});
