var buildings_UnknownBuilding = $hxClasses["buildings.UnknownBuilding"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_UnknownBuilding.__name__ = "buildings.UnknownBuilding";
buildings_UnknownBuilding.__super__ = Building;
buildings_UnknownBuilding.prototype = $extend(Building.prototype,{
	load: function(queue,definition) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var qpos = intToRead;
		queue.readStart = qpos;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		var value = queue.size + 4;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,__class__: buildings_UnknownBuilding
});
