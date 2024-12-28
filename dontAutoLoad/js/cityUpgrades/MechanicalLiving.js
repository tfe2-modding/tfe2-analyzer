var cityUpgrades_MechanicalLiving = $hxClasses["cityUpgrades.MechanicalLiving"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_MechanicalLiving.__name__ = "cityUpgrades.MechanicalLiving";
cityUpgrades_MechanicalLiving.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_MechanicalLiving.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		cityUpgrades_CityUpgrade.prototype.addToCity.call(this,city);
		city.progress.resources.buildingInfo.h["buildings.MechanicalHouse"].residents += 1;
		city.progress.resources.buildingInfo.h["buildings.TinkerersHome"].residents += 1;
	}
	,__class__: cityUpgrades_MechanicalLiving
});
