var buildings_AlienHouse = $hxClasses["buildings.AlienHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.adjecentBuildingEffects.push({ name : "alienHouse", intensity : 1});
};
buildings_AlienHouse.__name__ = "buildings.AlienHouse";
buildings_AlienHouse.__super__ = buildings_House;
buildings_AlienHouse.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_LivingComputer];
	}
	,__class__: buildings_AlienHouse
});
