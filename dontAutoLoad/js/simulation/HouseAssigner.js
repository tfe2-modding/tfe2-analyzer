var simulation_HouseAssigner = $hxClasses["simulation.HouseAssigner"] = function(city,simulation) {
	this.currentlyRateLimited = false;
	this.limitHouseAssignments = 80;
	this.shouldUpdateHouses = true;
	this.city = city;
	this.simulation = simulation;
	var _g = [];
	var _g1 = 0;
	while(_g1 < 101) {
		var i = _g1++;
		_g.push(0);
	}
	this.peoplePerHomeQuality = _g;
	var _g = [];
	var _g1 = 0;
	while(_g1 < 101) {
		var i = _g1++;
		_g.push(0);
	}
	this.emptyPlacesPerHomeQuality = _g;
	var _g = [];
	var _g1 = 0;
	while(_g1 < 101) {
		var i = _g1++;
		_g.push(0);
	}
	this.transferFrom = _g;
	this.citizensWithFixedHomes = [];
};
simulation_HouseAssigner.__name__ = "simulation.HouseAssigner";
simulation_HouseAssigner.prototype = {
	assignHouses: function() {
		if(!this.shouldUpdateHouses) {
			return;
		}
		if(Config.limitedVersionForSmoothFilming) {
			return;
		}
		var maxEvict = this.limitHouseAssignments;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.city.connections.numberOfShards;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(0);
		}
		simulation_HouseAssigner.privateTeleportersLeft = _g;
		var _g = 0;
		var _g1 = this.city.connections.numberOfShards;
		while(_g < _g1) {
			var shardId = _g++;
			var shardPermanents = this.city.connections.permanentsByShard[shardId];
			var _g2 = 0;
			while(_g2 < 101) {
				var i = _g2++;
				this.peoplePerHomeQuality[i] = 0;
			}
			var _g3 = 0;
			while(_g3 < 101) {
				var i1 = _g3++;
				this.emptyPlacesPerHomeQuality[i1] = 0;
			}
			var _g4 = 0;
			while(_g4 < 101) {
				var i2 = _g4++;
				this.transferFrom[i2] = 0;
			}
			simulation_HouseAssigner.privateTeleportersLeft[shardId] = 0;
			var _g5 = 0;
			while(_g5 < shardPermanents.length) {
				var p = shardPermanents[_g5];
				++_g5;
				if(p != null && p.is(buildings_House)) {
					var thisHome = p;
					var val = thisHome.get_attractiveness();
					var quality = (val < 0 ? 0 : val > 100 ? 100 : val) | 0;
					if(!p.is(buildings_WorkWithHome)) {
						if(thisHome.get_hasPrivateTeleporter() && thisHome.get_remainingCapacity() > 0 && thisHome.get_attractiveness() > 99.9) {
							simulation_HouseAssigner.privateTeleportersLeft[shardId] += 1;
						}
						var _g6 = 0;
						var _g7 = thisHome.residents;
						while(_g6 < _g7.length) {
							var res = _g7[_g6];
							++_g6;
							if(!res.isForcedHome) {
								this.peoplePerHomeQuality[quality] += 1;
							}
						}
						this.emptyPlacesPerHomeQuality[quality] += thisHome.get_remainingCapacity();
					}
				}
			}
			var checkingPeople = 0;
			var checkingPlaces = 100;
			while(checkingPeople < checkingPlaces) {
				while(checkingPeople < checkingPlaces && this.peoplePerHomeQuality[checkingPeople] > 0) {
					var val1 = this.emptyPlacesPerHomeQuality[checkingPlaces];
					var val2 = this.peoplePerHomeQuality[checkingPeople];
					var transferNum = val2 < val1 ? val2 : val1;
					this.transferFrom[checkingPeople] += transferNum;
					this.emptyPlacesPerHomeQuality[checkingPlaces] -= transferNum;
					this.peoplePerHomeQuality[checkingPeople] -= transferNum;
					--checkingPlaces;
				}
				++checkingPeople;
			}
			var _g8 = 0;
			while(_g8 < shardPermanents.length) {
				var p1 = shardPermanents[_g8];
				++_g8;
				if(p1 != null && p1.is(buildings_House)) {
					var thisHome1 = p1;
					var val3 = thisHome1.get_attractiveness();
					var quality1 = (val3 < 0 ? 0 : val3 > 100 ? 100 : val3) | 0;
					if(this.transferFrom[quality1] > 0) {
						var c = thisHome1.residents.length;
						while(--c >= 0) {
							var citizen = thisHome1.residents[c];
							if(this.transferFrom[quality1] > 0 && !citizen.isForcedHome) {
								if(maxEvict > 0) {
									citizen.evictFromHome();
									this.transferFrom[quality1]--;
									--maxEvict;
								}
							}
						}
					}
				}
			}
		}
		var _g = [];
		var _g1 = 0;
		var _g2 = this.city.connections.numberOfShards;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(false);
		}
		var shardIsImpossible = _g;
		var _g = 0;
		var _g1 = this.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(!shardIsImpossible[citizen.getShard()]) {
				if(citizen.home == null && this.limitHouseAssignments > 0) {
					var citizen1 = [citizen];
					var _gthis = [this];
					var isHouseWithCapacityOnReachableWorld = [(function() {
						return function(c,pm) {
							var pm1 = pm;
							if(pm1.is(buildings_House) && pm1.get_remainingCapacity() > 0 && (pm1.get_fixedCapacityForWorkers() == 0 || Lambda.count(pm1.workers,(function() {
								return function(w) {
									return w.job == pm1;
								};
							})()) >= pm1.get_fixedCapacityForWorkers())) {
								return c.getShard() == pm.shardId;
							} else {
								return false;
							}
						};
					})()];
					var isHouseWithCapacityOnReachableWorldFromBuilding = [(function() {
						return function(building,pm) {
							var pm1 = pm;
							if(pm1.is(buildings_House) && pm1.get_remainingCapacity() > 0 && (pm1.get_fixedCapacityForWorkers() == 0 || Lambda.count(pm1.workers,(function() {
								return function(w) {
									return w.job == pm1;
								};
							})()) >= pm1.get_fixedCapacityForWorkers())) {
								return building.shardId == pm.shardId;
							} else {
								return false;
							}
						};
					})()];
					var isHouseWithCapacityOnReachableWorldOrTeleporter = [(function(_gthis) {
						return function(c,pm) {
							var pm1 = pm;
							if(!(pm1.is(buildings_House) && pm1.get_remainingCapacity() > 0 && (pm1.get_fixedCapacityForWorkers() == 0 || Lambda.count(pm1.workers,(function() {
								return function(w) {
									return w.job == pm1;
								};
							})()) >= pm1.get_fixedCapacityForWorkers()) && c.getShard() == pm.shardId)) {
								if(pm.is(buildings_Teleporter)) {
									return _gthis[0].city.simulation.operatingCost.teleportersEnabled;
								} else {
									return false;
								}
							} else {
								return true;
							}
						};
					})(_gthis)];
					var isHouseWithCapacityOnReachableWorldFromBuildingOrTeleporter = [(function(_gthis) {
						return function(building,pm) {
							var pm1 = pm;
							if(!(pm1.is(buildings_House) && pm1.get_remainingCapacity() > 0 && (pm1.get_fixedCapacityForWorkers() == 0 || Lambda.count(pm1.workers,(function() {
								return function(w) {
									return w.job == pm1;
								};
							})()) >= pm1.get_fixedCapacityForWorkers()) && building.shardId == pm.shardId)) {
								if(pm.is(buildings_Teleporter)) {
									return _gthis[0].city.simulation.operatingCost.teleportersEnabled;
								} else {
									return false;
								}
							} else {
								return true;
							}
						};
					})(_gthis)];
					if(citizen1[0].home == null) {
						var newHome = null;
						if(simulation_HouseAssigner.privateTeleportersLeft[citizen1[0].getShard()] > 0) {
							if(citizen1[0].job != null) {
								var newHome1 = this.simulation.permanentFinder;
								var citizen2 = citizen1[0].job;
								var newHome2 = (function(building,isHouseWithCapacityOnReachableWorldFromBuildingOrTeleporter) {
									return function(pm) {
										return isHouseWithCapacityOnReachableWorldFromBuildingOrTeleporter[0](building[0],pm);
									};
								})([citizen1[0].job],isHouseWithCapacityOnReachableWorldFromBuildingOrTeleporter);
								var getAttractiveness = (function() {
									return function(house) {
										if(house.is(buildings_Teleporter)) {
											return 100;
										} else {
											return house.get_baseAttractiveness() + house.bonusAttractiveness;
										}
									};
								})();
								newHome = newHome1.query(citizen2,newHome2,getAttractiveness,null,99.999999);
							} else {
								var newHome3 = this.city.permanents;
								var newHome4 = (function(c,isHouseWithCapacityOnReachableWorldOrTeleporter) {
									return function(pm) {
										return isHouseWithCapacityOnReachableWorldOrTeleporter[0](c[0],pm);
									};
								})([citizen1[0]],isHouseWithCapacityOnReachableWorldOrTeleporter);
								var getAttractiveness1 = (function() {
									return function(house) {
										if(house.is(buildings_Teleporter)) {
											return 100;
										} else {
											return house.get_baseAttractiveness() + house.bonusAttractiveness;
										}
									};
								})();
								newHome = common_ArrayExtensions.whereMaxWithMax(newHome3,newHome4,getAttractiveness1,99.999999);
							}
							if(newHome != null && newHome.is(buildings_Teleporter)) {
								newHome = Lambda.find(this.city.permanents,(function(citizen) {
									return function(pm) {
										if(pm.is(buildings_House) && citizen[0].getShard() == pm.shardId) {
											var thisHouse = pm;
											if(thisHouse.get_hasPrivateTeleporter()) {
												var pm1 = pm;
												if(pm1.is(buildings_House) && pm1.get_remainingCapacity() > 0) {
													if(pm1.get_fixedCapacityForWorkers() != 0) {
														return Lambda.count(pm1.workers,(function() {
															return function(w) {
																return w.job == pm1;
															};
														})()) >= pm1.get_fixedCapacityForWorkers();
													} else {
														return true;
													}
												} else {
													return false;
												}
											}
										}
										return false;
									};
								})(citizen1));
							}
						} else if(citizen1[0].job != null) {
							var newHome5 = this.simulation.permanentFinder;
							var citizen3 = citizen1[0].job;
							var newHome6 = (function(building,isHouseWithCapacityOnReachableWorldFromBuilding) {
								return function(pm) {
									return isHouseWithCapacityOnReachableWorldFromBuilding[0](building[0],pm);
								};
							})([citizen1[0].job],isHouseWithCapacityOnReachableWorldFromBuilding);
							var getAttractiveness2 = (function() {
								return function(house) {
									return house.get_baseAttractiveness() + house.bonusAttractiveness;
								};
							})();
							newHome = newHome5.query(citizen3,newHome6,getAttractiveness2,null,99.999999);
						} else {
							var newHome7 = this.city.permanents;
							var newHome8 = (function(c,isHouseWithCapacityOnReachableWorld) {
								return function(pm) {
									return isHouseWithCapacityOnReachableWorld[0](c[0],pm);
								};
							})([citizen1[0]],isHouseWithCapacityOnReachableWorld);
							var getAttractiveness3 = (function() {
								return function(house) {
									return house.get_baseAttractiveness() + house.bonusAttractiveness;
								};
							})();
							newHome = common_ArrayExtensions.whereMaxWithMax(newHome7,newHome8,getAttractiveness3,99.999999);
						}
						if(newHome != null) {
							citizen1[0].home = newHome;
							newHome.residents.push(citizen1[0]);
							if(newHome.get_hasPrivateTeleporter()) {
								var tmp = simulation_HouseAssigner.privateTeleportersLeft;
								var tmp1 = citizen1[0].getShard();
								tmp[tmp1]--;
							}
						}
					}
					if(citizen.home == null) {
						shardIsImpossible[citizen.getShard()] = true;
					}
					this.limitHouseAssignments--;
				}
			}
		}
		if(this.limitHouseAssignments > 0) {
			this.shouldUpdateHouses = false;
		}
		this.currentlyRateLimited = this.shouldUpdateHouses;
	}
	,load: function(queue) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var numberOfCitizensWithFixedHomes = intToRead;
		this.citizensWithFixedHomes = [];
		var _g = 0;
		var _g1 = numberOfCitizensWithFixedHomes;
		while(_g < _g1) {
			var i = _g++;
			var theCitizen = this.simulation.citizens;
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var theCitizen1 = theCitizen[intToRead];
			theCitizen1.isForcedHome = true;
			this.citizensWithFixedHomes.push(theCitizen1);
		}
	}
	,save: function(queue) {
		var value = this.citizensWithFixedHomes.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		if(this.citizensWithFixedHomes.length >= 10) {
			var ci = 0;
			var _g = 0;
			var _g1 = this.simulation.citizens;
			while(_g < _g1.length) {
				var citizen = _g1[_g];
				++_g;
				if(citizen.isForcedHome) {
					if(queue.size + 4 > queue.bytes.length) {
						var oldBytes = queue.bytes;
						queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
						queue.bytes.blit(0,oldBytes,0,queue.size);
					}
					queue.bytes.setInt32(queue.size,ci);
					queue.size += 4;
				}
				++ci;
			}
		} else {
			var _g = 0;
			var _g1 = this.citizensWithFixedHomes;
			while(_g < _g1.length) {
				var citizen = _g1[_g];
				++_g;
				var value = this.simulation.citizens.indexOf(citizen);
				if(queue.size + 4 > queue.bytes.length) {
					var oldBytes = queue.bytes;
					queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
					queue.bytes.blit(0,oldBytes,0,queue.size);
				}
				queue.bytes.setInt32(queue.size,value);
				queue.size += 4;
			}
		}
	}
	,__class__: simulation_HouseAssigner
};
