var simulation_citizenSpecialActions_ClimbIntoTree = $hxClasses["simulation.citizenSpecialActions.ClimbIntoTree"] = function(citizen) {
	simulation_CitizenSpecialAction.call(this,citizen);
};
simulation_citizenSpecialActions_ClimbIntoTree.__name__ = "simulation.citizenSpecialActions.ClimbIntoTree";
simulation_citizenSpecialActions_ClimbIntoTree.__super__ = simulation_CitizenSpecialAction;
simulation_citizenSpecialActions_ClimbIntoTree.prototype = $extend(simulation_CitizenSpecialAction.prototype,{
	update: function(timeMod) {
		if(this.citizen.inPermanent != null && this.citizen.inPermanent.is(worldResources_Forest)) {
			var inForest = this.citizen.inPermanent;
			if(((this.time.timeSinceStart | 0) / 60 | 0) % 24 == 4 && (this.time.timeSinceStart | 0) % 60 > 45) {
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
				arr[1] = inForest.get_treeClimbX();
				arr[2] = 9;
				arr[3] = inForest.get_treeClimbY();
				tmp.setPath(arr,0,4);
			}
		} else {
			var nearestForest = null;
			var nearestForestDist = 100000.0;
			var _g = 0;
			var _g1 = this.citizen.onWorld.permanents;
			while(_g < _g1.length) {
				var stack = _g1[_g];
				++_g;
				if(stack.length >= 1 && stack[0] != null && stack[0].is(worldResources_Forest)) {
					var thisForest = stack[0];
					if(thisForest.materialsLeft == thisForest.initialMaterials) {
						var dist = thisForest.worldPosition.x * 20 - this.citizen.get_worldX();
						if(dist < nearestForestDist) {
							nearestForest = thisForest;
							nearestForestDist = dist;
						}
					}
				}
			}
			if(nearestForest != null) {
				var _this = this.citizen;
				_this.simulation.pathfinder.findPath(_this,nearestForest);
				_this.pathOnFail = null;
			}
		}
	}
	,isActive: function() {
		if(((this.time.timeSinceStart | 0) / 60 | 0) % 24 >= 0 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 <= 4) {
			return this.citizen.currentAction != 3;
		} else {
			return false;
		}
	}
	,__class__: simulation_citizenSpecialActions_ClimbIntoTree
});
