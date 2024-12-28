var simulation_CitizenEntertainment = $hxClasses["simulation.CitizenEntertainment"] = function(citizen) {
	this.entertainmentInited = false;
	this.tryForDayEntertainment = 0;
	this.tryForEntertainment = 0;
	this.entertainmentFinishedTime = 0;
	var _g = [];
	var _g1 = 0;
	var _g2 = simulation_EntertainmentTypeHelpers.entertainmentTypeNumber;
	while(_g1 < _g2) {
		var i = _g1++;
		_g.push(0.0);
	}
	this.recentEntertainmentTypes = _g;
	this.citizen = citizen;
	this.entertainmentInited = false;
	this.tryForDayEntertainment = 0;
	this.setAgeRelatedEntertainment();
};
simulation_CitizenEntertainment.__name__ = "simulation.CitizenEntertainment";
simulation_CitizenEntertainment.prototype = {
	get_normallyAtHomeTimeFrom: function() {
		var tmp = this.citizen.get_workTimePreference();
		var tmp1;
		if(this.citizen.job == null) {
			tmp1 = 23;
		} else {
			var this1 = this.citizen.job.endTime;
			var this2 = this1;
			var newTime = this2;
			newTime += 4;
			newTime %= 24;
			tmp1 = newTime;
		}
		return tmp + tmp1;
	}
	,get_normallyAtHomeTimeTo: function() {
		var tmp = this.citizen.get_workTimePreference();
		var tmp1;
		if(this.citizen.job == null) {
			tmp1 = 8;
		} else {
			var this1 = this.citizen.job.startTime;
			tmp1 = this1;
		}
		return tmp + tmp1;
	}
	,setAgeRelatedEntertainment: function() {
		if(this.citizen.get_age() < 16 && random_Random.getInt(1000) < 998) {
			this.recentEntertainmentTypes[2] = this.citizen.simulation.time.timeSinceStart + 1440 * (this.citizen.get_age() - random_Random.getFloat(14,16));
		}
	}
	,updateEntertainment: function(timeMod) {
		var busy = false;
		if(this.citizen.inPermanent != null && this.citizen.inPermanent.isBuilding && this.citizen.inPermanent.isEntertainment) {
			var busy1 = true;
			var entertainmentBuilding = this.citizen.inPermanent;
			var timeSinceStart = this.citizen.simulation.time.timeSinceStart;
			if(!this.entertainmentInited) {
				if(entertainmentBuilding.get_isOpen()) {
					var currentEntertainmentDesirability = 1.0;
					if(this.citizen.job == null && this.citizen.school == null) {
						currentEntertainmentDesirability = 0.75;
					}
					this.entertainmentFinishedTime = timeSinceStart + 60 * random_Random.getFloat(entertainmentBuilding.get_minimumNormalTimeToSpend(),entertainmentBuilding.get_maximumNormalTimeToSpend());
					this.recentEntertainmentTypes[entertainmentBuilding.get_entertainmentType()] = timeSinceStart + 1440 * random_Random.getFloat(entertainmentBuilding.get_minimumEntertainmentGroupSatisfy(),entertainmentBuilding.get_maximumEntertainmentGroupSatisfy()) * currentEntertainmentDesirability;
					this.entertainmentInited = true;
				} else {
					this.entertainmentFinishedTime = timeSinceStart - 1000;
				}
			}
			if(!entertainmentBuilding.get_isOpenForExistingVisitors() || timeSinceStart >= this.entertainmentFinishedTime) {
				if(entertainmentBuilding.finishEntertainment(this.citizen,timeMod)) {
					busy1 = false;
					this.entertainmentInited = false;
				} else {
					entertainmentBuilding.beEntertained(this.citizen,timeMod);
				}
			} else {
				entertainmentBuilding.beEntertained(this.citizen,timeMod);
			}
			busy = busy1;
		}
		if(busy) {
			return true;
		}
		var tmp;
		if(this.citizen.get_age() > 16 && this.citizen.likesNightclubs) {
			var this1 = this.citizen.simulation.time.timeSinceStart / 60 % 24;
			var start = 23 + this.citizen.get_workTimePreference();
			var end = 6 + this.citizen.get_workTimePreference();
			tmp = start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end;
		} else {
			tmp = false;
		}
		if(tmp && this.citizen.wantsNightEntertainmentIn <= 0) {
			busy = this.searchNightEntertainment();
		} else {
			var this1 = this.citizen.simulation.time.timeSinceStart / 60 % 24;
			var start = this.get_normallyAtHomeTimeFrom();
			var end = this.get_normallyAtHomeTimeTo();
			if(!(start < end ? this1 >= start && this1 < end : this1 >= start || this1 < end)) {
				busy = this.searchDayEntertainment();
			}
		}
		return busy;
	}
	,stop: function() {
		this.entertainmentInited = false;
	}
	,delayLookingForEntertainment: function() {
		this.tryForEntertainment = this.citizen.simulation.time.timeSinceStart + 1440 * this.citizen.simulation.time.minutesPerTick;
		this.tryForDayEntertainment = this.citizen.simulation.time.timeSinceStart + 1440 * this.citizen.simulation.time.minutesPerTick;
	}
	,searchNightEntertainment: function() {
		if(this.citizen.simulation.time.timeSinceStart >= this.tryForEntertainment) {
			if(!this.citizen.simulation.pathfinder.mayRequestPathNow()) {
				return true;
			}
			var _this = this.citizen;
			var maxDistance = random_Random.getFloat() < 0.02 ? 480 : 320;
			_this.simulation.pathfinder.findPathEntertainment(_this,maxDistance,-1);
			_this.pathOnFail = null;
			this.entertainmentInited = false;
			this.tryForEntertainment = this.citizen.simulation.time.timeSinceStart + 120 * this.citizen.simulation.time.minutesPerTick;
			return true;
		}
		return false;
	}
	,searchDayEntertainment: function() {
		var _gthis = this;
		var timeSinceStart = this.citizen.simulation.time.timeSinceStart;
		if(timeSinceStart >= this.tryForDayEntertainment) {
			if(!this.citizen.simulation.pathfinder.mayRequestPathNow()) {
				return true;
			}
			var entertainmentTypeBit = 0;
			var _g = 0;
			var _g1 = this.recentEntertainmentTypes.length;
			while(_g < _g1) {
				var i = _g++;
				if(timeSinceStart >= this.recentEntertainmentTypes[i]) {
					entertainmentTypeBit |= 1 << i;
				}
			}
			var _this = this.citizen;
			var maxDistance = random_Random.getFloat() < 0.02 ? 480 : 320;
			_this.simulation.pathfinder.findPathEntertainment(_this,maxDistance,entertainmentTypeBit);
			_this.pathOnFail = null;
			this.entertainmentInited = false;
			this.tryForDayEntertainment = timeSinceStart + 120 * this.citizen.simulation.time.minutesPerTick;
			return true;
		}
		return false;
	}
	,__class__: simulation_CitizenEntertainment
};
