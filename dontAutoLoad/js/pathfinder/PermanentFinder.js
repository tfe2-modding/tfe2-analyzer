var pathfinder_PermanentFinder = $hxClasses["pathfinder.PermanentFinder"] = function(city) {
	this.pfRelatedPrioritizable = null;
	this.pfSeen = null;
	this.buildingSpecialTransport = null;
	this.buildingAdjacentLast = null;
	this.buildingAdjacentIndex = null;
	this.buildingAdjacentDist = null;
	this.buildingAdjacent = null;
	this.pfSeenStart = 1;
	this.limitQueryAmountFor = 0;
	this.updateQueries = 0;
	this.pathQueue = new polygonal_ds_PriorityQueue(10,true);
	this.city = city;
	this.savedResults = new haxe_ds_StringMap();
};
pathfinder_PermanentFinder.__name__ = "pathfinder.PermanentFinder";
pathfinder_PermanentFinder.prototype = {
	preUpdate: function() {
		this.updateQueries = 0;
		if(this.limitQueryAmountFor > 0) {
			this.limitQueryAmountFor--;
		}
	}
	,requestQueryLimiting: function(strictInFirstUpdate) {
		if(strictInFirstUpdate == null) {
			strictInFirstUpdate = false;
		}
		this.limitQueryAmountFor = 120;
		if(strictInFirstUpdate) {
			this.updateQueries = 10;
		}
	}
	,canPerformQuery: function() {
		if(this.limitQueryAmountFor > 0) {
			return this.updateQueries < 10;
		} else {
			return true;
		}
	}
	,clearPFCache: function() {
		this.buildingAdjacent = null;
		this.buildingAdjacentDist = null;
		this.buildingAdjacentIndex = null;
		this.buildingAdjacentLast = null;
		this.buildingSpecialTransport = null;
	}
	,preProcessQuery: function() {
		this.buildingAdjacent = [];
		this.buildingAdjacentDist = [];
		this.buildingAdjacentIndex = [];
		this.buildingAdjacentLast = [];
		this.buildingSpecialTransport = [];
		this.pfSeen = [];
		this.pfRelatedPrioritizable = [];
		var cur = 0;
		var _g = 0;
		var _g1 = this.city.permanents.length;
		while(_g < _g1) {
			var i = _g++;
			var pm = this.city.permanents[i];
			this.buildingAdjacentIndex[i] = cur;
			if(pm.isBuilding) {
				var bld = pm;
				if(bld.leftBuilding != null) {
					this.buildingAdjacent.push(bld.leftBuilding.tempId);
					this.buildingAdjacentDist.push(20);
					++cur;
				} else {
					var bridgeLeft = this.city.miscCityElements.findSpecific(new common_Point(bld.position.x - 20,bld.position.y),miscCityElements_Bridge);
					if(bridgeLeft != null && bridgeLeft.leftBuilding != null && bridgeLeft.rightBuilding != null && bridgeLeft.get_humanCanWalkOn()) {
						this.buildingAdjacent.push(bridgeLeft.leftBuilding.tempId);
						this.buildingAdjacentDist.push(bridgeLeft.rightBuilding.position.x - bridgeLeft.leftBuilding.position.x);
						++cur;
					}
				}
				if(bld.rightBuilding != null) {
					this.buildingAdjacent.push(bld.rightBuilding.tempId);
					this.buildingAdjacentDist.push(20);
					++cur;
				} else {
					var bridgeRight = this.city.miscCityElements.findSpecific(new common_Point(bld.position.x + 20,bld.position.y),miscCityElements_Bridge);
					if(bridgeRight != null && bridgeRight.leftBuilding != null && bridgeRight.rightBuilding != null && bridgeRight.get_humanCanWalkOn()) {
						this.buildingAdjacent.push(bridgeRight.rightBuilding.tempId);
						this.buildingAdjacentDist.push(bridgeRight.rightBuilding.position.x - bridgeRight.leftBuilding.position.x);
						++cur;
					}
				}
				if(bld.topBuilding != null) {
					this.buildingAdjacent.push(bld.topBuilding.tempId);
					this.buildingAdjacentDist.push(20);
					++cur;
				}
				if(bld.bottomBuilding != null) {
					this.buildingAdjacent.push(bld.bottomBuilding.tempId);
					this.buildingAdjacentDist.push(20);
					++cur;
				}
			}
			this.buildingAdjacentLast[i] = cur;
			if(pm.is(buildings_Teleporter)) {
				this.buildingSpecialTransport.push(1);
			} else if(pm.is(buildings_LandingSite)) {
				this.buildingSpecialTransport.push(2);
			} else if(pm.is(buildings_HyperElevator)) {
				this.buildingSpecialTransport.push(3);
			} else if(pm.is(buildings_TrainStation)) {
				this.buildingSpecialTransport.push(4);
			} else {
				this.buildingSpecialTransport.push(0);
			}
			this.pfSeen.push(this.pfSeenStart);
			this.pfRelatedPrioritizable.push(null);
		}
	}
	,query: function(from,isGoal,goalNiceness,fromWorld,fromWorldX,maximumDistance,citizen,bestExpectedGoalNiceness) {
		if(bestExpectedGoalNiceness == null) {
			bestExpectedGoalNiceness = 100000000;
		}
		if(maximumDistance == null) {
			maximumDistance = -1;
		}
		var _gthis = this;
		if(this.buildingAdjacent == null) {
			this.preProcessQuery();
		}
		this.updateQueries += 1;
		this.pfSeenStart += 3;
		if(this.pfSeenStart > 100000) {
			this.pfSeenStart = 1;
		}
		if(from != null) {
			var newPrioritizable = pathfinder_PermanentPrioritizable.create(0,from.tempId);
			this.pfRelatedPrioritizable[from.tempId] = newPrioritizable;
			this.pathQueue.enqueue(newPrioritizable);
		} else {
			var _g = 0;
			var _g1 = fromWorld.permanents;
			while(_g < _g1.length) {
				var bottomPermanents = _g1[_g];
				++_g;
				if(bottomPermanents.length == 0 || bottomPermanents[0] == null) {
					continue;
				}
				var newPriority = Math.abs(bottomPermanents[0].position.x - fromWorldX);
				if(maximumDistance != -1 && newPriority > maximumDistance) {
					continue;
				}
				this.pfRelatedPrioritizable[bottomPermanents[0].tempId] = pathfinder_PermanentPrioritizable.create(newPriority,bottomPermanents[0].tempId);
				this.pathQueue.enqueue(this.pfRelatedPrioritizable[bottomPermanents[0].tempId]);
				this.pfSeen[bottomPermanents[0].tempId] = this.pfSeenStart;
			}
		}
		var maxNiceNess = -10000.0;
		var bestPermanent = null;
		var landingSiteGroups = this.city.connections.landingSiteGroups;
		var teleportersDone = !this.city.simulation.operatingCost.teleportersEnabled;
		var _g = [];
		var _g1 = 0;
		while(_g1 < landingSiteGroups.length) {
			var i = landingSiteGroups[_g1];
			++_g1;
			_g.push(false);
		}
		var landingSitesDone = _g;
		var privateTeleporter = -1;
		if(citizen != null && citizen.home != null) {
			privateTeleporter = citizen.home.get_hasPrivateTeleporter() ? citizen.home.tempId : null;
		}
		while(this.pathQueue.mSize != 0) {
			var currentQueueItem = this.pathQueue.dequeue();
			var currentPermanent = currentQueueItem.permanent;
			this.pfSeen[currentPermanent] = this.pfSeenStart + 1;
			if(isGoal(this.city.permanents[currentPermanent])) {
				if(goalNiceness != null) {
					var thisNiceness = goalNiceness(this.city.permanents[currentPermanent]);
					if(thisNiceness >= bestExpectedGoalNiceness) {
						bestPermanent = currentPermanent;
						break;
					}
					if(thisNiceness > maxNiceNess) {
						bestPermanent = currentPermanent;
						maxNiceNess = thisNiceness;
					}
				} else {
					while(this.pathQueue.mSize != 0) this.pathQueue.dequeue().destroy();
					bestPermanent = currentPermanent;
					break;
				}
			}
			var _g = this.buildingAdjacentIndex[currentPermanent];
			var _g1 = this.buildingAdjacentLast[currentPermanent];
			while(_g < _g1) {
				var connectionIndex = _g++;
				var permanentTo = this.buildingAdjacent[connectionIndex];
				var priorityAdd = this.buildingAdjacentDist[connectionIndex];
				if(permanentTo != null) {
					if(_gthis.pfSeen[permanentTo] == _gthis.pfSeenStart) {
						var relatedPrioritizable = _gthis.pfRelatedPrioritizable[permanentTo];
						var newPriority = currentQueueItem.priority + priorityAdd;
						if(newPriority < relatedPrioritizable.priority) {
							_gthis.pathQueue.reprioritize(relatedPrioritizable,newPriority);
						}
					} else if(_gthis.pfSeen[permanentTo] != _gthis.pfSeenStart + 1) {
						var newPriority1 = currentQueueItem.priority + priorityAdd;
						if(maximumDistance == -1 || newPriority1 <= maximumDistance) {
							_gthis.pfSeen[permanentTo] = _gthis.pfSeenStart;
							_gthis.pfRelatedPrioritizable[permanentTo] = pathfinder_PermanentPrioritizable.create(newPriority1,permanentTo);
							_gthis.pathQueue.enqueue(_gthis.pfRelatedPrioritizable[permanentTo]);
						}
					}
				}
			}
			var buildingSpecialTransport = this.buildingSpecialTransport[currentPermanent];
			var isPrivateTeleporter = privateTeleporter == currentPermanent;
			var canTeleportFromHere = buildingSpecialTransport == 1 || isPrivateTeleporter;
			if(canTeleportFromHere && !teleportersDone) {
				var rnd = random_Random.getFloat(2);
				var tp = 0;
				var len = this.city.teleporters.length;
				var invlen = 2 / len;
				var _g2 = 0;
				var _g3 = len;
				while(_g2 < _g3) {
					var tp1 = _g2++;
					var teleporter = this.city.teleporters[tp1];
					var permanentTo1 = teleporter.tempId;
					var priorityAdd1 = 9 + (rnd + tp1 * invlen) % 2.0;
					if(permanentTo1 != null) {
						if(_gthis.pfSeen[permanentTo1] == _gthis.pfSeenStart) {
							var relatedPrioritizable1 = _gthis.pfRelatedPrioritizable[permanentTo1];
							var newPriority2 = currentQueueItem.priority + priorityAdd1;
							if(newPriority2 < relatedPrioritizable1.priority) {
								_gthis.pathQueue.reprioritize(relatedPrioritizable1,newPriority2);
							}
						} else if(_gthis.pfSeen[permanentTo1] != _gthis.pfSeenStart + 1) {
							var newPriority3 = currentQueueItem.priority + priorityAdd1;
							if(maximumDistance == -1 || newPriority3 <= maximumDistance) {
								_gthis.pfSeen[permanentTo1] = _gthis.pfSeenStart;
								_gthis.pfRelatedPrioritizable[permanentTo1] = pathfinder_PermanentPrioritizable.create(newPriority3,permanentTo1);
								_gthis.pathQueue.enqueue(_gthis.pfRelatedPrioritizable[permanentTo1]);
							}
						}
					}
				}
				if(!isPrivateTeleporter && privateTeleporter != -1) {
					if(privateTeleporter != null) {
						if(_gthis.pfSeen[privateTeleporter] == _gthis.pfSeenStart) {
							var relatedPrioritizable2 = _gthis.pfRelatedPrioritizable[privateTeleporter];
							var newPriority4 = currentQueueItem.priority + 10;
							if(newPriority4 < relatedPrioritizable2.priority) {
								_gthis.pathQueue.reprioritize(relatedPrioritizable2,newPriority4);
							}
						} else if(_gthis.pfSeen[privateTeleporter] != _gthis.pfSeenStart + 1) {
							var newPriority5 = currentQueueItem.priority + 10;
							if(maximumDistance == -1 || newPriority5 <= maximumDistance) {
								_gthis.pfSeen[privateTeleporter] = _gthis.pfSeenStart;
								_gthis.pfRelatedPrioritizable[privateTeleporter] = pathfinder_PermanentPrioritizable.create(newPriority5,privateTeleporter);
								_gthis.pathQueue.enqueue(_gthis.pfRelatedPrioritizable[privateTeleporter]);
							}
						}
					}
				}
				teleportersDone = true;
			} else if(buildingSpecialTransport == 2 && !landingSitesDone[this.city.permanents[currentPermanent].landingSiteGroup]) {
				var thisGroup = this.city.permanents[currentPermanent].landingSiteGroup;
				var _g4 = 0;
				var _g5 = this.city.connections.landingSiteGroups[thisGroup];
				while(_g4 < _g5.length) {
					var landingSite = _g5[_g4];
					++_g4;
					var permanentTo2 = landingSite.tempId;
					var priorityAdd2 = landingSite.estimatedFlyingDistanceTo(this.city.permanents[currentPermanent]);
					if(permanentTo2 != null) {
						if(_gthis.pfSeen[permanentTo2] == _gthis.pfSeenStart) {
							var relatedPrioritizable3 = _gthis.pfRelatedPrioritizable[permanentTo2];
							var newPriority6 = currentQueueItem.priority + priorityAdd2;
							if(newPriority6 < relatedPrioritizable3.priority) {
								_gthis.pathQueue.reprioritize(relatedPrioritizable3,newPriority6);
							}
						} else if(_gthis.pfSeen[permanentTo2] != _gthis.pfSeenStart + 1) {
							var newPriority7 = currentQueueItem.priority + priorityAdd2;
							if(maximumDistance == -1 || newPriority7 <= maximumDistance) {
								_gthis.pfSeen[permanentTo2] = _gthis.pfSeenStart;
								_gthis.pfRelatedPrioritizable[permanentTo2] = pathfinder_PermanentPrioritizable.create(newPriority7,permanentTo2);
								_gthis.pathQueue.enqueue(_gthis.pfRelatedPrioritizable[permanentTo2]);
							}
						}
					}
				}
				landingSitesDone[thisGroup] = true;
			} else if(buildingSpecialTransport == 3 && !currentQueueItem.dontCheckElevators && this.pfSeen[currentPermanent] != 3) {
				var currentBuilding = this.city.permanents[currentPermanent];
				var _g6 = 0;
				var _g7 = this.city.connections.elevatorConnections.h[currentBuilding.world.__id__][currentBuilding.worldPosition.x];
				while(_g6 < _g7.length) {
					var elevator = _g7[_g6];
					++_g6;
					var permanentTo3 = elevator.tempId;
					var priorityAdd3 = Math.abs(elevator.worldPosition.y - currentBuilding.worldPosition.y);
					if(permanentTo3 != null) {
						if(_gthis.pfSeen[permanentTo3] == _gthis.pfSeenStart) {
							var relatedPrioritizable4 = _gthis.pfRelatedPrioritizable[permanentTo3];
							var newPriority8 = currentQueueItem.priority + priorityAdd3;
							if(newPriority8 < relatedPrioritizable4.priority) {
								_gthis.pathQueue.reprioritize(relatedPrioritizable4,newPriority8);
							}
						} else if(_gthis.pfSeen[permanentTo3] != _gthis.pfSeenStart + 1) {
							var newPriority9 = currentQueueItem.priority + priorityAdd3;
							if(maximumDistance == -1 || newPriority9 <= maximumDistance) {
								_gthis.pfSeen[permanentTo3] = _gthis.pfSeenStart;
								_gthis.pfRelatedPrioritizable[permanentTo3] = pathfinder_PermanentPrioritizable.create(newPriority9,permanentTo3);
								_gthis.pathQueue.enqueue(_gthis.pfRelatedPrioritizable[permanentTo3]);
							}
						}
					}
					if(this.pfRelatedPrioritizable[elevator.tempId] != null) {
						this.pfRelatedPrioritizable[elevator.tempId].dontCheckElevators = true;
					}
				}
			} else if(buildingSpecialTransport == 4) {
				var currentTrainStation = this.city.permanents[currentPermanent];
				if(currentTrainStation.leftTrainStation != null) {
					var permanentTo4 = currentTrainStation.leftTrainStation.tempId;
					var priorityAdd4 = Math.abs(currentTrainStation.position.x - currentTrainStation.leftTrainStation.position.x) / 4;
					if(permanentTo4 != null) {
						if(_gthis.pfSeen[permanentTo4] == _gthis.pfSeenStart) {
							var relatedPrioritizable5 = _gthis.pfRelatedPrioritizable[permanentTo4];
							var newPriority10 = currentQueueItem.priority + priorityAdd4;
							if(newPriority10 < relatedPrioritizable5.priority) {
								_gthis.pathQueue.reprioritize(relatedPrioritizable5,newPriority10);
							}
						} else if(_gthis.pfSeen[permanentTo4] != _gthis.pfSeenStart + 1) {
							var newPriority11 = currentQueueItem.priority + priorityAdd4;
							if(maximumDistance == -1 || newPriority11 <= maximumDistance) {
								_gthis.pfSeen[permanentTo4] = _gthis.pfSeenStart;
								_gthis.pfRelatedPrioritizable[permanentTo4] = pathfinder_PermanentPrioritizable.create(newPriority11,permanentTo4);
								_gthis.pathQueue.enqueue(_gthis.pfRelatedPrioritizable[permanentTo4]);
							}
						}
					}
				}
				if(currentTrainStation.rightTrainStation != null) {
					var permanentTo5 = currentTrainStation.rightTrainStation.tempId;
					var priorityAdd5 = Math.abs(currentTrainStation.position.x - currentTrainStation.rightTrainStation.position.x) / 4;
					if(permanentTo5 != null) {
						if(_gthis.pfSeen[permanentTo5] == _gthis.pfSeenStart) {
							var relatedPrioritizable6 = _gthis.pfRelatedPrioritizable[permanentTo5];
							var newPriority12 = currentQueueItem.priority + priorityAdd5;
							if(newPriority12 < relatedPrioritizable6.priority) {
								_gthis.pathQueue.reprioritize(relatedPrioritizable6,newPriority12);
							}
						} else if(_gthis.pfSeen[permanentTo5] != _gthis.pfSeenStart + 1) {
							var newPriority13 = currentQueueItem.priority + priorityAdd5;
							if(maximumDistance == -1 || newPriority13 <= maximumDistance) {
								_gthis.pfSeen[permanentTo5] = _gthis.pfSeenStart;
								_gthis.pfRelatedPrioritizable[permanentTo5] = pathfinder_PermanentPrioritizable.create(newPriority13,permanentTo5);
								_gthis.pathQueue.enqueue(_gthis.pfRelatedPrioritizable[permanentTo5]);
							}
						}
					}
				}
			}
			if(this.city.permanents[currentPermanent].worldPosition.y == 0) {
				var _g8 = 0;
				var _g9 = this.city.permanents[currentPermanent].world.permanents;
				while(_g8 < _g9.length) {
					var bottomPermanents = _g9[_g8];
					++_g8;
					if(bottomPermanents.length == 0 || bottomPermanents[0] == null) {
						continue;
					}
					var permanentTo6 = bottomPermanents[0].tempId;
					var priorityAdd6 = Math.abs(bottomPermanents[0].position.x - this.city.permanents[currentPermanent].position.x);
					if(permanentTo6 != null) {
						if(_gthis.pfSeen[permanentTo6] == _gthis.pfSeenStart) {
							var relatedPrioritizable7 = _gthis.pfRelatedPrioritizable[permanentTo6];
							var newPriority14 = currentQueueItem.priority + priorityAdd6;
							if(newPriority14 < relatedPrioritizable7.priority) {
								_gthis.pathQueue.reprioritize(relatedPrioritizable7,newPriority14);
							}
						} else if(_gthis.pfSeen[permanentTo6] != _gthis.pfSeenStart + 1) {
							var newPriority15 = currentQueueItem.priority + priorityAdd6;
							if(maximumDistance == -1 || newPriority15 <= maximumDistance) {
								_gthis.pfSeen[permanentTo6] = _gthis.pfSeenStart;
								_gthis.pfRelatedPrioritizable[permanentTo6] = pathfinder_PermanentPrioritizable.create(newPriority15,permanentTo6);
								_gthis.pathQueue.enqueue(_gthis.pfRelatedPrioritizable[permanentTo6]);
							}
						}
					}
				}
			}
			currentQueueItem.destroy();
		}
		return this.city.permanents[bestPermanent];
	}
	,queryForCitizen: function(citizen,isGoal,goalNiceness,maximumDistance,isQuickQuery) {
		if(isQuickQuery == null) {
			isQuickQuery = false;
		}
		if(maximumDistance == null) {
			maximumDistance = -1;
		}
		if(citizen.inPermanent != null) {
			return this.query(citizen.inPermanent,isGoal,goalNiceness,null,0,maximumDistance,isQuickQuery ? null : citizen);
		} else {
			return this.query(null,isGoal,goalNiceness,citizen.onWorld,citizen.relativeX,maximumDistance,isQuickQuery ? null : citizen);
		}
	}
	,quickQueryForCitizen: function(citizen,isGoal,queryKey,expiryHours,goalNiceness,maximumDistance) {
		if(maximumDistance == null) {
			maximumDistance = -1;
		}
		var time = this.city.simulation.time.timeSinceStart;
		var xInd;
		var yInd;
		if(citizen.inPermanent != null) {
			xInd = citizen.inPermanent.worldPosition.x;
			yInd = citizen.inPermanent.worldPosition.y / 5 | 0;
		} else {
			xInd = (citizen.relativeX | 0) / 20 | 0;
			yInd = 0;
		}
		var key = citizen.onWorld.rect.x + ";" + citizen.onWorld.rect.y + ";" + xInd + ";" + yInd + queryKey;
		var savedResult = this.savedResults.h[key];
		var permanentToReturn = null;
		if(savedResult != null) {
			if(time < savedResult.expiry) {
				permanentToReturn = savedResult.permanent;
			} else if(savedResult.permanent != null && isGoal(savedResult.permanent)) {
				savedResult.expiry += expiryHours * 60;
				permanentToReturn = savedResult.permanent;
			}
		}
		if(permanentToReturn == null) {
			var foundPermanent = this.queryForCitizen(citizen,isGoal,goalNiceness,maximumDistance,true);
			var v = { permanent : foundPermanent, expiry : time + expiryHours * 60};
			this.savedResults.h[key] = v;
			permanentToReturn = foundPermanent;
		}
		return permanentToReturn;
	}
	,invalidatePathfindingRelatedInfo: function() {
		this.savedResults = new haxe_ds_StringMap();
	}
	,__class__: pathfinder_PermanentFinder
};
