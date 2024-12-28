var simulation_HappinessBoost = $hxClasses["simulation.HappinessBoost"] = function(boostUntil,boost,text) {
	this.canGoOverMax = true;
	this.boostUntil = boostUntil;
	this.boost = boost;
	this.text = text;
};
simulation_HappinessBoost.__name__ = "simulation.HappinessBoost";
simulation_HappinessBoost.withDuration = function(cityTime,duration,boost,text) {
	return new simulation_HappinessBoost(cityTime.timeSinceStart + duration,boost,text);
};
simulation_HappinessBoost.prototype = {
	hasPassed: function(cityTime) {
		return cityTime.timeSinceStart > this.boostUntil;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_HappinessBoost.saveDefinition);
		}
		var value = this.boostUntil;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.boost;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		queue.addString(this.text);
		var value = this.canGoOverMax;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"boostUntil")) {
			this.boostUntil = loadMap.h["boostUntil"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"boost")) {
			this.boost = loadMap.h["boost"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"text")) {
			this.text = loadMap.h["text"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"canGoOverMax")) {
			this.canGoOverMax = loadMap.h["canGoOverMax"];
		}
	}
	,__class__: simulation_HappinessBoost
};
