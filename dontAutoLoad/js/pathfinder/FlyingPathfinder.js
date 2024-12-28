var pathfinder_FlyingPathfinder = $hxClasses["pathfinder.FlyingPathfinder"] = function(city) {
	this.gridIStart = 0;
	this.city = city;
	this.allWaypoints = [];
	this.highestYPositions = [];
};
pathfinder_FlyingPathfinder.__name__ = "pathfinder.FlyingPathfinder";
pathfinder_FlyingPathfinder.prototype = {
	updateWaypoints: function() {
		this.allWaypoints = [];
		var obstructions = [];
		var gridxstart = 0;
		var gridxmax = 20;
		if(this.city.worlds.length > 0) {
			gridxstart = common_ArrayExtensions.min(this.city.worlds,function(w) {
				return w.rect.x;
			}).rect.x - 40;
			gridxmax = common_ArrayExtensions.max(this.city.worlds,function(w) {
				return w.rect.get_x2();
			}).rect.get_x2() + 40;
		}
		var sortedWorlds = [];
		sortedWorlds = this.city.worlds.slice();
		sortedWorlds.sort(function(w1,w2) {
			return w1.rect.y - w2.rect.y;
		});
		var istart = gridxstart / 20 | 0;
		this.gridIStart = istart;
		var obstructionsLength = (gridxmax / 20 | 0) - istart + 1;
		var _g = [];
		var _g1 = 0;
		var _g2 = obstructionsLength;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push([]);
		}
		var landingSites = _g;
		var _g = 0;
		var _g1 = this.city.landingSites;
		while(_g < _g1.length) {
			var landingSite = _g1[_g];
			++_g;
			landingSites[(landingSite.position.x / 20 | 0) - istart].push(landingSite);
		}
		var _g = 0;
		var _g1 = obstructionsLength;
		while(_g < _g1) {
			var i = _g++;
			var x = (i + istart) * 20;
			obstructions.push([]);
			var _g2 = 0;
			while(_g2 < sortedWorlds.length) {
				var world = sortedWorlds[_g2];
				++_g2;
				var lower = world.rect.x;
				var upper = world.rect.get_x2();
				if(x >= lower && x < upper) {
					var worldRelativeIndex = (x - world.rect.x) / 20 | 0;
					var maxY = null;
					if(world.mask != null) {
						var thisMask = world.mask[worldRelativeIndex];
						var _g3 = 0;
						var _g4 = thisMask.length;
						while(_g3 < _g4) {
							var j = _g3++;
							if(thisMask[j]) {
								maxY = j;
							}
						}
					}
					var startY = [world.rect.y - world.permanents[worldRelativeIndex].length * 20];
					var pm = world.permanents[worldRelativeIndex].length;
					var hole = false;
					var topBuilding = world.permanents[worldRelativeIndex][pm - 1];
					var topWasLandingSite = topBuilding != null && topBuilding.is(buildings_LandingSite);
					while(--pm >= 0) {
						var thisPermanent = world.permanents[worldRelativeIndex][pm];
						if(thisPermanent == null || thisPermanent.is(buildings_LandingSiteTunnel) || thisPermanent.is(buildings_SpaceShipTunnel)) {
							if(!hole) {
								if(pm != world.permanents[worldRelativeIndex].length - 1) {
									var endY = world.rect.y - (pm + 1) * 20;
									var nextRelevantObstruction = obstructions[i][obstructions[i].length - 1];
									if(topWasLandingSite) {
										startY[0] += 20;
									}
									if(obstructions[i].length == 0 || startY[0] > nextRelevantObstruction) {
										obstructions[i].push(startY[0]);
										obstructions[i].push(endY);
									} else {
										obstructions[i][obstructions[i].length - 1] = endY;
									}
								}
								hole = true;
							}
						} else if(hole) {
							startY[0] = world.rect.y - (pm + 1) * 20;
							hole = false;
							topWasLandingSite = thisPermanent.is(buildings_LandingSite);
						}
					}
					if(hole) {
						startY[0] = world.rect.y;
						hole = false;
					}
					if(maxY != null) {
						var endY1 = (maxY + 1) * 20 + world.rect.y;
						var nextRelevantObstruction1 = obstructions[i][obstructions[i].length - 1];
						if(common_ArrayExtensions.any(landingSites[i],(function(startY) {
							return function(ls) {
								return ls.position.y == startY[0];
							};
						})(startY))) {
							startY[0] += 20;
						}
						if(obstructions[i].length == 0 || startY[0] > nextRelevantObstruction1) {
							obstructions[i].push(startY[0]);
							obstructions[i].push(endY1);
						} else {
							obstructions[i][obstructions[i].length - 1] = endY1;
						}
					}
				}
			}
		}
		var previousPathfindingWaypoints = new haxe_ds_IntMap();
		var prevWayPoints = [];
		this.highestYPositions = [];
		var _g = 1;
		var _g1 = (gridxmax / 20 | 0) - istart;
		while(_g < _g1) {
			var i = _g++;
			var x = (i + istart) * 20;
			var wayPoints = [];
			var obstructionsLength = obstructions[i].length / 2 | 0;
			var nextObstructions = [obstructions[i + 1]];
			var prevWPNum = 0;
			var k = 0;
			var thesePathfindingWaypoints = new haxe_ds_IntMap();
			var _g2 = 0;
			var _g3 = obstructionsLength + 1;
			while(_g2 < _g3) {
				var j = _g2++;
				var theseWaypoints = [[]];
				var yfrom = [-1000000];
				var yto = [1000000];
				if(obstructionsLength != 0) {
					if(j == 0) {
						yto[0] = obstructions[i][0];
					} else if(j == obstructionsLength) {
						yfrom[0] = obstructions[i][obstructionsLength * 2 - 1];
					} else {
						yfrom[0] = obstructions[i][j * 2 - 1];
						yto[0] = obstructions[i][j * 2];
					}
				}
				if(j == 0) {
					this.highestYPositions.push(obstructionsLength == 0 ? -1000000 : yto[0]);
				}
				var addNextWaypointToAvoidBlockers = (function(yto,yfrom,theseWaypoints,nextObstructions) {
					return function(wp) {
						var b = 0;
						var blockerFrom = -1;
						var blockerTo = -1;
						while(b < nextObstructions[0].length) {
							if(wp >= nextObstructions[0][b] && wp < nextObstructions[0][b + 1]) {
								blockerFrom = nextObstructions[0][b];
								blockerTo = nextObstructions[0][b + 1];
								break;
							}
							if(nextObstructions[0][b] > wp) {
								break;
							}
							b += 2;
						}
						if(blockerFrom != -1) {
							if(blockerFrom > yfrom[0]) {
								theseWaypoints[0].push(blockerFrom - 20);
							} else if(blockerTo < yto[0]) {
								theseWaypoints[0].push(blockerTo);
							}
						}
					};
				})(yto,yfrom,theseWaypoints,nextObstructions);
				while(k < nextObstructions[0].length) {
					if(nextObstructions[0][k] > yfrom[0] && nextObstructions[0][k + 1] < yto[0]) {
						theseWaypoints[0].push(nextObstructions[0][k] - 20);
						theseWaypoints[0].push(nextObstructions[0][k + 1]);
					} else if(nextObstructions[0][k] > yfrom[0]) {
						break;
					}
					k += 2;
				}
				while(prevWPNum < prevWayPoints.length) {
					var wp = prevWayPoints[prevWPNum];
					if(wp >= yfrom[0] && wp < yto[0]) {
						theseWaypoints[0].push(wp);
						addNextWaypointToAvoidBlockers(wp);
					} else if(wp >= yfrom[0]) {
						break;
					}
					++prevWPNum;
				}
				var _g4 = 0;
				var _g5 = landingSites[i];
				while(_g4 < _g5.length) {
					var landingSite = _g5[_g4];
					++_g4;
					if(landingSite.position.y >= yfrom[0] && landingSite.position.y <= yto[0] - 20) {
						theseWaypoints[0].push(landingSite.position.y);
						addNextWaypointToAvoidBlockers(landingSite.position.y);
					}
				}
				theseWaypoints[0].sort((function() {
					return function(wp1,wp2) {
						return wp1 - wp2;
					};
				})());
				var prevWaypoint = null;
				var j1 = theseWaypoints[0].length;
				while(--j1 >= 0) {
					if(theseWaypoints[0][j1] == prevWaypoint) {
						theseWaypoints[0].splice(j1,1);
					}
					prevWaypoint = theseWaypoints[0][j1];
				}
				var prevwp = null;
				var _g6 = 0;
				while(_g6 < theseWaypoints[0].length) {
					var wp1 = theseWaypoints[0][_g6];
					++_g6;
					wayPoints.push(wp1);
					var pathfindingWaypoint = new pathfinder_FlyingPathfinderWaypoint(x,wp1);
					if(prevwp != null) {
						prevwp.connections.push(pathfindingWaypoint);
						pathfindingWaypoint.connections.push(prevwp);
					}
					if(previousPathfindingWaypoints.h.hasOwnProperty(wp1)) {
						var connectToPrevious = previousPathfindingWaypoints.h[wp1];
						connectToPrevious.connections.push(pathfindingWaypoint);
						pathfindingWaypoint.connections.push(connectToPrevious);
					}
					thesePathfindingWaypoints.h[wp1] = pathfindingWaypoint;
					this.allWaypoints.push(pathfindingWaypoint);
					prevwp = pathfindingWaypoint;
				}
			}
			var _g7 = 0;
			var _g8 = landingSites[i];
			while(_g7 < _g8.length) {
				var landingSite1 = [_g8[_g7]];
				++_g7;
				var tmp = (function(landingSite) {
					return function(wp) {
						return wp.y == landingSite[0].position.y;
					};
				})(landingSite1);
				landingSite1[0].connectedWaypoint = Lambda.find(thesePathfindingWaypoints,tmp);
				if(landingSite1[0].connectedWaypoint != null) {
					landingSite1[0].connectedWaypoint.connectedSite = landingSite1[0];
				}
			}
			prevWayPoints = wayPoints;
			previousPathfindingWaypoints = thesePathfindingWaypoints;
		}
	}
	,findRoute: function(from,to) {
		if(from.connectedWaypoint == null || to.connectedWaypoint == null) {
			console.log("FloatingSpaceCities/pathfinder/FlyingPathfinder.hx:304:","problem while finding an air route from:");
			console.log("FloatingSpaceCities/pathfinder/FlyingPathfinder.hx:305:",from);
			console.log("FloatingSpaceCities/pathfinder/FlyingPathfinder.hx:306:","to:");
			console.log("FloatingSpaceCities/pathfinder/FlyingPathfinder.hx:307:",to);
			console.log("FloatingSpaceCities/pathfinder/FlyingPathfinder.hx:308:","If you're an end user, please report this problem. The game should continue normally now, but saving+loading the game may help if you do encounter further pathfinding problems.");
			return null;
		}
		var _g = 0;
		var _g1 = this.allWaypoints;
		while(_g < _g1.length) {
			var wp = _g1[_g];
			++_g;
			wp.seen = 0;
		}
		var pathQueue = new polygonal_ds_PriorityQueue(null,true);
		var start = from.connectedWaypoint;
		start.priority = 0;
		pathQueue.enqueue(start);
		var goal = to.connectedWaypoint;
		while(pathQueue.mSize != 0) {
			var currentWaypoint = pathQueue.dequeue();
			currentWaypoint.seen = 2;
			if(currentWaypoint == goal) {
				var path = [];
				while(currentWaypoint != start) {
					path.push(currentWaypoint);
					currentWaypoint = currentWaypoint.prevWaypoint;
				}
				path.push(start);
				return path;
			}
			var _g = 0;
			var _g1 = currentWaypoint.connections;
			while(_g < _g1.length) {
				var connection = _g1[_g];
				++_g;
				switch(connection.seen) {
				case 0:
					connection.seen = 1;
					connection.prevWaypoint = currentWaypoint;
					connection.priority = currentWaypoint.priority + (Math.abs(currentWaypoint.x - connection.x) + Math.abs(currentWaypoint.y - connection.y));
					pathQueue.enqueue(connection);
					break;
				case 1:
					var newPriority = currentWaypoint.priority + (Math.abs(currentWaypoint.x - connection.x) + Math.abs(currentWaypoint.y - connection.y));
					if(newPriority < connection.priority) {
						connection.prevWaypoint = currentWaypoint;
						pathQueue.reprioritize(connection,newPriority);
					}
					break;
				}
			}
		}
		return null;
	}
	,findAnyOtherLandingSite: function(from) {
		if(from.connectedWaypoint == null) {
			return null;
		}
		var _g = 0;
		var _g1 = this.allWaypoints;
		while(_g < _g1.length) {
			var wp = _g1[_g];
			++_g;
			wp.seen = 0;
		}
		var pathQueue = new haxe_ds_GenericStack();
		var start = from.connectedWaypoint;
		start.priority = 0;
		pathQueue.head = new haxe_ds_GenericCell(start,pathQueue.head);
		while(pathQueue.head != null) {
			var k = pathQueue.head;
			var currentWaypoint;
			if(k == null) {
				currentWaypoint = null;
			} else {
				pathQueue.head = k.next;
				currentWaypoint = k.elt;
			}
			currentWaypoint.seen = 2;
			if(currentWaypoint.connectedSite != null && currentWaypoint.connectedSite != from && currentWaypoint.connectedSite.landingSiteGroup != null) {
				return currentWaypoint.connectedSite;
			}
			var _g = 0;
			var _g1 = currentWaypoint.connections;
			while(_g < _g1.length) {
				var connection = _g1[_g];
				++_g;
				if(connection.seen == 0) {
					connection.seen = 1;
					connection.prevWaypoint = currentWaypoint;
					pathQueue.head = new haxe_ds_GenericCell(connection,pathQueue.head);
				}
			}
		}
		return null;
	}
	,__class__: pathfinder_FlyingPathfinder
};
