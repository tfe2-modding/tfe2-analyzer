var simulation_FlyingSaucer = $hxClasses["simulation.FlyingSaucer"] = function(simulation,stage,path,start,destination) {
	this.stage = stage;
	this.simulation = simulation;
	this.start = start;
	this.destination = destination;
	this.pathPos = path.length - 1;
	this.position = new common_FPoint(path[this.pathPos].x,path[this.pathPos].y);
	this.sprite = Resources.makeSprite(start.get_saucherTexture());
	this.sprite.position.set(this.position.x,this.position.y);
	stage.addChild(this.sprite);
	this.path = path;
	this.passengers = [];
	this.leavingIn = 12;
	start.currentlyLandedSaucer = this;
};
simulation_FlyingSaucer.__name__ = "simulation.FlyingSaucer";
simulation_FlyingSaucer.__super__ = simulation_Vehicle;
simulation_FlyingSaucer.prototype = $extend(simulation_Vehicle.prototype,{
	get_citizenOffset: function() {
		return new common_FPoint(9,16);
	}
	,setDestination: function(newDestination,newPath) {
		this.path = newPath;
		this.pathPos = this.path.length - 1;
		this.destination = newDestination;
	}
	,addPassenger: function(citizen) {
		this.passengers.push(citizen);
		this.start.timesUsed++;
	}
	,destroy: function() {
		HxOverrides.remove(this.simulation.flyingSaucers,this);
		this.sprite.destroy();
	}
	,cancel: function() {
		var _g = 0;
		var _g1 = this.passengers;
		while(_g < _g1.length) {
			var person = _g1[_g];
			++_g;
			person.fullyBeingControlled = false;
			person.canViewSelfInBuilding = true;
			if(person.recyclePathArray) {
				pooling_Int32ArrayPool.returnToPool(person.path);
				person.recyclePathArray = false;
			}
			person.path = null;
			person.nextPathPos = -1;
			person.pathEnd = -1;
			person.currentPathAction = -2;
			if(!person.canViewSelfInBuilding) {
				person.delayCanViewSelfInBuilding = true;
			}
			person.canViewSelfInBuilding = true;
			person.verticalPathProgress = 0;
			person.pathEndFunction = null;
			person.requestingPathGoal = null;
			person.pathOnlyRelatedTo = null;
			person.pathWalkSpeed = 1;
			person.pathCanBeReconsidered = true;
			if(person.sprite.alpha > 0 && person.sprite.alpha < 1) {
				person.sprite.alpha = 1;
			}
		}
		this.destroy();
	}
	,update: function(timeMod) {
		if(this.leavingIn > 0) {
			this.leavingIn -= timeMod;
			if(this.leavingIn <= 0) {
				this.start.currentlyLandedSaucer = null;
				this.startedOn = this.simulation.time.timeSinceStart;
			}
			return;
		}
		var flyingDistanceLeft = timeMod * 3;
		while(flyingDistanceLeft > 0) {
			var goalX = this.path[this.pathPos].x;
			var goalY = this.path[this.pathPos].y;
			if(Math.abs(this.position.x - goalX) > 0.01) {
				var diff = goalX - this.position.x;
				this.position.x += (diff > 0 ? 1 : diff < 0 ? -1 : 0) * Math.min(flyingDistanceLeft,Math.abs(diff));
				flyingDistanceLeft -= Math.abs(diff);
			} else if(Math.abs(this.position.y - goalY) > 0.01) {
				var diff1 = goalY - this.position.y;
				this.position.y += (diff1 > 0 ? 1 : diff1 < 0 ? -1 : 0) * Math.min(flyingDistanceLeft,Math.abs(diff1));
				flyingDistanceLeft -= Math.abs(diff1);
			} else {
				this.position.x = goalX;
				this.position.y = goalY;
				if(this.pathPos == 0) {
					var _g = 0;
					var _g1 = this.passengers;
					while(_g < _g1.length) {
						var person = _g1[_g];
						++_g;
						person.fullyBeingControlled = false;
						if(person.inPermanent != null) {
							person.inPermanent.onCitizenLeave(person,this.destination);
						}
						person.inPermanent = this.destination;
						person.onWorld = person.inPermanent.world;
						person.inBuildingSince = person.city.simulation.time.timeSinceStart;
						if(person.currentPathActionPermanent != this.destination) {
							this.destination.timesUsedStopOver++;
						} else {
							this.destination.timesUsedTo++;
						}
					}
					this.destination.addFlyingSaucer();
					this.destroy();
					if(this.simulation.time.timeSinceStart > this.startedOn + 1440) {
						common_Achievements.achieve("SPACESHIP_FLIGHT_TIME");
					}
					return;
				} else {
					this.pathPos--;
				}
			}
		}
		this.sprite.position.set(this.position.x,this.position.y);
	}
	,__class__: simulation_FlyingSaucer
});
