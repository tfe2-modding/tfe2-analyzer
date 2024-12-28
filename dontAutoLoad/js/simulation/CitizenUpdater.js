var simulation_CitizenUpdater = $hxClasses["simulation.CitizenUpdater"] = function(simulation) {
	this.i = 0;
	this.simulation = simulation;
};
simulation_CitizenUpdater.__name__ = "simulation.CitizenUpdater";
simulation_CitizenUpdater.prototype = {
	update: function(timeMod) {
		this.i++;
		var _g = 0;
		var _g1 = this.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(!citizen.fullyBeingControlled) {
				Citizen.shouldUpdateDraw = false;
				if(citizen.delayCanViewSelfInBuilding) {
					citizen.delayCanViewSelfInBuilding = false;
					Citizen.shouldUpdateDraw = true;
				}
				citizen.updatePath(timeMod);
				if(citizen.path == null && !citizen.isRequestingPath) {
					citizen.updateDailyLife(timeMod);
				}
				if(Citizen.shouldUpdateDraw) {
					citizen.actuallyUpdateDraw();
				}
			}
		}
	}
	,__class__: simulation_CitizenUpdater
};
