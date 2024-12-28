var miscCityElements_ReinforcedBridge = $hxClasses["miscCityElements.ReinforcedBridge"] = function(city,position,spriteIndex) {
	miscCityElements_Bridge.call(this,city,position,spriteIndex);
};
miscCityElements_ReinforcedBridge.__name__ = "miscCityElements.ReinforcedBridge";
miscCityElements_ReinforcedBridge.instantiateFromSave = function(city,queue) {
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var xx = intToRead;
	var intToRead = queue.bytes.getInt32(queue.readStart);
	queue.readStart += 4;
	var yy = intToRead;
	var spriteIndex = 0;
	if(queue.version >= 47) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		spriteIndex = intToRead;
	}
	var bridgePos = new common_Point(xx,yy);
	var newBridge = new miscCityElements_ReinforcedBridge(city,bridgePos,spriteIndex);
	return newBridge;
};
miscCityElements_ReinforcedBridge.__super__ = miscCityElements_Bridge;
miscCityElements_ReinforcedBridge.prototype = $extend(miscCityElements_Bridge.prototype,{
	get_texturesName: function() {
		return "spr_reinforcedbridge";
	}
	,get_potentialTexturesName: function() {
		return "spr_reinforcedbridge_potential";
	}
	,__class__: miscCityElements_ReinforcedBridge
});
