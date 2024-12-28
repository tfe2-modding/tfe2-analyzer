var cityUpgrades_SecretiveLiving = $hxClasses["cityUpgrades.SecretiveLiving"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_SecretiveLiving.__name__ = "cityUpgrades.SecretiveLiving";
cityUpgrades_SecretiveLiving.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_SecretiveLiving.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.progress.resources.buildingInfo.h["buildings.SecretSocietyHouse"].quality += 25;
	}
	,__class__: cityUpgrades_SecretiveLiving
});
