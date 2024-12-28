var CityTime = $hxClasses["CityTime"] = function(city,simulation) {
	this.skyColors = [{ color : 2626656, time : 0},{ color : 2626656, time : 4},{ color : 12541833, time : 6},{ color : 12541833, time : 6.5},{ color : 11389183, time : 8.5},{ color : 11389183, time : 11},{ color : 12247804, time : 13},{ color : 12247804, time : 17},{ color : 8872356, time : 20.5},{ color : 8872356, time : 21},{ color : 2626656, time : 23},{ color : 2626656, time : 24}];
	this.lastLoadTime = 0.0;
	this.minutesPerTick = 0.5;
	this.city = city;
	this.simulation = simulation;
	this.timeSinceStart = 120;
};
CityTime.__name__ = "CityTime";
CityTime.getBasicTimeString = function(time) {
	if(time > 2880) {
		return common_Localize.lo("n_days",[Math.floor(time / 1440)]);
	}
	if(time > 1440) {
		return common_Localize.lo("one_day");
	}
	if(time > 60) {
		return common_Localize.lo("n_hours",[Math.floor(time / 60)]);
	}
	return common_Localize.lo("one_hour");
};
CityTime.prototype = {
	update: function(timeMod) {
		this.timeSinceStart += timeMod * this.minutesPerTick;
		this.updateSky();
		if((this.timeSinceStart / 60 % 24 > 23 || this.timeSinceStart / 60 % 24 < 4) && this.city.progress.story.get_speedUpStartNights()) {
			if(1 + ((this.timeSinceStart | 0) / 1440 | 0) == 1 || 1 + ((this.timeSinceStart | 0) / 1440 | 0) == 2 || 1 + ((this.timeSinceStart | 0) / 1440 | 0) == 3 && this.timeSinceStart / 60 % 24 < 4) {
				this.timeSinceStart += timeMod * this.minutesPerTick * 2.75;
			} else if(1 + ((this.timeSinceStart | 0) / 1440 | 0) == 3) {
				this.timeSinceStart += timeMod * this.minutesPerTick;
			} else if(1 + ((this.timeSinceStart | 0) / 1440 | 0) == 4) {
				this.timeSinceStart += timeMod * this.minutesPerTick * 0.5;
			}
		}
	}
	,updateSky: function() {
		var currentColor = this.getCurrentColor(this.skyColors);
		if(currentColor != null) {
			this.city.updateSky(currentColor);
		}
	}
	,getCurrentColor: function(colors) {
		var rgb = function(col) {
			return { r : col / 65536 | 0, g : (col / 256 | 0) % 256, b : col % 256};
		};
		var _g = 0;
		var _g1 = colors.length;
		while(_g < _g1) {
			var i = _g++;
			var thisCol = colors[i];
			var nextCol = colors[i + 1];
			if(this.timeSinceStart / 60 % 24 < nextCol.time) {
				var thisColColor = rgb(thisCol.color);
				var nextColColor = rgb(nextCol.color);
				var lerpVal = (this.timeSinceStart / 60 % 24 - thisCol.time) / (nextCol.time - thisCol.time);
				var val1 = thisColColor.r;
				var val11 = thisColColor.g;
				var val12 = thisColColor.b;
				return (val1 + lerpVal * (nextColColor.r - val1) | 0) * 256 * 256 + (val11 + lerpVal * (nextColColor.g - val11) | 0) * 256 + (val12 + lerpVal * (nextColColor.b - val12) | 0);
			}
		}
		return null;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(CityTime.saveDefinition);
		}
		var value = this.timeSinceStart;
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
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timeSinceStart")) {
			this.timeSinceStart = loadMap.h["timeSinceStart"];
		}
	}
	,__class__: CityTime
};
