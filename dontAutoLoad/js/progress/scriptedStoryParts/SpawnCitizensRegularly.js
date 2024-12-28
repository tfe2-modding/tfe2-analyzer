var progress_scriptedStoryParts_SpawnCitizensRegularly = $hxClasses["progress.scriptedStoryParts.SpawnCitizensRegularly"] = function(city,story) {
	this.afterDoneMessage = null;
	this.timeBetweenMax = 0;
	this.timeBetweenMin = 0;
	this.worldID = 0;
	this.ageRangeMax = 0;
	this.ageRangeMin = 0;
	this.groupSizeMax = 1;
	this.groupSizeMin = 0;
	this.nextSpawn = 0;
	this.spawnNumber = 0;
	progress_ScriptedStoryPart.call(this,city,story);
};
progress_scriptedStoryParts_SpawnCitizensRegularly.__name__ = "progress.scriptedStoryParts.SpawnCitizensRegularly";
progress_scriptedStoryParts_SpawnCitizensRegularly.__super__ = progress_ScriptedStoryPart;
progress_scriptedStoryParts_SpawnCitizensRegularly.prototype = $extend(progress_ScriptedStoryPart.prototype,{
	update: function(timeMod) {
		if(this.spawnNumber > 0 && this.simulation.time.timeSinceStart >= this.nextSpawn) {
			var val1 = this.spawnNumber;
			var val2 = random_Random.getInt(this.groupSizeMin,this.groupSizeMax + 1);
			var spawnAmount = val2 < val1 ? val2 : val1;
			this.spawnNumber -= spawnAmount;
			if(this.city.simulation.citizens.length < 200) {
				var globalBoost = this.city.simulation.boostManager.currentGlobalBoostAmount;
				if(globalBoost > 1.5) {
					spawnAmount *= 2;
				}
			}
			this.city.simulation.citizenSpawners.push(new simulation_SpawnFlyingSaucer(this.city.simulation,this.city.farForegroundStage,this.city.worlds[this.worldID],{ time : 0, type : "SpawnCitizensFlyingSaucer", amount : spawnAmount, ageRangeMin : this.ageRangeMin, ageRangeMax : this.ageRangeMax, world : this.worldID}));
			var nextSpawnMultiplier = 1.0;
			if(this.city.simulation.stats.houseCapacity >= this.city.simulation.stats.peopleWithHome + this.groupSizeMin && this.city.simulation.stats.jobs >= this.city.simulation.stats.laborForce + this.groupSizeMin && this.spawnNumber > 5) {
				nextSpawnMultiplier = this.city.materials.food > 10 ? 0.6 : 0.7;
			} else if(this.city.simulation.stats.houseCapacity >= this.city.simulation.stats.peopleWithHome && this.city.simulation.stats.jobs >= this.city.simulation.stats.laborForce && this.spawnNumber > 5) {
				nextSpawnMultiplier = this.city.materials.food > 10 ? 0.7 : 0.8;
			}
			this.nextSpawn = this.simulation.time.timeSinceStart + 60 * nextSpawnMultiplier * random_Random.getFloat(this.timeBetweenMin,this.timeBetweenMax);
		} else if(this.spawnNumber <= 0 && this.simulation.citizenSpawners.length == 0) {
			if(this.afterDoneMessage != null && this.afterDoneMessage != "") {
				if(this.city.gui.showSimpleWindow(this.afterDoneMessage,null,false,true)) {
					HxOverrides.remove(this.story.scriptedParts,this);
				}
			} else {
				HxOverrides.remove(this.story.scriptedParts,this);
			}
		}
	}
	,initialize: function($with) {
		this.spawnNumber = $with.spawnNumber;
		this.groupSizeMin = $with.groupSizeMin;
		this.groupSizeMax = $with.groupSizeMax;
		this.ageRangeMin = $with.ageRangeMin;
		this.ageRangeMax = $with.ageRangeMax;
		this.worldID = $with.world;
		this.timeBetweenMin = $with.timeBetweenMin;
		this.timeBetweenMax = $with.timeBetweenMax;
		this.afterDoneMessage = $with.afterDoneMessage;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		progress_ScriptedStoryPart.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(progress_scriptedStoryParts_SpawnCitizensRegularly.saveDefinition);
		}
		var value = this.spawnNumber;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.nextSpawn;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.groupSizeMin;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.groupSizeMax;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.ageRangeMin;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.ageRangeMax;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.worldID;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.timeBetweenMin;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.timeBetweenMax;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		queue.addString(this.afterDoneMessage);
	}
	,load: function(queue,definition) {
		progress_ScriptedStoryPart.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"spawnNumber")) {
			this.spawnNumber = loadMap.h["spawnNumber"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"nextSpawn")) {
			this.nextSpawn = loadMap.h["nextSpawn"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"groupSizeMin")) {
			this.groupSizeMin = loadMap.h["groupSizeMin"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"groupSizeMax")) {
			this.groupSizeMax = loadMap.h["groupSizeMax"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"ageRangeMin")) {
			this.ageRangeMin = loadMap.h["ageRangeMin"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"ageRangeMax")) {
			this.ageRangeMax = loadMap.h["ageRangeMax"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"worldID")) {
			this.worldID = loadMap.h["worldID"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timeBetweenMin")) {
			this.timeBetweenMin = loadMap.h["timeBetweenMin"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timeBetweenMax")) {
			this.timeBetweenMax = loadMap.h["timeBetweenMax"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"afterDoneMessage")) {
			this.afterDoneMessage = loadMap.h["afterDoneMessage"];
		}
	}
	,__class__: progress_scriptedStoryParts_SpawnCitizensRegularly
});
