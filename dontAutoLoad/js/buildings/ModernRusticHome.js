var buildings_ModernRusticHome = $hxClasses["buildings.ModernRusticHome"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.currentAdjBonus = 0;
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.adjecentBuildingEffects.push({ name : "modernRusticHomeCommunityFeeling", intensity : 1});
};
buildings_ModernRusticHome.__name__ = "buildings.ModernRusticHome";
buildings_ModernRusticHome.__super__ = buildings_House;
buildings_ModernRusticHome.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_ModernConveniences];
	}
	,onCityChange: function() {
		var newAdjBonus = 0;
		if(this.getEffectsOfAdjecentBuildings("modernRusticHomeCommunityFeeling") >= 3) {
			newAdjBonus = 15;
		}
		this.bonusAttractiveness += newAdjBonus - this.currentAdjBonus;
		if(newAdjBonus != (this.currentAdjBonus | 0)) {
			this.city.simulation.houseAssigner.shouldUpdateHouses = true;
		}
		this.currentAdjBonus = newAdjBonus | 0;
	}
	,__class__: buildings_ModernRusticHome
});
