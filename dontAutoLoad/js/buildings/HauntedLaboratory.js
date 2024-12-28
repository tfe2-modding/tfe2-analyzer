var buildings_HauntedLaboratory = $hxClasses["buildings.HauntedLaboratory"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.hauntedLabsNumber = 1;
	this.totalKnowledgeGenerated = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.normalDrawer = this.drawer;
	this.startTime = 19;
	this.endTime = 8;
};
buildings_HauntedLaboratory.__name__ = "buildings.HauntedLaboratory";
buildings_HauntedLaboratory.__super__ = buildings_Work;
buildings_HauntedLaboratory.prototype = $extend(buildings_Work.prototype,{
	get_hauntRisk: function() {
		var val1 = Math.pow(this.hauntedLabsNumber,1.5);
		var val = this.hauntedLabsNumber / 25;
		return val1 + (val < 0 ? 0 : val > 1 ? 1 : val) * (Math.pow(this.hauntedLabsNumber,1.667) - val1);
	}
	,get_hauntRiskMult: function() {
		return this.get_hauntRisk() / this.hauntedLabsNumber;
	}
	,postCreate: function() {
		buildings_Work.prototype.postCreate.call(this);
		this.hauntedLabsNumber = this.city.getAmountOfPermanentsPerType().h["buildings.HauntedLaboratory"];
		if(this.city.simulation.bonuses.hauntedLabMalfunctioning) {
			this.malfunctionThis();
		}
	}
	,onCityChange: function() {
		buildings_Work.prototype.onCityChange.call(this);
		this.hauntedLabsNumber = this.city.getAmountOfPermanentsPerType().h["buildings.HauntedLaboratory"];
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
	}
	,update: function(timeMod) {
		if(this.city.simulation.bonuses.hauntedLabMalfunctioning) {
			if(this.city.simulation.time.timeSinceStart >= this.city.simulation.bonuses.hauntedLabRepairTime) {
				this.city.simulation.bonuses.hauntedLabMalfunctioning = false;
				var _g = 0;
				var _g1 = this.city.permanents;
				while(_g < _g1.length) {
					var bld = _g1[_g];
					++_g;
					if(bld.is(buildings_HauntedLaboratory)) {
						var hl = bld;
						hl.repairThis();
					}
				}
			}
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		}
		if(!this.city.simulation.bonuses.hauntedLabMalfunctioning) {
			var positionInArray = this.workers.indexOf(citizen);
			citizen.setRelativePos(positionInArray == 0 ? 3 : 11,9);
			var thisBoost = 1 + (this.hauntedLabsNumber - 1) * 0.15;
			var newKnowledge = 0.001 * timeMod * this.city.simulation.happiness.actionSpeedModifier * this.city.simulation.bonuses.labSpeed * citizen.get_educationSpeedModifier() * thisBoost * this.city.simulation.boostManager.currentGlobalBoostAmount;
			this.city.materials.knowledge += newKnowledge;
			this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
			this.totalKnowledgeGenerated += newKnowledge;
			if(this.city.materials.knowledge > 100 && random_Random.getFloat(2748480.) < timeMod * this.get_hauntRiskMult()) {
				this.malfunctionGlobal();
			}
		} else {
			citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(20,30),null,false,false);
		}
	}
	,malfunctionThis: function() {
		this.drawer.changeMainTexture("spr_hauntedlaboratory_failed");
	}
	,repairThis: function() {
		this.drawer.changeMainTexture("spr_hauntedlaboratory");
	}
	,malfunctionGlobal: function() {
		var effect = random_Random.getInt(6);
		if(effect == 5 && this.city.materials.food < 5000) {
			effect = 4;
		}
		if(effect == 6 && this.city.materials.computerChips < 20) {
			effect = 0;
		}
		var txt = "";
		switch(effect) {
		case 0:
			var _g = 0;
			var _g1 = this.city.simulation.citizens;
			while(_g < _g1.length) {
				var citizen = _g1[_g];
				++_g;
				citizen.educationLevel = Math.max(0,citizen.educationLevel - 0.1);
			}
			txt = common_Localize.lo("haunted_effect_education");
			break;
		case 1:
			this.city.simulation.happiness.addBoost(simulation_HappinessBoost.withDuration(this.city.simulation.time,5760,-20,common_Localize.lo("malfunctioned_haunted_labs")));
			txt = common_Localize.lo("haunted_effect_unhappy");
			break;
		case 2:
			var knowledgeLoss = Math.min(this.city.materials.knowledge,100 * this.hauntedLabsNumber);
			this.city.materials.knowledge -= knowledgeLoss;
			this.city.simulation.stats.materialUsed[10][0] += knowledgeLoss;
			txt = common_Localize.lo("haunted_effect_knowledge",[knowledgeLoss]);
			break;
		case 3:
			var _g = 0;
			var _g1 = this.city.simulation.citizens;
			while(_g < _g1.length) {
				var citizen = _g1[_g];
				++_g;
				if(citizen.get_age() < 75 + citizen.dieAgeModifier - 1) {
					citizen.dieAgeModifier -= 1;
				}
			}
			txt = common_Localize.lo("haunted_effect_dieage");
			break;
		case 4:
			this.city.simulation.happiness.addBoost(simulation_HappinessBoost.withDuration(this.city.simulation.time,2160.,-50,common_Localize.lo("malfunctioned_haunted_labs")));
			txt = common_Localize.lo("haunted_effect_unhappy_extreme");
			break;
		case 5:
			var foodLoss = Math.min(this.city.materials.food,250 * this.hauntedLabsNumber);
			var _g = this.city.materials;
			_g.set_food(_g.food - foodLoss);
			this.city.simulation.stats.materialUsed[0][0] += foodLoss;
			txt = common_Localize.lo("haunted_effect_rot",[foodLoss]);
			break;
		case 6:
			var chipLoss = Math.min(this.city.materials.computerChips,3 * this.hauntedLabsNumber);
			this.city.materials.computerChips -= chipLoss;
			this.city.simulation.stats.materialUsed[5][0] += chipLoss;
			this.city.materials.stone += chipLoss;
			this.city.simulation.stats.materialProduction[2][0] += chipLoss;
			txt = common_Localize.lo("haunted_effect_chip",[chipLoss]);
			break;
		}
		this.city.simulation.bonuses.hauntedLabMalfunctioning = true;
		this.city.simulation.bonuses.hauntedLabRepairTime = this.city.simulation.time.timeSinceStart + 1440;
		this.city.simulation.bonuses.hauntedLabMalfunctionReason = txt;
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var bld = _g1[_g];
			++_g;
			if(bld.is(buildings_HauntedLaboratory)) {
				var hl = bld;
				hl.malfunctionThis();
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("current_haunt_boost",[100 + 15 * (_gthis.hauntedLabsNumber - 1 | 0)]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("current_haunt_risk",[common_MathExtensions.floatFormat(Math,_gthis.get_hauntRisk(),1)]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			if(!_gthis.city.simulation.bonuses.hauntedLabMalfunctioning) {
				return common_Localize.lo("currently_working_properly");
			} else {
				return common_Localize.lo("currently_malfunctioning_hl") + " " + _gthis.city.simulation.bonuses.hauntedLabMalfunctionReason;
			}
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_HauntedLaboratory.saveDefinition);
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
	,__class__: buildings_HauntedLaboratory
});
