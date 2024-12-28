var buildings_EcoFarm = $hxClasses["buildings.EcoFarm"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.buildingIsPruning = false;
	this.woodMade = 0;
	this.crop3Sprite = 0;
	this.crop2Sprite = 0;
	this.openDay = 0;
	this.growthAreas = null;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.crop2Sprite = random_Random.getInt(buildings_EcoFarm.crop2Sprites.length);
	this.crop3Sprite = random_Random.getInt(buildings_EcoFarm.crop3Sprites.length);
	this.growthAreas = [new buildings_FarmGrowArea(bgStage,this,new common_Point(3,3),city,"spr_ecofarm_crop1",6,20 + city.upgrades.vars.extraEcoFarmFoodToPlot1,0.7,0,6),new buildings_FarmGrowArea(bgStage,this,new common_Point(9,3),city,buildings_EcoFarm.crop2Sprites[this.crop2Sprite],8,10 + city.upgrades.vars.extraEcoFarmFoodToPlot2,1.4,10),new buildings_FarmGrowArea(bgStage,this,new common_Point(9,12),city,buildings_EcoFarm.crop3Sprites[this.crop3Sprite],8,12,0.6,7)];
	this.isEntertainment = true;
	this.openDay = random_Random.getInt(7);
	this.positionSprites();
	this.adjecentBuildingEffects.push({ name : "farm", intensity : 1});
};
buildings_EcoFarm.__name__ = "buildings.EcoFarm";
buildings_EcoFarm.__interfaces__ = [buildings_IEntertainmentBuilding];
buildings_EcoFarm.__super__ = buildings_Work;
buildings_EcoFarm.prototype = $extend(buildings_Work.prototype,{
	get_baseEntertainmentCapacity: function() {
		return this.workers.length * 5;
	}
	,get_isOpen: function() {
		if(this.workers.length > 0 && this.workers[0].currentAction == 0 && (1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0)) % 7 == this.openDay && this.city.simulation.time.timeSinceStart / 60 % 24 < 20.5) {
			return this.city.simulation.time.timeSinceStart / 60 % 24 > 12.0;
		} else {
			return false;
		}
	}
	,get_entertainmentType: function() {
		return 1;
	}
	,get_secondaryEntertainmentTypes: function() {
		return null;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 2;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 3;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 1.5;
	}
	,get_entertainmentQuality: function() {
		return 100;
	}
	,get_isOpenForExistingVisitors: function() {
		return this.get_isOpen();
	}
	,finishEntertainment: function(citizen,timeMod) {
		return true;
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_EcoFarmNormal,buildingUpgrades_EcoFarmPruning];
	}
	,onBuild: function() {
		this.city.progress.unlocks.unlock(cityUpgrades_EcoFarmUpgrade);
	}
	,beEntertained: function(citizen,timeMod) {
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(50,100),null,modifyWithHappiness,slowMove);
	}
	,postLoad: function() {
		this.growthAreas[1].setTexture(buildings_EcoFarm.crop2Sprites[this.crop2Sprite],8);
		this.growthAreas[2].setTexture(buildings_EcoFarm.crop3Sprites[this.crop3Sprite],8);
		var _g = 0;
		var _g1 = this.growthAreas;
		while(_g < _g1.length) {
			var growthArea = _g1[_g];
			++_g;
			growthArea.updateTexture();
		}
	}
	,update: function(timeMod) {
		if((1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0)) % 7 == this.openDay) {
			this.endTime = 21.0;
		} else {
			this.endTime = 19.0;
		}
		buildings_Work.prototype.update.call(this,timeMod);
		var _g = 0;
		var _g1 = this.growthAreas;
		while(_g < _g1.length) {
			var growthArea = _g1[_g];
			++_g;
			growthArea.update(timeMod);
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			var citizenIndex = this.workers.indexOf(citizen);
			if(citizenIndex == 1) {
				if(citizen.relativeY < 5) {
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 18;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = function() {
						citizen.changeFloor();
					};
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
				} else {
					this.growthAreas[citizenIndex].doCitizenWork(citizen);
				}
			} else if(citizenIndex == 0 && this.growthAreas[0].farmStage == 1) {
				if(citizen.relativeY <= 1 || (citizen.relativeX < 4 || citizen.relativeX > 6)) {
					citizen.setPath(new Int32Array([4,5,9,8]),0,4,true);
				} else {
					this.growthAreas[citizenIndex].doCitizenWorkNoMove(citizen);
				}
			} else if(citizen.relativeY > 5) {
				citizen.changeFloor();
			} else {
				this.growthAreas[citizenIndex].doCitizenWork(citizen);
			}
			if(this.buildingIsPruning && citizenIndex == 0) {
				var currentHarvestAmount = 0.025 * this.city.simulation.boostManager.currentGlobalBoostAmount;
				this.city.materials.wood += currentHarvestAmount;
				this.city.simulation.stats.materialProduction[1][0] += currentHarvestAmount;
				this.woodMade += currentHarvestAmount;
			}
		}
	}
	,workExternal: function(citizen,timeMod,shouldStopWorking,citizenIndex) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			if(citizenIndex == 1) {
				if(citizen.relativeY < 5) {
					var citizen1 = citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = 18;
					citizen1.setPath(arr,0,2,true);
					citizen.pathEndFunction = function() {
						citizen.changeFloor();
					};
					citizen.pathOnlyRelatedTo = citizen.inPermanent;
				} else {
					this.growthAreas[citizenIndex].doCitizenWork(citizen);
				}
			} else if(citizenIndex == 0 && this.growthAreas[0].farmStage == 1) {
				if(citizen.relativeY <= 1 || (citizen.relativeX < 4 || citizen.relativeX > 6)) {
					citizen.setPath(new Int32Array([4,5,9,8]),0,4,true);
				} else {
					this.growthAreas[citizenIndex].doCitizenWorkNoMove(citizen);
				}
			} else if(citizen.relativeY > 5) {
				citizen.changeFloor();
			} else {
				this.growthAreas[citizenIndex].doCitizenWork(citizen);
			}
			if(this.buildingIsPruning && citizenIndex == 0) {
				var currentHarvestAmount = 0.025 * this.city.simulation.boostManager.currentGlobalBoostAmount;
				this.city.materials.wood += currentHarvestAmount;
				this.city.simulation.stats.materialProduction[1][0] += currentHarvestAmount;
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue,shouldSaveDefinition);
		this.saveBasics(queue);
		var _g = 0;
		var _g1 = this.growthAreas;
		while(_g < _g1.length) {
			var growthArea = _g1[_g];
			++_g;
			growthArea.save(queue);
		}
	}
	,load: function(queue,definition) {
		buildings_Work.prototype.load.call(this,queue,definition);
		this.loadBasics(queue,definition);
		var _g = 0;
		var _g1 = this.growthAreas;
		while(_g < _g1.length) {
			var growthArea = _g1[_g];
			++_g;
			growthArea.load(queue);
		}
		this.postLoad();
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		var _g = 0;
		var _g1 = this.growthAreas;
		while(_g < _g1.length) {
			var growthArea = _g1[_g];
			++_g;
			growthArea.destroy();
		}
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		var _g = 0;
		var _g1 = this.growthAreas;
		while(_g < _g1.length) {
			var growthArea = _g1[_g];
			++_g;
			growthArea.positionSprites();
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.growthAreas[0].showInfoText(common_Localize.lo("left_plot") + " ");
		this.growthAreas[1].showInfoText(common_Localize.lo("top_right_plot") + " ");
		this.growthAreas[2].showInfoText(common_Localize.lo("bottom_right_plot") + " ");
		if(this.buildingIsPruning) {
			this.city.gui.windowAddInfoText(null,function() {
				return common_Localize.lo("wood_produced",[_gthis.woodMade | 0]);
			});
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(buildings_EcoFarm.saveDefinition);
		}
		var value = this.openDay;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.crop2Sprite;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.crop3Sprite;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.woodMade;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"openDay")) {
			this.openDay = loadMap.h["openDay"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"crop2Sprite")) {
			this.crop2Sprite = loadMap.h["crop2Sprite"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"crop3Sprite")) {
			this.crop3Sprite = loadMap.h["crop3Sprite"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"woodMade")) {
			this.woodMade = loadMap.h["woodMade"];
		}
		this.postLoad();
	}
	,__class__: buildings_EcoFarm
});
