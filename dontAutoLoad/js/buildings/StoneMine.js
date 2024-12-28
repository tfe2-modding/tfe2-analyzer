var buildings_StoneMine = $hxClasses["buildings.StoneMine"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.stoneMinedPerActionBoost = 1;
	buildings_BlueCollarWork.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_StoneMine.__name__ = "buildings.StoneMine";
buildings_StoneMine.__super__ = buildings_BlueCollarWork;
buildings_StoneMine.prototype = $extend(buildings_BlueCollarWork.prototype,{
	get_stoneMinedPerAction: function() {
		return 0.2 * this.stoneMinedPerActionBoost;
	}
	,get_possibleUpgrades: function() {
		return [buildingUpgrades_BetterPickaxes,buildingUpgrades_AIMining];
	}
	,onBuild: function() {
		buildings_BlueCollarWork.prototype.onBuild.call(this);
		if(this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("standardization") != -1) {
			this.upgrades.push(Type.createInstance(buildingUpgrades_BetterPickaxes,[this.stage,this.city.cityMidStage,this.bgStage,this]));
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		var _gthis = this;
		this.doBlueCollarJob(citizen,timeMod,shouldStopWorking,[worldResources_Rock,buildings_StoneTeleporter],function(rock) {
			var finalStoneMineAction = _gthis.get_stoneMinedPerAction();
			var _this = _gthis.city.simulation;
			var finalStoneMineAction1 = finalStoneMineAction * (_gthis.city.progress.story.hiddenBoost && _gthis.city.materials.stone <= 4 ? Config.earlyGameFix1 ? 1.6 : 2 : 1) * _gthis.city.upgrades.vars.stoneMiningSpeed * (Config.earlyGameFix1 && _this.citizens.length < 30 ? 1.3 - 0.3 * (_this.citizens.length / 60) : 1) * _gthis.city.simulation.boostManager.currentGlobalBoostAmount;
			_gthis.city.materials.stone += finalStoneMineAction1;
			_gthis.city.simulation.stats.materialProduction[2][0] += finalStoneMineAction1;
			rock.materialsLeft -= finalStoneMineAction1;
		},90,120);
	}
	,__class__: buildings_StoneMine
});
