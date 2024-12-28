var simulation_FrogManager = $hxClasses["simulation.FrogManager"] = function(simulation) {
	this.simulation = simulation;
	this.frogs = [];
};
simulation_FrogManager.__name__ = "simulation.FrogManager";
simulation_FrogManager.prototype = {
	update: function(timeMod) {
		if(this.simulation.time.timeSinceStart / 60 % 24 > 7 && this.simulation.time.timeSinceStart / 60 % 24 < 12) {
			var _g = 0;
			var _g1 = this.frogs;
			while(_g < _g1.length) {
				var frog = _g1[_g];
				++_g;
				frog.destroy();
			}
			this.frogs = [];
		} else {
			var _g = 0;
			var _g1 = this.frogs;
			while(_g < _g1.length) {
				var frog = _g1[_g];
				++_g;
				frog.update(timeMod);
			}
		}
	}
	,save: function(queue) {
		var value = this.frogs.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.frogs;
		while(_g < _g1.length) {
			var frog = _g1[_g];
			++_g;
			var value = frog.onWorld.id;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
			frog.save(queue);
		}
	}
	,addFrog: function(onWorld) {
		this.frogs.push(new simulation_Frog(this.simulation.city,this.simulation.city.justAboveCitizensForegroundStage,onWorld,random_Random.getInt(4,onWorld.rect.width - 4)));
	}
	,load: function(queue) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var len = intToRead;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			var onWorldId = [0];
			if(queue.version >= 46) {
				var onWorldId1 = onWorldId;
				var intToRead = queue.bytes.getInt32(queue.readStart);
				queue.readStart += 4;
				onWorldId1[0] = intToRead;
			}
			var onWorld = Lambda.find(this.simulation.city.worlds,(function(onWorldId) {
				return function(w) {
					return w.id == onWorldId[0];
				};
			})(onWorldId));
			var newFrog = new simulation_Frog(this.simulation.city,this.simulation.city.justAboveCitizensForegroundStage,onWorld,0);
			newFrog.load(queue);
			this.frogs.push(newFrog);
		}
	}
	,__class__: simulation_FrogManager
};
