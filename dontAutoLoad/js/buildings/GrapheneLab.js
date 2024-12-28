var buildings_GrapheneLab = $hxClasses["buildings.GrapheneLab"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalGrapheneProduced = 0;
	this.totalStoneUsed = 0;
	this.totalKnowledgeGenerated = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_GrapheneLab.__name__ = "buildings.GrapheneLab";
buildings_GrapheneLab.__super__ = buildings_Work;
buildings_GrapheneLab.prototype = $extend(buildings_Work.prototype,{
	onBuild: function() {
		this.city.progress.unlocks.unlockMaterial("graphene");
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		var bonuses = this.city.simulation.happiness.actionSpeedModifier * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
		if(this.city.materials.stone > 1) {
			var productionAmount = bonuses * 0.0015 * 2;
			this.city.materials.stone -= productionAmount;
			this.city.simulation.stats.materialUsed[2][0] += productionAmount;
			var productionAmount = bonuses * 0.0015;
			this.city.materials.graphene += productionAmount;
			this.city.simulation.stats.materialProduction[8][0] += productionAmount;
			this.totalStoneUsed += bonuses * 0.0015 * 2;
			this.totalGrapheneProduced += bonuses * 0.0015;
		}
		var productionAmount = bonuses * 0.0375;
		this.city.materials.knowledge += productionAmount;
		this.city.simulation.stats.materialProduction[10][0] += productionAmount;
		this.totalKnowledgeGenerated += bonuses * 0.0375;
		var r = random_Random.getInt(4);
		if(r == 0 && citizen.get_stepsInBuilding() > 50) {
			citizen.changeFloorAndWaitRandom(60,90);
		} else if(r == 1) {
			citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(30,60),null,false,false);
		} else if(r == 2) {
			citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(30,60),null,false,false);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(90,120);
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("graphene_sheets_made",[_gthis.totalStoneUsed | 0,_gthis.totalGrapheneProduced | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_GrapheneLab.saveDefinition);
		}
		var value = this.totalKnowledgeGenerated;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.totalStoneUsed;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.totalGrapheneProduced;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalStoneUsed")) {
			this.totalStoneUsed = loadMap.h["totalStoneUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalGrapheneProduced")) {
			this.totalGrapheneProduced = loadMap.h["totalGrapheneProduced"];
		}
	}
	,__class__: buildings_GrapheneLab
});
