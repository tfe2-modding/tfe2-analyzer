var buildings_School = $hxClasses["buildings.School"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.schoolEndTime = 16;
	this.schoolStartTime = 7;
	buildings_Work.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.students = [];
};
buildings_School.__name__ = "buildings.School";
buildings_School.__super__ = buildings_Work;
buildings_School.prototype = $extend(buildings_Work.prototype,{
	get_studentCapacity: function() {
		return Math.round(this.city.policies.vars.schoolClassSizeMod * 30);
	}
	,get_educationPerDay: function() {
		return 0.07 * this.city.policies.vars.schoolMaxEdu;
	}
	,get_educationCap: function() {
		return this.city.policies.vars.schoolMaxEdu;
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		var spd = citizen.pathWalkSpeed * timeMod;
		Citizen.shouldUpdateDraw = true;
		if(Math.abs(3 - citizen.relativeX) < spd) {
			citizen.relativeX = 3;
		} else {
			var num = 3 - citizen.relativeX;
			citizen.relativeX += (num > 0 ? 1 : num < 0 ? -1 : 0) * spd;
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Work.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("students",[_gthis.students.length,_gthis.get_studentCapacity()]);
		});
	}
	,destroy: function() {
		buildings_Work.prototype.destroy.call(this);
		var i = this.students.length;
		while(--i >= 0) {
			var student = this.students[i];
			student.leaveSchool();
		}
	}
	,afterGiveJob: function(citizen) {
		this.city.simulation.schoolAssigner.schoolsShouldBeUpdated = true;
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
		}
	}
	,__class__: buildings_School
});
