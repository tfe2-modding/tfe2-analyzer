var simulation_citizenSpecialActions_Protester4 = $hxClasses["simulation.citizenSpecialActions.Protester4"] = function(citizen) {
	simulation_citizenSpecialActions_Protester.call(this,citizen);
};
simulation_citizenSpecialActions_Protester4.__name__ = "simulation.citizenSpecialActions.Protester4";
simulation_citizenSpecialActions_Protester4.__super__ = simulation_citizenSpecialActions_Protester;
simulation_citizenSpecialActions_Protester4.prototype = $extend(simulation_citizenSpecialActions_Protester.prototype,{
	citizensAreVeryHappy: function() {
		return false;
	}
	,citizensAreVeryUnhappy: function() {
		if(this.simulation.happiness.happiness <= 10.01) {
			return this.simulation.happiness.veryUnhappyFromDay < 1 + ((this.simulation.time.timeSinceStart | 0) / 1440 | 0) - 7;
		} else {
			return false;
		}
	}
	,__class__: simulation_citizenSpecialActions_Protester4
});
