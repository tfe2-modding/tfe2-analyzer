var simulation_BabyMaker = $hxClasses["simulation.BabyMaker"] = function(city,simulation) {
	this.totalBabyMakeCapacity = 0;
	this.targetPopAmount = -1;
	this.mode = 0;
	this.softPopLimit = 3000;
	this.updateStatsIn = -2;
	this.city = city;
	this.simulation = simulation;
	this.babyMakerCapacity = new haxe_ds_ObjectMap();
	this.babiesPerYear = new haxe_ds_ObjectMap();
	this.peoplePerWorld = new haxe_ds_ObjectMap();
};
simulation_BabyMaker.__name__ = "simulation.BabyMaker";
simulation_BabyMaker.prototype = {
	getCurrentBabyProduction: function() {
		if(this.simulation.happiness.happiness < 10 && this.simulation.stats.peopleWithHome < this.simulation.stats.people / 2 && this.city.materials.food < 1) {
			return 0.0;
		}
		if(this.simulation.happiness.happiness < 10) {
			return 0.8;
		}
		switch(this.mode) {
		case 0:
			return 1 + this.simulation.happiness.happiness / 140 / Math.pow((Math.pow(this.simulation.citizens.length,1.2) + 500) / 1400,0.4);
		case 1:
			if(this.targetPopAmount == -1) {
				return 1;
			} else if(this.simulation.citizens.length >= this.targetPopAmount) {
				return 0.1;
			} else {
				return 3.0;
			}
			break;
		case 2:
			return 1 + 0.4 * (this.simulation.happiness.happiness / 140) / Math.pow((Math.pow(this.simulation.citizens.length,1.2) + 500) / 1400,0.4);
		case 3:
			return 1 + (this.simulation.happiness.happiness / 140 + Math.max(0,(this.simulation.happiness.happiness - 60) / 120)) / Math.pow((Math.pow(this.simulation.citizens.length,1.2) + 500) / 1400,0.4);
		}
	}
	,numberOfNewCitizens: function() {
		return common_ArrayExtensions.isum(this.city.simulation.citizenSpawners,function(cs) {
			return cs.spawn.amount;
		});
	}
	,update: function(timeMod) {
		if(this.updateStatsIn <= 0) {
			this.updateStatsIn += 60;
			this.updateStats();
		}
		this.updateStatsIn -= timeMod;
		var yearsPast = this.simulation.time.minutesPerTick * timeMod / 60 / 24;
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			if(this.simulation.citizens.length + this.numberOfNewCitizens() < this.softPopLimit && this.simulation.citizens.length >= 2 && this.babyMakerCapacity.h[w.__id__] >= 2 && random_Random.getFloat() < this.babiesPerYear.h[w.__id__] * yearsPast) {
				this.createBaby(w);
			}
		}
	}
	,createBaby: function(w) {
		if(this.simulation.citizens.length == 0) {
			return;
		}
		var possibleParent = common_ArrayExtensions.findRandom(this.simulation.citizens,function(c) {
			if(c.onWorld == w && c.get_age() >= 20) {
				return c.get_age() < 55;
			} else {
				return false;
			}
		});
		var fatherOrMother = this.simulation.citizens[0];
		if(possibleParent != null) {
			fatherOrMother = possibleParent;
		}
		this.simulation.createCitizen(fatherOrMother.onWorld,0,fatherOrMother.inPermanent,fatherOrMother.relativeX | 0);
	}
	,onCitizenDeath: function() {
		if(this.simulation.citizens.length == this.softPopLimit) {
			if(this.totalBabyMakeCapacity == 0) {
				this.updateStats();
			}
			if(this.totalBabyMakeCapacity != 0) {
				var r = random_Random.getFloat();
				var w = this.city.worlds[0];
				var _g = 0;
				var _g1 = this.city.worlds;
				while(_g < _g1.length) {
					var wrld = _g1[_g];
					++_g;
					r -= this.babyMakerCapacity.h[wrld.__id__] / this.totalBabyMakeCapacity;
					if(r <= 0) {
						w = wrld;
					}
				}
				this.createBaby(w);
			}
		}
	}
	,updateStats: function() {
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			this.babyMakerCapacity.set(w,0);
			this.peoplePerWorld.set(w,0);
		}
		var totalBabyMakerCapacity = 0;
		var _g = 0;
		var _g1 = this.simulation.citizens;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			var myAge = c.get_age();
			var addBabyMakerCap = myAge >= 20 && myAge < 45 ? 1 : myAge >= 45 && myAge < 55 ? 1 - (myAge - 45) / 10 : 0;
			var _g2 = c.onWorld;
			var _g3 = this.babyMakerCapacity;
			var v = _g3.h[_g2.__id__] + addBabyMakerCap;
			_g3.set(_g2,v);
			if(myAge >= 20) {
				var tmp = c.onWorld;
				var v1 = this.peoplePerWorld.h[tmp.__id__] + 1;
				this.peoplePerWorld.set(tmp,v1);
			}
			totalBabyMakerCapacity += addBabyMakerCap;
		}
		var currentBabiesPerPerson = this.getCurrentBabyProduction();
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			if(this.simulation.citizens.length > 300 && totalBabyMakerCapacity < 0.1 * this.simulation.citizens.length && this.babyMakerCapacity.h[w.__id__] < 0.1 * this.peoplePerWorld.h[w.__id__]) {
				var v = 0.1 * this.peoplePerWorld.h[w.__id__];
				this.babyMakerCapacity.set(w,v);
			}
			var v1 = this.babyMakerCapacity.h[w.__id__] * currentBabiesPerPerson / 30.;
			this.babiesPerYear.set(w,v1);
			this.totalBabyMakeCapacity += this.babyMakerCapacity.h[w.__id__];
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_BabyMaker.saveDefinition);
		}
		var value = this.softPopLimit;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.mode;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.targetPopAmount;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"softPopLimit")) {
			this.softPopLimit = loadMap.h["softPopLimit"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mode")) {
			this.mode = loadMap.h["mode"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"targetPopAmount")) {
			this.targetPopAmount = loadMap.h["targetPopAmount"];
		}
	}
	,__class__: simulation_BabyMaker
};
