var buildings_StoneResearchCenter = $hxClasses["buildings.StoneResearchCenter"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.hasPickaxeTech = false;
	this.currentBonus = 0;
	this.totalKnowledgeGenerated = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_StoneResearchCenter.__name__ = "buildings.StoneResearchCenter";
buildings_StoneResearchCenter.__super__ = buildings_Work;
buildings_StoneResearchCenter.prototype = $extend(buildings_Work.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_PickaxeTech,buildingUpgrades_FossilScanner];
	}
	,postCreate: function() {
		this.recalculateBonus();
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		var rnd = random_Random.getInt(3);
		if(rnd == 0) {
			citizen.changeFloorAndWait(50);
		} else if(rnd == 1) {
			citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(50,80),null,false,false);
		} else if(rnd == 2) {
			citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(50,80),null,false,false);
		}
	}
	,update: function(timeMod) {
		this.recalculateBonus();
	}
	,recalculateBonus: function() {
		this.currentBonus = 0.0;
		var knowledgeProd = this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("knowledge")];
		var baseBonusOn = 0.0;
		if(knowledgeProd.length >= 2) {
			baseBonusOn = knowledgeProd[1];
		} else if(knowledgeProd.length >= 1) {
			baseBonusOn = knowledgeProd[0];
		}
		var currBonusDivider = this.hasPickaxeTech ? 195 : 200;
		var currBonusMultiplier = this.hasPickaxeTech ? 0.1 : 0.075;
		var currBonusLogFactor = this.hasPickaxeTech ? 1.65 : 2;
		if(baseBonusOn < currBonusDivider) {
			this.currentBonus = baseBonusOn / currBonusDivider * 0.15;
		} else {
			this.currentBonus = Math.log(baseBonusOn / currBonusDivider) / Math.log(currBonusLogFactor) * currBonusMultiplier + 0.15;
		}
		if(this.hasPickaxeTech) {
			this.currentBonus += 2.5e-005 * baseBonusOn;
		}
		this.currentBonus *= this.workers.length / this.get_jobs();
		this.currentBonus = Math.max(0,this.currentBonus);
		this.city.upgrades.vars.stoneMiningSpeed = 1.0 + this.currentBonus;
		if(this.currentBonus >= 1) {
			common_Achievements.achieve("HUGE_STONE_BONUS");
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			_gthis.recalculateBonus();
			return common_Localize.lo("stone_mining_boost",[_gthis.currentBonus * 100 | 0]);
		});
		this.city.gui.windowAddInfoText(common_Localize.lo("stone_mining_boost_base"));
		if(this.city.upgrades.vars.stoneResearchCenterWithFossils == this) {
			this.city.gui.windowAddInfoText(null,function() {
				return common_Localize.lo("fossils_found",[_gthis.city.simulation.bonuses.fossilsCollected | 0]);
			});
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_StoneResearchCenter.saveDefinition);
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
		buildings_Work.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
	}
	,__class__: buildings_StoneResearchCenter
});
