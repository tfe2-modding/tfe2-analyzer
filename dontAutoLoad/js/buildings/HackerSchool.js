var buildings_HackerSchool = $hxClasses["buildings.HackerSchool"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	buildings_School.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.students = [];
};
buildings_HackerSchool.__name__ = "buildings.HackerSchool";
buildings_HackerSchool.__super__ = buildings_School;
buildings_HackerSchool.prototype = $extend(buildings_School.prototype,{
	get_studentCapacity: function() {
		return Math.round(this.city.policies.vars.schoolClassSizeMod * 25);
	}
	,get_educationPerDay: function() {
		return 0.084 * this.city.policies.vars.schoolMaxEdu;
	}
	,get_educationCap: function() {
		return 1.2 * this.city.policies.vars.schoolMaxEdu;
	}
	,onBuild: function() {
		buildings_School.prototype.onBuild.call(this);
		var mission = this.city.progress.sideQuests.findSidequestWithType(progress_sidequests_HackerSchoolMission);
		if(mission != null) {
			this.city.progress.sideQuests.completeSidequest(mission);
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		if(this.workers.indexOf(citizen) == 0) {
			if(citizen.relativeY < 5) {
				citizen.changeFloor();
			}
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
			if(Math.abs(6 - citizen.relativeX) < spd) {
				citizen.relativeX = 6;
			} else {
				var num = 6 - citizen.relativeX;
				citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
			}
		}
	}
	,beAtSchool: function(citizen,timeMod) {
		if(!citizen.hasBuildingInited) {
			var i = this.students.indexOf(citizen);
			switch(i % 3) {
			case 0:
				var moveToX = random_Random.getInt(6,7);
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 4;
				arr[1] = moveToX;
				citizen.setPath(arr,0,2,true);
				citizen.pathEndFunction = null;
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
				break;
			case 1:
				citizen.changeFloorAndMoveRandom(3,7);
				break;
			case 2:
				var moveToX = random_Random.getInt(12,16);
				var pool = pooling_Int32ArrayPool.pool;
				var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
				arr[0] = 4;
				arr[1] = moveToX;
				citizen.setPath(arr,0,2,true);
				citizen.pathEndFunction = null;
				citizen.pathOnlyRelatedTo = citizen.inPermanent;
				break;
			}
			var amount = this.get_educationPerDay();
			var cap = this.get_educationCap();
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + amount,cap),citizen.educationLevel);
			citizen.hasBuildingInited = true;
			if(citizen.educationLevel > 1 && this.city.simulation.hackerSchoolBonuses.citizens.indexOf(citizen) == -1) {
				this.city.simulation.hackerSchoolBonuses.citizens.push(citizen);
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_School.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("graduates",[_gthis.city.simulation.hackerSchoolBonuses.citizens.length]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("inventions_currently_in_city",[_gthis.city.simulation.hackerSchoolBonuses.inventions.length]);
		});
		gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			if(_gthis.city.simulation.hackerSchoolBonuses.inventions.length > 0) {
				var inv = common_ArrayExtensions.findRandom(_gthis.city.simulation.hackerSchoolBonuses.inventions,function(c) {
					return true;
				});
				if(inv != null) {
					gui_FollowingInvention.createWindow(_gthis.city,inv,false);
				}
			} else {
				_gthis.city.simulation.hackerSchoolBonuses.encourage = 100;
			}
		},this.city.gui.windowInner,function() {
			if(_gthis.city.simulation.hackerSchoolBonuses.inventions.length == 0) {
				return common_Localize.lo("encourage_creativity");
			}
			return common_Localize.lo("find_invention");
		},this.city.gui.innerWindowStage);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.window,new common_Point(2,6)));
	}
	,__class__: buildings_HackerSchool
});
