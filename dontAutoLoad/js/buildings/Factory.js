var buildings_Factory = $hxClasses["buildings.Factory"] = function(game,stage,bgStage,city,world,position,worldPosition,id,animation,idleAnimation) {
	this.activeWorkersTotalEducation = 0;
	this.activeWorkers = 0;
	this.buildingEnabled = true;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.activeBgTextures = Resources.getTexturesByWidth(animation,20);
	this.idleBgTextures = Resources.getTexturesByWidth(idleAnimation,20);
	this.bgTexture = 0;
	this.backSprite = new PIXI.Sprite(this.idleBgTextures[0]);
	this.backSprite.position.set(position.x,position.y);
	bgStage.addChild(this.backSprite);
};
buildings_Factory.__name__ = "buildings.Factory";
buildings_Factory.__super__ = buildings_Work;
buildings_Factory.prototype = $extend(buildings_Work.prototype,{
	work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		} else {
			this.workAnimation(citizen,timeMod);
			this.activeWorkers += 1;
			this.activeWorkersTotalEducation += citizen.get_educationSpeedModifier();
		}
	}
	,workAnimation: function(citizen,timeMod) {
	}
	,update: function(timeMod) {
		var active = false;
		if(this.activeWorkers > 0 && this.buildingEnabled) {
			active = this.possiblyBeActive(timeMod);
		}
		var bgTextures = active && this.canShowActiveTextures() ? this.activeBgTextures : this.idleBgTextures;
		this.bgTexture += timeMod / 4;
		if(this.bgTexture >= bgTextures.length) {
			this.bgTexture = 0;
		}
		this.backSprite.texture = bgTextures[this.bgTexture | 0];
		this.activeWorkers = 0;
		this.activeWorkersTotalEducation = 0;
	}
	,positionSprites: function() {
		buildings_Work.prototype.positionSprites.call(this);
		if(this.backSprite != null) {
			this.backSprite.position.set(this.position.x,this.position.y);
		}
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		if(this.backSprite != null) {
			this.backSprite.destroy();
		}
	}
	,possiblyBeActive: function(timeMod) {
		return false;
	}
	,canShowActiveTextures: function() {
		return false;
	}
	,__class__: buildings_Factory
});
