var buildings_ComfortableHouse = $hxClasses["buildings.ComfortableHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_ComfortableHouse.__name__ = "buildings.ComfortableHouse";
buildings_ComfortableHouse.__super__ = buildings_House;
buildings_ComfortableHouse.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_ComfortableCouch,buildingUpgrades_SmartSpeaker];
	}
	,__class__: buildings_ComfortableHouse
});
