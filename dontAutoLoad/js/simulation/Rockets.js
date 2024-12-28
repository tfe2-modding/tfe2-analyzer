var simulation_Rockets = $hxClasses["simulation.Rockets"] = function(city) {
	this.missionsDoneFar = 0;
	this.missionsDoneNear = 0;
	this.city = city;
	this.rockets = [];
	this.currentMissions = [];
};
simulation_Rockets.__name__ = "simulation.Rockets";
simulation_Rockets.prototype = {
	update: function(timeMod) {
		var i = this.rockets.length;
		while(--i >= 0) this.rockets[i].update(timeMod);
		i = this.currentMissions.length;
		while(--i >= 0) this.currentMissions[i].update(timeMod);
	}
	,addRocket: function(rocket) {
		this.rockets.push(rocket);
	}
	,removeRocket: function(rocket) {
		HxOverrides.remove(this.rockets,rocket);
	}
	,addMission: function(mission) {
		this.currentMissions.push(mission);
	}
	,removeMission: function(mission) {
		HxOverrides.remove(this.currentMissions,mission);
	}
	,afterLoad: function() {
		var _g = 0;
		var _g1 = this.currentMissions;
		while(_g < _g1.length) {
			var mission = _g1[_g];
			++_g;
			mission.afterLoad();
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_Rockets.saveDefinition);
		}
		var value = this.missionsDoneNear;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.missionsDoneFar;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"missionsDoneNear")) {
			this.missionsDoneNear = loadMap.h["missionsDoneNear"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"missionsDoneFar")) {
			this.missionsDoneFar = loadMap.h["missionsDoneFar"];
		}
	}
	,__class__: simulation_Rockets
};
