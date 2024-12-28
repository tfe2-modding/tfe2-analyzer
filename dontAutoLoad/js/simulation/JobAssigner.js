var simulation_JobAssigner = $hxClasses["simulation.JobAssigner"] = function(city,simulation) {
	this.availableClassesForJob = [];
	this.citizensWithoutJob = [];
	this.buildingsHaveWork = true;
	this.city = city;
	this.simulation = simulation;
	this.priorityJobs = new haxe_ds_StringMap();
};
simulation_JobAssigner.__name__ = "simulation.JobAssigner";
simulation_JobAssigner.prototype = {
	assignJobs: function() {
		if(Config.limitedVersionForSmoothFilming) {
			return;
		}
		this.doStorySpecific();
		if(this.buildingsHaveWork) {
			var buildingsWithJob = [];
			var _g = [];
			var _g1 = 0;
			var _g2 = PermanentMetaHelper.getClassIDLength();
			while(_g1 < _g2) {
				var i = _g1++;
				_g.push(0);
			}
			var workersShortPerBuildingType = _g;
			var _g = [];
			var _g1 = 0;
			var _g2 = PermanentMetaHelper.getClassIDLength();
			while(_g1 < _g2) {
				var i = _g1++;
				_g.push(false);
			}
			var isMaxPrio = _g;
			var prioJob = haxe_ds_StringMap.keysIterator(this.priorityJobs.h);
			while(prioJob.hasNext()) {
				var prioJob1 = prioJob.next();
				var classID = PermanentMetaHelper.getClassID(prioJob1);
				var priorityJobs = Object.prototype.hasOwnProperty.call(this.priorityJobs.h,prioJob1) ? this.priorityJobs.h[prioJob1] : 0;
				isMaxPrio[classID] = priorityJobs == 1000000;
				workersShortPerBuildingType[classID] = isMaxPrio[classID] ? 0 : priorityJobs;
			}
			var _g = 0;
			var _g1 = this.city.workBuildings;
			while(_g < _g1.length) {
				var thisWork = _g1[_g];
				++_g;
				if(thisWork.workers.length < thisWork.get_jobs()) {
					buildingsWithJob.push(thisWork);
				}
				if(isMaxPrio[thisWork.classID]) {
					workersShortPerBuildingType[thisWork.classID] += thisWork.get_jobs();
				}
				workersShortPerBuildingType[thisWork.classID] -= thisWork.workers.length;
			}
			var isHandlingPriorityJobs = false;
			var priorityJobShortTypes = 0;
			var _g = 0;
			while(_g < workersShortPerBuildingType.length) {
				var w = workersShortPerBuildingType[_g];
				++_g;
				if(w > 0) {
					isHandlingPriorityJobs = true;
					++priorityJobShortTypes;
				}
			}
			if(!isHandlingPriorityJobs && this.citizensWithoutJob.length == 0 && this.availableClassesForJob.length == 0) {
				this.buildingsHaveWork = false;
				return;
			}
			var buildingsWithJobNeedSort = true;
			var anyJobHadResult = true;
			var _g = [];
			var _g1 = 0;
			var _g2 = this.city.connections.numberOfShards;
			while(_g1 < _g2) {
				var i = _g1++;
				_g.push(false);
			}
			var shardNoOptions = _g;
			while(anyJobHadResult) {
				anyJobHadResult = false;
				if(buildingsWithJobNeedSort) {
					if(this.city.progress.story.storyName == "hippiecommune") {
						buildingsWithJob.sort((function() {
							return function(b1,b2) {
								if(b1.className == "buildings.BlossomHippieHQ") {
									return -1;
								} else if(b2.className == "buildings.BlossomHippieHQ") {
									return 1;
								} else if(b1.workers.length > b2.workers.length) {
									return 1;
								} else if(b1.workers.length < b2.workers.length) {
									return -1;
								} else {
									return 0;
								}
							};
						})());
					} else if(this.city.progress.story.storyName == "cityofthekey") {
						buildingsWithJob.sort((function() {
							return function(b1,b2) {
								if(b1.className == "buildings.SecretSocietyHouse") {
									return -1;
								} else if(b2.className == "buildings.SecretSocietyHouse") {
									return 1;
								} else if(b1.workers.length > b2.workers.length) {
									return 1;
								} else if(b1.workers.length < b2.workers.length) {
									return -1;
								} else {
									return 0;
								}
							};
						})());
					} else {
						buildingsWithJob.sort((function() {
							return function(b1,b2) {
								if(b1.workers.length > b2.workers.length) {
									return 1;
								} else if(b1.workers.length < b2.workers.length) {
									return -1;
								} else {
									return 0;
								}
							};
						})());
					}
					buildingsWithJobNeedSort = false;
				}
				var _g = 0;
				while(_g < buildingsWithJob.length) {
					var building = [buildingsWithJob[_g]];
					++_g;
					if(building[0].workers.length == building[0].get_jobs()) {
						continue;
					}
					if(isHandlingPriorityJobs && workersShortPerBuildingType[building[0].classID] <= 0) {
						continue;
					}
					var bestCitizen = Lambda.find(this.citizensWithoutJob,(function(building) {
						return function(c) {
							return c.getShard() == building[0].shardId;
						};
					})(building));
					if(isHandlingPriorityJobs && bestCitizen == null) {
						if(!shardNoOptions[building[0].shardId]) {
							var bestFoundBuildingToFireFrom = null;
							var bestFoundBuildingToFireFromWorkers = 0;
							var _g1 = 0;
							var _g2 = this.city.workBuildings;
							while(_g1 < _g2.length) {
								var thisWork = _g2[_g1];
								++_g1;
								if(building[0].shardId == thisWork.shardId && thisWork.workers.length > bestFoundBuildingToFireFromWorkers && workersShortPerBuildingType[thisWork.classID] < 0) {
									bestFoundBuildingToFireFrom = thisWork;
									bestFoundBuildingToFireFromWorkers = thisWork.workers.length;
								}
							}
							if(bestFoundBuildingToFireFrom != null && bestFoundBuildingToFireFrom.workers.length > 0) {
								bestCitizen = bestFoundBuildingToFireFrom.workers[bestFoundBuildingToFireFrom.workers.length - 1];
								bestCitizen.loseJob(true);
								workersShortPerBuildingType[bestFoundBuildingToFireFrom.classID] += 1;
							} else {
								shardNoOptions[building[0].shardId] = true;
							}
						}
					} else if(this.availableClassesForJob.length > 0 && bestCitizen == null) {
						var bestFoundBuildingToFireFrom1 = null;
						var bestFoundBuildingToFireFromWorkers1 = 0;
						var _this = this.availableClassesForJob;
						var result = new Array(_this.length);
						var _g3 = 0;
						var _g11 = _this.length;
						while(_g3 < _g11) {
							var i = _g3++;
							result[i] = _this[i].classType;
						}
						var availableClassesForJobClasses = result;
						var _g4 = 0;
						var _g5 = this.city.workBuildings;
						while(_g4 < _g5.length) {
							var thisWork1 = _g5[_g4];
							++_g4;
							if(building[0].shardId == thisWork1.shardId && thisWork1.workers.length > bestFoundBuildingToFireFromWorkers1 && workersShortPerBuildingType[thisWork1.classID] < 0 && availableClassesForJobClasses.indexOf(thisWork1.classID) != -1) {
								bestFoundBuildingToFireFrom1 = thisWork1;
								bestFoundBuildingToFireFromWorkers1 = thisWork1.workers.length;
							}
						}
						if(bestFoundBuildingToFireFrom1 != null) {
							var _g6 = 0;
							var _g7 = this.availableClassesForJob.length;
							while(_g6 < _g7) {
								var i1 = _g6++;
								if(this.availableClassesForJob[i1].classType == building[0].classID) {
									this.availableClassesForJob[i1].number -= 1;
									if(this.availableClassesForJob[i1].number <= 0) {
										this.availableClassesForJob.splice(i1,1);
									}
									break;
								}
							}
							if(bestFoundBuildingToFireFrom1 != building[0]) {
								bestCitizen = bestFoundBuildingToFireFrom1.workers[bestFoundBuildingToFireFrom1.workers.length - 1];
								bestCitizen.loseJob(true);
								workersShortPerBuildingType[bestFoundBuildingToFireFrom1.classID] += 1;
							}
						}
					}
					if(bestCitizen != null) {
						anyJobHadResult = true;
						workersShortPerBuildingType[building[0].classID] -= 1;
						HxOverrides.remove(this.citizensWithoutJob,bestCitizen);
						building[0].workers.push(bestCitizen);
						bestCitizen.job = building[0];
						building[0].afterGiveJob(bestCitizen);
						if(bestCitizen.getShard() == building[0].shardId && (bestCitizen.home == null || !bestCitizen.home.is(buildings_HouseOfTheKeyFriends))) {
							bestCitizen.evictFromHome();
							var hasAssignedHome = false;
							if(building[0].is(buildings_House) && building[0].get_remainingCapacity() > 0) {
								var home = building[0];
								bestCitizen.home = home;
								home.residents.push(bestCitizen);
								hasAssignedHome = true;
							}
							if(bestCitizen.home == null || !hasAssignedHome && bestCitizen.home.get_hasPrivateTeleporter()) {
								this.simulation.houseAssigner.limitHouseAssignments--;
								if(this.simulation.houseAssigner.limitHouseAssignments > 0) {
									var _this1 = this.simulation.houseAssigner;
									var citizen = [bestCitizen];
									var _gthis = [_this1];
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
									if(citizen[0].home == null) {
										var newHome = null;
										if(simulation_HouseAssigner.privateTeleportersLeft[citizen[0].getShard()] > 0) {
											if(citizen[0].job != null) {
												var _this2 = _this1.simulation.permanentFinder;
												var citizen1 = citizen[0].job;
												var newHome1 = (function(building,isHouseWithCapacityOnReachableWorldFromBuildingOrTeleporter) {
													return function(pm) {
														return isHouseWithCapacityOnReachableWorldFromBuildingOrTeleporter[0](building[0],pm);
													};
												})([citizen[0].job],isHouseWithCapacityOnReachableWorldFromBuildingOrTeleporter);
												var getAttractiveness = (function() {
													return function(house) {
														if(house.is(buildings_Teleporter)) {
															return 100;
														} else {
															return house.get_baseAttractiveness() + house.bonusAttractiveness;
														}
													};
												})();
												newHome = _this2.query(citizen1,newHome1,getAttractiveness,null,99.999999);
											} else {
												var _this3 = _this1.city.permanents;
												var newHome2 = (function(c,isHouseWithCapacityOnReachableWorldOrTeleporter) {
													return function(pm) {
														return isHouseWithCapacityOnReachableWorldOrTeleporter[0](c[0],pm);
													};
												})([citizen[0]],isHouseWithCapacityOnReachableWorldOrTeleporter);
												var getAttractiveness1 = (function() {
													return function(house) {
														if(house.is(buildings_Teleporter)) {
															return 100;
														} else {
															return house.get_baseAttractiveness() + house.bonusAttractiveness;
														}
													};
												})();
												newHome = common_ArrayExtensions.whereMaxWithMax(_this3,newHome2,getAttractiveness1,99.999999);
											}
											if(newHome != null && newHome.is(buildings_Teleporter)) {
												newHome = Lambda.find(_this1.city.permanents,(function(citizen) {
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
												})(citizen));
											}
										} else if(citizen[0].job != null) {
											var _this4 = _this1.simulation.permanentFinder;
											var citizen2 = citizen[0].job;
											var newHome3 = (function(building,isHouseWithCapacityOnReachableWorldFromBuilding) {
												return function(pm) {
													return isHouseWithCapacityOnReachableWorldFromBuilding[0](building[0],pm);
												};
											})([citizen[0].job],isHouseWithCapacityOnReachableWorldFromBuilding);
											var getAttractiveness2 = (function() {
												return function(house) {
													return house.get_baseAttractiveness() + house.bonusAttractiveness;
												};
											})();
											newHome = _this4.query(citizen2,newHome3,getAttractiveness2,null,99.999999);
										} else {
											var _this5 = _this1.city.permanents;
											var newHome4 = (function(c,isHouseWithCapacityOnReachableWorld) {
												return function(pm) {
													return isHouseWithCapacityOnReachableWorld[0](c[0],pm);
												};
											})([citizen[0]],isHouseWithCapacityOnReachableWorld);
											var getAttractiveness3 = (function() {
												return function(house) {
													return house.get_baseAttractiveness() + house.bonusAttractiveness;
												};
											})();
											newHome = common_ArrayExtensions.whereMaxWithMax(_this5,newHome4,getAttractiveness3,99.999999);
										}
										if(newHome != null) {
											citizen[0].home = newHome;
											newHome.residents.push(citizen[0]);
											if(newHome.get_hasPrivateTeleporter()) {
												var tmp = simulation_HouseAssigner.privateTeleportersLeft;
												var tmp1 = citizen[0].getShard();
												tmp[tmp1]--;
											}
										}
									}
								} else {
									this.simulation.houseAssigner.shouldUpdateHouses = true;
								}
							}
						}
						if(this.citizensWithoutJob.length == 0 && !isHandlingPriorityJobs) {
							this.availableClassesForJob = [];
							return;
						}
						if(workersShortPerBuildingType[building[0].classID] <= 0) {
							--priorityJobShortTypes;
							if(priorityJobShortTypes <= 0) {
								isHandlingPriorityJobs = false;
								buildingsWithJobNeedSort = true;
								break;
							}
						}
					}
				}
				if(!anyJobHadResult && isHandlingPriorityJobs) {
					anyJobHadResult = true;
					isHandlingPriorityJobs = false;
					buildingsWithJobNeedSort = true;
				}
			}
			this.buildingsHaveWork = false;
			this.availableClassesForJob = [];
		}
	}
	,giveCitizenJob: function(citizen,work) {
		if(this.citizensWithoutJob.indexOf(citizen) != -1) {
			HxOverrides.remove(this.citizensWithoutJob,citizen);
		}
		work.workers.push(citizen);
		citizen.job = work;
		work.afterGiveJob(citizen);
	}
	,save: function(queue) {
		var value = Lambda.count(this.priorityJobs);
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var pj = haxe_ds_StringMap.keysIterator(this.priorityJobs.h);
		while(pj.hasNext()) {
			var pj1 = pj.next();
			queue.addString(pj1);
			var value = this.priorityJobs.h[pj1];
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
		}
	}
	,load: function(queue) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var num = intToRead;
		var _g = 0;
		var _g1 = num;
		while(_g < _g1) {
			var i = _g++;
			var key = queue.readString();
			var this1 = this.priorityJobs;
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var v = intToRead;
			this1.h[key] = v;
		}
	}
	,doStorySpecific: function() {
		if(this.city.progress.story.storyName == "cityofthekey") {
			this.priorityJobs.h["buildings.SecretSocietyHouse"] = 8;
		}
		if(this.city.progress.story.storyName == "hippiecommune") {
			this.priorityJobs.h["buildings.BlossomHippieHQ"] = 6;
		}
	}
	,__class__: simulation_JobAssigner
};
