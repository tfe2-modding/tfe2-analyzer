var buildings_ExplorationCentre = $hxClasses["buildings.ExplorationCentre"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.hasSearchedForRuinsThisStep = false;
	this.currentAction = buildings_CurrentExplorationCentreAction.Unknown;
	this.nearestRuins = null;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_ExplorationCentre.__name__ = "buildings.ExplorationCentre";
buildings_ExplorationCentre.__super__ = buildings_Work;
buildings_ExplorationCentre.prototype = $extend(buildings_Work.prototype,{
	addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			switch(_gthis.currentAction._hx_index) {
			case 0:
				return common_Localize.lo("current_task_looking");
			case 1:
				return common_Localize.lo("current_task_exploring");
			case 2:
				return common_Localize.lo("current_task_investigating");
			}
		});
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			citizen.hasWorkTools = false;
		} else if(citizen.hasWorkTools) {
			if(((citizen.inPermanent) instanceof worldResources_AlienRuins)) {
				this.exploreTheseRuins(citizen);
			} else {
				if(this.nearestRuins == null && !this.hasSearchedForRuinsThisStep && !Object.prototype.hasOwnProperty.call(this.world.knownResourceInavailability.h,"AlienRuins")) {
					if(!this.city.simulation.permanentFinder.canPerformQuery()) {
						return;
					}
					this.nearestRuins = this.city.simulation.permanentFinder.query(this,function(pm) {
						if(pm.is(worldResources_AlienRuins)) {
							return pm.explored < 100;
						} else {
							return false;
						}
					});
					this.hasSearchedForRuinsThisStep = true;
					if(this.nearestRuins == null) {
						this.world.knownResourceInavailability.h["AlienRuins"] = true;
					}
				}
				this.exploreOrInvestigate(citizen,timeMod);
			}
		} else if(citizen.inPermanent == this) {
			citizen.moveAndWait(4,30,function() {
				citizen.hasWorkTools = true;
			},true);
		} else {
			citizen.simulation.pathfinder.findPath(citizen,this);
			citizen.pathOnFail = null;
		}
	}
	,exploreTheseRuins: function(citizen) {
		var _gthis = this;
		var theseRuins = citizen.inPermanent;
		var moveX = theseRuins.standingPlaces.length == 0 ? random_Random.getInt(1,17) : random_Random.fromArray(theseRuins.standingPlaces);
		var speedMod = 0;
		if(this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("efficientExploration") != -1) {
			speedMod = -20;
		} else if(this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("carefulExploration") != -1) {
			speedMod = 30;
		}
		citizen.moveAndWait(moveX,random_Random.getInt(90 + speedMod,180 + speedMod),function() {
			if(theseRuins.explored < 100) {
				var exploredOld = Math.floor(theseRuins.explored);
				theseRuins.explored += 0.25;
				var _this = _gthis.city.simulation;
				var productionAmount = 0.25 * (Config.earlyGameFix1 && _this.citizens.length < 30 ? 1.3 - 0.3 * (_this.citizens.length / 60) : 1) * _gthis.city.simulation.boostManager.currentGlobalBoostAmount;
				_gthis.city.materials.knowledge += productionAmount;
				_gthis.city.simulation.stats.materialProduction[10][0] += productionAmount;
				theseRuins.awardAnyBonuses();
				if(_gthis.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("carefulExploration") != -1 && Math.floor(theseRuins.explored) != exploredOld) {
					if(random_Random.getFloat(1) < 0.5) {
						theseRuins.bonusStoneGiven += 1;
						_gthis.city.materials.stone += 1;
						_gthis.city.simulation.stats.materialProduction[2][0] += 1;
					} else {
						theseRuins.bonusWoodGiven += 1;
						_gthis.city.materials.wood += 1;
						_gthis.city.simulation.stats.materialProduction[1][0] += 1;
					}
				}
				if(theseRuins.explored >= 100) {
					theseRuins.explored = 100;
					if(citizen.inPermanent != null && citizen.inPermanent.isBuilding) {
						var building = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
						citizen.relativeX = building.worldPosition.x * 20 + building.doorX;
					} else {
						citizen.relativeX += citizen.inPermanent.worldPosition.x * 20;
					}
					if(citizen.inPermanent != null) {
						citizen.inPermanent.onCitizenLeave(citizen,null);
					}
					citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
					citizen.set_drawOnStage(citizen.foregroundStage);
					citizen.inPermanent = null;
					citizen.relativeY = 0;
					Citizen.shouldUpdateDraw = true;
					_gthis.nearestRuins = null;
				}
			} else {
				if(citizen.inPermanent != null && citizen.inPermanent.isBuilding) {
					var building = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
					citizen.relativeX = building.worldPosition.x * 20 + building.doorX;
				} else {
					citizen.relativeX += citizen.inPermanent.worldPosition.x * 20;
				}
				if(citizen.inPermanent != null) {
					citizen.inPermanent.onCitizenLeave(citizen,null);
				}
				citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
				citizen.set_drawOnStage(citizen.foregroundStage);
				citizen.inPermanent = null;
				citizen.relativeY = 0;
				Citizen.shouldUpdateDraw = true;
				_gthis.nearestRuins = null;
			}
		},true);
	}
	,exploreOrInvestigate: function(citizen,timeMod) {
		if(this.nearestRuins != null) {
			citizen.simulation.pathfinder.findPath(citizen,this.nearestRuins);
			citizen.pathOnFail = null;
			this.currentAction = buildings_CurrentExplorationCentreAction.Exploring;
		} else {
			this.currentAction = buildings_CurrentExplorationCentreAction.Investigating;
			if(citizen.inPermanent == this) {
				var positionInArray = this.workers.indexOf(citizen);
				if((positionInArray == 1 || positionInArray == 2) && citizen.isAtGroundLevel()) {
					citizen.changeFloor();
				} else {
					var correctXMin = positionInArray == 2 ? 12 : 3;
					var correctXMax = positionInArray == 2 ? 16 : 7;
					if(citizen.relativeX >= correctXMin && citizen.relativeX < correctXMax) {
						var productionAmount = 0.001 * timeMod * this.city.simulation.happiness.actionSpeedModifier * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
						this.city.materials.knowledge += productionAmount;
						this.city.simulation.stats.materialProduction[10][0] += productionAmount;
					} else {
						var moveToX = random_Random.getInt(correctXMin,correctXMax);
						var pool = pooling_Int32ArrayPool.pool;
						var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
						arr[0] = 4;
						arr[1] = moveToX;
						citizen.setPath(arr,0,2,true);
						citizen.pathEndFunction = null;
						citizen.pathOnlyRelatedTo = citizen.inPermanent;
					}
				}
			} else {
				citizen.simulation.pathfinder.findPath(citizen,this);
				citizen.pathOnFail = null;
			}
		}
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
		this.hasSearchedForRuinsThisStep = false;
	}
	,invalidatePathfindingRelatedInfo: function() {
		buildings_Work.prototype.invalidatePathfindingRelatedInfo.call(this);
		this.nearestRuins = null;
	}
	,__class__: buildings_ExplorationCentre
});
