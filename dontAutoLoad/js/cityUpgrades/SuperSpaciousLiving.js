var cityUpgrades_SuperSpaciousLiving = $hxClasses["cityUpgrades.SuperSpaciousLiving"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_SuperSpaciousLiving.__name__ = "cityUpgrades.SuperSpaciousLiving";
cityUpgrades_SuperSpaciousLiving.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_SuperSpaciousLiving.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.progress.resources.buildingInfo.h["buildings.SpaciousHouse"].residents += 1;
	}
	,__class__: cityUpgrades_SuperSpaciousLiving
});
