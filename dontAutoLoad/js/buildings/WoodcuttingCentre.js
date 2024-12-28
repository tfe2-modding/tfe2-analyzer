var buildings_WoodcuttingCentre = $hxClasses["buildings.WoodcuttingCentre"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_BlueCollarWork.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_WoodcuttingCentre.__name__ = "buildings.WoodcuttingCentre";
buildings_WoodcuttingCentre.__super__ = buildings_BlueCollarWork;
buildings_WoodcuttingCentre.prototype = $extend(buildings_BlueCollarWork.prototype,{
	work: function(citizen,timeMod,shouldStopWorking) {
		var _gthis = this;
		this.doBlueCollarJob(citizen,timeMod,shouldStopWorking,[worldResources_Forest,buildings_TreePlantation],function(forest) {
			var _this = _gthis.city.simulation;
			var finalWoodCutPerAction = 0.2 * (_gthis.city.progress.story.hiddenBoost && _gthis.city.materials.wood <= 6 ? 1.75 : 1) * (Config.earlyGameFix1 && _this.citizens.length < 30 ? 1.3 - 0.3 * (_this.citizens.length / 60) : 1) * _gthis.city.simulation.boostManager.currentGlobalBoostAmount;
			_gthis.city.materials.wood += finalWoodCutPerAction;
			_gthis.city.simulation.stats.materialProduction[1][0] += finalWoodCutPerAction;
			forest.materialsLeft -= finalWoodCutPerAction;
		},60,90);
	}
	,__class__: buildings_WoodcuttingCentre
});
