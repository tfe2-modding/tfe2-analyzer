var buildings_BlueCollarWork = $hxClasses["buildings.BlueCollarWork"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.hasNotSearchedForResourceGatherPlaceThisStep = true;
	this.nearestResourceGatherPlace = null;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_BlueCollarWork.__name__ = "buildings.BlueCollarWork";
buildings_BlueCollarWork.__super__ = buildings_Work;
buildings_BlueCollarWork.prototype = $extend(buildings_Work.prototype,{
	doBlueCollarJob: function(citizen,timeMod,shouldStopWorking,resourceOptions,getResource,minChopTime,maxChopTime) {
		var _gthis = this;
		if(shouldStopWorking) {
			if(!citizen.hasWorkTools) {
				citizen.currentAction = 2;
			} else if(citizen.inPermanent == this) {
				citizen.moveAndWait(4,20,function() {
					citizen.hasWorkTools = false;
				});
			} else {
				citizen.simulation.pathfinder.findPath(citizen,this);
				citizen.pathOnFail = null;
			}
		} else if(citizen.hasWorkTools) {
			var citizenInResource = false;
			var _g = 0;
			while(_g < resourceOptions.length) {
				var o = resourceOptions[_g];
				++_g;
				if(js_Boot.__instanceof(citizen.inPermanent,o)) {
					citizenInResource = true;
					break;
				}
			}
			if(citizenInResource && (citizen.inPermanent.materialsLeft > 0 || citizen.inPermanent.get_stayIfEmpty()) && !citizen.inPermanent.get_doNotGather()) {
				var resourceGatherPlace = citizen.inPermanent;
				if(resourceGatherPlace.materialsLeft > 0) {
					var modifyWithHappiness = true;
					if(modifyWithHappiness == null) {
						modifyWithHappiness = false;
					}
					citizen.moveAndWait(random_Random.getInt(resourceGatherPlace.minCitizenX,resourceGatherPlace.maxCitizenX),random_Random.getInt(minChopTime,maxChopTime),function() {
						if(resourceGatherPlace.get_doNotGather()) {
							_gthis.nearestResourceGatherPlace = null;
							return;
						}
						getResource(resourceGatherPlace);
						if(resourceGatherPlace.materialsLeft <= 0 && !resourceGatherPlace.get_stayIfEmpty()) {
							_gthis.nearestResourceGatherPlace = null;
							if(resourceGatherPlace.get_destroyedOnEmpty()) {
								resourceGatherPlace.destroy();
							}
						} else {
							resourceGatherPlace.updateTexture();
						}
					},modifyWithHappiness,false);
				}
			} else {
				var performCitizenAction = true;
				if(this.nearestResourceGatherPlace == null || this.nearestResourceGatherPlace.materialsLeft <= 0 && !this.nearestResourceGatherPlace.get_stayIfEmpty() || this.nearestResourceGatherPlace.get_doNotGather()) {
					this.nearestResourceGatherPlace = null;
					var notRateLimited = this.city.simulation.permanentFinder.canPerformQuery();
					if(!notRateLimited) {
						performCitizenAction = false;
					}
					var tmp;
					if(notRateLimited && this.hasNotSearchedForResourceGatherPlaceThisStep) {
						var this1 = this.world.knownResourceInavailability;
						var key = resourceOptions[0].__name__;
						tmp = !Object.prototype.hasOwnProperty.call(this1.h,key);
					} else {
						tmp = false;
					}
					if(tmp) {
						if(this.city.simulation.resourcePriorityManager.hasResourcePrioritiesFor(resourceOptions[0])) {
							var findFunc = resourceOptions.length == 0 ? function(pm) {
								if(pm.is(resourceOptions[0]) && pm.materialsLeft > 0 && !pm.get_doNotGather()) {
									return _gthis.city.simulation.resourcePriorityManager.isPrioritized(pm);
								} else {
									return false;
								}
							} : function(pm) {
								if(common_ArrayExtensions.any(resourceOptions,function(ro) {
									return pm.is(ro);
								}) && pm.materialsLeft > 0 && !pm.get_doNotGather()) {
									return _gthis.city.simulation.resourcePriorityManager.isPrioritized(pm);
								} else {
									return false;
								}
							};
							this.nearestResourceGatherPlace = this.city.simulation.permanentFinder.query(this,findFunc);
						}
						if(this.nearestResourceGatherPlace == null) {
							var findFunc = resourceOptions.length == 2 ? function(pm) {
								if((pm.is(resourceOptions[0]) || pm.is(resourceOptions[1])) && pm.materialsLeft > 0) {
									return !pm.get_doNotGather();
								} else {
									return false;
								}
							} : resourceOptions.length == 1 ? function(pm) {
								if(pm.is(resourceOptions[0]) && pm.materialsLeft > 0) {
									return !pm.get_doNotGather();
								} else {
									return false;
								}
							} : function(pm) {
								if(common_ArrayExtensions.any(resourceOptions,function(ro) {
									return pm.is(ro);
								}) && pm.materialsLeft > 0) {
									return !pm.get_doNotGather();
								} else {
									return false;
								}
							};
							this.nearestResourceGatherPlace = this.city.simulation.permanentFinder.query(this,findFunc);
						}
						if(this.nearestResourceGatherPlace == null) {
							var this1 = this.world.knownResourceInavailability;
							var k = resourceOptions[0].__name__;
							this1.h[k] = true;
						}
						this.hasNotSearchedForResourceGatherPlaceThisStep = false;
					}
				}
				if(performCitizenAction) {
					if(this.nearestResourceGatherPlace != null) {
						citizen.simulation.pathfinder.findPathCombined(citizen,this.nearestResourceGatherPlace);
						citizen.pathOnFail = null;
					} else {
						citizen.wander(timeMod);
					}
				}
			}
		} else if(citizen.inPermanent == this) {
			citizen.moveAndWait(4,20,function() {
				citizen.hasWorkTools = true;
			});
		} else {
			citizen.simulation.pathfinder.findPathCombined(citizen,this);
			citizen.pathOnFail = null;
		}
	}
	,update: function(timeMod) {
		buildings_Work.prototype.update.call(this,timeMod);
		this.hasNotSearchedForResourceGatherPlaceThisStep = true;
	}
	,invalidatePathfindingRelatedInfo: function() {
		buildings_Work.prototype.invalidatePathfindingRelatedInfo.call(this);
		this.nearestResourceGatherPlace = null;
	}
	,__class__: buildings_BlueCollarWork
});
