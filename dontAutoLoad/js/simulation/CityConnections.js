var simulation_CityConnections = $hxClasses["simulation.CityConnections"] = function(city) {
	this.city = city;
};
simulation_CityConnections.__name__ = "simulation.CityConnections";
simulation_CityConnections.prototype = {
	updateCityConnections: function() {
		var _gthis = this;
		this.city.simulation.flyingPathfinder.updateWaypoints();
		var worlds = this.city.worlds;
		var permanents = this.city.permanents;
		var worldsWithTeleporter = [];
		this.city.permanentsByPosition = null;
		var _g = 0;
		while(_g < permanents.length) {
			var permanent = permanents[_g];
			++_g;
			if(permanent.isBuilding) {
				permanent.leftBuilding = null;
				permanent.rightBuilding = null;
				permanent.topBuilding = null;
				permanent.bottomBuilding = null;
			}
		}
		this.elevatorConnections = new haxe_ds_ObjectMap();
		var _g = 0;
		while(_g < worlds.length) {
			var world = worlds[_g];
			++_g;
			var theseElevators = [];
			this.elevatorConnections.set(world,theseElevators);
			var _g1 = 0;
			var _g2 = world.permanents.length - 1;
			while(_g1 < _g2) {
				var i = _g1++;
				var permanentStack = world.permanents[i];
				var nextPermanentStack = world.permanents[i + 1];
				var _g3 = 0;
				var val1 = permanentStack.length;
				var val2 = nextPermanentStack.length;
				var _g4 = val2 < val1 ? val2 : val1;
				while(_g3 < _g4) {
					var j = _g3++;
					var thisPermanent = permanentStack[j];
					var nextPermanent = nextPermanentStack[j];
					if(thisPermanent != null && nextPermanent != null && thisPermanent.isBuilding && nextPermanent.isBuilding) {
						var thisBuilding = thisPermanent;
						var nextBuilding = nextPermanent;
						if(!thisBuilding.cannotBuildOnTop && !nextBuilding.cannotBuildOnTop) {
							thisBuilding.rightBuilding = nextBuilding;
							nextBuilding.leftBuilding = thisBuilding;
						}
					}
				}
			}
			var _g5 = 0;
			var _g6 = world.permanents;
			while(_g5 < _g6.length) {
				var permanentStack1 = _g6[_g5];
				++_g5;
				var stackElevators = [];
				theseElevators.push(stackElevators);
				var _g7 = 0;
				while(_g7 < permanentStack1.length) {
					var pm = permanentStack1[_g7];
					++_g7;
					if(pm != null && pm.is(buildings_HyperElevator)) {
						stackElevators.push(pm);
					}
				}
				var _g8 = 0;
				var _g9 = permanentStack1.length - 1;
				while(_g8 < _g9) {
					var i1 = _g8++;
					var thisPermanent1 = permanentStack1[i1];
					var nextPermanent1 = permanentStack1[i1 + 1];
					if(thisPermanent1 != null && nextPermanent1 != null && thisPermanent1.isBuilding && nextPermanent1.isBuilding && !thisPermanent1.isRooftopBuilding) {
						thisPermanent1.topBuilding = nextPermanent1;
						nextPermanent1.bottomBuilding = thisPermanent1;
					}
				}
			}
		}
		var _g = 0;
		var _g1 = this.city.teleporters;
		while(_g < _g1.length) {
			var teleporter = _g1[_g];
			++_g;
			if(worldsWithTeleporter.indexOf(teleporter.world) == -1) {
				worldsWithTeleporter.push(teleporter.world);
			}
		}
		var simulation = this.city.simulation;
		this.landingSiteGroups = [];
		var _g = 0;
		var _g1 = this.city.landingSites;
		while(_g < _g1.length) {
			var landingSite = _g1[_g];
			++_g;
			landingSite.landingSiteGroup = null;
		}
		var _g = 0;
		var _g1 = this.city.landingSites;
		while(_g < _g1.length) {
			var landingSite = _g1[_g];
			++_g;
			var addedToGroup = false;
			var otherLS = simulation.flyingPathfinder.findAnyOtherLandingSite(landingSite);
			if(otherLS != null) {
				addedToGroup = true;
				landingSite.landingSiteGroup = otherLS.landingSiteGroup;
				this.landingSiteGroups[otherLS.landingSiteGroup].push(landingSite);
			}
			if(!addedToGroup) {
				landingSite.landingSiteGroup = this.landingSiteGroups.length;
				this.landingSiteGroups.push([landingSite]);
			}
		}
		this.directWorldConnectionNumber = 0;
		var _g = 0;
		while(_g < worlds.length) {
			var world = worlds[_g];
			++_g;
			if(worldsWithTeleporter.indexOf(world) != -1) {
				world.reachableWorlds = worldsWithTeleporter;
			} else {
				world.reachableWorlds = [world];
			}
		}
		var _g = 0;
		var _g1 = this.landingSiteGroups;
		while(_g < _g1.length) {
			var landingSiteGroup = _g1[_g];
			++_g;
			var theseReachableWorlds = null;
			var _g2 = 0;
			while(_g2 < landingSiteGroup.length) {
				var ls = landingSiteGroup[_g2];
				++_g2;
				if(theseReachableWorlds == null) {
					theseReachableWorlds = ls.world.reachableWorlds;
				} else if(ls.world.reachableWorlds != theseReachableWorlds) {
					var _g3 = 0;
					var _g4 = ls.world.reachableWorlds;
					while(_g3 < _g4.length) {
						var w = _g4[_g3];
						++_g3;
						if(theseReachableWorlds.indexOf(w) == -1) {
							theseReachableWorlds.push(w);
						}
						w.reachableWorlds = theseReachableWorlds;
					}
					ls.world.reachableWorlds = theseReachableWorlds;
				}
			}
		}
		var _g = 0;
		var _g1 = this.city.miscCityElements.allMiscElements;
		while(_g < _g1.length) {
			var miscCityElement = _g1[_g];
			++_g;
			if(miscCityElement.is(miscCityElements_Bridge)) {
				var bridge = miscCityElement;
				if(bridge.leftBuilding != null && bridge.rightBuilding != null && bridge.leftBuilding.world != bridge.rightBuilding.world) {
					var leftWorld = bridge.leftBuilding.world;
					var rightWorld = bridge.rightBuilding.world;
					var theseReachableWorlds = leftWorld.reachableWorlds;
					if(rightWorld.reachableWorlds != theseReachableWorlds) {
						var _g2 = 0;
						var _g3 = rightWorld.reachableWorlds;
						while(_g2 < _g3.length) {
							var w = _g3[_g2];
							++_g2;
							if(theseReachableWorlds.indexOf(w) == -1) {
								theseReachableWorlds.push(w);
							}
							w.reachableWorlds = theseReachableWorlds;
						}
						rightWorld.reachableWorlds = theseReachableWorlds;
					}
				}
			}
		}
		var _g = 0;
		while(_g < worlds.length) {
			var world = [worlds[_g]];
			++_g;
			var hasWorldsCached = [world[0].relevantWorldsForDirectCityConnectionsCache != null];
			var arr = [hasWorldsCached[0] ? world[0].relevantWorldsForDirectCityConnectionsCache : worlds];
			if(!hasWorldsCached[0]) {
				world[0].relevantWorldsForDirectCityConnectionsCache = [];
			}
			var testPossibleConnection = (function(arr,hasWorldsCached,world) {
				return function(permanentStack,nonNullPosX,nextToDir) {
					if(nonNullPosX != null) {
						var _g = 0;
						while(_g < arr[0].length) {
							var otherWorld = arr[0][_g];
							++_g;
							if((otherWorld.rect.y > world[0].rect.y || otherWorld.rect.y == world[0].rect.y && otherWorld.rect.x > world[0].rect.x) && otherWorld.rect.x % 20 == world[0].rect.x % 20 && otherWorld.rect.y % 20 == world[0].rect.y % 20) {
								var otherPermanentStackX = ((nonNullPosX - otherWorld.rect.x) / 20 | 0) + nextToDir;
								if(otherPermanentStackX >= 0 && otherPermanentStackX < otherWorld.permanents.length) {
									if(!hasWorldsCached[0] && world[0].relevantWorldsForDirectCityConnectionsCache.indexOf(otherWorld) == -1) {
										world[0].relevantWorldsForDirectCityConnectionsCache.push(otherWorld);
									}
									var otherPermanentStack = otherWorld.permanents[otherPermanentStackX];
									var permanentHeightsBetweenWorlds = (otherWorld.rect.y - world[0].rect.y) / 20 | 0;
									if(otherPermanentStack.length > permanentHeightsBetweenWorlds) {
										var isAnyConnection = false;
										var _g1 = 0;
										var val1 = permanentStack.length;
										var val2 = otherPermanentStack.length - permanentHeightsBetweenWorlds;
										var _g2 = val2 < val1 ? val2 : val1;
										while(_g1 < _g2) {
											var i = _g1++;
											var thisPermanent = permanentStack[i];
											var otherPermanent = otherPermanentStack[i + permanentHeightsBetweenWorlds];
											if(thisPermanent != null && otherPermanent != null && thisPermanent.isBuilding && otherPermanent.isBuilding) {
												var thisBuilding = thisPermanent;
												var otherBuilding = otherPermanent;
												if(!thisBuilding.cannotBuildOnTop && !otherBuilding.cannotBuildOnTop) {
													if(nextToDir == 1) {
														thisBuilding.rightBuilding = otherBuilding;
														otherBuilding.leftBuilding = thisBuilding;
													} else {
														thisBuilding.leftBuilding = otherBuilding;
														otherBuilding.rightBuilding = thisBuilding;
													}
													isAnyConnection = true;
													_gthis.directWorldConnectionNumber += 2;
												}
											}
										}
										if(isAnyConnection) {
											var oldRWs = world[0].reachableWorlds;
											if(world[0].reachableWorlds != otherWorld.reachableWorlds) {
												world[0].reachableWorlds = otherWorld.reachableWorlds;
												var _g3 = 0;
												while(_g3 < oldRWs.length) {
													var w = oldRWs[_g3];
													++_g3;
													if(world[0].reachableWorlds.indexOf(w) == -1) {
														world[0].reachableWorlds.push(w);
													}
												}
											}
											var _g4 = 0;
											while(_g4 < worlds.length) {
												var world2 = worlds[_g4];
												++_g4;
												if(world2.reachableWorlds == oldRWs) {
													world2.reachableWorlds = world[0].reachableWorlds;
												}
											}
										}
									}
								}
							}
						}
					}
				};
			})(arr,hasWorldsCached,world);
			testPossibleConnection(world[0].permanents[0],world[0].rect.x,-1);
			testPossibleConnection(world[0].permanents[world[0].permanents.length - 1],world[0].rect.x + 20 * (world[0].permanents.length - 1),1);
		}
		var currentWorldGroup = 0;
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var world1 = _g1[_g];
			++_g;
			world1.worldGroup = null;
		}
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var world1 = _g1[_g];
			++_g;
			if(world1.worldGroup != null) {
				continue;
			}
			var haveTeleporter = false;
			if(worldsWithTeleporter.indexOf(world1) != -1) {
				haveTeleporter = true;
			}
			var _g2 = 0;
			var _g3 = world1.reachableWorlds;
			while(_g2 < _g3.length) {
				var world2 = _g3[_g2];
				++_g2;
				world2.worldGroup = currentWorldGroup;
				world2.hasTeleporterOnGroup = haveTeleporter;
			}
			++currentWorldGroup;
		}
		var _g = 0;
		var _g1 = this.city.permanents.length;
		while(_g < _g1) {
			var i = _g++;
			this.city.permanents[i].tempId = i;
		}
		this.floodFillPermanentGroups();
		this.numberOfWorldGroups = currentWorldGroup;
		if(this.city.builder != null) {
			this.city.builder.invalidateCache();
		}
	}
	,floodFillPermanentGroups: function() {
		var _g = [];
		var _g1 = 0;
		var _g2 = this.city.permanents.length;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(false);
		}
		var seen = _g;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.city.worlds.length;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(false);
		}
		var seenWorld = _g;
		var handledTeleporters = false;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.landingSiteGroups.length;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(false);
		}
		var handledLandingSite = _g;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.city.permanents.length;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(-1);
		}
		var leftPermanentViaBridge = _g;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.city.permanents.length;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(-1);
		}
		var rightPermanentViaBridge = _g;
		var _g = 0;
		var _g1 = this.city.worlds.length;
		while(_g < _g1) {
			var i = _g++;
			this.city.worlds[i].tempId = i;
			this.city.worlds[i].surfaceShardId = -1;
		}
		var shardId = 0;
		this.permanentsByShard = [];
		var _g = 0;
		var _g1 = this.city.miscCityElements.allMiscElements;
		while(_g < _g1.length) {
			var miscCityElement = _g1[_g];
			++_g;
			if(miscCityElement.is(miscCityElements_Bridge)) {
				var bridge = miscCityElement;
				if(bridge.leftBuilding != null && bridge.rightBuilding != null) {
					leftPermanentViaBridge[bridge.rightBuilding.tempId] = bridge.leftBuilding.tempId;
					rightPermanentViaBridge[bridge.leftBuilding.tempId] = bridge.rightBuilding.tempId;
				}
			}
		}
		var _g = 0;
		var _g1 = this.city.permanents.length;
		while(_g < _g1) {
			var i = _g++;
			if(seen[i]) {
				continue;
			}
			this.permanentsByShard[shardId] = [];
			var thisPermanent = this.city.permanents[i];
			seen[thisPermanent.tempId] = true;
			var permanentsToCheck = [thisPermanent];
			while(permanentsToCheck.length > 0) {
				var pm = permanentsToCheck.pop();
				pm.shardId = shardId;
				this.permanentsByShard[shardId].push(pm);
				if(pm.isBuilding) {
					var bld = pm;
					var thisBuilding = bld.leftBuilding;
					if(thisBuilding != null && !seen[thisBuilding.tempId]) {
						seen[thisBuilding.tempId] = true;
						permanentsToCheck.push(thisBuilding);
					}
					thisBuilding = bld.topBuilding;
					if(thisBuilding != null && !seen[thisBuilding.tempId]) {
						seen[thisBuilding.tempId] = true;
						permanentsToCheck.push(thisBuilding);
					}
					thisBuilding = bld.bottomBuilding;
					if(thisBuilding != null && !seen[thisBuilding.tempId]) {
						seen[thisBuilding.tempId] = true;
						permanentsToCheck.push(thisBuilding);
					}
					thisBuilding = bld.rightBuilding;
					if(thisBuilding != null && !seen[thisBuilding.tempId]) {
						seen[thisBuilding.tempId] = true;
						permanentsToCheck.push(thisBuilding);
					}
					var thisBuildingId = leftPermanentViaBridge[bld.tempId];
					thisBuilding = this.city.permanents[thisBuildingId];
					if(thisBuilding != null && !seen[thisBuilding.tempId]) {
						seen[thisBuilding.tempId] = true;
						permanentsToCheck.push(thisBuilding);
					}
					thisBuildingId = rightPermanentViaBridge[bld.tempId];
					thisBuilding = this.city.permanents[thisBuildingId];
					if(thisBuilding != null && !seen[thisBuilding.tempId]) {
						seen[thisBuilding.tempId] = true;
						permanentsToCheck.push(thisBuilding);
					}
					if(!handledTeleporters && pm.is(buildings_Teleporter)) {
						var _g2 = 0;
						var _g3 = this.city.teleporters;
						while(_g2 < _g3.length) {
							var tp = _g3[_g2];
							++_g2;
							if(!seen[tp.tempId]) {
								seen[tp.tempId] = true;
								permanentsToCheck.push(tp);
							}
						}
						handledTeleporters = true;
					}
					if(pm.is(buildings_LandingSite)) {
						var thisLandingSiteGroup = pm.landingSiteGroup;
						if(!handledLandingSite[thisLandingSiteGroup]) {
							var _g4 = 0;
							var _g5 = this.landingSiteGroups[thisLandingSiteGroup];
							while(_g4 < _g5.length) {
								var ls = _g5[_g4];
								++_g4;
								if(!seen[ls.tempId]) {
									seen[ls.tempId] = true;
									permanentsToCheck.push(ls);
								}
							}
							handledLandingSite[thisLandingSiteGroup] = true;
						}
					}
				}
				if(pm.worldPosition.y == 0 && !seenWorld[pm.world.tempId]) {
					seenWorld[pm.world.tempId] = true;
					pm.world.surfaceShardId = shardId;
					var _g6 = 0;
					var _g7 = pm.world.permanents;
					while(_g6 < _g7.length) {
						var pms = _g7[_g6];
						++_g6;
						if(pms.length > 0 && pms[0] != null && !seen[pms[0].tempId]) {
							seen[pms[0].tempId] = true;
							permanentsToCheck.push(pms[0]);
						}
					}
				}
			}
			++shardId;
		}
		var _g = 0;
		var _g1 = this.city.worlds.length;
		while(_g < _g1) {
			var i = _g++;
			if(this.city.worlds[i].surfaceShardId == -1) {
				this.city.worlds[i].surfaceShardId = shardId;
				this.permanentsByShard[shardId] = [];
				++shardId;
			}
		}
		this.numberOfShards = shardId;
	}
	,__class__: simulation_CityConnections
};
