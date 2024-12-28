var miscCityElements_MiscCityElement = $hxClasses["miscCityElements.MiscCityElement"] = function(city,rect) {
	this.city = city;
	this.rect = rect;
	this.ancestors = [];
	var currClass = js_Boot.getClass(this);
	while(currClass != miscCityElements_MiscCityElement) {
		this.ancestors.push(currClass);
		currClass = currClass.__super__;
	}
};
miscCityElements_MiscCityElement.__name__ = "miscCityElements.MiscCityElement";
miscCityElements_MiscCityElement.__interfaces__ = [ICreatableCityElement];
miscCityElements_MiscCityElement.prototype = {
	onCityChange: function() {
	}
	,onCityChangeStage2: function() {
	}
	,postCreate: function() {
	}
	,update: function(timeMod) {
	}
	,save: function(queue) {
	}
	,onClick: function() {
	}
	,onHover: function(isActive) {
	}
	,is: function(permanentClass) {
		var _g = 0;
		var _g1 = this.ancestors;
		while(_g < _g1.length) {
			var anc = _g1[_g];
			++_g;
			if(permanentClass == anc) {
				return true;
			}
		}
		return false;
	}
	,__class__: miscCityElements_MiscCityElement
};
