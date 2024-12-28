var simulation_citizenSpecialActions_WatchStars = $hxClasses["simulation.citizenSpecialActions.WatchStars"] = function(citizen) {
	this.currentSprite = null;
	simulation_CitizenSpecialAction.call(this,citizen);
};
simulation_citizenSpecialActions_WatchStars.__name__ = "simulation.citizenSpecialActions.WatchStars";
simulation_citizenSpecialActions_WatchStars.__super__ = simulation_CitizenSpecialAction;
simulation_citizenSpecialActions_WatchStars.prototype = $extend(simulation_CitizenSpecialAction.prototype,{
	update: function(timeMod) {
		var _gthis = this;
		if(((this.time.timeSinceStart | 0) / 60 | 0) % 24 >= 0 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 <= 4) {
			if(this.currentSprite == null) {
				if(this.citizen.inPermanent != null) {
					this.citizen.goDownTowardsWorldSurface(timeMod);
				} else {
					var telescopeWidth = 4;
					var telescopeHeight = 5;
					var bestPosition = pathfinder_PathfindingTools.findNearestBestBuildingStack(this.citizen,function(stack) {
						if(stack.length == 0 || stack[0] == null) {
							return 1000;
						}
						if(stack[0].is(worldResources_Forest)) {
							return 999;
						}
						return 0;
					}) * 20 + random_Random.getInt(telescopeWidth,18 - telescopeWidth);
					var _this = this.citizen;
					var pool = pooling_Int32ArrayPool.pool;
					var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
					arr[0] = 4;
					arr[1] = bestPosition;
					_this.setPath(arr,0,2,true);
					_this.pathEndFunction = function() {
						var tmp = Resources.getTexture("spr_telescope");
						_gthis.currentSprite = new PIXI.Sprite(tmp);
						_gthis.currentSprite.position.y = _gthis.citizen.onWorld.rect.y - telescopeHeight;
						if(random_Random.getInt(2) == 0) {
							_gthis.currentSprite.position.x = _gthis.citizen.onWorld.rect.x + bestPosition - telescopeWidth;
						} else {
							_gthis.currentSprite.position.x = _gthis.citizen.onWorld.rect.x + bestPosition + 2 + telescopeWidth;
							_gthis.currentSprite.scale.x = -1;
						}
						_gthis.citizen.onWorld.city.farForegroundStage.addChild(_gthis.currentSprite);
					};
					_this.pathOnlyRelatedTo = _this.inPermanent;
				}
			}
		} else if(this.currentSprite != null) {
			this.currentSprite.destroy();
			var _this = this.citizen;
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = 5;
			_this.setPath(arr,0,2,true);
			_this.pathEndFunction = null;
			_this.pathOnlyRelatedTo = _this.inPermanent;
			this.currentSprite = null;
		}
	}
	,isActive: function() {
		if(!(((this.time.timeSinceStart | 0) / 60 | 0) % 24 >= 0 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 <= 4 && this.citizen.currentAction != 3)) {
			return this.currentSprite != null;
		} else {
			return true;
		}
	}
	,onDie: function() {
		simulation_CitizenSpecialAction.prototype.onDie.call(this);
		if(this.currentSprite != null) {
			this.currentSprite.destroy();
			this.currentSprite = null;
		}
	}
	,__class__: simulation_citizenSpecialActions_WatchStars
});
