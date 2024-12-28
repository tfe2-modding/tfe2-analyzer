var cityUpgrades_GeneEditing = $hxClasses["cityUpgrades.GeneEditing"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_GeneEditing.__name__ = "cityUpgrades.GeneEditing";
cityUpgrades_GeneEditing.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_GeneEditing.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.hasGeneEditing = true;
		city.progress.unlocks.unlock(worldResources_RedForest);
		city.progress.unlocks.unlock(worldResources_PurpleForest);
	}
	,__class__: cityUpgrades_GeneEditing
});
