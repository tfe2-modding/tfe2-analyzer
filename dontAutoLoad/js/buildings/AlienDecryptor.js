var buildings_AlienDecryptor = $hxClasses["buildings.AlienDecryptor"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.timeWorking = 0;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_AlienDecryptor.__name__ = "buildings.AlienDecryptor";
buildings_AlienDecryptor.__super__ = Building;
buildings_AlienDecryptor.prototype = $extend(Building.prototype,{
	update: function(timeMod) {
		this.timeWorking += timeMod * this.city.simulation.time.minutesPerTick;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_AlienDecryptor.saveDefinition);
		}
		var value = this.timeWorking;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timeWorking")) {
			this.timeWorking = loadMap.h["timeWorking"];
		}
	}
	,__class__: buildings_AlienDecryptor
});
