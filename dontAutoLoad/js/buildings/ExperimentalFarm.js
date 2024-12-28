var buildings_ExperimentalFarm = $hxClasses["buildings.ExperimentalFarm"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalKnowledgeGenerated = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.growthAreas = [new buildings_FarmGrowArea(bgStage,this,new common_Point(3,3),city,"spr_experimentalfarm_crop1",5,12,1,5),new buildings_FarmGrowArea(bgStage,this,new common_Point(12,3),city,"spr_experimentalfarm_crop2",5,10,1.2,10),new buildings_FarmGrowArea(bgStage,this,new common_Point(12,12),city,"spr_experimentalfarm_crop3",5,6,1.5,10)];
	this.positionSprites();
	this.adjecentBuildingEffects.push({ name : "farm", intensity : 1});
};
buildings_ExperimentalFarm.__name__ = "buildings.ExperimentalFarm";
buildings_ExperimentalFarm.__super__ = buildings_Work;
buildings_ExperimentalFarm.prototype = $extend(buildings_Work.prototype,{
	get_possibleCityUpgrades: function() {
		return [cityUpgrades_EcoFarmUpgrade];
	}
	,onBuild: function() {
		this.city.simulation.bonuses.indoorFarmSpeed += 0.1;
	}
	,postLoad: function() {
		var _g = 0;
		var _g1 = this.growthAreas;
		while(_g < _g1.length) {
			var growthArea = _g1[_g];
			++_g;
			growthArea.updateTexture();
		}
	}
	,update: function(timeMod) {
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
		if(this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("knowledgeSharing") != -1) {
			var newKnowledge = 0.025 * timeMod * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
			this.city.materials.knowledge += newKnowledge;
			this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
			this.totalKnowledgeGenerated += newKnowledge;
		}
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
			} else if(citizen.relativeY > 5) {
				citizen.changeFloor();
			} else {
				this.growthAreas[citizenIndex].doCitizenWork(citizen);
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
		this.city.simulation.bonuses.indoorFarmSpeed -= 0.1;
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
		if(this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("knowledgeSharing") != -1) {
			this.city.gui.windowAddInfoText(null,function() {
				return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]);
			});
		}
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(buildings_ExperimentalFarm.saveDefinition);
		}
		var value = this.totalKnowledgeGenerated;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
		this.postLoad();
	}
	,__class__: buildings_ExperimentalFarm
});
