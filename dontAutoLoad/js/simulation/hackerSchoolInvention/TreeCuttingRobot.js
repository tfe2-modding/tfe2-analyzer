var simulation_hackerSchoolInvention_TreeCuttingRobot = $hxClasses["simulation.hackerSchoolInvention.TreeCuttingRobot"] = function(simulation,stage) {
	this.waitTime = 0.0;
	this.targetX = -1;
	this.texture = Resources.getTexture("spr_treecuttingrobot");
	this.relativeX = 7;
	simulation_HackerSchoolInvention.call(this,simulation,stage);
	this.lifetime = 60 * random_Random.getInt(20,40) / 0.5;
};
simulation_hackerSchoolInvention_TreeCuttingRobot.__name__ = "simulation.hackerSchoolInvention.TreeCuttingRobot";
simulation_hackerSchoolInvention_TreeCuttingRobot.__super__ = simulation_HackerSchoolInvention;
simulation_hackerSchoolInvention_TreeCuttingRobot.prototype = $extend(simulation_HackerSchoolInvention.prototype,{
	get_followingSpriteOffset: function() {
		return 2;
	}
	,update: function(timeMod) {
		var inWCP = this.inPermanent;
		if(this.targetX < 0) {
			this.waitTime -= timeMod;
			if(this.waitTime <= 0) {
				this.targetX = random_Random.getInt(2) * 6 + 5;
			}
		} else if(inWCP.materialsLeft > 0) {
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
				var woodProduced = city.simulation.boostManager.currentGlobalBoostAmount * 0.4 * city.upgrades.vars.stoneMiningSpeed;
				inWCP.materialsLeft -= woodProduced;
				this.resourcesCollected += woodProduced;
				city.materials.wood += woodProduced;
				city.simulation.stats.materialProduction[1][0] += woodProduced;
				inWCP.updateTexture();
			}
		}
		simulation_HackerSchoolInvention.prototype.update.call(this,timeMod);
	}
	,windowAddInfo: function(gui) {
		var _gthis = this;
		gui.windowAddInfoText(common_Localize.lo("woodcutting_robot"),null,"Arial15");
		gui.windowAddInfoText(null,function() {
			return common_Localize.lo("wood_cut_amount",[Math.floor(_gthis.resourcesCollected)]);
		});
	}
	,__class__: simulation_hackerSchoolInvention_TreeCuttingRobot
});
