var buildings_HauntedHovel = $hxClasses["buildings.HauntedHovel"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.yearsToLiveLongerPerYearIfLivingHere = -0.05;
};
buildings_HauntedHovel.__name__ = "buildings.HauntedHovel";
buildings_HauntedHovel.__super__ = buildings_House;
buildings_HauntedHovel.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [];
	}
	,__class__: buildings_HauntedHovel
});
