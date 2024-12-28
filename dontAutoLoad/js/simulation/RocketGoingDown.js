var simulation_RocketGoingDown = $hxClasses["simulation.RocketGoingDown"] = function(simulation,stage,toWorld,withMission,toXIndex) {
	this.stage = stage;
	this.simulation = simulation;
	this.toWorld = toWorld;
	this.mission = withMission;
	if(toXIndex == null) {
		var bestFoundQuality = -5;
		var xIndexOptions = [];
		var _g = 0;
		var _g1 = toWorld.permanents.length;
		while(_g < _g1) {
			var x = _g++;
			var q = -1;
			var permanentStack = toWorld.permanents[x];
			if(permanentStack.length == 0) {
				q = 1;
			} else if(permanentStack[0] != null && permanentStack[0].is(Building) && !permanentStack[0].isRooftopBuilding) {
				q = 0;
			}
			if(q > bestFoundQuality) {
				bestFoundQuality = q;
				xIndexOptions = [];
			}
			if(q >= bestFoundQuality) {
				xIndexOptions.push(x);
			}
		}
		toXIndex = random_Random.fromArray(xIndexOptions);
	}
	this.toXIndex = toXIndex;
	this.yPositionAboveWorld = 1000 + toWorld.permanents[toXIndex].length * 20;
	this.sprite = Resources.makeSprite("spr_rocket_part1_down");
	this.setSpritePosition();
	stage.addChild(this.sprite);
};
simulation_RocketGoingDown.__name__ = "simulation.RocketGoingDown";
simulation_RocketGoingDown.fromLoad = function(queue,simulation,stage) {
	var simulation1 = simulation.city.worlds;
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var world = simulation1[intToRead];
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var toXIndex = intToRead;
	var floatToRead = queue.bytes.getDouble(queue.readStart);
	queue.readStart += 8;
	var yPositionAboveWorld = floatToRead;
	var simulation1 = simulation.rockets.currentMissions;
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var mission = simulation1[intToRead];
	var newRocket = new simulation_RocketGoingDown(simulation,stage,world,mission,toXIndex);
	newRocket.yPositionAboveWorld = yPositionAboveWorld;
	return newRocket;
};
simulation_RocketGoingDown.__super__ = simulation_Vehicle;
simulation_RocketGoingDown.prototype = $extend(simulation_Vehicle.prototype,{
	get_citizenOffset: function() {
		return new common_FPoint(8.,57);
	}
	,update: function(timeMod) {
		this.yPositionAboveWorld -= timeMod * 3;
		this.setSpritePosition();
		if(this.yPositionAboveWorld <= this.toWorld.permanents[this.toXIndex].length * 20 + 40) {
			this.mission.completeMission();
			this.destroy();
		}
	}
	,setSpritePosition: function() {
		this.sprite.position.set(this.toWorld.rect.x + this.toXIndex * 20,this.toWorld.rect.y - this.yPositionAboveWorld - 20 + 1);
		this.position = new common_FPoint(this.toWorld.rect.x + this.toXIndex * 20,this.toWorld.rect.y - this.yPositionAboveWorld - 20 + 1);
	}
	,destroy: function() {
		this.sprite.destroy();
		HxOverrides.remove(this.simulation.rocketsGoingDown,this);
	}
	,save: function(queue) {
		var value = this.simulation.city.worlds.indexOf(this.toWorld);
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.toXIndex;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.yPositionAboveWorld;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.simulation.rockets.currentMissions.indexOf(this.mission);
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,__class__: simulation_RocketGoingDown
});
