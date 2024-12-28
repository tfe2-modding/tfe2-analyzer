var simulation_festival_MusicFestival = $hxClasses["simulation.festival.MusicFestival"] = function(city,simulation,manager,centerBuilding) {
	simulation_festival_Festival.call(this,city,simulation,manager,centerBuilding);
};
simulation_festival_MusicFestival.__name__ = "simulation.festival.MusicFestival";
simulation_festival_MusicFestival.involvedCitizens = function(simulation) {
	var _g = [];
	var _g1 = 0;
	var _g2 = simulation.citizens;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v.get_age() > 18 && (v.job == null || !v.job.is(buildings_School))) {
			_g.push(v);
		}
	}
	return _g;
};
simulation_festival_MusicFestival.canDo = function(city,simulation,centerBuilding) {
	var involvedCitizenNum = simulation_festival_MusicFestival.involvedCitizens(simulation).length;
	var relevantBuildingNum = simulation_festival_MusicFestival.relevantBuildings(simulation,centerBuilding).length;
	if(involvedCitizenNum > simulation_festival_MusicFestival.minCitizens) {
		return relevantBuildingNum > (involvedCitizenNum / 100 | 0);
	} else {
		return false;
	}
};
simulation_festival_MusicFestival.relevantBuildings = function(simulation,centerBuilding) {
	var relevants = [];
	simulation.permanentFinder.query(centerBuilding,function(pm) {
		if(pm.isBuilding) {
			var bld = pm;
			if(bld.isEntertainment) {
				var ent = bld;
				if(ent.get_entertainmentType() == 1 || ent.get_entertainmentType() == 2 || ent.get_entertainmentType() == 0) {
					if(bld.couldStandHere() && !bld.is(buildings_EcoFarm)) {
						relevants.push(ent);
					}
				}
			}
		}
		return false;
	});
	return relevants;
};
simulation_festival_MusicFestival.__super__ = simulation_festival_Festival;
simulation_festival_MusicFestival.prototype = $extend(simulation_festival_Festival.prototype,{
	isInvolvedWithFestival: function(citizen) {
		if(citizen.get_age() > 18) {
			if(citizen.job != null) {
				return !citizen.job.is(buildings_School);
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,updateFestival: function(timeMod) {
	}
	,doStartRepeatables: function() {
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(js_Boot.__implements(pm,buildings_IBuildingWithFestivalSpecials)) {
				var festivalPM = pm;
				festivalPM.initFestival();
			}
		}
		var involvedCitizens = simulation_festival_MusicFestival.involvedCitizens(this.simulation);
		var involvedCitizensNum = involvedCitizens.length;
		var desiredNumberOfVenues = involvedCitizensNum / simulation_festival_MusicFestival.citizensPerVenue | 0;
		var nonConsideredVenues = [];
		this.currentFestivalVenues = simulation_festival_MusicFestival.relevantBuildings(this.simulation,this.centerBuilding);
		if(this.currentFestivalVenues.length > desiredNumberOfVenues) {
			nonConsideredVenues = this.currentFestivalVenues.splice(desiredNumberOfVenues,this.currentFestivalVenues.length - desiredNumberOfVenues);
		}
		var len = this.currentFestivalVenues.length;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			var bld = this.currentFestivalVenues[i];
			while(bld.leftBuilding != null && nonConsideredVenues.indexOf(bld.leftBuilding) != -1) {
				HxOverrides.remove(nonConsideredVenues,bld.leftBuilding);
				this.currentFestivalVenues.push(bld.leftBuilding);
				bld = bld.leftBuilding;
			}
			bld = this.currentFestivalVenues[i];
			while(bld.rightBuilding != null && nonConsideredVenues.indexOf(bld.rightBuilding) != -1) {
				HxOverrides.remove(nonConsideredVenues,bld.rightBuilding);
				this.currentFestivalVenues.push(bld.rightBuilding);
				bld = bld.rightBuilding;
			}
		}
		this.currentFestivalVenuesSet = new haxe_ds_ObjectMap();
		this.currentTempWorkers = new haxe_ds_ObjectMap();
		var _g = 0;
		var _g1 = this.currentFestivalVenues;
		while(_g < _g1.length) {
			var bld = _g1[_g];
			++_g;
			this.currentFestivalVenuesSet.set(bld,true);
			var v = [];
			this.currentTempWorkers.set(bld,v);
		}
	}
	,startFestival: function() {
		this.doStartRepeatables();
		this.simulation.happiness.addBoost(simulation_HappinessBoost.withDuration(this.simulation.time,simulation_festival_MusicFestival.happinessBoostDuration,simulation_festival_MusicFestival.happinessBoostGiven,common_Localize.lo("music_festival_boost")));
	}
	,citizenFestivalUpdate: function(citizen,timeMod) {
		var busy = false;
		if(!citizen.tryFinishWork(timeMod)) {
			return;
		}
		if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null) != null && this.currentFestivalVenuesSet.h.__keys__[(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).__id__] != null) {
			var tempWorkers = this.currentTempWorkers.h[(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).__id__];
			var isWorkBuilding = (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).is(buildings_Work);
			var workBuilding = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
			var buildingAsFestivalWorkHaver = null;
			var buildingIsFestivalWorkHaver = false;
			if(js_Boot.__implements(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null,buildings_IBuildingWithFestivalSpecials)) {
				buildingAsFestivalWorkHaver = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
				buildingIsFestivalWorkHaver = true;
			}
			var citizenIsInvolvedWithFestival = false;
			var i = tempWorkers.length;
			var citizenID = 0;
			while(--i >= 0) {
				var tw = tempWorkers[i];
				if(tw.hasDied || !this.isInvolvedWithFestival(tw)) {
					tempWorkers.splice(i,1);
				} else if(tw == citizen) {
					citizenID = i;
					citizenIsInvolvedWithFestival = true;
				}
			}
			if(!buildingIsFestivalWorkHaver && isWorkBuilding && tempWorkers.length < workBuilding.get_jobs() || buildingIsFestivalWorkHaver && tempWorkers.length < buildingAsFestivalWorkHaver.festivalJobs) {
				if(!citizenIsInvolvedWithFestival) {
					citizenIsInvolvedWithFestival = true;
					tempWorkers.push(citizen);
				}
			}
			if(citizenIsInvolvedWithFestival) {
				busy = true;
				if(buildingIsFestivalWorkHaver) {
					buildingAsFestivalWorkHaver.doFestivalWork(this,citizen,timeMod,citizenID);
				} else {
					workBuilding.work(citizen,timeMod,false);
				}
			} else {
				var _this = citizen.entertainment;
				var _gthis = _this;
				var busy1 = true;
				var entertainmentBuilding = _this.citizen.inPermanent;
				var timeSinceStart = _this.citizen.simulation.time.timeSinceStart;
				if(!_this.entertainmentInited) {
					var currentEntertainmentDesirability = 1.0;
					if(_this.citizen.job == null && _this.citizen.school == null) {
						currentEntertainmentDesirability = 0.75;
					}
					_this.entertainmentFinishedTime = timeSinceStart + 60 * random_Random.getFloat(entertainmentBuilding.get_minimumNormalTimeToSpend(),entertainmentBuilding.get_maximumNormalTimeToSpend());
					_this.recentEntertainmentTypes[entertainmentBuilding.get_entertainmentType()] = timeSinceStart + 1440 * random_Random.getFloat(entertainmentBuilding.get_minimumEntertainmentGroupSatisfy(),entertainmentBuilding.get_maximumEntertainmentGroupSatisfy()) * currentEntertainmentDesirability;
					_this.entertainmentInited = true;
				}
				if(timeSinceStart >= _this.entertainmentFinishedTime) {
					if(entertainmentBuilding.finishEntertainment(_this.citizen,timeMod)) {
						busy1 = false;
						_this.entertainmentInited = false;
					} else if(buildingIsFestivalWorkHaver) {
						var _this = _gthis.citizen;
						var buildingAsFestivalWorkHaver = _this.inPermanent != null && _this.inPermanent.isBuilding ? _this.inPermanent : null;
						buildingAsFestivalWorkHaver.beEntertainedFestival(this,_gthis.citizen,timeMod);
					} else {
						entertainmentBuilding.beEntertained(_gthis.citizen,timeMod);
					}
				} else if(buildingIsFestivalWorkHaver) {
					var _this = _gthis.citizen;
					var buildingAsFestivalWorkHaver = _this.inPermanent != null && _this.inPermanent.isBuilding ? _this.inPermanent : null;
					buildingAsFestivalWorkHaver.beEntertainedFestival(this,_gthis.citizen,timeMod);
				} else {
					entertainmentBuilding.beEntertained(_gthis.citizen,timeMod);
				}
				busy = busy1;
				citizen.dynamicUnsavedVars.searchingFestivalBuilding = null;
			}
			citizen.canViewSelfInBuilding = true;
		}
		if(!busy) {
			if(citizen.dynamicUnsavedVars.searchingFestivalBuilding != null && !citizen.dynamicUnsavedVars.searchingFestivalBuilding.destroyed) {
				citizen.simulation.pathfinder.findPath(citizen,citizen.dynamicUnsavedVars.searchingFestivalBuilding);
				citizen.pathOnFail = null;
			} else {
				var newVenue = random_Random.fromArray(this.currentFestivalVenues);
				if(!newVenue.destroyed) {
					citizen.simulation.pathfinder.findPath(citizen,newVenue);
					citizen.pathOnFail = null;
					citizen.dynamicUnsavedVars.searchingFestivalBuilding = newVenue;
				}
			}
		}
	}
	,getText: function() {
		if(!this.isNow()) {
			return common_Localize.lo("music_festival_planned");
		}
		return common_Localize.lo("music_festival_doing");
	}
	,end: function() {
		var _g = 0;
		var _g1 = this.city.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null) == null) {
				continue;
			}
			var tempWorkersInBuilding = this.currentTempWorkers.h[(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).__id__];
			if(tempWorkersInBuilding != null && tempWorkersInBuilding.indexOf(citizen) != -1) {
				var buildingAsFestivalWorkHaver = null;
				var buildingIsFestivalWorkHaver = false;
				var workBuilding = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
				if(js_Boot.__implements(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null,buildings_IBuildingWithFestivalSpecials)) {
					buildingAsFestivalWorkHaver = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
					buildingIsFestivalWorkHaver = true;
				}
				if(buildingIsFestivalWorkHaver) {
					buildingAsFestivalWorkHaver.endFestivalWork(this,citizen);
				} else {
					workBuilding.work(citizen,0,true);
				}
			}
		}
		simulation_festival_Festival.prototype.end.call(this);
		var _g = 0;
		var _g1 = this.city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(js_Boot.__implements(pm,buildings_IBuildingWithFestivalSpecials)) {
				var festivalPM = pm;
				festivalPM.stopFestival();
			}
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		simulation_festival_Festival.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(simulation_festival_MusicFestival.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		simulation_festival_Festival.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: simulation_festival_MusicFestival
});
