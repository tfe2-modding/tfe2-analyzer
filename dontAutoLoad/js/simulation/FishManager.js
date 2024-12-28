var simulation_FishManager = $hxClasses["simulation.FishManager"] = function(simulation) {
	this.simulation = simulation;
	this.fishes = [];
};
simulation_FishManager.__name__ = "simulation.FishManager";
simulation_FishManager.prototype = {
	update: function(timeMod) {
		var _g = 0;
		var _g1 = this.fishes;
		while(_g < _g1.length) {
			var fish = _g1[_g];
			++_g;
			fish.update(timeMod);
		}
	}
	,save: function(queue) {
		var value = this.fishes.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.fishes;
		while(_g < _g1.length) {
			var fish = _g1[_g];
			++_g;
			fish.save(queue);
		}
	}
	,load: function(queue) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var len = intToRead;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			var newFish = new simulation_Fish(this.simulation.city,this.simulation.city.aboveCitizensInBuildingStage,null,0,0);
			newFish.load(queue);
			this.fishes.push(newFish);
		}
	}
	,__class__: simulation_FishManager
};
