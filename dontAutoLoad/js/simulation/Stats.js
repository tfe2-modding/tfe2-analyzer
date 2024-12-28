var simulation_Stats = $hxClasses["simulation.Stats"] = function(city,simulation) {
	this.peopleWorkingAtLabs = 0;
	this.people = 0;
	this.jobs = 0;
	this.houseCapacity = 0;
	this.peopleWithHome = 0;
	this.peopleWithAJob = 0;
	this.children = 0;
	this.laborForce = 0;
	this.shouldUpdateIn = -1;
	this.city = city;
	this.simulation = simulation;
	this.materialProduction = [];
	this.materialUsed = [];
	this.materialProductionTotal = [];
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialProduction.push([0,0,0,0,0,0,0]);
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		this.materialProduction.push([0,0,0,0,0,0,0]);
	}
	this.materialProduction.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialUsed.push([0,0,0,0,0,0,0]);
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		this.materialUsed.push([0,0,0,0,0,0,0]);
	}
	this.materialUsed.push([0,0,0,0,0,0,0]);
	this.materialProductionTotal.push(0);
	this.materialProductionTotal.push(0);
	this.materialProductionTotal.push(0);
	this.materialProductionTotal.push(0);
	this.materialProductionTotal.push(0);
	this.materialProductionTotal.push(0);
	this.materialProductionTotal.push(0);
	this.materialProductionTotal.push(0);
	this.materialProductionTotal.push(0);
	this.materialProductionTotal.push(0);
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		this.materialProductionTotal.push(0);
	}
	this.materialProductionTotal.push(0);
};
simulation_Stats.__name__ = "simulation.Stats";
simulation_Stats.prototype = {
	save: function(queue) {
		this.saveBasics(queue);
		var value = this.materialProduction.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.materialProduction.length;
		while(_g < _g1) {
			var i = _g++;
			queue.addString(MaterialsHelper.findMaterialName(i));
			var value = this.materialProduction[i].length;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
			var _g2 = 0;
			var _g3 = this.materialProduction[i];
			while(_g2 < _g3.length) {
				var prod = _g3[_g2];
				++_g2;
				if(queue.size + 8 > queue.bytes.length) {
					var oldBytes1 = queue.bytes;
					queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
					queue.bytes.blit(0,oldBytes1,0,queue.size);
				}
				queue.bytes.setDouble(queue.size,prod);
				queue.size += 8;
			}
		}
		var value = this.materialUsed.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.materialUsed.length;
		while(_g < _g1) {
			var i = _g++;
			queue.addString(MaterialsHelper.findMaterialName(i));
			var value = this.materialUsed[i].length;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
			var _g2 = 0;
			var _g3 = this.materialUsed[i];
			while(_g2 < _g3.length) {
				var prod = _g3[_g2];
				++_g2;
				if(queue.size + 8 > queue.bytes.length) {
					var oldBytes1 = queue.bytes;
					queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
					queue.bytes.blit(0,oldBytes1,0,queue.size);
				}
				queue.bytes.setDouble(queue.size,prod);
				queue.size += 8;
			}
		}
		var value = this.materialProductionTotal.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.materialProductionTotal.length;
		while(_g < _g1) {
			var i = _g++;
			var value = this.materialProductionTotal[i];
			if(queue.size + 8 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setDouble(queue.size,value);
			queue.size += 8;
		}
	}
	,load: function(queue) {
		this.loadBasics(queue);
		if(queue.version >= 5) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var numberOfSavedMaterialArrays = intToRead;
			var _g = 0;
			var _g1 = numberOfSavedMaterialArrays;
			while(_g < _g1) {
				var i = _g++;
				var index = MaterialsHelper.findMaterialIndex(queue.readString());
				if(index == -1) {
					var intToRead = queue.bytes.getInt32(queue.readStart);
					queue.readStart += 4;
					var historyLength = intToRead;
					var _g2 = 0;
					var _g3 = historyLength;
					while(_g2 < _g3) {
						var j = _g2++;
						var floatToRead = queue.bytes.getDouble(queue.readStart);
						queue.readStart += 8;
					}
					continue;
				}
				var intToRead1 = queue.bytes.getInt32(queue.readStart);
				queue.readStart += 4;
				var historyLength1 = intToRead1;
				var _g4 = 0;
				var _g5 = historyLength1;
				while(_g4 < _g5) {
					var j1 = _g4++;
					var floatToRead1 = queue.bytes.getDouble(queue.readStart);
					queue.readStart += 8;
					var prod = floatToRead1;
					if(this.materialProduction[index].length <= j1) {
						this.materialProduction[index].push(prod);
					} else {
						this.materialProduction[index][j1] = prod;
					}
				}
			}
		}
		if(queue.version >= 11) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var numberOfSavedMaterialArrays = intToRead;
			var _g = 0;
			var _g1 = numberOfSavedMaterialArrays;
			while(_g < _g1) {
				var i = _g++;
				var index = MaterialsHelper.findMaterialIndex(queue.readString());
				if(index == -1) {
					var intToRead = queue.bytes.getInt32(queue.readStart);
					queue.readStart += 4;
					var historyLength = intToRead;
					var _g2 = 0;
					var _g3 = historyLength;
					while(_g2 < _g3) {
						var j = _g2++;
						var floatToRead = queue.bytes.getDouble(queue.readStart);
						queue.readStart += 8;
					}
					continue;
				}
				var intToRead1 = queue.bytes.getInt32(queue.readStart);
				queue.readStart += 4;
				var historyLength1 = intToRead1;
				var _g4 = 0;
				var _g5 = historyLength1;
				while(_g4 < _g5) {
					var j1 = _g4++;
					var floatToRead1 = queue.bytes.getDouble(queue.readStart);
					queue.readStart += 8;
					var cons = floatToRead1;
					if(this.materialUsed[index].length <= j1) {
						this.materialUsed[index].push(cons);
					} else {
						this.materialUsed[index][j1] = cons;
					}
				}
			}
		}
		if(queue.version >= 67) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var savedTotalProduction = intToRead;
			var _g = 0;
			var _g1 = savedTotalProduction;
			while(_g < _g1) {
				var i = _g++;
				var tmp = this.materialProductionTotal;
				var floatToRead = queue.bytes.getDouble(queue.readStart);
				queue.readStart += 8;
				tmp[i] = floatToRead;
			}
		}
	}
	,update: function(timeMod) {
		if(this.shouldUpdateIn <= 0) {
			this.laborForce = 0;
			this.peopleWithAJob = 0;
			this.peopleWithHome = 0;
			this.children = 0;
			this.houseCapacity = 0;
			this.peopleWorkingAtLabs = 0;
			this.people = this.simulation.citizens.length;
			this.jobs = 0;
			this.simulation.eating.herbsCap = 0;
			var _g = 0;
			var _g1 = this.simulation.citizens;
			while(_g < _g1.length) {
				var citizen = _g1[_g];
				++_g;
				if(citizen.lastInfrequentUpdateAge >= 16) {
					this.laborForce += 1;
					if(citizen.job != null) {
						this.peopleWithAJob += 1;
						if(citizen.job.is(buildings_Laboratory) || citizen.job.is(buildings_ExperimentationLab) || citizen.job.is(buildings_GrapheneLab)) {
							this.peopleWorkingAtLabs += 1;
						}
					}
				} else {
					this.children += 1;
				}
				if(citizen.home != null) {
					this.peopleWithHome += 1;
				}
			}
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var permanent = _g1[_g];
				++_g;
				if(permanent.is(buildings_House)) {
					this.houseCapacity += permanent.get_residentCapacity();
				}
				if(permanent.is(buildings_Work)) {
					this.jobs += permanent.get_jobs();
				}
				if(permanent.is(buildings_HerbGarden)) {
					this.simulation.eating.herbsCap += permanent.getHerbCapacity();
				}
			}
			this.shouldUpdateIn += 20;
			this.city.progress.unlocks.checkStatRelatedUnlocks();
		} else {
			this.shouldUpdateIn -= Math.max(1,timeMod);
		}
	}
	,midnightUpdate: function() {
		var _g = 0;
		var _g1 = this.materialProduction.length;
		while(_g < _g1) {
			var m = _g++;
			var singleMaterialProduction = this.materialProduction[m];
			var i = singleMaterialProduction.length;
			while(--i >= 1) singleMaterialProduction[i] = singleMaterialProduction[i - 1];
			this.materialProductionTotal[m] += singleMaterialProduction[0];
			singleMaterialProduction[0] = 0;
		}
		var _g = 0;
		var _g1 = this.materialUsed;
		while(_g < _g1.length) {
			var singleMaterialUse = _g1[_g];
			++_g;
			var i = singleMaterialUse.length;
			while(--i >= 1) singleMaterialUse[i] = singleMaterialUse[i - 1];
			singleMaterialUse[0] = 0;
		}
	}
	,amountOfBuildingsOfType: function(type) {
		var count = 0;
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(pm.is(type)) {
				++count;
			}
		}
		return count;
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_Stats.saveDefinition);
		}
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: simulation_Stats
};
