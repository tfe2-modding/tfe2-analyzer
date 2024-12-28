var simulation_OperatingCost = $hxClasses["simulation.OperatingCost"] = function(city) {
	this.teleportersAreUserEnabled = true;
	this.teleportersEnabled = true;
	this.operatingCost = new Materials();
	this.city = city;
};
simulation_OperatingCost.__name__ = "simulation.OperatingCost";
simulation_OperatingCost.prototype = {
	changeTeleportersEnabledState: function(areEnabled,changeIsByUser) {
		if(areEnabled == this.teleportersEnabled) {
			if(changeIsByUser) {
				this.teleportersAreUserEnabled = this.teleportersEnabled;
			}
			return;
		}
		if(!changeIsByUser && !this.teleportersAreUserEnabled && !this.teleportersEnabled) {
			return;
		}
		this.teleportersEnabled = areEnabled;
		if(changeIsByUser) {
			this.teleportersAreUserEnabled = this.teleportersEnabled;
		}
		if(this.teleportersEnabled) {
			this.city.simulation.houseAssigner.shouldUpdateHouses = true;
		}
		this.recalculate();
	}
	,recalculate: function() {
		this.operatingCost = this.getWholeCityOperatingCost();
	}
	,update: function(timeMod) {
		if(this.city.materials.knowledge > 10 * timeMod && this.teleportersAreUserEnabled && !this.teleportersEnabled) {
			this.changeTeleportersEnabledState(true,false);
		}
		var partialCost = this.operatingCost.copy();
		partialCost.multiply(timeMod / 1440 * this.city.simulation.time.minutesPerTick);
		if(this.city.materials.canAfford(partialCost)) {
			this.city.materials.remove(partialCost);
			partialCost.addToConsumption(this.city.simulation.stats);
		} else {
			this.changeTeleportersEnabledState(false,false);
		}
	}
	,getWholeCityOperatingCost: function() {
		var opCost = new Materials();
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(pm.isBuilding) {
				var bld = pm;
				opCost.add(this.getOperatingCost(bld.info,true));
			}
		}
		return opCost;
	}
	,getWholeCityOperatingCostTeleporters: function() {
		var opCost = new Materials();
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(pm.isBuilding) {
				var bld = pm;
				if(bld.info.teleporterOperatingCost > 0) {
					opCost.add(this.getOperatingCost(bld.info,true));
				}
			}
		}
		return opCost;
	}
	,getOperatingCost: function(buildingInfo,currentCost) {
		if(currentCost == null) {
			currentCost = false;
		}
		if(!currentCost || this.teleportersEnabled) {
			if(buildingInfo.teleporterOperatingCost > 0) {
				return this.calculateTeleporterCost(buildingInfo.teleporterOperatingCost);
			}
		}
		return null;
	}
	,calculateTeleporterCost: function(standardOperatingCost) {
		var misdirectorReward = this.city.misdirector == null ? 1 : 0.5;
		misdirectorReward *= 1 - this.city.upgrades.vars.rocketTeleporterReward;
		return new Materials(0,0,0,0,standardOperatingCost * misdirectorReward);
	}
	,getOperatingCostReason: function(buildingInfo) {
		return common_Localize.lo("operating_cost_pd") + " ";
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_OperatingCost.saveDefinition);
		}
		var value = this.teleportersEnabled;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.teleportersAreUserEnabled;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"teleportersEnabled")) {
			this.teleportersEnabled = loadMap.h["teleportersEnabled"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"teleportersAreUserEnabled")) {
			this.teleportersAreUserEnabled = loadMap.h["teleportersAreUserEnabled"];
		}
	}
	,__class__: simulation_OperatingCost
};
