var simulation_EntertainmentTypeHelpers = $hxClasses["simulation.EntertainmentTypeHelpers"] = function() { };
simulation_EntertainmentTypeHelpers.__name__ = "simulation.EntertainmentTypeHelpers";
simulation_EntertainmentTypeHelpers.getName = function(type) {
	if(type == null) {
		return common_Localize.lo("sport");
	} else {
		switch(type) {
		case 0:
			return common_Localize.lo("pubs_restaurants");
		case 1:
			return common_Localize.lo("nature");
		case 2:
			return common_Localize.lo("night_clubs");
		case 3:
			return common_Localize.lo("art");
		case 4:
			return common_Localize.lo("gaming");
		case 5:
			return common_Localize.lo("libraries");
		case 6:
			return common_Localize.lo("other");
		}
	}
};
