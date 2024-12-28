var buildings_ComputerResearchCenter = $hxClasses["buildings.ComputerResearchCenter"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalKnowledgeGenerated = 0;
	buildings_Factory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,"spr_computerresearchcenter_frames","spr_computerresearchcenter_idle");
};
buildings_ComputerResearchCenter.__name__ = "buildings.ComputerResearchCenter";
buildings_ComputerResearchCenter.__super__ = buildings_Factory;
buildings_ComputerResearchCenter.prototype = $extend(buildings_Factory.prototype,{
	get_possibleCityUpgrades: function() {
		return [cityUpgrades_ChipBinning];
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,workAnimation: function(citizen,timeMod) {
		switch(this.workers.indexOf(citizen)) {
		case 0:
			citizen.setRelativePos(13,10);
			break;
		case 1:
			citizen.setRelativePos(6,0);
			break;
		case 2:
			citizen.setRelativePos(6,10);
			break;
		case 3:
			citizen.setRelativePos(15,0);
			break;
		case 4:
			citizen.setRelativePos(8,0);
			break;
		}
	}
	,possiblyBeActive: function(timeMod) {
		var newKnowledge = 0.0014 * timeMod * this.city.simulation.happiness.actionSpeedModifier * this.activeWorkersTotalEducation * this.city.simulation.boostManager.currentGlobalBoostAmount;
		this.city.materials.knowledge += newKnowledge;
		this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
		this.totalKnowledgeGenerated += newKnowledge;
		return true;
	}
	,canShowActiveTextures: function() {
		return true;
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Factory.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Factory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ComputerResearchCenter.saveDefinition);
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
	,load: function(queue,definition) {
		buildings_Factory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
	}
	,__class__: buildings_ComputerResearchCenter
});
