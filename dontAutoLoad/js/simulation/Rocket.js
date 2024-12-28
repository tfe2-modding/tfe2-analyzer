var simulation_Rocket = $hxClasses["simulation.Rocket"] = function(rockets,base,stage,cityEdgeY1) {
	this.droppedOfPartsCurYDiff = 0;
	this.dropOffPartsY = -1000000;
	this.velocity2 = 0;
	this.velocity = 0;
	this.launchOff = false;
	var _this = base.position;
	this.position = new common_FPoint(_this.x,_this.y);
	var _this = this.position;
	this.startPos = new common_FPoint(_this.x,_this.y);
	this.base = base;
	this.rockets = rockets;
	this.parts = [new PIXI.Sprite(Resources.getTexture("spr_rocket_part1")),new PIXI.Sprite(Resources.getTexture("spr_rocket_part2")),new PIXI.Sprite(Resources.getTexture("spr_rocket_part3")),new PIXI.Sprite(Resources.getTexture("spr_rocket_part4"))];
	this.trails = [new PIXI.Sprite(Resources.getTexture("spr_rockettrail")),new PIXI.Sprite(Resources.getTexture("spr_rockettrail_small")),new PIXI.Sprite(Resources.getTexture("spr_rockettrail_small"))];
	this.trails[0].scale.y = 0;
	this.trails[1].scale.y = 0;
	this.trails[2].scale.y = 0;
	var _g = 0;
	var _g1 = this.trails;
	while(_g < _g1.length) {
		var trail = _g1[_g];
		++_g;
		stage.addChild(trail);
	}
	var _g = 0;
	var _g1 = this.parts;
	while(_g < _g1.length) {
		var part = _g1[_g];
		++_g;
		stage.addChild(part);
	}
	this.launchOff = false;
	this.positionParts();
	this.dropOffPartsY = cityEdgeY1 - 300;
};
simulation_Rocket.__name__ = "simulation.Rocket";
simulation_Rocket.__super__ = simulation_Vehicle;
simulation_Rocket.prototype = $extend(simulation_Vehicle.prototype,{
	get_citizenOffset: function() {
		return new common_FPoint(9,-5);
	}
	,positionParts: function() {
		var _g = 0;
		var _g1 = this.parts;
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			part.anchor.set(0,1);
			part.position.set(this.position.x,this.position.y);
		}
		this.trails[0].position.set(this.position.x + 5,this.position.y - 4);
		this.trails[0].scale.y = Math.min(1,(this.startPos.y - this.position.y) / this.trails[0].texture.height);
		this.parts[3].position.set(this.position.x + 12,this.position.y);
		if(this.position.y < this.dropOffPartsY) {
			if(this.launchOff) {
				var dropOffPosition = this.dropOffPartsY + this.droppedOfPartsCurYDiff;
				this.parts[2].position.set(this.position.x,dropOffPosition);
				this.parts[3].position.set(this.position.x + 12,dropOffPosition);
				this.trails[1].position.set(this.position.x - 1,dropOffPosition);
				this.trails[1].scale.y = Math.min(1,(this.startPos.y - dropOffPosition) / this.trails[1].texture.height);
				this.trails[2].position.set(this.position.x + 15,dropOffPosition);
				this.trails[2].scale.y = Math.min(1,(this.startPos.y - dropOffPosition) / this.trails[2].texture.height);
				var newAlph = Math.max(0,1 - this.droppedOfPartsCurYDiff / 300);
				this.parts[2].alpha = newAlph;
				this.parts[3].alpha = newAlph;
				this.trails[1].alpha = 0;
				this.trails[2].alpha = 0;
			}
		} else {
			this.trails[1].position.set(this.position.x - 1,this.position.y);
			this.trails[1].scale.y = Math.min(1,(this.startPos.y - this.position.y) / this.trails[1].texture.height);
			this.trails[2].position.set(this.position.x + 15,this.position.y);
			this.trails[2].scale.y = Math.min(1,(this.startPos.y - this.position.y) / this.trails[2].texture.height);
		}
		if(!this.launchOff) {
			this.trails[0].scale.y = 0;
			this.trails[1].scale.y = 0;
			this.trails[2].scale.y = 0;
		}
	}
	,destroy: function() {
		var _g = 0;
		var _g1 = this.parts;
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			part.destroy();
		}
		var _g = 0;
		var _g1 = this.trails;
		while(_g < _g1.length) {
			var trail = _g1[_g];
			++_g;
			trail.destroy();
		}
		this.rockets.removeRocket(this);
	}
	,launch: function(cityEdgeY1) {
		this.launchOff = true;
		this.velocity = 1;
		this.dropOffPartsY = cityEdgeY1 - 300;
	}
	,updatePosition: function() {
		if(!this.launchOff) {
			var _this = this.position;
			this.startPos = new common_FPoint(_this.x,_this.y);
		}
		this.positionParts();
	}
	,update: function(timeMod) {
		if(this.launchOff) {
			this.position.y -= this.velocity * timeMod;
			this.velocity += 0.25 * timeMod;
			if(this.position.y < this.dropOffPartsY) {
				this.droppedOfPartsCurYDiff += this.velocity2 * timeMod;
				this.velocity2 += 0.35 * timeMod;
			} else {
				this.velocity2 = this.velocity;
			}
		} else {
			this.position.x = this.base.position.x;
			this.position.y = this.base.position.y;
		}
		this.positionParts();
	}
	,__class__: simulation_Rocket
});
