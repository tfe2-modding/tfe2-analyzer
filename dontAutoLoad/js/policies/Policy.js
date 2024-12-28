var policies_Policy = $hxClasses["policies.Policy"] = function() {
	var c = js_Boot.getClass(this);
	var className = c.__name__;
	this.info = Lambda.find(Resources.cityUpgradesInfo,function(i) {
		return "policies." + i.className == className;
	});
};
policies_Policy.__name__ = "policies.Policy";
policies_Policy.__interfaces__ = [ICreatableCityElement];
policies_Policy.prototype = {
	addToCity: function(city) {
		this.city = city;
	}
	,destroy: function() {
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(policies_Policy.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: policies_Policy
};
