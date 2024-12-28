var progress_Sidequest = $hxClasses["progress.Sidequest"] = function(city,sidequests) {
	this.completionTime = -1;
	this.city = city;
	this.simulation = city.simulation;
	this.sideQuests = sidequests;
	var c = js_Boot.getClass(this);
	this.className = c.__name__;
};
progress_Sidequest.__name__ = "progress.Sidequest";
progress_Sidequest.prototype = {
	get_isInstant: function() {
		return false;
	}
	,get_tag: function() {
		return "";
	}
	,start: function() {
	}
	,onComplete: function() {
	}
	,update: function(timeMod) {
	}
	,getGoalHelp: function() {
		return null;
	}
	,canStart: function() {
		return false;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(progress_Sidequest.saveDefinition);
		}
		var value = this.completionTime;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"completionTime")) {
			this.completionTime = loadMap.h["completionTime"];
		}
	}
	,__class__: progress_Sidequest
};
