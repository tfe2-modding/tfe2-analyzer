var simulation_Train = $hxClasses["simulation.Train"] = function(stage,simulation,building) {
	this.trainID = 0;
	this.stopping = false;
	this.isStopped = 0;
	this.switchingPlatformSpeed = 2;
	this.switchingPlatform = 0.0;
	this.speed = 0;
	this.xPosRelative = 4;
	this.inBuilding = null;
	this.direction = simulation_TrainDirection.Right;
	this.citizenDestinations = new haxe_ds_ObjectMap();
	this.trainTextures = Resources.getTexturesByWidth("spr_train",12);
	this.sprite = new PIXI.Sprite(this.trainTextures[0]);
	stage.addChild(this.sprite);
	this.simulation = simulation;
	this.inBuilding = building;
	simulation.trainsByBuildingRight.set(this.inBuilding,this);
	this.position = new common_FPoint(0,0);
	this.trainID = ++simulation_Train.maxTrainID + 1;
	switch(this.direction._hx_index) {
	case 0:
		this.position.x = this.inBuilding.position.x + this.xPosRelative;
		this.position.y = this.inBuilding.position.y + 2;
		this.sprite.position.set(this.position.x,this.position.y);
		break;
	case 1:
		this.position.x = this.inBuilding.position.x + this.xPosRelative;
		this.position.y = this.inBuilding.position.y + 12;
		this.sprite.position.set(this.position.x,this.position.y);
		break;
	}
};
simulation_Train.__name__ = "simulation.Train";
simulation_Train.__super__ = simulation_Vehicle;
simulation_Train.prototype = $extend(simulation_Vehicle.prototype,{
	get_citizenOffset: function() {
		return new common_FPoint(5,5);
	}
	,setTexture: function(spr) {
		this.sprite.texture = this.trainTextures[spr];
	}
	,update: function(timeMod) {
		var timeModLeft = timeMod;
		if(this.isStopped <= 0 && !this.stopping) {
			var _g = 0;
			_hx_loop1: while(_g < 4) {
				var timeModPart = _g++;
				var tmeMod = timeMod / 4;
				timeModLeft -= tmeMod;
				switch(this.direction._hx_index) {
				case 0:
					if(this.xPosRelative <= 1 + tmeMod * this.speed) {
						if(!this.inBuilding.is(buildings_TrainStation) && this.inBuilding.leftBuilding == null || this.inBuilding.is(buildings_TrainStation) && this.inBuilding.leftTrainStation == null && this.inBuilding.rightTrainStation != null || this.switchingPlatform > 0) {
							if(this.simulation.trainsByBuildingRight.h[this.inBuilding.__id__] == null) {
								this.xPosRelative = 1;
								this.speed = 0;
								this.switchingPlatform += tmeMod * this.switchingPlatformSpeed;
								if(this.switchingPlatform >= 10) {
									this.switchingPlatform = 0;
									if(this.inBuilding.is(buildings_TrainStation)) {
										this.inBuilding.setPlatformSwitch(10,7);
									}
									this.direction = simulation_TrainDirection.Right;
									var v = null;
									this.simulation.trainsByBuildingLeft.set(this.inBuilding,v);
									this.simulation.trainsByBuildingRight.set(this.inBuilding,this);
									if(this.inBuilding.is(buildings_TrainStation)) {
										var inTrainStation = this.inBuilding;
										if(inTrainStation.requestedStopRight || inTrainStation.currentWaitBetweenTrainsRight < inTrainStation.minimumWaitBetweenTrains || this.isAnyDestination(inTrainStation)) {
											this.stopping = true;
											break _hx_loop1;
										}
									}
								}
							}
						} else if(this.inBuilding.leftBuilding != null && this.simulation.trainsByBuildingLeft.h[this.inBuilding.leftBuilding.__id__] == null && (!this.inBuilding.leftBuilding.is(buildings_TrainStation) || this.inBuilding.leftBuilding.platformSwitchCurrent <= 4)) {
							if(this.inBuilding.is(buildings_TrainStation)) {
								var trainStationBuilding = this.inBuilding;
								if(this.inBuilding.rightTrainStation == null) {
									trainStationBuilding.setPlatformSwitch(10,3);
								}
								trainStationBuilding.currentWaitBetweenTrainsLeft = 0;
							}
							this.xPosRelative -= tmeMod * this.speed;
							this.xPosRelative += 20;
							this.xPosRelative = Math.max(this.xPosRelative,7);
							this.simulation.trainsByBuildingLeft.set(this.inBuilding.leftBuilding,this);
							var v1 = null;
							this.simulation.trainsByBuildingLeft.set(this.inBuilding,v1);
							this.inBuilding = this.inBuilding.leftBuilding;
							if(this.inBuilding.is(buildings_TrainStation)) {
								var inTrainStation1 = this.inBuilding;
								if(inTrainStation1.requestedStopLeft || inTrainStation1.currentWaitBetweenTrainsLeft < inTrainStation1.minimumWaitBetweenTrains || this.isAnyDestination(inTrainStation1)) {
									this.stopping = true;
									break _hx_loop1;
								}
							}
							if(!this.stopping) {
								if(this.inBuilding.leftBuilding == null || this.simulation.trainsByBuildingLeft.h[this.inBuilding.leftBuilding.__id__] != null) {
									this.speed = Math.min(4,this.speed + 1);
								} else {
									this.speed = Math.min(this.inBuilding != null && this.inBuilding.is(buildings_TrainRail) ? 10 : 5,this.speed + 1);
								}
							}
						} else {
							this.xPosRelative = 1;
							this.speed = 0;
							if(this.inBuilding.is(buildings_TrainStation) && this.inBuilding.rightTrainStation == null) {
								var trainStationBuilding1 = this.inBuilding;
								trainStationBuilding1.setPlatformSwitch(10);
							}
						}
					} else {
						this.xPosRelative -= tmeMod * this.speed;
						if(this.inBuilding.leftBuilding == null || this.simulation.trainsByBuildingLeft.h[this.inBuilding.leftBuilding.__id__] != null) {
							this.speed = Math.min(4,this.speed + 1);
						} else {
							this.speed = Math.min(this.inBuilding != null && this.inBuilding.is(buildings_TrainRail) ? 10 : 5,this.speed + 1);
						}
						if(this.inBuilding.is(buildings_TrainStation) && this.inBuilding.rightTrainStation == null) {
							var trainStationBuilding2 = this.inBuilding;
							trainStationBuilding2.setPlatformSwitch(10);
						}
					}
					break;
				case 1:
					if(this.xPosRelative >= 7 - tmeMod * this.speed) {
						if(!this.inBuilding.is(buildings_TrainStation) && this.inBuilding.rightBuilding == null || this.inBuilding.is(buildings_TrainStation) && this.inBuilding.rightTrainStation == null && this.inBuilding.leftTrainStation != null || this.switchingPlatform > 0) {
							if(this.simulation.trainsByBuildingLeft.h[this.inBuilding.__id__] == null) {
								this.xPosRelative = 7;
								this.speed = 0;
								this.switchingPlatform += tmeMod * this.switchingPlatformSpeed;
								if(this.switchingPlatform >= 10) {
									this.switchingPlatform = 0;
									if(this.inBuilding.is(buildings_TrainStation)) {
										this.inBuilding.setPlatformSwitch(10,7);
									}
									this.direction = simulation_TrainDirection.Left;
									var v2 = null;
									this.simulation.trainsByBuildingRight.set(this.inBuilding,v2);
									this.simulation.trainsByBuildingLeft.set(this.inBuilding,this);
								}
							}
						} else if(this.inBuilding.rightBuilding != null && this.simulation.trainsByBuildingRight.h[this.inBuilding.rightBuilding.__id__] == null && (!this.inBuilding.rightBuilding.is(buildings_TrainStation) || this.inBuilding.rightBuilding.platformSwitchCurrent <= 4)) {
							this.xPosRelative += tmeMod * this.speed;
							this.xPosRelative -= 20;
							this.xPosRelative = Math.min(this.xPosRelative,7);
							this.simulation.trainsByBuildingRight.set(this.inBuilding.rightBuilding,this);
							var v3 = null;
							this.simulation.trainsByBuildingRight.set(this.inBuilding,v3);
							if(this.inBuilding.is(buildings_TrainStation)) {
								var inTrainStation2 = this.inBuilding;
								inTrainStation2.currentWaitBetweenTrainsRight = 0;
							}
							this.inBuilding = this.inBuilding.rightBuilding;
							if(this.inBuilding.is(buildings_TrainStation)) {
								var inTrainStation3 = this.inBuilding;
								if(inTrainStation3.requestedStopRight || inTrainStation3.currentWaitBetweenTrainsRight < inTrainStation3.minimumWaitBetweenTrains || this.isAnyDestination(inTrainStation3)) {
									this.stopping = true;
									break _hx_loop1;
								}
							}
							if(!this.stopping) {
								if(this.inBuilding.rightBuilding == null || this.simulation.trainsByBuildingRight.h[this.inBuilding.rightBuilding.__id__] != null) {
									this.speed = Math.min(4,this.speed + 1);
								} else {
									this.speed = Math.min(this.inBuilding != null && this.inBuilding.is(buildings_TrainRail) ? 10 : 5,this.speed + 1);
								}
							}
						} else {
							this.xPosRelative = 7;
							this.speed = 0;
						}
					} else {
						if(this.inBuilding.rightBuilding == null || this.simulation.trainsByBuildingRight.h[this.inBuilding.rightBuilding.__id__] != null) {
							this.speed = Math.min(4,this.speed + 1);
						} else {
							this.speed = Math.min(this.inBuilding != null && this.inBuilding.is(buildings_TrainRail) ? 10 : 5,this.speed + 1);
						}
						this.xPosRelative += tmeMod * this.speed;
					}
					break;
				}
			}
		}
		if(this.stopping) {
			this.speed = Math.max(2,this.speed - timeModLeft);
			switch(this.direction._hx_index) {
			case 0:
				this.xPosRelative -= this.speed * timeModLeft;
				if(this.xPosRelative < 4) {
					this.xPosRelative = 4;
					this.stopping = false;
					this.isStopped = 10;
					if(this.inBuilding.is(buildings_TrainStation)) {
						var thisTrainStation = this.inBuilding;
						this.isStopped = Math.max(10,(thisTrainStation.minimumWaitBetweenTrains - thisTrainStation.currentWaitBetweenTrainsLeft) * 40);
					}
				}
				break;
			case 1:
				this.xPosRelative += this.speed * timeModLeft;
				if(this.xPosRelative > 4) {
					this.xPosRelative = 4;
					this.stopping = false;
					this.isStopped = 10;
					if(this.inBuilding.is(buildings_TrainStation)) {
						var thisTrainStation = this.inBuilding;
						this.isStopped = Math.max(10,(thisTrainStation.minimumWaitBetweenTrains - thisTrainStation.currentWaitBetweenTrainsRight) * 40);
					}
				}
				break;
			}
			if(this.isStopped > 0) {
				var persons = this.citizenDestinations.h[this.inBuilding.__id__];
				if(persons != null) {
					var _g = 0;
					while(_g < persons.length) {
						var person = persons[_g];
						++_g;
						person.fullyBeingControlled = false;
						if(person.inPermanent != null) {
							person.inPermanent.onCitizenLeave(person,this.inBuilding);
						}
						person.inPermanent = this.inBuilding;
						person.onWorld = person.inPermanent.world;
						person.setRelativeY(this.direction == simulation_TrainDirection.Left ? 10 : 0);
						person.canViewSelfInBuilding = true;
						person.inBuildingSince = person.city.simulation.time.timeSinceStart;
					}
					var v = [];
					this.citizenDestinations.set(this.inBuilding,v);
				}
			}
		} else if(this.isStopped > 0) {
			this.speed = 0;
			this.isStopped -= timeModLeft;
			if(this.inBuilding.is(buildings_TrainStation)) {
				var inTrainStation = this.inBuilding;
				if(this.direction == simulation_TrainDirection.Left) {
					inTrainStation.requestedStopLeft = false;
				} else {
					inTrainStation.requestedStopRight = false;
				}
			}
			if(this.isStopped <= 0) {
				this.isStopped = 0;
			}
		}
		switch(this.direction._hx_index) {
		case 0:
			this.position.x = this.inBuilding.position.x + this.xPosRelative;
			this.position.y = this.inBuilding.position.y + 2 + this.switchingPlatform;
			this.sprite.position.set(this.position.x,this.position.y);
			break;
		case 1:
			this.position.x = this.inBuilding.position.x + this.xPosRelative;
			this.position.y = this.inBuilding.position.y + 12 - this.switchingPlatform;
			this.sprite.position.set(this.position.x,this.position.y);
			break;
		}
		if(this.switchingPlatform > 0 && this.inBuilding.is(buildings_TrainStation)) {
			this.inBuilding.setPlatformSwitch(this.switchingPlatform);
		}
	}
	,addPassenger: function(passenger,destination) {
		var destinationArray = this.citizenDestinations.h[destination.__id__];
		if(destinationArray == null) {
			var v = [];
			this.citizenDestinations.set(destination,v);
			destinationArray = this.citizenDestinations.h[destination.__id__];
		}
		destinationArray.push(passenger);
	}
	,isAnyDestination: function(trainStation) {
		var thisDestination = this.citizenDestinations.h[trainStation.__id__];
		if(thisDestination != null) {
			return thisDestination.length != 0;
		} else {
			return false;
		}
	}
	,despawn: function() {
		HxOverrides.remove(this.simulation.trains,this);
		this.sprite.destroy();
		if(this.direction == simulation_TrainDirection.Left) {
			this.simulation.trainsByBuildingLeft.remove(this.inBuilding);
		} else if(this.direction == simulation_TrainDirection.Right) {
			this.simulation.trainsByBuildingRight.remove(this.inBuilding);
		}
		var cd = this.citizenDestinations.iterator();
		while(cd.hasNext()) {
			var cd1 = cd.next();
			var _g = 0;
			while(_g < cd1.length) {
				var citizen = cd1[_g];
				++_g;
				citizen.fullyBeingControlled = false;
				citizen.canViewSelfInBuilding = true;
				if(citizen.recyclePathArray) {
					pooling_Int32ArrayPool.returnToPool(citizen.path);
					citizen.recyclePathArray = false;
				}
				citizen.path = null;
				citizen.nextPathPos = -1;
				citizen.pathEnd = -1;
				citizen.currentPathAction = -2;
				if(!citizen.canViewSelfInBuilding) {
					citizen.delayCanViewSelfInBuilding = true;
				}
				citizen.canViewSelfInBuilding = true;
				citizen.verticalPathProgress = 0;
				citizen.pathEndFunction = null;
				citizen.requestingPathGoal = null;
				citizen.pathOnlyRelatedTo = null;
				citizen.pathWalkSpeed = 1;
				citizen.pathCanBeReconsidered = true;
				if(citizen.sprite.alpha > 0 && citizen.sprite.alpha < 1) {
					citizen.sprite.alpha = 1;
				}
			}
		}
	}
	,onCityChange: function() {
		if(this.inBuilding.destroyed) {
			this.despawn();
			return;
		}
	}
	,onCityChangePart2: function() {
		var anyTrainStation = null;
		if(!this.inBuilding.is(buildings_TrainStation)) {
			var hasTrainStation = false;
			var bld = this.inBuilding.leftBuilding;
			while(bld != null) {
				if(bld.is(buildings_TrainStation)) {
					anyTrainStation = bld;
					break;
				}
				bld = bld.leftBuilding;
			}
			if(anyTrainStation == null) {
				var bld = this.inBuilding.rightBuilding;
				while(bld != null) {
					if(bld.is(buildings_TrainStation)) {
						anyTrainStation = bld;
						break;
					}
					bld = bld.rightBuilding;
				}
			}
			if(anyTrainStation == null) {
				this.despawn();
				return;
			}
		} else {
			anyTrainStation = this.inBuilding;
		}
		var citizenDestinationBuildings = new haxe_ds_ObjectMap();
		var destination = this.citizenDestinations.keys();
		while(destination.hasNext()) {
			var destination1 = destination.next();
			citizenDestinationBuildings.set(destination1,false);
		}
		var bld = anyTrainStation;
		while(bld != null) {
			citizenDestinationBuildings.set(bld,true);
			bld = bld.leftTrainStation;
		}
		bld = anyTrainStation.rightTrainStation;
		while(bld != null) {
			citizenDestinationBuildings.set(bld,true);
			bld = bld.rightTrainStation;
		}
		var possibleDestination = citizenDestinationBuildings.keys();
		while(possibleDestination.hasNext()) {
			var possibleDestination1 = possibleDestination.next();
			if(!citizenDestinationBuildings.h[possibleDestination1.__id__]) {
				var _g = 0;
				var _g1 = this.citizenDestinations.h[possibleDestination1.__id__];
				while(_g < _g1.length) {
					var citizen = _g1[_g];
					++_g;
					citizen.fullyBeingControlled = false;
					citizen.canViewSelfInBuilding = true;
					if(citizen.recyclePathArray) {
						pooling_Int32ArrayPool.returnToPool(citizen.path);
						citizen.recyclePathArray = false;
					}
					citizen.path = null;
					citizen.nextPathPos = -1;
					citizen.pathEnd = -1;
					citizen.currentPathAction = -2;
					if(!citizen.canViewSelfInBuilding) {
						citizen.delayCanViewSelfInBuilding = true;
					}
					citizen.canViewSelfInBuilding = true;
					citizen.verticalPathProgress = 0;
					citizen.pathEndFunction = null;
					citizen.requestingPathGoal = null;
					citizen.pathOnlyRelatedTo = null;
					citizen.pathWalkSpeed = 1;
					citizen.pathCanBeReconsidered = true;
					if(citizen.sprite.alpha > 0 && citizen.sprite.alpha < 1) {
						citizen.sprite.alpha = 1;
					}
				}
				this.citizenDestinations.remove(possibleDestination1);
			}
		}
	}
	,__class__: simulation_Train
});
