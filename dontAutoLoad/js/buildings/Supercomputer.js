var buildings_Supercomputer = $hxClasses["buildings.Supercomputer"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.numberOfLabs = 0;
	this.knowledgeSoFar = 0;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_Supercomputer.__name__ = "buildings.Supercomputer";
buildings_Supercomputer.__super__ = Building;
buildings_Supercomputer.prototype = $extend(Building.prototype,{
	get_knowledgePerDay: function() {
		return 2 * this.city.simulation.stats.peopleWorkingAtLabs * (1 + this.city.upgrades.vars.superComputerUpgrade);
	}
	,get_possibleCityUpgrades: function() {
		return [cityUpgrades_UniverseMapping,cityUpgrades_OptimizedChipLayouts,cityUpgrades_MedicalMachineLearning];
	}
	,update: function(timeMod) {
		var addKnowledge = timeMod * (this.get_knowledgePerDay() / (1440 / this.city.simulation.time.minutesPerTick)) * this.city.simulation.boostManager.currentGlobalBoostAmount;
		this.city.materials.knowledge += addKnowledge;
		this.city.simulation.stats.materialProduction[10][0] += addKnowledge;
		this.knowledgeSoFar += addKnowledge;
	}
	,onCityChange: function() {
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		Building.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered_per_day",[_gthis.get_knowledgePerDay() | 0]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered_so_far",[_gthis.knowledgeSoFar | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Supercomputer.saveDefinition);
		}
		var value = this.knowledgeSoFar;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"knowledgeSoFar")) {
			this.knowledgeSoFar = loadMap.h["knowledgeSoFar"];
		}
	}
	,__class__: buildings_Supercomputer
});
