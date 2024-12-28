var cityUpgrades_CityUpgrade = $hxClasses["cityUpgrades.CityUpgrade"] = function() {
	var c = js_Boot.getClass(this);
	var className = c.__name__;
	this.info = Lambda.find(Resources.cityUpgradesInfo,function(i) {
		return "cityUpgrades." + i.className == className;
	});
};
cityUpgrades_CityUpgrade.__name__ = "cityUpgrades.CityUpgrade";
cityUpgrades_CityUpgrade.__interfaces__ = [ICreatableCityElement];
cityUpgrades_CityUpgrade.prototype = {
	addToCity: function(city) {
		this.city = city;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(cityUpgrades_CityUpgrade.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: cityUpgrades_CityUpgrade
};
