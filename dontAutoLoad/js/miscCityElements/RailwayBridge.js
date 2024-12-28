var miscCityElements_RailwayBridge = $hxClasses["miscCityElements.RailwayBridge"] = function(city,position,spriteIndex) {
	if(spriteIndex == null) {
		spriteIndex = 0;
	}
	this.rightTrainStation = null;
	this.leftTrainStation = null;
	miscCityElements_Bridge.call(this,city,position,spriteIndex);
};
miscCityElements_RailwayBridge.__name__ = "miscCityElements.RailwayBridge";
miscCityElements_RailwayBridge.instantiateFromSave = function(city,queue) {
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
	var newBridge = new miscCityElements_RailwayBridge(city,bridgePos,spriteIndex);
	return newBridge;
};
miscCityElements_RailwayBridge.__super__ = miscCityElements_Bridge;
miscCityElements_RailwayBridge.prototype = $extend(miscCityElements_Bridge.prototype,{
	get_humanCanWalkOn: function() {
		return false;
	}
	,get_texturesName: function() {
		return "spr_railwaybridge";
	}
	,get_potentialTexturesName: function() {
		return "spr_reinforcedbridge_potential";
	}
	,onCityChangeStage2: function() {
		var curBuilding = this.leftBuilding;
		while(curBuilding != null && !curBuilding.is(buildings_TrainStation)) if(curBuilding.leftBuilding == null) {
			var railwayBridgeHere = this.city.miscCityElements.findSpecific(new common_Point(curBuilding.position.x - 20,curBuilding.position.y),buildings_TrainStation);
			if(railwayBridgeHere != null) {
				curBuilding = railwayBridgeHere.leftBuilding;
			} else {
				curBuilding = null;
			}
		} else {
			curBuilding = curBuilding.leftBuilding;
		}
		if(curBuilding != null && curBuilding.is(buildings_TrainStation)) {
			this.leftTrainStation = curBuilding;
		}
		curBuilding = this.rightBuilding;
		while(curBuilding != null && !curBuilding.is(buildings_TrainStation)) curBuilding = curBuilding.rightBuilding;
		if(curBuilding != null && curBuilding.is(buildings_TrainStation)) {
			this.rightTrainStation = curBuilding;
		}
		if(this.leftTrainStation != null && this.rightTrainStation != null) {
			this.leftTrainStation.rightTrainStationViaBridge = this.rightTrainStation;
			this.rightTrainStation.leftTrainStationViaBridge = this.leftTrainStation;
		}
	}
	,__class__: miscCityElements_RailwayBridge
});
