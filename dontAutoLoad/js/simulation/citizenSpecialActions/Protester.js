var simulation_citizenSpecialActions_Protester = $hxClasses["simulation.citizenSpecialActions.Protester"] = function(citizen) {
	this.goingIntoThisDirection = 0;
	this.goIntoDirection = 1;
	this.currentSprite = null;
	simulation_CitizenSpecialAction.call(this,citizen);
};
simulation_citizenSpecialActions_Protester.__name__ = "simulation.citizenSpecialActions.Protester";
simulation_citizenSpecialActions_Protester.__super__ = simulation_CitizenSpecialAction;
simulation_citizenSpecialActions_Protester.prototype = $extend(simulation_CitizenSpecialAction.prototype,{
	update: function(timeMod) {
		if(((this.time.timeSinceStart | 0) / 60 | 0) % 24 >= 0 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 <= 4 && (this.citizensAreVeryHappy() || this.citizensAreVeryUnhappy())) {
			if(this.citizen.inPermanent != null) {
				this.citizen.goDownTowardsWorldSurface(timeMod);
			} else {
				if(this.currentSprite == null) {
					this.goIntoDirection = random_Random.fromArray([-1,1]);
					if(this.citizensAreVeryHappy()) {
						this.currentSprite = new PIXI.Sprite(Resources.getTexture("spr_protestsign_happy"));
					} else {
						this.currentSprite = new PIXI.Sprite(Resources.getTexture("spr_protestsign_sad"));
					}
					this.currentSprite.position.y = this.citizen.onWorld.rect.y - this.currentSprite.height;
					this.citizen.onWorld.city.farForegroundStage.addChild(this.currentSprite);
				}
				this.citizen.setRelativeX(this.citizen.relativeX + timeMod * 0.66666666666666663 * this.goIntoDirection);
				if(this.goIntoDirection == 1 && this.citizen.relativeX >= this.citizen.onWorld.rect.width - 2 || this.goIntoDirection == -1 && this.citizen.relativeX <= 0) {
					this.goIntoDirection = -this.goIntoDirection;
				} else if(this.goingIntoThisDirection > 150 && random_Random.getInt(90) == 1) {
					this.goIntoDirection = -this.goIntoDirection;
					this.goingIntoThisDirection = 0;
				} else {
					this.goingIntoThisDirection += timeMod;
				}
				this.currentSprite.position.x = this.citizen.onWorld.rect.x + this.citizen.relativeX - (this.goIntoDirection == 1 ? 2 : 5);
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
		if(!(((this.time.timeSinceStart | 0) / 60 | 0) % 24 >= 0 && ((this.time.timeSinceStart | 0) / 60 | 0) % 24 <= 4 && this.citizen.currentAction != 3 && (this.citizensAreVeryHappy() || this.citizensAreVeryUnhappy()))) {
			return this.currentSprite != null;
		} else {
			return true;
		}
	}
	,citizensAreVeryHappy: function() {
		return this.simulation.happiness.happiness >= 99.99;
	}
	,citizensAreVeryUnhappy: function() {
		return this.simulation.happiness.happiness <= 10.01;
	}
	,onDie: function() {
		simulation_CitizenSpecialAction.prototype.onDie.call(this);
		if(this.currentSprite != null) {
			this.currentSprite.destroy();
			this.currentSprite = null;
		}
	}
	,__class__: simulation_citizenSpecialActions_Protester
});
