var simulation_winter_Winter = $hxClasses["simulation.winter.Winter"] = function(city) {
	this.city = city;
	this.snow = new simulation_winter_Snow(city);
	this.santaHats = new simulation_winter_SantaHats(city);
};
simulation_winter_Winter.__name__ = "simulation.winter.Winter";
simulation_winter_Winter.prototype = {
	update: function(timeMod) {
		if(this.santaHats != null) {
			this.santaHats.update(timeMod);
		}
		if(this.snow != null) {
			this.snow.update(timeMod);
		}
	}
	,__class__: simulation_winter_Winter
};
