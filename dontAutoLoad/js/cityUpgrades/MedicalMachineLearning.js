var cityUpgrades_MedicalMachineLearning = $hxClasses["cityUpgrades.MedicalMachineLearning"] = function() {
	cityUpgrades_CityUpgrade.call(this);
};
cityUpgrades_MedicalMachineLearning.__name__ = "cityUpgrades.MedicalMachineLearning";
cityUpgrades_MedicalMachineLearning.__super__ = cityUpgrades_CityUpgrade;
cityUpgrades_MedicalMachineLearning.prototype = $extend(cityUpgrades_CityUpgrade.prototype,{
	addToCity: function(city) {
		this.city = city;
		city.upgrades.vars.extendAgeBy += 0.05;
	}
	,__class__: cityUpgrades_MedicalMachineLearning
});
