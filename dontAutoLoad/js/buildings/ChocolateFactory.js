var buildings_ChocolateFactory = $hxClasses["buildings.ChocolateFactory"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.materialsMadePerStepPerWorker = 0.0008;
	buildings_MaterialConvertingFactory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,"spr_chocolatefactory_frames","spr_chocolatefactory_idle");
};
buildings_ChocolateFactory.__name__ = "buildings.ChocolateFactory";
buildings_ChocolateFactory.__super__ = buildings_MaterialConvertingFactory;
buildings_ChocolateFactory.prototype = $extend(buildings_MaterialConvertingFactory.prototype,{
	get_normalEfficiency: function() {
		return 1;
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,get_possibleUpgrades: function() {
		return [];
	}
	,get_possibleBuildingModes: function() {
		return [buildingUpgrades_FactoryWorking,buildingUpgrades_FactoryDisabled];
	}
	,get_materialFrom: function() {
		return this.city.materials.cacao;
	}
	,set_materialFrom: function(value) {
		return this.city.materials.cacao = value;
	}
	,get_materialTo: function() {
		return this.city.materials.chocolate;
	}
	,set_materialTo: function(value) {
		var productionAmount = value - this.city.materials.chocolate;
		this.city.materials.chocolate += productionAmount;
		this.city.simulation.stats.materialProduction[7][0] += productionAmount;
		return this.city.materials.chocolate;
	}
	,workAnimation: function(citizen,timeMod) {
		if(this.workers.indexOf(citizen) == 1) {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(3 - citizen.relativeX) < spd) {
				citizen.relativeX = 3;
			} else {
				var num = 3 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
		} else {
			var spd = citizen.pathWalkSpeed * timeMod;
			Citizen.shouldUpdateDraw = true;
			if(Math.abs(7 - citizen.relativeX) < spd) {
				citizen.relativeX = 7;
			} else {
				var num = 7 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_MaterialConvertingFactory.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("chocolate_production",[_gthis.totalMaterialUsed | 0,_gthis.materialMade | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_MaterialConvertingFactory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_ChocolateFactory.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		buildings_MaterialConvertingFactory.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: buildings_ChocolateFactory
});
