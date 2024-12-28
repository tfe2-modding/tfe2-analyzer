var buildings_Misdirector = $hxClasses["buildings.Misdirector"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.mode = buildings_MisdirectorMode.Normal;
	this.teleportX = 9.;
	this.timesUsedTo = 0;
	this.knowledgeGenerated = 0;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.doorX = 12;
	city.misdirector = this;
};
buildings_Misdirector.__name__ = "buildings.Misdirector";
buildings_Misdirector.__super__ = Building;
buildings_Misdirector.prototype = $extend(Building.prototype,{
	get_misdirectChance: function() {
		switch(this.mode._hx_index) {
		case 0:
			return 0.025;
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 0.001;
		}
	}
	,onBuild: function() {
		Building.prototype.onBuild.call(this);
		common_Achievements.achieve("BUILD_MISDIRECTOR");
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_MisdirectorNormal,buildingUpgrades_MisdirectorAlways,buildingUpgrades_MisdirectorMostlyDisabled,buildingUpgrades_MisdirectorDisabled];
	}
	,giveReward: function() {
		var newKnowledge = this.mode == buildings_MisdirectorMode.Always ? 0.05 : 0.5;
		this.city.materials.knowledge += newKnowledge;
		this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
		this.knowledgeGenerated += newKnowledge;
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		this.city.misdirector = null;
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		Building.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("misdirected",[_gthis.timesUsedTo]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_generated",[Math.floor(_gthis.knowledgeGenerated)]);
		});
	}
	,createTeleportParticle: function(rayTexture) {
		if(rayTexture == null) {
			rayTexture = "spr_teleporter_ray_misdirect";
		}
		this.city.particles.addParticle(Resources.getTexturesByWidth(rayTexture,4),new common_Point(this.position.x + 8,this.position.y + 4));
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_Misdirector.saveDefinition);
		}
		var value = this.knowledgeGenerated;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.timesUsedTo;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"knowledgeGenerated")) {
			this.knowledgeGenerated = loadMap.h["knowledgeGenerated"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsedTo")) {
			this.timesUsedTo = loadMap.h["timesUsedTo"];
		}
	}
	,__class__: buildings_Misdirector
});
