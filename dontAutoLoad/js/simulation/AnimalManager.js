var simulation_AnimalManager = $hxClasses["simulation.AnimalManager"] = function(simulation) {
	this.simulation = simulation;
	this.animals = [];
};
simulation_AnimalManager.__name__ = "simulation.AnimalManager";
simulation_AnimalManager.prototype = {
	update: function(timeMod) {
		var _g = 0;
		var _g1 = this.animals;
		while(_g < _g1.length) {
			var animal = _g1[_g];
			++_g;
			animal.update(timeMod);
		}
	}
	,save: function(queue) {
		var value = this.animals.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.animals;
		while(_g < _g1.length) {
			var animal = _g1[_g];
			++_g;
			animal.save(queue);
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
			var newAnimal = new simulation_Animal(this.simulation.city,this.simulation.city.aboveCitizensInBuildingStage,null,0);
			newAnimal.load(queue);
			this.animals.push(newAnimal);
		}
	}
	,__class__: simulation_AnimalManager
};
