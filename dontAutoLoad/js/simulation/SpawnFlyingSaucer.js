var simulation_SpawnFlyingSaucer = $hxClasses["simulation.SpawnFlyingSaucer"] = function(simulation,stage,toWorld,spawn,toXIndex) {
	this.stage = stage;
	this.simulation = simulation;
	this.toWorld = toWorld;
	this.spawn = spawn;
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
	this.sprite = Resources.makeSprite("spr_flyingsaucer");
	this.setSpritePosition();
	stage.addChild(this.sprite);
};
simulation_SpawnFlyingSaucer.__name__ = "simulation.SpawnFlyingSaucer";
simulation_SpawnFlyingSaucer.fromLoad = function(queue,simulation,stage) {
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
	var spawn = queue.readJSON();
	var newFlyingSaucer = new simulation_SpawnFlyingSaucer(simulation,stage,world,spawn,toXIndex);
	newFlyingSaucer.yPositionAboveWorld = yPositionAboveWorld;
	return newFlyingSaucer;
};
simulation_SpawnFlyingSaucer.prototype = {
	update: function(timeMod) {
		this.yPositionAboveWorld -= timeMod * 3;
		this.setSpritePosition();
		if(this.yPositionAboveWorld <= this.toWorld.permanents[this.toXIndex].length * 20) {
			this.spawnCitizens();
			this.destroy();
		}
	}
	,spawnCitizens: function() {
		var startPermanent = null;
		var startX = null;
		var permanentsArray = this.toWorld.permanents[this.toXIndex];
		if(permanentsArray.length == 0) {
			startX = this.toXIndex * 20;
		} else {
			startPermanent = permanentsArray[permanentsArray.length - 1];
		}
		var _g = 0;
		var _g1 = this.spawn.amount;
		while(_g < _g1) {
			var i = _g++;
			var age = this.spawn.ageRangeMin;
			if(this.spawn.ageRangeMin != this.spawn.ageRangeMax) {
				age = random_Random.getFloat(this.spawn.ageRangeMin,this.spawn.ageRangeMax);
			}
			if(this.simulation.citizens.length + this.numberOfNewCitizens() < this.simulation.babyMaker.softPopLimit) {
				this.simulation.createCitizen(this.toWorld,age,startPermanent,startX);
			}
		}
	}
	,numberOfNewCitizens: function() {
		var num = 0;
		var _g = 0;
		var _g1 = this.simulation.citizenSpawners;
		while(_g < _g1.length) {
			var sp = _g1[_g];
			++_g;
			num += sp.spawn.amount;
		}
		return num;
	}
	,setSpritePosition: function() {
		this.sprite.position.set(this.toWorld.rect.x + this.toXIndex * 20,this.toWorld.rect.y - this.yPositionAboveWorld - 20 + 1);
	}
	,destroy: function() {
		this.sprite.destroy();
		HxOverrides.remove(this.simulation.citizenSpawners,this);
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
		queue.addJSON(this.spawn);
	}
	,__class__: simulation_SpawnFlyingSaucer
};
