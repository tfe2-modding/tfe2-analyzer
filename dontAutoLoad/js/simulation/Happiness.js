var simulation_Happiness = $hxClasses["simulation.Happiness"] = function(city,simulation) {
	this.hippieLifestyle = false;
	this.gloryOfTheKey = null;
	this.healthCapacityByType = null;
	this.veryUnhappyFromDay = -1;
	this.lastShownVeryUnhappyWarning = -1;
	this.shouldUpdateHappinessIn = 0;
	this.happinessEnthusiasmLevel = 0;
	this.actualHappiness = 0;
	this.ignoreUnhappyCitizens = false;
	this.numberOfGroupsWithCitizens = 0;
	this.lastRestoreTime = -1;
	this.lastOvertimeDay = -1;
	this.lastOvertime = 0;
	this.overtimeStarted = 0;
	this.overtimeUnhappinessShown = 0;
	this.overtimeUnhappinessActual = 0;
	this.foodRationingUnhappiness = 0;
	this.foodShortageUnhappiness = 0;
	this.enthusiasmHappiness = 0;
	this.fullHappinessTimeout = 0;
	this.oneWithNatureHappiness = 0;
	this.fullHappinessTime = 0;
	this.medicalHappinessFillsAllCitizens = false;
	this.happinessExBoosts = 0;
	this.happiness = -1;
	this.city = city;
	this.simulation = simulation;
	this.entertainmentTypes = [0,1,2,3,4];
	HxOverrides.remove(this.entertainmentTypes,5);
	HxOverrides.remove(this.entertainmentTypes,6);
	var _g = [];
	var _g1 = 0;
	var _g2 = this.entertainmentTypes.length;
	while(_g1 < _g2) {
		var i = _g1++;
		_g.push(0);
	}
	this.happinessPerEntertainmentType = _g;
	this.actionSpeedModifierWithoutPenalties = 1;
	this.happinessBoosts = [];
	var _g = [];
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	this.healthCapacityByType = _g;
};
simulation_Happiness.__name__ = "simulation.Happiness";
simulation_Happiness.prototype = {
	set_happiness: function(newHappiness) {
		this.actionSpeedModifier = newHappiness <= 50 ? 0.25 + newHappiness / 50 * 0.75 : 1 + (newHappiness - 50) / 50;
		return this.happiness = newHappiness;
	}
	,update: function(timeMod) {
		var time = this.simulation.time;
		var b = this.happinessBoosts.length - 1;
		while(b >= 0) {
			var boost = this.happinessBoosts[b];
			if(boost.hasPassed(time)) {
				this.happinessBoosts.splice(b,1);
			}
			--b;
		}
		if(this.shouldUpdateHappinessIn <= 0) {
			this.actualHappiness = this.getActualHappiness();
			this.shouldUpdateHappinessIn = 60;
		} else {
			this.shouldUpdateHappinessIn -= Math.max(1,timeMod);
		}
		if(this.happiness == -1) {
			this.set_happiness(this.actualHappiness);
		}
		var changeHappinessWith = 0.05 * timeMod;
		if(Math.abs(this.actualHappiness - this.happiness) < changeHappinessWith) {
			this.set_happiness(this.actualHappiness);
		} else {
			var _g = this;
			var num = this.actualHappiness - this.happiness;
			_g.set_happiness(_g.happiness + (num > 0 ? 1 : num < 0 ? -1 : 0) * changeHappinessWith);
		}
		if(this.happiness >= 99.99) {
			this.fullHappinessTime += timeMod * this.city.simulation.time.minutesPerTick;
			this.fullHappinessTimeout = 300;
			common_Achievements.achieve("HAPPINESS_100");
			if(this.happiness >= 124.99) {
				common_Achievements.achieve("HAPPINESS_125");
			}
		} else if(this.fullHappinessTimeout < 0) {
			this.fullHappinessTime = 0;
		} else {
			this.fullHappinessTimeout -= timeMod;
		}
		if(this.happiness <= 10.01) {
			if(1 + ((time.timeSinceStart | 0) / 1440 | 0) != this.lastShownVeryUnhappyWarning) {
				if(this.veryUnhappyFromDay == -1) {
					this.veryUnhappyFromDay = 1 + ((time.timeSinceStart | 0) / 1440 | 0);
					this.lastShownVeryUnhappyWarning = 1 + ((time.timeSinceStart | 0) / 1440 | 0);
					if(!this.city.simulation.happiness.ignoreUnhappyCitizens) {
						this.city.gui.showSimpleWindow(common_Localize.lo(this.city.progress.story.storyName == "cityofthekey" ? "citizens_unhappy_key" : this.city.materials.food == 0 ? "citizens_unhappy_food" : "citizens_unhappy") + " " + common_Localize.lo("more_happiness_info"),common_Localize.lo("citizens_unhappy_title"),true,true);
						this.city.gui.pauseForWindow();
					}
				}
			}
		} else {
			this.veryUnhappyFromDay = -1;
		}
		if(5 == 1) {
			common_KongTools.reportHappiness(this.happiness | 0);
		}
	}
	,getActualHappiness: function() {
		var doneWorld = new haxe_ds_ObjectMap();
		var worldGroup = new haxe_ds_ObjectMap();
		var maxWorldGroup = 0;
		var entertainmentPerGroup = [];
		var entertainmentSubtypeBuildingsPerGroup = [];
		var medicalBuildingsPerGroup = [];
		var citizensPerGroup = [];
		var entertainmentTypeNum = this.entertainmentTypes.length;
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var worldForGrouping = _g1[_g];
			++_g;
			if(!doneWorld.h[worldForGrouping.__id__]) {
				var _g2 = [];
				var _g3 = 0;
				var _g4 = entertainmentTypeNum;
				while(_g3 < _g4) {
					var i = _g3++;
					_g2.push([]);
				}
				var theseEntertainmentSubtypesBuildings = _g2;
				var theseMedicalBuildings = [];
				var entertainment = 0.0;
				var _g5 = 0;
				var _g6 = worldForGrouping.reachableWorlds;
				while(_g5 < _g6.length) {
					var world = _g6[_g5];
					++_g5;
					worldGroup.set(world,maxWorldGroup);
					doneWorld.set(world,true);
					var _g7 = 0;
					var _g8 = world.permanents;
					while(_g7 < _g8.length) {
						var permanentStack = _g8[_g7];
						++_g7;
						var _g9 = 0;
						while(_g9 < permanentStack.length) {
							var permanent = permanentStack[_g9];
							++_g9;
							if(permanent == null) {
								continue;
							}
							if(permanent.isBuilding) {
								if(permanent.isEntertainment) {
									var entertainmentBuilding = permanent;
									var index = this.entertainmentTypes.indexOf(entertainmentBuilding.get_entertainmentType());
									if(index != -1) {
										theseEntertainmentSubtypesBuildings[index].push(entertainmentBuilding);
									}
									if(entertainmentBuilding.get_secondaryEntertainmentTypes() != null) {
										var _g10 = 0;
										var _g11 = entertainmentBuilding.get_secondaryEntertainmentTypes();
										while(_g10 < _g11.length) {
											var et = _g11[_g10];
											++_g10;
											var index1 = this.entertainmentTypes.indexOf(et);
											if(index1 != -1) {
												theseEntertainmentSubtypesBuildings[index1].push(entertainmentBuilding);
											}
										}
									}
								} else if(permanent.isMedical) {
									var medicalBuilding = permanent;
									theseMedicalBuildings.push(medicalBuilding);
								}
							}
							entertainment += permanent.get_baseEntertainmentCapacity() + permanent.bonusEntertainmentCapacity;
						}
					}
				}
				entertainmentPerGroup[maxWorldGroup] = entertainment;
				entertainmentSubtypeBuildingsPerGroup[maxWorldGroup] = theseEntertainmentSubtypesBuildings;
				medicalBuildingsPerGroup[maxWorldGroup] = theseMedicalBuildings;
				citizensPerGroup[maxWorldGroup] = 0;
				++maxWorldGroup;
			}
		}
		var homeHappinessOld = this.homeHappiness;
		this.homeHappiness = 0;
		this.schoolHappiness = 0;
		this.purposeHappiness = 0;
		var kids = 0;
		var _g = 0;
		var _g1 = this.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen.home != null) {
				this.homeHappiness += citizen.home.get_attractiveness();
			}
			if(citizen.job != null) {
				this.purposeHappiness += 100;
			} else if(citizen.lastInfrequentUpdateAge < 16) {
				++kids;
				if(citizen.school != null) {
					this.schoolHappiness += 100;
					this.purposeHappiness += 100;
				}
			}
			citizensPerGroup[worldGroup.h[citizen.onWorld.__id__]] += 1;
		}
		if(this.simulation.citizens.length > 0) {
			this.homeHappiness /= this.simulation.citizens.length;
			this.purposeHappiness /= this.simulation.citizens.length;
		}
		if(this.homeHappiness < homeHappinessOld && this.simulation.houseAssigner.currentlyRateLimited) {
			this.homeHappiness = homeHappinessOld;
		}
		if(kids > 0) {
			this.schoolHappiness /= kids;
		} else {
			this.schoolHappiness = common_ArrayExtensions.any(this.city.permanents,function(p) {
				if(p.is(buildings_School)) {
					return p.workers.length >= 1;
				} else {
					return false;
				}
			}) ? 100 : 0;
		}
		var _g = 0;
		var _g1 = this.happinessPerEntertainmentType.length;
		while(_g < _g1) {
			var i = _g++;
			this.happinessPerEntertainmentType[i] = 0;
		}
		this.entertainmentHappiness = 0;
		this.medicalHappiness = 0;
		this.medicalHappinessFillsAllCitizens = true;
		var _g = [];
		_g.push(0);
		_g.push(0);
		_g.push(0);
		_g.push(0);
		_g.push(0);
		_g.push(0);
		_g.push(0);
		_g.push(0);
		_g.push(0);
		_g.push(0);
		this.healthCapacityByType = _g;
		this.numberOfGroupsWithCitizens = 0;
		var _g = 0;
		var _g1 = maxWorldGroup;
		while(_g < _g1) {
			var i = _g++;
			if(citizensPerGroup[i] == 0) {
				continue;
			} else {
				this.numberOfGroupsWithCitizens++;
			}
			var thisEntertainmentHappiness = 32.999999999999993 * Math.min(entertainmentPerGroup[i],citizensPerGroup[i]);
			var _g2 = 0;
			var _g3 = entertainmentSubtypeBuildingsPerGroup[i].length;
			while(_g2 < _g3) {
				var j = _g2++;
				var subTypeBuildings = entertainmentSubtypeBuildingsPerGroup[i][j];
				var amountOfCitizensLeft = citizensPerGroup[i];
				var thisEntertainmentHappinessPart = 0;
				var _g4 = 0;
				while(_g4 < subTypeBuildings.length) {
					var entertainmentBuilding = subTypeBuildings[_g4];
					++_g4;
					var citizensForBuilding = amountOfCitizensLeft > entertainmentBuilding.get_entertainmentCapacity() ? entertainmentBuilding.get_entertainmentCapacity() : amountOfCitizensLeft;
					thisEntertainmentHappinessPart += citizensForBuilding * entertainmentBuilding.get_entertainmentQuality();
					amountOfCitizensLeft -= citizensForBuilding;
					if(amountOfCitizensLeft <= 0) {
						break;
					}
				}
				thisEntertainmentHappiness += thisEntertainmentHappinessPart * (0.67 / entertainmentTypeNum);
				this.happinessPerEntertainmentType[j] += thisEntertainmentHappinessPart / this.simulation.citizens.length;
			}
			this.entertainmentHappiness += thisEntertainmentHappiness / this.simulation.citizens.length;
			var theseMedicalBuildings = medicalBuildingsPerGroup[i];
			theseMedicalBuildings.sort(function(b1,b2) {
				var num = b2.get_medicalQuality() - b1.get_medicalQuality() + 0.01 * (b2.get_medicalTypeID() - b1.get_medicalTypeID());
				if(num > 0) {
					return 1;
				} else if(num < 0) {
					return -1;
				} else {
					return 0;
				}
			});
			var amountOfCitizensLeft1 = citizensPerGroup[i];
			var thisMedicalPart = 0;
			var medicalTypes = 0;
			var _g5 = 0;
			while(_g5 < theseMedicalBuildings.length) {
				var medicalBuilding = theseMedicalBuildings[_g5];
				++_g5;
				var val2 = medicalBuilding.get_medicalTypeID() + 1;
				if(val2 > medicalTypes) {
					medicalTypes = val2;
				}
			}
			var _g6 = [];
			var _g7 = 0;
			var _g8 = medicalTypes;
			while(_g7 < _g8) {
				var i1 = _g7++;
				_g6.push(0.0);
			}
			var medicalLimitUsedPerType = _g6;
			var _g9 = 0;
			while(_g9 < theseMedicalBuildings.length) {
				var medicalBuilding1 = theseMedicalBuildings[_g9];
				++_g9;
				var citizensForBuilding1 = amountOfCitizensLeft1 > medicalBuilding1.get_medicalCapacity() ? medicalBuilding1.get_medicalCapacity() : amountOfCitizensLeft1;
				var thisMaxLimit = medicalBuilding1.get_medicalTypeLimit() * citizensPerGroup[i];
				var val = thisMaxLimit - medicalLimitUsedPerType[medicalBuilding1.get_medicalTypeID()];
				if(val < 0) {
					citizensForBuilding1 = 0;
				} else if(!(val > citizensForBuilding1)) {
					citizensForBuilding1 = val;
				}
				medicalLimitUsedPerType[medicalBuilding1.get_medicalTypeID()] += citizensForBuilding1;
				this.healthCapacityByType[medicalBuilding1.get_medicalTypeID()] += citizensForBuilding1;
				thisMedicalPart += citizensForBuilding1 * medicalBuilding1.get_medicalQuality();
				amountOfCitizensLeft1 -= citizensForBuilding1;
				if(amountOfCitizensLeft1 <= 0) {
					break;
				}
			}
			this.medicalHappiness += thisMedicalPart / this.simulation.citizens.length;
			if(amountOfCitizensLeft1 > 0) {
				this.medicalHappinessFillsAllCitizens = false;
			}
		}
		this.entertainmentHappiness = Math.min(100,this.entertainmentHappiness + 0.01);
		this.medicalHappiness = Math.min(100,this.medicalHappiness + 0.01);
		var cityPermanents = this.city.getAmountOfPermanentsPerType();
		var numberOfSpecializedMedicalBuildings = cityPermanents.h["buildings.SpecializedMedicalClinic"];
		if(numberOfSpecializedMedicalBuildings == null || numberOfSpecializedMedicalBuildings == 0) {
			this.specializedMedicalHappiness = 0;
		} else {
			var val = numberOfSpecializedMedicalBuildings / this.simulation.citizens.length * 1000 * 100;
			this.specializedMedicalHappiness = val < 0 ? 0 : val > 100 ? 100 : val;
		}
		var purposeHappinessPartCur = 0.1;
		var homeHappinessPartCur = 0.4;
		var medicalHappinessPartCur = 0.1;
		var schoolHappinessPartCur = 0.1;
		var entertainmentHappinessPartCur = 0.3;
		var oneWithNatureHappinessPartCur = 0.0;
		if(this.gloryOfTheKey != null) {
			purposeHappinessPartCur -= 0.02;
			homeHappinessPartCur -= 0.02;
			medicalHappinessPartCur -= 0.02;
			schoolHappinessPartCur -= 0.02;
			entertainmentHappinessPartCur -= 0.02;
		}
		if(this.hippieLifestyle) {
			oneWithNatureHappinessPartCur = purposeHappinessPartCur;
			purposeHappinessPartCur = 0;
		}
		this.oneWithNatureHappiness = 0;
		if(oneWithNatureHappinessPartCur > 0) {
			var oneWithNatureEntertainmentCap = 0.0;
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var pm = _g1[_g];
				++_g;
				if(!pm.isBuilding) {
					continue;
				}
				var bld = pm;
				if(!bld.isEntertainment) {
					continue;
				}
				var thisBuilding = pm;
				if(thisBuilding.get_entertainmentType() != 1 && (thisBuilding.get_secondaryEntertainmentTypes() == null || thisBuilding.get_secondaryEntertainmentTypes().indexOf(1) == -1)) {
					continue;
				}
				oneWithNatureEntertainmentCap += thisBuilding.get_entertainmentCapacity();
			}
			this.oneWithNatureHappiness = Math.min(100,oneWithNatureEntertainmentCap / Math.max(1,this.simulation.citizens.length) * 33.334);
		}
		var newHappiness = this.homeHappiness * homeHappinessPartCur + this.entertainmentHappiness * entertainmentHappinessPartCur + this.schoolHappiness * schoolHappinessPartCur + this.medicalHappiness * medicalHappinessPartCur + this.purposeHappiness * purposeHappinessPartCur + oneWithNatureHappinessPartCur * this.oneWithNatureHappiness;
		if(this.gloryOfTheKey != null) {
			this.gloryOfTheKey.updateHappiness();
			newHappiness += 0.1 * this.gloryOfTheKey.gloryOfTheKeyHappiness;
		}
		newHappiness = Math.min(100,newHappiness + 0.01);
		this.actionSpeedModifierWithoutPenalties = newHappiness <= 50 ? 0.25 + newHappiness / 50 * 0.75 : 1 + (newHappiness - 50) / 50;
		var foodShortage = this.simulation.eating.foodShortage;
		if(foodShortage > 0) {
			this.foodRationingUnhappiness = 0;
			if(this.actionSpeedModifierWithoutPenalties < 1) {
				this.actionSpeedModifierWithoutPenalties = 1;
			}
			if(this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("emergencySupplies") != -1) {
				if(foodShortage < 0.2 * this.simulation.eating.totalConsumedFoodPerDay) {
					this.foodShortageUnhappiness = 0;
				} else if(foodShortage >= 0.3 * this.simulation.eating.totalConsumedFoodPerDay + 10) {
					this.foodShortageUnhappiness = newHappiness;
					newHappiness = 0;
				} else if(newHappiness > 20) {
					this.foodShortageUnhappiness = newHappiness - 20;
					newHappiness = 20;
				} else {
					this.foodShortageUnhappiness = 0;
				}
			} else if(foodShortage >= 10) {
				this.foodShortageUnhappiness = newHappiness;
				newHappiness = 0;
			} else if(newHappiness > 10) {
				this.foodShortageUnhappiness = newHappiness - 10;
				newHappiness = 10;
			} else {
				this.foodShortageUnhappiness = 0;
			}
		} else {
			this.foodShortageUnhappiness = 0;
			this.foodRationingUnhappiness = 0;
			if(newHappiness > 10) {
				if(this.city.simulation.eating.foodRationing) {
					var newHappinessAfterRationing = Math.max(10,newHappiness * 0.67);
					this.foodRationingUnhappiness = newHappiness - newHappinessAfterRationing;
					newHappiness = newHappinessAfterRationing;
				}
			}
		}
		if(this.city.policies.vars.workTimeChange > 0) {
			this.lastOvertime = this.city.simulation.time.timeSinceStart / 1440;
			this.overtimeUnhappinessActual = Math.max(this.overtimeUnhappinessActual,5);
			if(this.lastOvertimeDay == -1) {
				this.lastOvertimeDay = this.lastOvertime;
			} else if(this.city.simulation.time.timeSinceStart / 1440 > this.lastOvertimeDay + 1) {
				this.lastOvertimeDay = this.city.simulation.time.timeSinceStart / 1440;
				this.overtimeUnhappinessActual = Math.min(this.overtimeUnhappinessActual + 5,50);
			}
			this.lastRestoreTime = -1;
		} else if(this.city.simulation.time.timeSinceStart / 1440 > this.lastOvertimeDay + 1) {
			if(this.lastRestoreTime == -1) {
				this.lastRestoreTime = this.city.simulation.time.timeSinceStart / 1440;
			} else {
				var reduceOvertimeBy = (this.city.simulation.time.timeSinceStart / 1440 - this.lastRestoreTime) * 10;
				this.lastRestoreTime = this.city.simulation.time.timeSinceStart / 1440;
				this.overtimeUnhappinessActual = Math.max(0,this.overtimeUnhappinessActual - reduceOvertimeBy);
			}
			this.lastOvertimeDay = -1;
		}
		this.overtimeUnhappinessShown = 0;
		if(this.overtimeUnhappinessActual > 0) {
			this.overtimeUnhappinessShown = Math.min(this.overtimeUnhappinessActual,newHappiness);
			newHappiness -= this.overtimeUnhappinessShown;
		}
		if(newHappiness < this.happinessEnthusiasmLevel) {
			this.enthusiasmHappiness = this.happinessEnthusiasmLevel - newHappiness;
			newHappiness = this.happinessEnthusiasmLevel;
		} else {
			this.enthusiasmHappiness = 0;
		}
		this.happinessExBoosts = newHappiness;
		var _g = 0;
		var _g1 = this.happinessBoosts;
		while(_g < _g1.length) {
			var boost = _g1[_g];
			++_g;
			if(!boost.canGoOverMax) {
				newHappiness = Math.min(100,newHappiness + boost.boost);
			}
		}
		var _g = 0;
		var _g1 = this.happinessBoosts;
		while(_g < _g1.length) {
			var boost = _g1[_g];
			++_g;
			if(boost.canGoOverMax) {
				newHappiness += boost.boost;
			}
		}
		newHappiness = Math.max(newHappiness,0);
		return newHappiness;
	}
	,addBoost: function(boost) {
		this.happinessBoosts.push(boost);
	}
	,save: function(queue) {
		this.saveBasics(queue);
		var value = this.happinessBoosts.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.happinessBoosts;
		while(_g < _g1.length) {
			var boost = _g1[_g];
			++_g;
			boost.save(queue);
		}
	}
	,load: function(queue) {
		this.loadBasics(queue);
		if(queue.version >= 20) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var happinessBoostsLen = intToRead;
			var _g = 0;
			var _g1 = happinessBoostsLen;
			while(_g < _g1) {
				var i = _g++;
				var boost = new simulation_HappinessBoost(0,0,"");
				boost.load(queue);
				this.happinessBoosts.push(boost);
			}
		}
		if(this.city.progress.story.storyName == "cityofthekey" || this.city.progress.ruleset == progress_Ruleset.KeyCity) {
			this.createGloryOfTheKey();
		}
	}
	,createGloryOfTheKey: function() {
		this.gloryOfTheKey = new simulation_GloryOfTheKey(this.city);
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_Happiness.saveDefinition);
		}
		var value = this.happiness;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.homeHappiness;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.purposeHappiness;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.entertainmentHappiness;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.schoolHappiness;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.medicalHappiness;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.specializedMedicalHappiness;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.fullHappinessTime;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.oneWithNatureHappiness;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.overtimeUnhappinessActual;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.overtimeStarted;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.lastOvertime;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.lastOvertimeDay;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.lastRestoreTime;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.ignoreUnhappyCitizens;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
		var value = this.actualHappiness;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.happinessEnthusiasmLevel;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.lastShownVeryUnhappyWarning;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.veryUnhappyFromDay;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"happiness")) {
			this.set_happiness(loadMap.h["happiness"]);
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"homeHappiness")) {
			this.homeHappiness = loadMap.h["homeHappiness"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"purposeHappiness")) {
			this.purposeHappiness = loadMap.h["purposeHappiness"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"entertainmentHappiness")) {
			this.entertainmentHappiness = loadMap.h["entertainmentHappiness"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"schoolHappiness")) {
			this.schoolHappiness = loadMap.h["schoolHappiness"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"medicalHappiness")) {
			this.medicalHappiness = loadMap.h["medicalHappiness"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"specializedMedicalHappiness")) {
			this.specializedMedicalHappiness = loadMap.h["specializedMedicalHappiness"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"fullHappinessTime")) {
			this.fullHappinessTime = loadMap.h["fullHappinessTime"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"oneWithNatureHappiness")) {
			this.oneWithNatureHappiness = loadMap.h["oneWithNatureHappiness"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"overtimeUnhappinessActual")) {
			this.overtimeUnhappinessActual = loadMap.h["overtimeUnhappinessActual"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"overtimeStarted")) {
			this.overtimeStarted = loadMap.h["overtimeStarted"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastOvertime")) {
			this.lastOvertime = loadMap.h["lastOvertime"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastOvertimeDay")) {
			this.lastOvertimeDay = loadMap.h["lastOvertimeDay"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastRestoreTime")) {
			this.lastRestoreTime = loadMap.h["lastRestoreTime"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"ignoreUnhappyCitizens")) {
			this.ignoreUnhappyCitizens = loadMap.h["ignoreUnhappyCitizens"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"actualHappiness")) {
			this.actualHappiness = loadMap.h["actualHappiness"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"happinessEnthusiasmLevel")) {
			this.happinessEnthusiasmLevel = loadMap.h["happinessEnthusiasmLevel"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastShownVeryUnhappyWarning")) {
			this.lastShownVeryUnhappyWarning = loadMap.h["lastShownVeryUnhappyWarning"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"veryUnhappyFromDay")) {
			this.veryUnhappyFromDay = loadMap.h["veryUnhappyFromDay"];
		}
	}
	,__class__: simulation_Happiness
};
