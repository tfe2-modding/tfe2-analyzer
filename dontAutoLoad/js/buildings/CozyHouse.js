var buildings_CozyHouse = $hxClasses["buildings.CozyHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_CozyHouse.__name__ = "buildings.CozyHouse";
buildings_CozyHouse.__super__ = buildings_House;
buildings_CozyHouse.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_CozyFlowers,buildingUpgrades_MoodLighting];
	}
	,__class__: buildings_CozyHouse
});
