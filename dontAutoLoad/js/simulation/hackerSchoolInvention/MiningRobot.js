var simulation_hackerSchoolInvention_MiningRobot = $hxClasses["simulation.hackerSchoolInvention.MiningRobot"] = function(simulation,stage) {
	this.waitTime = 0.0;
	this.targetX = -1;
	this.texture = Resources.getTexture("spr_miningrobot");
	this.relativeX = 7;
	simulation_HackerSchoolInvention.call(this,simulation,stage);
};
simulation_hackerSchoolInvention_MiningRobot.__name__ = "simulation.hackerSchoolInvention.MiningRobot";
simulation_hackerSchoolInvention_MiningRobot.__super__ = simulation_HackerSchoolInvention;
simulation_hackerSchoolInvention_MiningRobot.prototype = $extend(simulation_HackerSchoolInvention.prototype,{
	get_followingSpriteOffset: function() {
		return 2;
	}
	,update: function(timeMod) {
		var inTP = this.inPermanent;
		if(this.targetX < 0) {
			this.waitTime -= timeMod;
			if(this.waitTime <= 0) {
				this.targetX = random_Random.getInt(4,13);
			}
		} else if(inTP.materialsLeft > 0) {
			var done = false;
			if(this.targetX < this.relativeX) {
				this.relativeX -= 0.5 * timeMod;
				if(this.targetX >= this.relativeX) {
					done = true;
				}
			} else {
				this.relativeX += 0.5 * timeMod;
				if(this.targetX <= this.relativeX) {
					done = true;
				}
			}
			if(done) {
				this.relativeX = this.targetX;
				this.targetX = -1;
				this.waitTime = random_Random.getInt(20,50);
				var city = this.simulation.city;
				var stoneProduced = city.simulation.boostManager.currentGlobalBoostAmount * 0.2 * city.upgrades.vars.stoneMiningSpeed;
				inTP.materialsLeft -= stoneProduced;
				this.resourcesCollected += stoneProduced;
				city.materials.stone += stoneProduced;
				city.simulation.stats.materialProduction[2][0] += stoneProduced;
				inTP.updateTexture();
			}
		}
		simulation_HackerSchoolInvention.prototype.update.call(this,timeMod);
	}
	,windowAddInfo: function(gui) {
		var _gthis = this;
		gui.windowAddInfoText(common_Localize.lo("mining_robot"),null,"Arial15");
		gui.windowAddInfoText(null,function() {
			return common_Localize.lo("stone_mined_amount",[Math.floor(_gthis.resourcesCollected)]);
		});
	}
	,__class__: simulation_hackerSchoolInvention_MiningRobot
});
