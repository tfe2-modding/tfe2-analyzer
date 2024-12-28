var miscCityElements_WoodenBridge = $hxClasses["miscCityElements.WoodenBridge"] = function(city,position,spriteIndex) {
	miscCityElements_Bridge.call(this,city,position,spriteIndex);
};
miscCityElements_WoodenBridge.__name__ = "miscCityElements.WoodenBridge";
miscCityElements_WoodenBridge.instantiateFromSave = function(city,queue) {
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
	var newBridge = new miscCityElements_WoodenBridge(city,bridgePos,spriteIndex);
	return newBridge;
};
miscCityElements_WoodenBridge.__super__ = miscCityElements_Bridge;
miscCityElements_WoodenBridge.prototype = $extend(miscCityElements_Bridge.prototype,{
	get_texturesName: function() {
		return "spr_woodenbridge";
	}
	,get_potentialTexturesName: function() {
		return "spr_woodenbridge_potential";
	}
	,__class__: miscCityElements_WoodenBridge
});
