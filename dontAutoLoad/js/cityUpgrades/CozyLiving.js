var cityUpgrades_CozyLiving = $hxClasses["cityUpgrades.CozyLiving"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_CozyLiving.__name__ = "cityUpgrades.CozyLiving";
cityUpgrades_CozyLiving.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_CozyLiving.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.progress.resources.buildingInfo.h["buildings.CozyHouse"].quality += 10;
		city.progress.unlocks.unlock(buildingUpgrades_MoodLighting);
	}
	,__class__: cityUpgrades_CozyLiving
});
