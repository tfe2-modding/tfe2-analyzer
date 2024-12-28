var simulation_citizenSpecialActions_DanceOnBall = $hxClasses["simulation.citizenSpecialActions.DanceOnBall"] = function(citizen) {
	this.goIntoDirection = 1;
	this.currentSprite = null;
	simulation_CitizenSpecialAction.call(this,citizen);
};
simulation_citizenSpecialActions_DanceOnBall.__name__ = "simulation.citizenSpecialActions.DanceOnBall";
simulation_citizenSpecialActions_DanceOnBall.__super__ = simulation_CitizenSpecialAction;
simulation_citizenSpecialActions_DanceOnBall.prototype = $extend(simulation_CitizenSpecialAction.prototype,{
	update: function(timeMod) {
		if(((this.time.timeSinceStart | 0) / 60 | 0) % 24 >= 1 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 <= 5) {
			if(this.citizen.inPermanent != null) {
				this.citizen.goDownTowardsWorldSurface(timeMod);
			} else {
				this.citizen.setRelativeY(4);
				if(this.currentSprite == null) {
					this.goIntoDirection = random_Random.fromArray([-1,1]);
					this.currentSprite = new PIXI.Sprite(Resources.getTexture("spr_citizen_ball"));
					this.currentSprite.position.y = this.citizen.onWorld.rect.y - 4;
					this.citizen.onWorld.city.farForegroundStage.addChild(this.currentSprite);
				}
				this.citizen.setRelativeX(this.citizen.relativeX + timeMod * 0.5 * this.goIntoDirection);
				if(this.goIntoDirection == 1 && this.citizen.relativeX >= this.citizen.onWorld.rect.width - 2 || this.goIntoDirection == -1 && this.citizen.relativeX <= 0) {
					this.goIntoDirection = -this.goIntoDirection;
				}
				this.currentSprite.position.x = this.citizen.onWorld.rect.x + this.citizen.relativeX - 1;
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
			this.citizen.setRelativeY(0);
		}
	}
	,isActive: function() {
		if(!(((this.time.timeSinceStart | 0) / 60 | 0) % 24 >= 1 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 <= 5 && this.citizen.currentAction != 3)) {
			return this.currentSprite != null;
		} else {
			return true;
		}
	}
	,isWalkingOnBall: function() {
		return this.currentSprite != null;
	}
	,onDie: function() {
		simulation_CitizenSpecialAction.prototype.onDie.call(this);
		if(this.currentSprite != null) {
			this.currentSprite.destroy();
			this.currentSprite = null;
		}
	}
	,__class__: simulation_citizenSpecialActions_DanceOnBall
});
