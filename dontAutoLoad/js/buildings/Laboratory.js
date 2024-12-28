var buildings_Laboratory = $hxClasses["buildings.Laboratory"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.anyoneHasWorkedHere = false;
	this.totalKnowledgeGenerated = 0;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.normalDrawer = this.drawer;
	this.originalBackTexture = Resources.getTexturesByWidth("spr_laboratory",20)[2];
	this.noLightBackTexture = Resources.getTexture("spr_laboratory_lightsoff");
	this.backSprite = new PIXI.Sprite(this.originalBackTexture);
	this.backSprite.position.set(position.x,position.y);
	bgStage.addChild(this.backSprite);
};
buildings_Laboratory.__name__ = "buildings.Laboratory";
buildings_Laboratory.__super__ = buildings_Work;
buildings_Laboratory.prototype = $extend(buildings_Work.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_FarmingResearch,buildingUpgrades_TreePlantationResearch];
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.backSprite != null) {
			this.backSprite.position.set(this.position.x,this.position.y);
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		if(this.backSprite != null) {
			this.backSprite.destroy();
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			this.anyoneHasWorkedHere = true;
			if(citizen.isAtGroundLevel()) {
				var positionInArray = this.workers.indexOf(citizen);
				citizen.setRelativePos(positionInArray == 0 ? 5 : 13,9);
			} else {
				var newKnowledge = 0.00125 * timeMod * this.city.simulation.happiness.actionSpeedModifier * this.city.simulation.bonuses.labSpeed * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
				this.city.materials.knowledge += newKnowledge;
				this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
				this.totalKnowledgeGenerated += newKnowledge;
			}
		}
	}
	,update: function(timeMod) {
		this.backSprite.texture = this.anyoneHasWorkedHere ? this.originalBackTexture : this.noLightBackTexture;
		this.anyoneHasWorkedHere = false;
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]);
		});
	}
	,createMainWindowPart: function() {
		buildings_Work.prototype.createMainWindowPart.call(this);
		gui_GlobalUpgradeWindow.addSmartUpgradeForLabs(this.city);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Work.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Laboratory.saveDefinition);
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
	,__class__: buildings_Laboratory
});
