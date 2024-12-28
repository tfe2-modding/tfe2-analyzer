var buildings_Work = $hxClasses["buildings.Work"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.workTimePreferenceMod = 1;
	this.endTime = 19;
	this.startTime = 6;
	this.workers = [];
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_Work.__name__ = "buildings.Work";
buildings_Work.__super__ = Building;
buildings_Work.prototype = $extend(Building.prototype,{
	get_jobs: function() {
		if(this.info.jobs == null) {
			return 0;
		} else {
			return this.info.jobs;
		}
	}
	,get_remainingCapacity: function() {
		return this.get_jobs() - this.workers.length;
	}
	,get_firstBuildingToGoTo: function() {
		return this;
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		while(this.workers.length != 0) this.workers[this.workers.length - 1].loseJob();
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		Building.prototype.addWindowInfoLines.call(this);
		var tmp = this.city.gui;
		var tmp1 = Resources.getTexture("spr_work");
		var city = this.city;
		var citizens = this.workers;
		var topText = common_Localize.lo("workers_of",[this.get_name()]);
		var relatedBuilding = this;
		var nothingFoundText = common_Localize.lo("no_workers");
		tmp.windowAddSimpleButton(tmp1,function() {
			gui_MultiFollowWindow.createWindow(city,citizens,topText,relatedBuilding,nothingFoundText);
		},null,function() {
			return common_Localize.lo("workers",[_gthis.workers.length,_gthis.get_jobs()]);
		});
	}
	,afterGiveJob: function(citizen) {
	}
	,__class__: buildings_Work
});
