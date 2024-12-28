var simulation_citizenSpecialActions_ClimbOntoRuins = $hxClasses["simulation.citizenSpecialActions.ClimbOntoRuins"] = function(citizen) {
	this.cancelAction = false;
	simulation_CitizenSpecialAction.call(this,citizen);
};
simulation_citizenSpecialActions_ClimbOntoRuins.__name__ = "simulation.citizenSpecialActions.ClimbOntoRuins";
simulation_citizenSpecialActions_ClimbOntoRuins.__super__ = simulation_CitizenSpecialAction;
simulation_citizenSpecialActions_ClimbOntoRuins.prototype = $extend(simulation_CitizenSpecialAction.prototype,{
	update: function(timeMod) {
		if(this.cancelAction) {
			return;
		}
		if(this.citizen.inPermanent != null && this.citizen.inPermanent.is(worldResources_AlienRuins)) {
			var inAlienRuins = this.citizen.inPermanent;
			if(((this.time.timeSinceStart | 0) / 60 | 0) % 24 == 4.5 && (this.time.timeSinceStart | 0) % 60 > 45) {
				if(this.citizen.relativeY != 0) {
					var tmp = this.citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 9;
					arr[1] = 0;
					tmp.setPath(arr,0,2);
				}
			} else if(this.citizen.relativeY == 0) {
				var tmp = this.citizen;
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[4].length > 0 ? pool[4].splice(pool[4].length - 1,1)[0] : new Int32Array(4);
				arr[0] = 4;
				arr[1] = inAlienRuins.get_climbX();
				arr[2] = 9;
				arr[3] = inAlienRuins.get_climbY();
				tmp.setPath(arr,0,4);
			}
		} else {
			var nearestRuins = null;
			var nearestRuinsDist = 100000.0;
			var _g = 0;
			var _g1 = this.citizen.onWorld.permanents;
			while(_g < _g1.length) {
				var stack = _g1[_g];
				++_g;
				if(stack.length >= 1 && stack[0] != null && stack[0].is(worldResources_AlienRuins)) {
					var thisRuins = stack[0];
					var dist = thisRuins.worldPosition.x * 20 - this.citizen.get_worldX();
					if(dist < nearestRuinsDist) {
						nearestRuins = thisRuins;
						nearestRuinsDist = dist;
					}
				}
			}
			if(nearestRuins != null) {
				var _this = this.citizen;
				_this.simulation.pathfinder.findPath(_this,nearestRuins);
				_this.pathOnFail = null;
			} else {
				this.cancelAction = true;
			}
		}
	}
	,isActive: function() {
		if(((this.time.timeSinceStart | 0) / 60 | 0) % 24 >= 0.5 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 <= 4.5 && !this.cancelAction) {
			return this.citizen.currentAction != 3;
		} else {
			return false;
		}
	}
	,__class__: simulation_citizenSpecialActions_ClimbOntoRuins
});
