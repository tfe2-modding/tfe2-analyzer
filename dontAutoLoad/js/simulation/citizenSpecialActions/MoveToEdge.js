var simulation_citizenSpecialActions_MoveToEdge = $hxClasses["simulation.citizenSpecialActions.MoveToEdge"] = function(citizen) {
	simulation_CitizenSpecialAction.call(this,citizen);
};
simulation_citizenSpecialActions_MoveToEdge.__name__ = "simulation.citizenSpecialActions.MoveToEdge";
simulation_citizenSpecialActions_MoveToEdge.__super__ = simulation_CitizenSpecialAction;
simulation_citizenSpecialActions_MoveToEdge.prototype = $extend(simulation_CitizenSpecialAction.prototype,{
	update: function(timeMod) {
		var citizenMaxX = this.citizen.onWorld.rect.width - 2;
		if(this.citizen.inPermanent != null || this.citizen.relativeX > 0 && this.citizen.relativeX < citizenMaxX) {
			if(this.citizen.inPermanent == null) {
				var _this = this.citizen;
				var x = this.citizen.relativeX < citizenMaxX / 2 ? 0 : citizenMaxX;
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 4;
				arr[1] = x;
				_this.setPath(arr,0,2,true);
				_this.pathEndFunction = null;
				_this.pathOnlyRelatedTo = _this.inPermanent;
			} else {
				this.citizen.goDownTowardsWorldSurface(timeMod);
			}
		}
	}
	,isActive: function() {
		var this1 = this.time.timeSinceStart / 60 % 24;
		if(this1 >= 23 || this1 < 5) {
			return this.citizen.currentAction != 3;
		} else {
			return false;
		}
	}
	,__class__: simulation_citizenSpecialActions_MoveToEdge
});
