var simulation_festival_Festival = $hxClasses["simulation.festival.Festival"] = function(city,simulation,manager,centerBuilding) {
	this.started = false;
	this.city = city;
	this.simulation = simulation;
	this.manager = manager;
	this.centerBuilding = centerBuilding;
};
simulation_festival_Festival.__name__ = "simulation.festival.Festival";
simulation_festival_Festival.prototype = {
	get_normalDuration: function() {
		return 1440;
	}
	,plan: function() {
		var dayStart = (1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0) + 1) * 24 * 60;
		this.timeStart = this.city.simulation.time.timeSinceStart;
		this.timeEnd = this.timeStart + this.get_normalDuration();
	}
	,isNow: function() {
		return this.city.simulation.time.timeSinceStart >= this.timeStart;
	}
	,getText: function() {
		return common_Localize.lo("festival_doing");
	}
	,end: function() {
		this.manager.endFestival(this);
	}
	,update: function(timeMod) {
		if(this.city.simulation.time.timeSinceStart > this.timeEnd) {
			this.end();
		} else if(this.isNow()) {
			if(!this.started) {
				this.startFestival();
				this.started = true;
			}
			this.updateFestival(timeMod);
		}
	}
	,updateFestival: function(timeMod) {
	}
	,startFestival: function() {
	}
	,doStartRepeatables: function() {
	}
	,isInvolvedWithFestival: function(citizen) {
		return true;
	}
	,citizenFestivalUpdate: function(citizen,timeMod) {
	}
	,updateFestivalCitizen: function(citizen,timeMod) {
		if(this.isInvolvedWithFestival(citizen)) {
			if(!citizen.fullyBeingControlled) {
				Citizen.shouldUpdateDraw = false;
				if(citizen.delayCanViewSelfInBuilding) {
					citizen.delayCanViewSelfInBuilding = false;
					Citizen.shouldUpdateDraw = true;
				}
				citizen.updatePath(timeMod);
				if(citizen.path == null && !citizen.isRequestingPath) {
					var _g = $bind(this,this.citizenFestivalUpdate);
					var citizen1 = citizen;
					(function(timeMod) {
						_g(citizen1,timeMod);
					})(timeMod);
				}
				if(Citizen.shouldUpdateDraw) {
					citizen.actuallyUpdateDraw();
				}
			}
		} else if(!citizen.fullyBeingControlled) {
			Citizen.shouldUpdateDraw = false;
			if(citizen.delayCanViewSelfInBuilding) {
				citizen.delayCanViewSelfInBuilding = false;
				Citizen.shouldUpdateDraw = true;
			}
			citizen.updatePath(timeMod);
			if(citizen.path == null && !citizen.isRequestingPath) {
				citizen.updateDailyLife(timeMod);
			}
			if(Citizen.shouldUpdateDraw) {
				citizen.actuallyUpdateDraw();
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_festival_Festival.saveDefinition);
		}
		var value = this.timeStart;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.timeEnd;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.started;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timeStart")) {
			this.timeStart = loadMap.h["timeStart"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timeEnd")) {
			this.timeEnd = loadMap.h["timeEnd"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"started")) {
			this.started = loadMap.h["started"];
		}
	}
	,__class__: simulation_festival_Festival
};
