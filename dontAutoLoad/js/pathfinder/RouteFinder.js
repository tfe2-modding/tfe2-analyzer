var pathfinder_RouteFinder = $hxClasses["pathfinder.RouteFinder"] = function(city) {
	this.city = city;
	this.prev = new haxe_ds_IntMap();
};
pathfinder_RouteFinder.__name__ = "pathfinder.RouteFinder";
pathfinder_RouteFinder.prototype = {
	query: function(from,isGoal,goalNiceness,fromWorld,fromWorldX,maximumDistance,citizen,bestExpectedGoalNiceness) {
		if(bestExpectedGoalNiceness == null) {
			bestExpectedGoalNiceness = 100000000;
		}
		if(maximumDistance == null) {
			maximumDistance = -1;
		}
		var _gthis = this;
		var pathQueue = new polygonal_ds_PriorityQueue(10,true);
		var permanentFinder = this.city.simulation.permanentFinder;
		if(permanentFinder.buildingAdjacent == null) {
			permanentFinder.preProcessQuery();
		}
		var buildingAdjacent = permanentFinder.buildingAdjacent;
		var buildingAdjacentDist = permanentFinder.buildingAdjacentDist;
		var buildingAdjacentIndex = permanentFinder.buildingAdjacentIndex;
		var buildingAdjacentLast = permanentFinder.buildingAdjacentLast;
		var buildingSpecialTransport = permanentFinder.buildingSpecialTransport;
		var pfSeen = permanentFinder.pfSeen;
		var pfRelatedPrioritizable = permanentFinder.pfRelatedPrioritizable;
		permanentFinder.pfSeenStart += 3;
		if(permanentFinder.pfSeenStart > 100000) {
			permanentFinder.pfSeenStart = 1;
		}
		if(from != null) {
			var newPrioritizable = pathfinder_PermanentPrioritizable.create(0,from.tempId);
			pfRelatedPrioritizable[from.tempId] = newPrioritizable;
			pathQueue.enqueue(newPrioritizable);
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
				pfRelatedPrioritizable[bottomPermanents[0].tempId] = pathfinder_PermanentPrioritizable.create(newPriority,bottomPermanents[0].tempId);
				pathQueue.enqueue(pfRelatedPrioritizable[bottomPermanents[0].tempId]);
				pfSeen[bottomPermanents[0].tempId] = permanentFinder.pfSeenStart;
			}
		}
		var maxNiceNess = -10000.0;
		var bestPermanent = null;
		var landingSiteGroups = this.city.connections.landingSiteGroups;
		var teleportersDone = !this.city.simulation.operatingCost.teleportersEnabled;
		var maxLandingSiteCheck = 5;
		var _g = [];
		var _g1 = 0;
		while(_g1 < landingSiteGroups.length) {
			var i = landingSiteGroups[_g1];
			++_g1;
			_g.push(0);
		}
		var landingSitesDone = _g;
		var privateTeleporter = -1;
		if(citizen != null && citizen.home != null) {
			privateTeleporter = citizen.home.get_hasPrivateTeleporter() ? citizen.home.tempId : null;
		}
		while(pathQueue.mSize != 0) {
			var currentQueueItem = pathQueue.dequeue();
			var currentPermanent = currentQueueItem.permanent;
			pfSeen[currentPermanent] = permanentFinder.pfSeenStart + 1;
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
					while(pathQueue.mSize != 0) pathQueue.dequeue().destroy();
					bestPermanent = currentPermanent;
					break;
				}
			}
			var _g = buildingAdjacentIndex[currentPermanent];
			var _g1 = buildingAdjacentLast[currentPermanent];
			while(_g < _g1) {
				var connectionIndex = _g++;
				var permanentTo = buildingAdjacent[connectionIndex];
				var priorityAdd = buildingAdjacentDist[connectionIndex];
				if(permanentTo != null) {
					if(pfSeen[permanentTo] == permanentFinder.pfSeenStart) {
						var relatedPrioritizable = pfRelatedPrioritizable[permanentTo];
						var newPriority = currentQueueItem.priority + priorityAdd;
						if(newPriority < relatedPrioritizable.priority) {
							pathQueue.reprioritize(relatedPrioritizable,newPriority);
							_gthis.prev.h[permanentTo] = currentPermanent;
						}
					} else if(pfSeen[permanentTo] != permanentFinder.pfSeenStart + 1) {
						var newPriority1 = currentQueueItem.priority + priorityAdd;
						if(maximumDistance == -1 || newPriority1 <= maximumDistance) {
							pfSeen[permanentTo] = permanentFinder.pfSeenStart;
							pfRelatedPrioritizable[permanentTo] = pathfinder_PermanentPrioritizable.create(newPriority1,permanentTo);
							pathQueue.enqueue(pfRelatedPrioritizable[permanentTo]);
							_gthis.prev.h[permanentTo] = currentPermanent;
						}
					}
				}
			}
			var buildingSpecialTransport1 = buildingSpecialTransport[currentPermanent];
			var isPrivateTeleporter = privateTeleporter == currentPermanent;
			var canTeleportFromHere = buildingSpecialTransport1 == 1 || isPrivateTeleporter;
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
						if(pfSeen[permanentTo1] == permanentFinder.pfSeenStart) {
							var relatedPrioritizable1 = pfRelatedPrioritizable[permanentTo1];
							var newPriority2 = currentQueueItem.priority + priorityAdd1;
							if(newPriority2 < relatedPrioritizable1.priority) {
								pathQueue.reprioritize(relatedPrioritizable1,newPriority2);
								_gthis.prev.h[permanentTo1] = currentPermanent;
							}
						} else if(pfSeen[permanentTo1] != permanentFinder.pfSeenStart + 1) {
							var newPriority3 = currentQueueItem.priority + priorityAdd1;
							if(maximumDistance == -1 || newPriority3 <= maximumDistance) {
								pfSeen[permanentTo1] = permanentFinder.pfSeenStart;
								pfRelatedPrioritizable[permanentTo1] = pathfinder_PermanentPrioritizable.create(newPriority3,permanentTo1);
								pathQueue.enqueue(pfRelatedPrioritizable[permanentTo1]);
								_gthis.prev.h[permanentTo1] = currentPermanent;
							}
						}
					}
				}
				if(!isPrivateTeleporter && privateTeleporter != -1) {
					if(privateTeleporter != null) {
						if(pfSeen[privateTeleporter] == permanentFinder.pfSeenStart) {
							var relatedPrioritizable2 = pfRelatedPrioritizable[privateTeleporter];
							var newPriority4 = currentQueueItem.priority + 10;
							if(newPriority4 < relatedPrioritizable2.priority) {
								pathQueue.reprioritize(relatedPrioritizable2,newPriority4);
								_gthis.prev.h[privateTeleporter] = currentPermanent;
							}
						} else if(pfSeen[privateTeleporter] != permanentFinder.pfSeenStart + 1) {
							var newPriority5 = currentQueueItem.priority + 10;
							if(maximumDistance == -1 || newPriority5 <= maximumDistance) {
								pfSeen[privateTeleporter] = permanentFinder.pfSeenStart;
								pfRelatedPrioritizable[privateTeleporter] = pathfinder_PermanentPrioritizable.create(newPriority5,privateTeleporter);
								pathQueue.enqueue(pfRelatedPrioritizable[privateTeleporter]);
								_gthis.prev.h[privateTeleporter] = currentPermanent;
							}
						}
					}
				}
				teleportersDone = true;
			} else if(buildingSpecialTransport1 == 2 && landingSitesDone[this.city.permanents[currentPermanent].landingSiteGroup] < maxLandingSiteCheck) {
				var thisGroup = this.city.permanents[currentPermanent].landingSiteGroup;
				var _g4 = 0;
				var _g5 = this.city.connections.landingSiteGroups[thisGroup];
				while(_g4 < _g5.length) {
					var landingSite = _g5[_g4];
					++_g4;
					var permanentTo2 = landingSite.tempId;
					var priorityAdd2 = landingSite.estimatedFlyingDistanceTo(this.city.permanents[currentPermanent]);
					if(permanentTo2 != null) {
						if(pfSeen[permanentTo2] == permanentFinder.pfSeenStart) {
							var relatedPrioritizable3 = pfRelatedPrioritizable[permanentTo2];
							var newPriority6 = currentQueueItem.priority + priorityAdd2;
							if(newPriority6 < relatedPrioritizable3.priority) {
								pathQueue.reprioritize(relatedPrioritizable3,newPriority6);
								_gthis.prev.h[permanentTo2] = currentPermanent;
							}
						} else if(pfSeen[permanentTo2] != permanentFinder.pfSeenStart + 1) {
							var newPriority7 = currentQueueItem.priority + priorityAdd2;
							if(maximumDistance == -1 || newPriority7 <= maximumDistance) {
								pfSeen[permanentTo2] = permanentFinder.pfSeenStart;
								pfRelatedPrioritizable[permanentTo2] = pathfinder_PermanentPrioritizable.create(newPriority7,permanentTo2);
								pathQueue.enqueue(pfRelatedPrioritizable[permanentTo2]);
								_gthis.prev.h[permanentTo2] = currentPermanent;
							}
						}
					}
				}
				landingSitesDone[thisGroup]++;
			} else if(buildingSpecialTransport1 == 3 && !currentQueueItem.dontCheckElevators && pfSeen[currentPermanent] != 3) {
				var currentBuilding = this.city.permanents[currentPermanent];
				var _g6 = 0;
				var _g7 = this.city.connections.elevatorConnections.h[currentBuilding.world.__id__][currentBuilding.worldPosition.x];
				while(_g6 < _g7.length) {
					var elevator = _g7[_g6];
					++_g6;
					var permanentTo3 = elevator.tempId;
					var priorityAdd3 = Math.abs(elevator.worldPosition.y - currentBuilding.worldPosition.y);
					if(permanentTo3 != null) {
						if(pfSeen[permanentTo3] == permanentFinder.pfSeenStart) {
							var relatedPrioritizable4 = pfRelatedPrioritizable[permanentTo3];
							var newPriority8 = currentQueueItem.priority + priorityAdd3;
							if(newPriority8 < relatedPrioritizable4.priority) {
								pathQueue.reprioritize(relatedPrioritizable4,newPriority8);
								_gthis.prev.h[permanentTo3] = currentPermanent;
							}
						} else if(pfSeen[permanentTo3] != permanentFinder.pfSeenStart + 1) {
							var newPriority9 = currentQueueItem.priority + priorityAdd3;
							if(maximumDistance == -1 || newPriority9 <= maximumDistance) {
								pfSeen[permanentTo3] = permanentFinder.pfSeenStart;
								pfRelatedPrioritizable[permanentTo3] = pathfinder_PermanentPrioritizable.create(newPriority9,permanentTo3);
								pathQueue.enqueue(pfRelatedPrioritizable[permanentTo3]);
								_gthis.prev.h[permanentTo3] = currentPermanent;
							}
						}
					}
					if(pfRelatedPrioritizable[elevator.tempId] != null) {
						pfRelatedPrioritizable[elevator.tempId].dontCheckElevators = true;
					}
				}
			} else if(buildingSpecialTransport1 == 4) {
				var currentTrainStation = this.city.permanents[currentPermanent];
				if(currentTrainStation.leftTrainStation != null) {
					var permanentTo4 = currentTrainStation.leftTrainStation.tempId;
					var priorityAdd4 = Math.abs(currentTrainStation.position.x - currentTrainStation.leftTrainStation.position.x) / 4;
					if(permanentTo4 != null) {
						if(pfSeen[permanentTo4] == permanentFinder.pfSeenStart) {
							var relatedPrioritizable5 = pfRelatedPrioritizable[permanentTo4];
							var newPriority10 = currentQueueItem.priority + priorityAdd4;
							if(newPriority10 < relatedPrioritizable5.priority) {
								pathQueue.reprioritize(relatedPrioritizable5,newPriority10);
								_gthis.prev.h[permanentTo4] = currentPermanent;
							}
						} else if(pfSeen[permanentTo4] != permanentFinder.pfSeenStart + 1) {
							var newPriority11 = currentQueueItem.priority + priorityAdd4;
							if(maximumDistance == -1 || newPriority11 <= maximumDistance) {
								pfSeen[permanentTo4] = permanentFinder.pfSeenStart;
								pfRelatedPrioritizable[permanentTo4] = pathfinder_PermanentPrioritizable.create(newPriority11,permanentTo4);
								pathQueue.enqueue(pfRelatedPrioritizable[permanentTo4]);
								_gthis.prev.h[permanentTo4] = currentPermanent;
							}
						}
					}
				}
				if(currentTrainStation.rightTrainStation != null) {
					var permanentTo5 = currentTrainStation.rightTrainStation.tempId;
					var priorityAdd5 = Math.abs(currentTrainStation.position.x - currentTrainStation.rightTrainStation.position.x) / 4;
					if(permanentTo5 != null) {
						if(pfSeen[permanentTo5] == permanentFinder.pfSeenStart) {
							var relatedPrioritizable6 = pfRelatedPrioritizable[permanentTo5];
							var newPriority12 = currentQueueItem.priority + priorityAdd5;
							if(newPriority12 < relatedPrioritizable6.priority) {
								pathQueue.reprioritize(relatedPrioritizable6,newPriority12);
								_gthis.prev.h[permanentTo5] = currentPermanent;
							}
						} else if(pfSeen[permanentTo5] != permanentFinder.pfSeenStart + 1) {
							var newPriority13 = currentQueueItem.priority + priorityAdd5;
							if(maximumDistance == -1 || newPriority13 <= maximumDistance) {
								pfSeen[permanentTo5] = permanentFinder.pfSeenStart;
								pfRelatedPrioritizable[permanentTo5] = pathfinder_PermanentPrioritizable.create(newPriority13,permanentTo5);
								pathQueue.enqueue(pfRelatedPrioritizable[permanentTo5]);
								_gthis.prev.h[permanentTo5] = currentPermanent;
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
						if(pfSeen[permanentTo6] == permanentFinder.pfSeenStart) {
							var relatedPrioritizable7 = pfRelatedPrioritizable[permanentTo6];
							var newPriority14 = currentQueueItem.priority + priorityAdd6;
							if(newPriority14 < relatedPrioritizable7.priority) {
								pathQueue.reprioritize(relatedPrioritizable7,newPriority14);
								_gthis.prev.h[permanentTo6] = currentPermanent;
							}
						} else if(pfSeen[permanentTo6] != permanentFinder.pfSeenStart + 1) {
							var newPriority15 = currentQueueItem.priority + priorityAdd6;
							if(maximumDistance == -1 || newPriority15 <= maximumDistance) {
								pfSeen[permanentTo6] = permanentFinder.pfSeenStart;
								pfRelatedPrioritizable[permanentTo6] = pathfinder_PermanentPrioritizable.create(newPriority15,permanentTo6);
								pathQueue.enqueue(pfRelatedPrioritizable[permanentTo6]);
								_gthis.prev.h[permanentTo6] = currentPermanent;
							}
						}
					}
				}
			}
			currentQueueItem.destroy();
		}
		if(bestPermanent != null) {
			var foundPermanents = [];
			var cur = bestPermanent;
			while(cur != from.tempId) {
				foundPermanents.push(this.city.permanents[cur]);
				cur = this.prev.h[cur];
			}
			foundPermanents.push(from);
			return foundPermanents;
		} else {
			return [];
		}
	}
	,__class__: pathfinder_RouteFinder
};
