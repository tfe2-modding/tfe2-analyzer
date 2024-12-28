var simulation_CitizenSpecialAction = $hxClasses["simulation.CitizenSpecialAction"] = function(citizen) {
	this.citizen = null;
	this.citizen = citizen;
	this.simulation = citizen.onWorld.city.simulation;
	this.time = this.simulation.time;
};
simulation_CitizenSpecialAction.__name__ = "simulation.CitizenSpecialAction";
simulation_CitizenSpecialAction.prototype = {
	update: function(timeMod) {
	}
	,isActive: function() {
		return false;
	}
	,onDie: function() {
		this.simulation.possibleCitizenHobbies.push({ hobbyClass : js_Boot.getClass(this), minimumCitizenAmount : 0});
	}
	,__class__: simulation_CitizenSpecialAction
};
