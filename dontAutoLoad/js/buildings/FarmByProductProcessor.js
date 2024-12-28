var buildings_FarmByProductProcessor = $hxClasses["buildings.FarmByProductProcessor"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.cachedAdjacencyExpiration = 0.0;
	this.cachedAdjacencyValue = 0.0;
	this.woodMade = 0;
	buildings_Factory.call(this,game,stage,bgStage,city,world,position,worldPosition,id,"spr_farmbyproductprocessor_frames","spr_farmbyproductprocessor_idle");
};
buildings_FarmByProductProcessor.__name__ = "buildings.FarmByProductProcessor";
buildings_FarmByProductProcessor.__super__ = buildings_Factory;
buildings_FarmByProductProcessor.prototype = $extend(buildings_Factory.prototype,{
	get_walkThroughCanViewSelfInThisBuilding: function() {
		return false;
	}
	,possiblyBeActive: function(timeMod) {
		this.cachedAdjacencyExpiration--;
		var adjacentFarmNumberToUse = this.cachedAdjacencyValue;
		if(this.cachedAdjacencyExpiration <= 0) {
			adjacentFarmNumberToUse = this.adjacentFarmNumber(true);
			this.cachedAdjacencyValue = adjacentFarmNumberToUse;
			this.cachedAdjacencyExpiration = 72;
		}
		var woodProduction = 0.0014 * this.activeWorkersTotalEducation * this.city.simulation.happiness.actionSpeedModifier * this.city.simulation.boostManager.currentGlobalBoostAmount * timeMod * adjacentFarmNumberToUse;
		this.city.materials.wood += woodProduction;
		this.city.simulation.stats.materialProduction[1][0] += woodProduction;
		this.woodMade += woodProduction;
		return woodProduction > 0;
	}
	,adjacentFarmNumber: function(trueValue) {
		var effectType = "farm";
		var total = 0.0;
		if(this.leftBuilding != null) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.leftBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			var thisVal = total1;
			if(thisVal > 0.5) {
				if(trueValue) {
					if(this.leftBuilding.is(buildings_Work)) {
						var workBuilding = this.leftBuilding;
						total += workBuilding.workers.length / workBuilding.get_jobs();
					} else {
						var houseBuilding = this.leftBuilding;
						total += houseBuilding.residents.length / houseBuilding.get_residentCapacity();
					}
				} else {
					++total;
				}
			}
		}
		if(this.rightBuilding != null && (this.rightBuilding.rightBuilding == null || !this.rightBuilding.rightBuilding.is(buildings_FarmByProductProcessor))) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.rightBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			var thisVal = total1;
			if(thisVal > 0.5) {
				if(trueValue) {
					if(this.rightBuilding.is(buildings_Work)) {
						var workBuilding = this.rightBuilding;
						total += workBuilding.workers.length / workBuilding.get_jobs();
					} else {
						var houseBuilding = this.rightBuilding;
						total += houseBuilding.residents.length / houseBuilding.get_residentCapacity();
					}
				} else {
					++total;
				}
			}
		}
		if(this.topBuilding != null && (this.topBuilding.leftBuilding == null || !this.topBuilding.leftBuilding.is(buildings_FarmByProductProcessor)) && (this.topBuilding.rightBuilding == null || !this.topBuilding.rightBuilding.is(buildings_FarmByProductProcessor))) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.topBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			var thisVal = total1;
			if(thisVal > 0.5) {
				if(trueValue) {
					if(this.topBuilding.is(buildings_Work)) {
						var workBuilding = this.topBuilding;
						total += workBuilding.workers.length / workBuilding.get_jobs();
					} else {
						var houseBuilding = this.topBuilding;
						total += houseBuilding.residents.length / houseBuilding.get_residentCapacity();
					}
				} else {
					++total;
				}
			}
		}
		if(this.bottomBuilding != null && (this.bottomBuilding.leftBuilding == null || !this.bottomBuilding.leftBuilding.is(buildings_FarmByProductProcessor)) && (this.bottomBuilding.rightBuilding == null || !this.bottomBuilding.rightBuilding.is(buildings_FarmByProductProcessor)) && (this.bottomBuilding.bottomBuilding == null || !this.bottomBuilding.bottomBuilding.is(buildings_FarmByProductProcessor))) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.bottomBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			var thisVal = total1;
			if(thisVal > 0.5) {
				if(trueValue) {
					if(this.bottomBuilding.is(buildings_Work)) {
						var workBuilding = this.bottomBuilding;
						total += workBuilding.workers.length / workBuilding.get_jobs();
					} else {
						var houseBuilding = this.bottomBuilding;
						total += houseBuilding.residents.length / houseBuilding.get_residentCapacity();
					}
				} else {
					++total;
				}
			}
		}
		return total;
	}
	,workAnimation: function(citizen,timeMod) {
		if(citizen.relativeY != 10) {
			if(this.workers.indexOf(citizen) == 0) {
				citizen.setRelativePos(12,10);
			} else {
				citizen.setRelativePos(15,10);
			}
		}
	}
	,canShowActiveTextures: function() {
		return true;
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Factory.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			if((_gthis.adjacentFarmNumber(false) | 0) == 1) {
				return common_Localize.lo("producing_by_products_for_1_farm");
			} else {
				return common_Localize.lo("producing_by_products_for_n_farms",[_gthis.adjacentFarmNumber(false) | 0]);
			}
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("wood_produced",[_gthis.woodMade | 0]);
		});
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Factory.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_FarmByProductProcessor.saveDefinition);
		}
		var value = this.woodMade;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_Factory.prototype.load.call(this,queue);
		if(queue.version < 22) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"woodMade")) {
			this.woodMade = loadMap.h["woodMade"];
		}
	}
	,__class__: buildings_FarmByProductProcessor
});
