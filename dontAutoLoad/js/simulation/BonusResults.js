var simulation_BonusResults = $hxClasses["simulation.BonusResults"] = function() {
	this.theMachineBoost = 1;
	this.followedJobs = [];
	this.chosenEarlyGameUpgrades = [];
	this.hauntedLabMalfunctionReason = "";
	this.hauntedLabRepairTime = 0;
	this.hauntedLabMalfunctioning = false;
	this.waldoFound = false;
	this.fossilsCollected = 0;
	this.ecoFarmSpeed = 1;
	this.indoorFarmSpeed = 1;
	this.labSpeed = 1;
	this.machinePartsFactorySpeed = 1;
	this.extraFoodFromFarms = 0;
};
simulation_BonusResults.__name__ = "simulation.BonusResults";
simulation_BonusResults.prototype = {
	save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_BonusResults.saveDefinition);
		}
		var value = this.extraFoodFromFarms;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.machinePartsFactorySpeed;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.labSpeed;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.indoorFarmSpeed;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.ecoFarmSpeed;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.fossilsCollected;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.waldoFound;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.hauntedLabMalfunctioning;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.hauntedLabRepairTime;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		queue.addString(this.hauntedLabMalfunctionReason);
		queue.addString(haxe_Serializer.run(this.chosenEarlyGameUpgrades));
		queue.addString(haxe_Serializer.run(this.followedJobs));
		var value = this.theMachineBoost;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"extraFoodFromFarms")) {
			this.extraFoodFromFarms = loadMap.h["extraFoodFromFarms"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"machinePartsFactorySpeed")) {
			this.machinePartsFactorySpeed = loadMap.h["machinePartsFactorySpeed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"labSpeed")) {
			this.labSpeed = loadMap.h["labSpeed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"indoorFarmSpeed")) {
			this.indoorFarmSpeed = loadMap.h["indoorFarmSpeed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"ecoFarmSpeed")) {
			this.ecoFarmSpeed = loadMap.h["ecoFarmSpeed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"fossilsCollected")) {
			this.fossilsCollected = loadMap.h["fossilsCollected"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"waldoFound")) {
			this.waldoFound = loadMap.h["waldoFound"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hauntedLabMalfunctioning")) {
			this.hauntedLabMalfunctioning = loadMap.h["hauntedLabMalfunctioning"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hauntedLabRepairTime")) {
			this.hauntedLabRepairTime = loadMap.h["hauntedLabRepairTime"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"hauntedLabMalfunctionReason")) {
			this.hauntedLabMalfunctionReason = loadMap.h["hauntedLabMalfunctionReason"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"chosenEarlyGameUpgrades")) {
			this.chosenEarlyGameUpgrades = loadMap.h["chosenEarlyGameUpgrades"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"followedJobs")) {
			this.followedJobs = loadMap.h["followedJobs"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"theMachineBoost")) {
			this.theMachineBoost = loadMap.h["theMachineBoost"];
		}
	}
	,__class__: simulation_BonusResults
};
