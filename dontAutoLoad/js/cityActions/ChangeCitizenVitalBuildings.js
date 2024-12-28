var cityActions_ChangeCitizenVitalBuildings = $hxClasses["cityActions.ChangeCitizenVitalBuildings"] = function(city,citizen) {
	cityActions_CitySpecialAction.call(this,city);
	this.citizen = citizen;
};
cityActions_ChangeCitizenVitalBuildings.__name__ = "cityActions.ChangeCitizenVitalBuildings";
cityActions_ChangeCitizenVitalBuildings.__super__ = cityActions_CitySpecialAction;
cityActions_ChangeCitizenVitalBuildings.prototype = $extend(cityActions_CitySpecialAction.prototype,{
	get_specialActionID: function() {
		return "ChangeCitizenVitalBuildings";
	}
	,get_hasPermanentAction: function() {
		return true;
	}
	,activate: function() {
		cityActions_CitySpecialAction.prototype.activate.call(this);
	}
	,performPermanentAction: function(pm) {
		if(pm.is(buildings_SecretSocietyHouse) && this.city.progress.story.storyName == "cityofthekey") {
			this.city.gui.showSimpleWindow(common_Localize.lo("secret_society_forbidden"),null,true,true);
			return;
		}
		var work = pm;
		if(pm.is(buildings_Work) && this.citizen.school == null && this.citizen.get_age() >= 16) {
			var theWork = work;
			var workerWhoLostJob = null;
			if(this.citizen.job != theWork) {
				workerWhoLostJob = theWork.workers[0];
				if(theWork.workers.length >= theWork.get_jobs()) {
					workerWhoLostJob.loseJob(false);
				}
				this.citizen.loseJob(true);
				this.city.simulation.jobAssigner.giveCitizenJob(this.citizen,theWork);
				this.city.game.audio.playSound(this.city.game.audio.changeVitalBuildingSound);
				if(this.citizen.home != null && this.citizen.home != theWork && this.citizen.home.is(buildings_Work)) {
					var workBuilding = this.citizen.home;
					if(this.citizen.home.get_residentCapacity() <= workBuilding.get_jobs()) {
						this.citizen.evictFromHome();
					}
				}
			}
			if(theWork.is(buildings_House)) {
				var theHouse = theWork;
				if(this.citizen.home != theHouse) {
					var houseIsAtCap = theHouse.residents.length >= theHouse.get_residentCapacity();
					var canEnterInHouse = false;
					if(workerWhoLostJob != null && workerWhoLostJob.home == theHouse && houseIsAtCap) {
						workerWhoLostJob.evictFromHome();
						canEnterInHouse = true;
					} else if(houseIsAtCap) {
						theHouse.residents[0].evictFromHome();
						canEnterInHouse = true;
					}
					if(!houseIsAtCap || canEnterInHouse) {
						this.citizen.evictFromHome();
						var citizen = this.citizen;
						citizen.home = theHouse;
						theHouse.residents.push(citizen);
						if(!this.citizen.isForcedHome) {
							this.city.simulation.houseAssigner.citizensWithFixedHomes.push(this.citizen);
						}
						this.citizen.isForcedHome = true;
					}
				}
			}
		} else {
			var house = pm;
			if(pm.is(buildings_House)) {
				var theHouse = house;
				if(this.citizen.home != theHouse) {
					if(theHouse.residents.length >= theHouse.get_residentCapacity()) {
						theHouse.residents[0].evictFromHome();
					}
					this.citizen.evictFromHome();
					var citizen = this.citizen;
					citizen.home = theHouse;
					theHouse.residents.push(citizen);
					if(!this.citizen.isForcedHome) {
						this.city.simulation.houseAssigner.citizensWithFixedHomes.push(this.citizen);
					}
					this.citizen.isForcedHome = true;
					if(this.citizen.job != null && this.citizen.home != this.citizen.job && this.citizen.job.is(buildings_House)) {
						var houseBuilding = this.citizen.job;
						if(houseBuilding.get_residentCapacity() <= this.citizen.job.get_jobs()) {
							this.citizen.loseJob(false);
						}
					}
					this.city.game.audio.playSound(this.city.game.audio.changeVitalBuildingSound);
				}
			} else {
				var school = pm;
				if(pm.is(buildings_School)) {
					if(this.citizen.get_age() < 16) {
						var theSchool = school;
						if(this.citizen.school != theSchool) {
							if(theSchool.students.length >= theSchool.get_studentCapacity()) {
								theSchool.students[0].leaveSchool();
							}
							this.citizen.leaveSchool();
							this.citizen.school = theSchool;
							theSchool.students.push(this.citizen);
							this.city.game.audio.playSound(this.city.game.audio.changeVitalBuildingSound);
						}
					}
				}
			}
		}
	}
	,__class__: cityActions_ChangeCitizenVitalBuildings
});
