var simulation_citizenSpecialActions_Protester2 = $hxClasses["simulation.citizenSpecialActions.Protester2"] = function(citizen) {
	simulation_citizenSpecialActions_Protester.call(this,citizen);
};
simulation_citizenSpecialActions_Protester2.__name__ = "simulation.citizenSpecialActions.Protester2";
simulation_citizenSpecialActions_Protester2.__super__ = simulation_citizenSpecialActions_Protester;
simulation_citizenSpecialActions_Protester2.prototype = $extend(simulation_citizenSpecialActions_Protester.prototype,{
	citizensAreVeryHappy: function() {
		return false;
	}
	,citizensAreVeryUnhappy: function() {
		if(this.simulation.happiness.happiness <= 10.01) {
			return this.simulation.happiness.veryUnhappyFromDay < 1 + ((this.simulation.time.timeSinceStart | 0) / 1440 | 0) - 2;
		} else {
			return false;
		}
	}
	,__class__: simulation_citizenSpecialActions_Protester2
});
