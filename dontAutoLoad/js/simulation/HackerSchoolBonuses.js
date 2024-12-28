var simulation_HackerSchoolBonuses = $hxClasses["simulation.HackerSchoolBonuses"] = function(simulation) {
	this.encourage = 0;
	this.simulation = simulation;
	this.citizens = [];
	this.inventions = [];
	this.stage = simulation.city.aboveCitizensInBuildingStage;
};
simulation_HackerSchoolBonuses.__name__ = "simulation.HackerSchoolBonuses";
simulation_HackerSchoolBonuses.prototype = {
	update: function(timeMod) {
		var i = this.inventions.length;
		while(--i >= 0) {
			var invention = this.inventions[i];
			invention.update(timeMod);
		}
		var mult = 150.0;
		if(this.inventions.length == 0) {
			mult = 10;
		} else if(this.inventions.length > 10) {
			mult = 400;
		}
		if(this.encourage > 0 && this.inventions.length < 3) {
			mult = 0.1;
			this.encourage--;
		}
		if(this.inventions.length < 42 && this.citizens.length > 0 && random_Random.getFloat(mult) < timeMod) {
			var citizen = random_Random.fromArray(this.citizens);
			if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null) != null) {
				var noInventionHereYet = true;
				var _g = 0;
				var _g1 = this.inventions;
				while(_g < _g1.length) {
					var invention = _g1[_g];
					++_g;
					if(invention.inPermanent == (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null)) {
						noInventionHereYet = false;
					}
				}
				if(noInventionHereYet) {
					if(citizen.inPermanent.is(buildings_TreePlantation)) {
						if(citizen.inPermanent.materialsLeft > 30) {
							var createdInvention = new simulation_hackerSchoolInvention_TreeCuttingRobot(this.simulation,this.stage);
							createdInvention.inPermanent = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
							createdInvention.updateDisplay();
							this.inventions.push(createdInvention);
						}
					} else if(random_Random.getFloat(2) < 1) {
						if(citizen.inPermanent.is(buildings_StoneTeleporter)) {
							var createdInvention = new simulation_hackerSchoolInvention_MiningRobot(this.simulation,this.stage);
							createdInvention.inPermanent = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
							createdInvention.updateDisplay();
							this.inventions.push(createdInvention);
						} else if(citizen.inPermanent.is(buildings_NightClub) || citizen.inPermanent.is(buildings_ScrapyardNightClub)) {
							if(this.simulation.time.timeSinceStart / 60 % 24 > 20 || this.simulation.time.timeSinceStart / 60 % 24 < 3) {
								var createdInvention = new simulation_hackerSchoolInvention_MechDancer(this.simulation,this.stage);
								createdInvention.inPermanent = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
								createdInvention.updateDisplay();
								this.inventions.push(createdInvention);
							}
						} else if(citizen.inPermanent.is(buildings_Park) || citizen.inPermanent.is(buildings_BotanicalGardens)) {
							if(random_Random.getFloat(2) < 1) {
								var notHere = false;
								if(citizen.inPermanent.is(buildings_BotanicalGardens)) {
									var bg = citizen.inPermanent;
									if(bg.get_mergingDrawer().isConnectedBuilding(bg.bottomBuilding)) {
										notHere = true;
									}
								}
								if(!notHere) {
									var createdInvention;
									if(random_Random.getFloat(2) < 1) {
										createdInvention = new simulation_hackerSchoolInvention_KnowledgeRobot(this.simulation,this.stage);
									} else {
										createdInvention = new simulation_hackerSchoolInvention_MechAnimal(this.simulation,this.stage);
									}
									createdInvention.inPermanent = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
									createdInvention.updateDisplay();
									this.inventions.push(createdInvention);
								}
							}
						}
					}
				}
			}
		}
	}
	,onCityChange: function() {
		var i = this.inventions.length;
		while(--i >= 0) {
			var invention = this.inventions[i];
			if(invention.inPermanent.destroyed) {
				invention.destroy();
			} else {
				invention.onCityChange();
				if(!invention.destroyed) {
					invention.update(0);
				}
			}
		}
	}
	,save: function(queue) {
		var value = this.citizens.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			var value = citizen.tempId;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
		}
		var value = this.inventions.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.inventions;
		while(_g < _g1.length) {
			var invention = _g1[_g];
			++_g;
			queue.addString(invention.className);
			invention.save(queue);
		}
	}
	,load: function(queue) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var len = intToRead;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			var tmp = this.citizens;
			var tmp1 = this.simulation.citizens;
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			tmp.push(tmp1[intToRead]);
		}
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		len = intToRead;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			var inventionClass = queue.readString();
			var typeClass = $hxClasses[inventionClass];
			var invention = Type.createInstance(typeClass,[this.simulation,this.stage]);
			invention.load(queue);
			this.inventions.push(invention);
		}
	}
	,__class__: simulation_HackerSchoolBonuses
};
