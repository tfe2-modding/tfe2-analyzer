var cityActions_TravelTimes = $hxClasses["cityActions.TravelTimes"] = function() { };
cityActions_TravelTimes.__name__ = "cityActions.TravelTimes";
cityActions_TravelTimes.doHighlight = function(city) {
	var highlightTextures = Resources.getTexturesByWidth("spr_hoverhint",22);
	city.setPermanentTexture(function(pm) {
		var ttime = cityActions_TravelTimes.getAverageTravelTime(pm);
		if(ttime == null) {
			return null;
		}
		if(ttime == -1) {
			var this1 = [0,0,0.5];
			return { texture : Resources.getTexture("spr_highlightedbuilding"), color : thx_color_Rgb.toInt(thx_color_Hsl.toRgb(this1))};
		}
		var tint = Math.max(0,120 - 0.4 * ttime);
		var brightness = Math.max(0.5,0.7 - 0.001 * ttime);
		var this1 = [tint,1,0.5];
		var col = this1;
		if(Settings.colorBlindMode) {
			var this1 = [360 - tint * 1.5,1,brightness];
			col = this1;
		}
		return { texture : Resources.getTexture("spr_highlightedbuilding"), color : thx_color_Rgb.toInt(thx_color_Hsl.toRgb(col))};
	},Settings.colorBlindMode ? 0.6 : 0.5);
};
cityActions_TravelTimes.getPeopleOfPermanent = function(pm) {
	var people = null;
	if(pm.is(buildings_Work)) {
		var pmAsWork = pm;
		people = pmAsWork.workers;
	} else if(pm.is(buildings_House)) {
		var pmAsHouse = pm;
		people = pmAsHouse.residents;
	}
	if(people == null || people.length == 0) {
		return null;
	}
	return people;
};
cityActions_TravelTimes.getAverageTravelTime = function(pm) {
	var people = cityActions_TravelTimes.getPeopleOfPermanent(pm);
	if(people == null) {
		return null;
	}
	var avgTime = 0.0;
	var avgOver = 0;
	var _g = 0;
	while(_g < people.length) {
		var person = people[_g];
		++_g;
		if(person.home == person.job) {
			++avgOver;
		} else if(person.lastMorningCommuteTime > 0 && person.home != null && person.job != null) {
			avgTime += person.lastMorningCommuteTime;
			++avgOver;
		}
	}
	if(avgOver == 0) {
		return -1.0;
	}
	return avgTime / avgOver;
};
