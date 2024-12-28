var pathfinder_PathfinderManager = $hxClasses["pathfinder.PathfinderManager"] = function(city) {
	this.numberOfMultiRequests = 0;
	this.numberOfPathsDoneLastStepPerThread = 0;
	this.lastSentEntertainmentInfo = 0;
	this.previousRequestSentToWorker = 0;
	this.currentMaxThreads = 15;
	this.usedWorkers = 0;
	this.activeWorkers = 0;
	this.totalNumRequested = 0;
	this.city = city;
	this.workers = [];
	var _g = [];
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	_g.push(new polygonal_ds_ArrayedQueue());
	this.pathOwners = _g;
	var _g = [];
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	this.storedPathMessages = _g;
	var _g = [];
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	_g.push(null);
	this.pathRequests = _g;
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
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	this.pathRequestPos = _g;
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
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	this.pathRequestNumber = _g;
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
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	_g.push(0);
	this.pathNumberProcessed = _g;
	this.plannedMultiPathRequests = new haxe_ds_IntMap();
	this.setWorkerNumber(Settings.pathfindingWorkers,false);
};
pathfinder_PathfinderManager.__name__ = "pathfinder.PathfinderManager";
pathfinder_PathfinderManager.prototype = {
	setWorkerNumber: function(newWorkerNumber,sendPathfindInfo) {
		if(newWorkerNumber <= 0) {
			return;
		}
		if(newWorkerNumber > this.activeWorkers) {
			var workersToAdd = newWorkerNumber - this.activeWorkers;
			var origWorkers = this.activeWorkers;
			var _g = 0;
			var _g1 = workersToAdd;
			while(_g < _g1) {
				var i = _g++;
				this.initNewWorkerIfPossible();
				if(sendPathfindInfo && this.activeWorkers > i + origWorkers) {
					var pf = this.getPathfindingInfo();
					this.postInt32Array(pf,i + origWorkers,false);
				}
			}
		} else {
			this.usedWorkers = newWorkerNumber;
		}
	}
	,terminate: function() {
		var _g = 0;
		var _g1 = this.workers;
		while(_g < _g1.length) {
			var worker = _g1[_g];
			++_g;
			worker.terminate();
		}
		this.activeWorkers = 0;
	}
	,initNewWorkerIfPossible: function() {
		if(this.activeWorkers < this.currentMaxThreads) {
			this.initWorker(this.activeWorkers);
			this.initPathRequests(this.activeWorkers);
			this.activeWorkers++;
			this.usedWorkers++;
		}
	}
	,initWorker: function(workerID) {
		var _gthis = this;
		try {
			this.workers[workerID] = new Worker(Resources.pathfinderCodeUrl);
		} catch( _g ) {
			this.workers[workerID] = new Worker("js/pathfinder.js");
		}
		this.useModernPostMessage = true;
		try {
			var testArray = new Int32Array(1);
			testArray[0] = 2;
			this.workers[workerID].postMessage(testArray.buffer,[testArray.buffer]);
		} catch( _g ) {
			this.useModernPostMessage = false;
			console.log("FloatingSpaceCities/pathfinder/PathfinderManager.hx:138:","Using legacy mode for web workers.");
		}
		this.storedPathMessages[workerID] = new polygonal_ds_ArrayedQueue(200);
		this.workers[workerID].onmessage = function(e) {
			var _this = _gthis.storedPathMessages[workerID];
			var val = new Int32Array(e.data);
			if(_this.capacity == _this.mSize) {
				_this.grow();
			}
			_this.mData[(_this.mSize++ + _this.mFront) % _this.capacity] = val;
		};
	}
	,getEntertainmentInfo: function() {
		var data = new Int32Array(2 + 2 * this.city.permanents.length);
		var i = 0;
		data[i++] = 3;
		data[i++] = this.city.permanents.length;
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			data[i++] = pm.id;
			if(pm.isBuilding) {
				var bld = pm;
				if(bld.isEntertainment) {
					var entertainmentBuilding = bld;
					if(entertainmentBuilding.get_isOpen()) {
						data[i++] = 1 << entertainmentBuilding.get_entertainmentType();
					} else {
						data[i++] = -1;
					}
				} else {
					data[i++] = -1;
				}
			} else {
				data[i++] = -1;
			}
		}
		return data;
	}
	,sendEntertainmentInfo: function() {
		var data = this.getEntertainmentInfo();
		var _g = 0;
		var _g1 = this.activeWorkers;
		while(_g < _g1) {
			var worker = _g++;
			this.postInt32Array(data,worker,true);
		}
		this.lastSentEntertainmentInfo = 30;
	}
	,getPathfindingInfo: function() {
		var permanentsInfoLength = 0;
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var world = _g1[_g];
			++_g;
			permanentsInfoLength += 3;
			var _g2 = 0;
			var _g3 = world.permanents;
			while(_g2 < _g3.length) {
				var permanentsArray = _g3[_g2];
				++_g2;
				permanentsInfoLength += 1 + 2 * permanentsArray.length;
			}
		}
		var extraConnections = [];
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var bld = _g1[_g];
			++_g;
			if(bld.is(buildings_TrainStation)) {
				var ts = bld;
				if(ts.leftTrainStation == null) {
					var ts2 = ts.rightTrainStation;
					var prevBld = ts;
					while(ts2 != null) {
						var val = ts2.position.x - prevBld.position.x;
						var len = (val < 0 ? -val : val) / 4 | 0;
						extraConnections.push(14);
						extraConnections.push(ts2.id);
						extraConnections.push(prevBld.id);
						extraConnections.push(len);
						extraConnections.push(14);
						extraConnections.push(prevBld.id);
						extraConnections.push(ts2.id);
						extraConnections.push(len);
						prevBld = ts2;
						ts2 = ts2.rightTrainStation;
					}
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
				if(bridge.leftBuilding != null && bridge.rightBuilding != null && bridge.get_humanCanWalkOn()) {
					var bridgeDist = bridge.rightBuilding.position.x - bridge.leftBuilding.position.x;
					extraConnections.push(16);
					extraConnections.push(bridge.leftBuilding.id);
					extraConnections.push(bridge.rightBuilding.id);
					extraConnections.push(bridgeDist);
					extraConnections.push(15);
					extraConnections.push(bridge.rightBuilding.id);
					extraConnections.push(bridge.leftBuilding.id);
					extraConnections.push(bridgeDist);
				}
			}
		}
		var data = new Int32Array(permanentsInfoLength + 4 * this.city.connections.directWorldConnectionNumber + 4 + this.city.connections.landingSiteGroups.length + this.city.landingSites.length + extraConnections.length);
		var i = 0;
		data[i++] = 0;
		data[i++] = this.city.worlds.length;
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var world = _g1[_g];
			++_g;
			data[i++] = world.permanents.length;
			data[i++] = world.rect.x;
			data[i++] = world.rect.y;
			var _g2 = 0;
			var _g3 = world.permanents;
			while(_g2 < _g3.length) {
				var permanentsArray = _g3[_g2];
				++_g2;
				data[i++] = permanentsArray.length;
				var _g4 = 0;
				while(_g4 < permanentsArray.length) {
					var permanent = permanentsArray[_g4];
					++_g4;
					if(permanent != null) {
						data[i++] = permanent.id;
						if(!permanent.isBuilding) {
							data[i++] = 12;
						} else {
							data[i++] = permanent.get_typeID() * 4 + (permanent.isBuilding && permanent.isRooftopBuilding ? 1 : 0) + (permanent.isBuilding && permanent.cannotBuildOnTop ? 2 : 0);
						}
					} else {
						data[i++] = -1;
						data[i++] = -1;
					}
				}
			}
		}
		data[i++] = this.city.connections.directWorldConnectionNumber + (extraConnections.length / 4 | 0);
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var world = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = world.permanents[0];
			while(_g2 < _g3.length) {
				var permanent = _g3[_g2];
				++_g2;
				if(permanent != null && permanent.isBuilding) {
					var building = permanent;
					if(building.leftBuilding != null) {
						var otherBuilding = building.leftBuilding;
						var otherWorld = otherBuilding.world;
						if(otherWorld.rect.y > world.rect.y || otherWorld.rect.y == world.rect.y && otherWorld.rect.x > world.rect.x) {
							data[i++] = 2;
							data[i++] = building.id;
							data[i++] = otherBuilding.id;
							data[i++] = 20;
							data[i++] = 3;
							data[i++] = otherBuilding.id;
							data[i++] = building.id;
							data[i++] = 20;
						}
					}
				}
			}
			var _g4 = 0;
			var _g5 = world.permanents[world.permanents.length - 1];
			while(_g4 < _g5.length) {
				var permanent1 = _g5[_g4];
				++_g4;
				if(permanent1 != null && permanent1.isBuilding) {
					var building1 = permanent1;
					if(building1.rightBuilding != null) {
						var otherBuilding1 = building1.rightBuilding;
						var otherWorld1 = otherBuilding1.world;
						if(otherWorld1.rect.y > world.rect.y || otherWorld1.rect.y == world.rect.y && otherWorld1.rect.x > world.rect.x) {
							data[i++] = 3;
							data[i++] = building1.id;
							data[i++] = otherBuilding1.id;
							data[i++] = 20;
							data[i++] = 2;
							data[i++] = otherBuilding1.id;
							data[i++] = building1.id;
							data[i++] = 20;
						}
					}
				}
			}
		}
		var _g = 0;
		while(_g < extraConnections.length) {
			var ec = extraConnections[_g];
			++_g;
			data[i++] += ec;
		}
		data[i++] = this.city.connections.landingSiteGroups.length;
		var _g = 0;
		var _g1 = this.city.connections.landingSiteGroups;
		while(_g < _g1.length) {
			var lsg = _g1[_g];
			++_g;
			data[i++] = lsg.length;
			var _g2 = 0;
			while(_g2 < lsg.length) {
				var landingSite = lsg[_g2];
				++_g2;
				data[i++] = landingSite.id;
			}
		}
		return data;
	}
	,sendPathfindingInfo: function() {
		var data = this.getPathfindingInfo();
		var _g = 0;
		var _g1 = this.activeWorkers;
		while(_g < _g1) {
			var worker = _g++;
			this.postInt32Array(data,worker,true);
		}
		this.sendEntertainmentInfo();
	}
	,findPathEntertainment: function(citizen,maxDistance,entertainmentTypeBit) {
		this.findPathAny(citizen,null,1,entertainmentTypeBit,maxDistance);
	}
	,findPath: function(citizen,goal) {
		this.findPathAny(citizen,goal,0,goal.id,10000000);
	}
	,findPathCombined: function(citizen,goal) {
		citizen.isRequestingPath = true;
		citizen.requestingPathGoal = goal;
		if(citizen.inPermanent == null) {
			this.findPath(citizen,goal);
		} else {
			var multiMap = this.plannedMultiPathRequests.h[citizen.inPermanent.id];
			if(multiMap == null) {
				multiMap = { citizens : [], goals : []};
				this.plannedMultiPathRequests.h[citizen.inPermanent.id] = multiMap;
				this.numberOfMultiRequests++;
			}
			multiMap.citizens.push(citizen);
			multiMap.goals.push(goal);
		}
	}
	,findAllPaths: function(citizens,goals) {
		this.previousRequestSentToWorker++;
		if(this.previousRequestSentToWorker >= this.usedWorkers) {
			this.previousRequestSentToWorker = 0;
		}
		var workerID = this.previousRequestSentToWorker;
		var spaceNeededForThis = 6 + citizens.length;
		if(this.pathRequestPos[workerID] + spaceNeededForThis >= 603) {
			var val2 = 3 + spaceNeededForThis;
			this.requestPaths(workerID,val2 > 603 ? val2 : 603);
		}
		var thesePathRequests = this.pathRequests[workerID];
		this.pathRequestNumber[workerID] += 1;
		var firstCitizen = citizens[0];
		if(firstCitizen.inPermanent != null) {
			thesePathRequests[this.pathRequestPos[workerID]++] = -1;
			thesePathRequests[this.pathRequestPos[workerID]++] = firstCitizen.inPermanent.id;
		} else {
			thesePathRequests[this.pathRequestPos[workerID]++] = this.city.worlds.indexOf(firstCitizen.onWorld);
			thesePathRequests[this.pathRequestPos[workerID]++] = firstCitizen.relativeX | 0;
		}
		thesePathRequests[this.pathRequestPos[workerID]++] = 2;
		thesePathRequests[this.pathRequestPos[workerID]++] = citizens.length;
		if(firstCitizen.home != null && firstCitizen.home.get_hasPrivateTeleporter()) {
			thesePathRequests[this.pathRequestPos[workerID]++] = firstCitizen.home.id;
		} else {
			thesePathRequests[this.pathRequestPos[workerID]++] = -1;
		}
		thesePathRequests[this.pathRequestPos[workerID]++] = 1000000;
		var _this = this.pathOwners[workerID];
		if(_this.capacity == _this.mSize) {
			_this.grow();
		}
		_this.mData[(_this.mSize++ + _this.mFront) % _this.capacity] = pathfinder_PathOwner.PathForMultiCitizens(citizens);
		var _g = 0;
		var _g1 = citizens.length;
		while(_g < _g1) {
			var i = _g++;
			var citizen = citizens[i];
			var goal = goals[i];
			citizen.isRequestingPath = true;
			citizen.requestingPathGoal = goal;
			thesePathRequests[this.pathRequestPos[workerID]++] = goal.id;
		}
		if(this.pathRequestPos[workerID] + 6 > 603) {
			this.requestPaths(workerID);
		}
	}
	,findPathAny: function(citizen,goal,goalType,goalProp,maxDistance) {
		this.previousRequestSentToWorker++;
		if(this.previousRequestSentToWorker >= this.usedWorkers) {
			this.previousRequestSentToWorker = 0;
		}
		var workerID = this.previousRequestSentToWorker;
		var thesePathRequests = this.pathRequests[workerID];
		this.pathRequestNumber[workerID] += 1;
		if(citizen.inPermanent != null) {
			thesePathRequests[this.pathRequestPos[workerID]++] = -1;
			thesePathRequests[this.pathRequestPos[workerID]++] = citizen.inPermanent.id;
		} else {
			thesePathRequests[this.pathRequestPos[workerID]++] = this.city.worlds.indexOf(citizen.onWorld);
			thesePathRequests[this.pathRequestPos[workerID]++] = citizen.relativeX | 0;
		}
		thesePathRequests[this.pathRequestPos[workerID]++] = goalType;
		thesePathRequests[this.pathRequestPos[workerID]++] = goalProp;
		if(citizen.home != null && citizen.home.get_hasPrivateTeleporter()) {
			thesePathRequests[this.pathRequestPos[workerID]++] = citizen.home.id;
		} else {
			thesePathRequests[this.pathRequestPos[workerID]++] = -1;
		}
		thesePathRequests[this.pathRequestPos[workerID]++] = maxDistance;
		var _this = this.pathOwners[workerID];
		if(_this.capacity == _this.mSize) {
			_this.grow();
		}
		_this.mData[(_this.mSize++ + _this.mFront) % _this.capacity] = pathfinder_PathOwner.PathForCitizen(citizen);
		citizen.isRequestingPath = true;
		citizen.requestingPathGoal = goal;
		if(this.pathRequestPos[workerID] + 6 > 603) {
			this.requestPaths(workerID);
		}
	}
	,update: function(timeMod) {
		this.lastSentEntertainmentInfo -= timeMod;
		if(this.lastSentEntertainmentInfo <= 0) {
			this.sendEntertainmentInfo();
		}
		this.sendMultiPathRequests();
		this.requestAllPaths();
	}
	,sendMultiPathRequests: function() {
		var multiRequest = this.plannedMultiPathRequests.iterator();
		while(multiRequest.hasNext()) {
			var multiRequest1 = multiRequest.next();
			this.findAllPaths(multiRequest1.citizens,multiRequest1.goals);
		}
		this.plannedMultiPathRequests = new haxe_ds_IntMap();
		this.numberOfMultiRequests = 0;
	}
	,requestAllPaths: function() {
		var _g = 0;
		var _g1 = this.activeWorkers;
		while(_g < _g1) {
			var i = _g++;
			this.requestPaths(i);
		}
	}
	,requestPaths: function(workerID,newMinimumArraySize) {
		if(newMinimumArraySize == null) {
			newMinimumArraySize = 603;
		}
		if(this.pathRequestPos[workerID] > 3) {
			this.pathRequests[workerID][0] = 1;
			this.pathRequests[workerID][1] = this.pathRequestNumber[workerID];
			this.pathRequests[workerID][2] = this.city.simulation.operatingCost.teleportersEnabled ? 1 : 0;
			this.postInt32Array(this.pathRequests[workerID],workerID,false);
			this.totalNumRequested += (this.pathRequestPos[workerID] - 3) / 6 | 0;
			this.initPathRequests(workerID);
		}
	}
	,initPathRequests: function(workerID,newMinimumArraySize) {
		if(newMinimumArraySize == null) {
			newMinimumArraySize = 603;
		}
		this.pathRequests[workerID] = new Int32Array(newMinimumArraySize);
		this.pathRequestPos[workerID] = 3;
		this.pathRequestNumber[workerID] = 0;
	}
	,distributePaths: function() {
		this.numberOfPathsDoneLastStepPerThread = 0;
		var _g = 0;
		var _g1 = this.activeWorkers;
		while(_g < _g1) {
			var i = _g++;
			while(this.storedPathMessages[i].mSize != 0) {
				var _this = this.storedPathMessages[i];
				var x = _this.mData[_this.mFront++];
				if(_this.mFront == _this.capacity) {
					_this.mFront = 0;
				}
				_this.mSize--;
				var theseStoredPaths = x;
				var pathPos = 1;
				this.numberOfPathsDoneLastStepPerThread += theseStoredPaths[0];
				var _g2 = 0;
				var _g3 = theseStoredPaths[0];
				while(_g2 < _g3) {
					var _ = _g2++;
					var _this1 = this.pathOwners[i];
					var cfp = _this1.mData[_this1.mFront];
					switch(cfp._hx_index) {
					case 0:
						var citizen = cfp.citizen;
						var pathLength = theseStoredPaths[pathPos];
						citizen.setPath(theseStoredPaths,pathPos + 1,pathLength);
						var _this2 = this.pathOwners[i];
						var x1 = _this2.mData[_this2.mFront++];
						if(_this2.mFront == _this2.capacity) {
							_this2.mFront = 0;
						}
						_this2.mSize--;
						pathPos += pathLength + 1;
						break;
					case 1:
						var citizens = cfp.citizens;
						var numberOfFulfilledPaths = theseStoredPaths[pathPos++];
						this.pathNumberProcessed[i] += numberOfFulfilledPaths;
						var pathLength1 = theseStoredPaths[pathPos + numberOfFulfilledPaths];
						var _g4 = 0;
						var _g5 = numberOfFulfilledPaths;
						while(_g4 < _g5) {
							var j = _g4++;
							citizens[theseStoredPaths[pathPos + j]].setPath(theseStoredPaths,pathPos + numberOfFulfilledPaths + 1,pathLength1);
						}
						pathPos += pathLength1 + 1 + numberOfFulfilledPaths;
						if(this.pathNumberProcessed[i] >= citizens.length) {
							this.pathNumberProcessed[i] = 0;
							var _this3 = this.pathOwners[i];
							var x2 = _this3.mData[_this3.mFront++];
							if(_this3.mFront == _this3.capacity) {
								_this3.mFront = 0;
							}
							_this3.mSize--;
						}
						break;
					}
				}
			}
			this.totalNumRequested = 0;
		}
		this.numberOfPathsDoneLastStepPerThread = this.numberOfPathsDoneLastStepPerThread / this.activeWorkers | 0;
	}
	,getTotalNumberOfRequested: function() {
		var total = 0;
		var _g = 0;
		var _g1 = this.activeWorkers;
		while(_g < _g1) {
			var i = _g++;
			total += this.pathOwners[i].mSize;
		}
		return total;
	}
	,mayRequestPathNow: function(isMultiFromGoal) {
		var nextRequestSendToWorker = this.previousRequestSentToWorker + 1;
		if(nextRequestSendToWorker >= this.usedWorkers) {
			nextRequestSendToWorker = 0;
		}
		if(!(isMultiFromGoal != null && this.plannedMultiPathRequests.h[isMultiFromGoal.id] != null)) {
			return this.pathOwners[nextRequestSendToWorker].mSize + this.numberOfMultiRequests < this.numberOfPathsDoneLastStepPerThread + 100;
		} else {
			return true;
		}
	}
	,postInt32Array: function(arrayToPost,workerID,neverTransferControl) {
		if(this.useModernPostMessage && !neverTransferControl) {
			this.workers[workerID].postMessage(arrayToPost.buffer,[arrayToPost.buffer]);
		} else {
			this.workers[workerID].postMessage(arrayToPost.buffer);
		}
	}
	,invalidateAllPaths: function() {
		var _g = 0;
		var _g1 = this.pathOwners;
		while(_g < _g1.length) {
			var pathQueue = _g1[_g];
			++_g;
			var part = pathQueue.iterator();
			while(part.hasNext()) {
				var part1 = part.next();
				switch(part1._hx_index) {
				case 0:
					var citizen = part1.citizen;
					if(citizen != null) {
						citizen.isRequestingPath = false;
					}
					break;
				case 1:
					var citizens = part1.citizens;
					var _g2 = 0;
					while(_g2 < citizens.length) {
						var citizen1 = citizens[_g2];
						++_g2;
						if(citizen1 != null) {
							citizen1.isRequestingPath = false;
						}
					}
					break;
				}
			}
		}
		var _g = 0;
		var _g1 = this.activeWorkers;
		while(_g < _g1) {
			var i = _g++;
			this.workers[i].terminate();
			this.pathOwners[i].clear();
			this.pathNumberProcessed[i] = 0;
			this.initWorker(i);
			this.initPathRequests(i);
		}
	}
	,__class__: pathfinder_PathfinderManager
};
